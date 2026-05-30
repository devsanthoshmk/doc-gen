import "dotenv/config";
import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { replaceTemplateVariables } from "@repo/core/replacer";
import { extractTemplateVariables } from "@repo/core/extract";
import { flattenObject } from "@repo/core/flatten";
import {
  checkPlaceholders,
  validateAgainstSchema,
  type TemplateSchema,
} from "@repo/core/validate";
import {
  helloRoute,
  generateRoute,
  uploadTemplateRoute,
  updateTemplateRoute,
  listTemplatesRoute,
  getTemplateRoute,
  generateDocRoute,
  draftEmailRoute,
  listDocumentsRoute,
  getDocumentRoute,
} from "./openapi.js";
import { convex, api, uploadDocx, downloadFromUrl } from "./lib/convex.js";
import type { Id } from "@repo/convex/dataModel";
import {
  draftVariableDescriptions,
  structureContent,
  draftEmail,
} from "./lib/ai.js";

const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => c.redirect("/docs"));

// ─── Hello (kept) ─────────────────────────────────────────────────────────────
app.openapi(helloRoute, (c) => {
  const { name } = c.req.valid("query");
  return c.json({ message: name ? `Hello, ${name}!` : "Hello, World!" }, 200);
});

// ─── Low-level render (kept) ──────────────────────────────────────────────────
app.openapi(generateRoute, (c) => {
  const { template, data } = c.req.valid("json");
  try {
    const blob = Buffer.from(template, "base64");
    const out = replaceTemplateVariables(blob, flattenObject(data));
    return c.json(
      { success: true, message: "Rendered via @repo/core/replacer", base64: out.toString("base64") },
      200
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false, message: `Failed to render template: ${msg}` }, 400);
  }
});

// ─── Templates ────────────────────────────────────────────────────────────────

app.openapi(uploadTemplateRoute, async (c) => {
  const { filename, base64, category, access } = c.req.valid("json");
  try {
    const blob = Buffer.from(base64, "base64");
    const varNames = extractTemplateVariables(blob);
    const variables = await draftVariableDescriptions(varNames);
    const storageId = await uploadDocx(blob);

    const templateId = await convex.mutation(api.templates.createTemplate, {
      name: filename.replace(/\.docx$/i, ""),
      category,
      access,
      storageId,
      variables,
      status: "draft",
    });

    return c.json({ success: true as const, templateId, variables }, 200);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false as const, message: `Upload failed: ${msg}` }, 400);
  }
});

app.openapi(updateTemplateRoute, async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  try {
    const updated = await convex.mutation(api.templates.updateTemplate, {
      id: id as Id<"templates">,
      ...body,
    });
    return c.json(updated, 200);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false as const, message: `Update failed: ${msg}` }, 400);
  }
});

app.openapi(listTemplatesRoute, async (c) => {
  const { status } = c.req.valid("query");
  const rows = await convex.query(api.templates.listTemplates, status ? { status } : {});
  return c.json(rows, 200);
});

app.openapi(getTemplateRoute, async (c) => {
  const { id } = c.req.valid("param");
  const row = await convex.query(api.templates.getTemplate, { id: id as Id<"templates"> });
  if (!row) return c.json({ success: false as const, message: "Template not found" }, 404);
  return c.json(row, 200);
});

// ─── Documents ────────────────────────────────────────────────────────────────

app.openapi(generateDocRoute, async (c) => {
  const { templateId, content } = c.req.valid("json");
  try {
    const template = await convex.query(api.templates.getTemplate, {
      id: templateId as Id<"templates">,
    });
    if (!template) {
      return c.json({ success: false as const, message: "Template not found" }, 400);
    }
    if (!template.fileUrl) {
      return c.json({ success: false as const, message: "Template file missing" }, 400);
    }

    // 1. AI structures the raw content into JSON keyed by the schema.
    const structuredData = await structureContent(content, template.variables);

    // 2. Validation layer: schema + placeholder cross-check.
    const schema: TemplateSchema = template.variables;
    const schemaCheck = validateAgainstSchema(structuredData, schema);
    const flat = flattenObject(structuredData);
    const docxBytes = await downloadFromUrl(template.fileUrl);
    const requiredVars = extractTemplateVariables(docxBytes);
    const placeholderCheck = checkPlaceholders(requiredVars, flat);

    if (!schemaCheck.ok || !placeholderCheck.ok) {
      const errors = [
        ...schemaCheck.errors,
        ...placeholderCheck.missing.map((m) => `Missing value for {{${m}}}`),
      ];
      return c.json({ success: false as const, message: "Validation failed", errors }, 400);
    }

    // 3. Render docx and store the output.
    const outBuffer = replaceTemplateVariables(docxBytes, flat);
    const outputStorageId = await uploadDocx(outBuffer);

    // 4. Record history.
    const documentId = await convex.mutation(api.documents.createDocument, {
      templateId: templateId as Id<"templates">,
      templateName: template.name,
      inputContent: content,
      structuredData,
      outputStorageId,
      status: "doc_review",
    });

    const saved = await convex.query(api.documents.getDocument, {
      id: documentId,
    });

    return c.json(
      {
        success: true as const,
        documentId,
        structuredData,
        outputUrl: saved?.outputUrl ?? null,
      },
      200
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false as const, message: `Generation failed: ${msg}` }, 400);
  }
});

app.openapi(draftEmailRoute, async (c) => {
  const { id } = c.req.valid("param");
  try {
    const doc = await convex.query(api.documents.getDocument, { id: id as Id<"documents"> });
    if (!doc) return c.json({ success: false as const, message: "Document not found" }, 400);

    const email = await draftEmail(
      doc.templateName,
      doc.structuredData as Record<string, unknown>
    );
    await convex.mutation(api.documents.updateDocument, {
      id: id as Id<"documents">,
      emailDraft: email,
      status: "email_review",
    });
    return c.json({ success: true as const, ...email }, 200);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ success: false as const, message: `Email draft failed: ${msg}` }, 400);
  }
});

app.openapi(listDocumentsRoute, async (c) => {
  const rows = await convex.query(api.documents.listDocuments, {});
  return c.json(rows, 200);
});

app.openapi(getDocumentRoute, async (c) => {
  const { id } = c.req.valid("param");
  const row = await convex.query(api.documents.getDocument, { id: id as Id<"documents"> });
  if (!row) return c.json({ success: false as const, message: "Document not found" }, 404);
  return c.json(row, 200);
});

// ─── OpenAPI docs ─────────────────────────────────────────────────────────────
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Document Generation Workers API",
    description: "AI document generator: templates, structuring, rendering, email drafts, history.",
  },
  servers: [{ url: "http://localhost:3001", description: "Local development server" }],
});

app.get("/docs", swaggerUI({ url: "/openapi.json" }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
console.log(`🚀 Workers API on http://localhost:${port}`);
console.log(`📖 Docs at http://localhost:${port}/docs`);

serve({ fetch: app.fetch, port });

export default app;
