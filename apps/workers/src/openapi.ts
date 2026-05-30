import { createRoute, z } from "@hono/zod-openapi";

/**
 * Schema for the Hello World response.
 */
export const HelloResponseSchema = z
  .object({
    message: z.string().openapi({
      example: "Hello, World!",
      description: "A friendly greeting message",
    }),
  })
  .openapi("HelloResponse");

/**
 * Schema for the Hello World query parameters.
 */
export const HelloQuerySchema = z.object({
  name: z
    .string()
    .optional()
    .openapi({
      example: "Alice",
      description: "Optional name to greet",
    }),
});

/**
 * Route definition for GET /hello.
 */
export const helloRoute = createRoute({
  method: "get",
  path: "/hello",
  summary: "Get Hello World message",
  description: "Greets the user or a custom name if provided in the query string.",
  request: {
    query: HelloQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HelloResponseSchema,
        },
      },
      description: "Successfully retrieved hello message",
    },
  },
});

/**
 * Schema for POST /generate request body.
 */
export const GenerateRequestSchema = z
  .object({
    template: z.string().openapi({
      description: "Base64 encoded string of the DOCX template",
      example: "UEsDBBQAAAAIA...",
    }),
    data: z.record(z.any()).openapi({
      description: "Key-value pairs to inject into the template placeholders",
      example: {
        name: "Acme Corp",
        date: "2026-05-30",
        amount: 2500,
      },
    }),
  })
  .openapi("GenerateRequest");

/**
 * Schema for POST /generate response body.
 */
export const GenerateResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: "Indicates whether the document generation succeeded",
    }),
    message: z.string().openapi({
      example: "Document template rendered successfully",
      description: "Status message",
    }),
    base64: z.string().optional().openapi({
      description: "Base64 encoded string of the rendered output DOCX file",
      example: "UEsDBBQAAAAIA...",
    }),
  })
  .openapi("GenerateResponse");

/**
 * Route definition for POST /generate.
 */
export const generateRoute = createRoute({
  method: "post",
  path: "/generate",
  summary: "Render DOCX Template",
  description: "Accepts a base64 encoded DOCX template and data variables, processes it using @repo/core/replacer, and returns the rendered DOCX as base64.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenerateRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GenerateResponseSchema,
        },
      },
      description: "Successfully rendered the DOCX template",
    },
    400: {
      description: "Invalid request payload or template rendering failure",
    },
  },
});

// ─── Shared schemas ───────────────────────────────────────────────────────────

export const VariableSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    type: z.enum(["string", "number", "boolean"]).optional(),
  })
  .openapi("Variable");

export const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string(),
    errors: z.array(z.string()).optional(),
  })
  .openapi("ErrorResponse");

// ─── Template routes ──────────────────────────────────────────────────────────

export const UploadTemplateRequestSchema = z
  .object({
    filename: z.string().openapi({ example: "offer-letter.docx" }),
    base64: z.string().openapi({ description: "Base64 of the .docx template" }),
    category: z.string().openapi({ example: "HR" }),
    access: z.string().openapi({ example: "Private" }),
  })
  .openapi("UploadTemplateRequest");

export const UploadTemplateResponseSchema = z
  .object({
    success: z.literal(true),
    templateId: z.string(),
    variables: z.array(VariableSchema),
  })
  .openapi("UploadTemplateResponse");

export const uploadTemplateRoute = createRoute({
  method: "post",
  path: "/templates/upload",
  summary: "Upload a DOCX template",
  description:
    "Stores the .docx in Convex, extracts {{placeholders}}, and asks the AI to draft a description per variable. Returns the draft schema for the user to edit.",
  request: {
    body: { content: { "application/json": { schema: UploadTemplateRequestSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: UploadTemplateResponseSchema } },
      description: "Template stored, variables extracted",
    },
    400: {
      content: { "application/json": { schema: ErrorResponseSchema } },
      description: "Invalid docx or upload failure",
    },
  },
});

export const UpdateTemplateRequestSchema = z
  .object({
    name: z.string().optional(),
    variables: z.array(VariableSchema).optional(),
    status: z.enum(["draft", "published"]).optional(),
  })
  .openapi("UpdateTemplateRequest");

export const updateTemplateRoute = createRoute({
  method: "patch",
  path: "/templates/{id}",
  summary: "Update a template (save edited descriptions / publish)",
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { "application/json": { schema: UpdateTemplateRequestSchema } } },
  },
  responses: {
    200: { description: "Updated template" },
    400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Update failed" },
  },
});

export const listTemplatesRoute = createRoute({
  method: "get",
  path: "/templates",
  summary: "List templates",
  request: { query: z.object({ status: z.enum(["draft", "published"]).optional() }) },
  responses: { 200: { description: "Array of templates" } },
});

export const getTemplateRoute = createRoute({
  method: "get",
  path: "/templates/{id}",
  summary: "Get a template by id",
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: "Template with file url" },
    404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
  },
});

// ─── Document routes ──────────────────────────────────────────────────────────

export const GenerateDocRequestSchema = z
  .object({
    templateId: z.string(),
    content: z.string().openapi({ description: "Raw content blob to structure" }),
  })
  .openapi("GenerateDocRequest");

export const GenerateDocResponseSchema = z
  .object({
    success: z.literal(true),
    documentId: z.string(),
    structuredData: z.record(z.any()),
    outputUrl: z.string().nullable(),
  })
  .openapi("GenerateDocResponse");

export const generateDocRoute = createRoute({
  method: "post",
  path: "/documents/generate",
  summary: "Generate a document from a template + content",
  description:
    "Structures the content into JSON via AI, validates against the schema and placeholders, renders the docx, stores it, and records history.",
  request: {
    body: { content: { "application/json": { schema: GenerateDocRequestSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: GenerateDocResponseSchema } },
      description: "Document generated",
    },
    400: {
      content: { "application/json": { schema: ErrorResponseSchema } },
      description: "Validation failure (missing placeholders / schema errors)",
    },
  },
});

export const draftEmailRoute = createRoute({
  method: "post",
  path: "/documents/{id}/email",
  summary: "Draft a client email for an approved document",
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: "Email draft { to, subject, body }" },
    400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Failure" },
  },
});

export const listDocumentsRoute = createRoute({
  method: "get",
  path: "/documents",
  summary: "List generated documents (history)",
  responses: { 200: { description: "Array of documents, newest first" } },
});

export const getDocumentRoute = createRoute({
  method: "get",
  path: "/documents/{id}",
  summary: "Get a document by id",
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: "Document with output url" },
    404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
  },
});
