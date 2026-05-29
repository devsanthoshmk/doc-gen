import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { helloRoute, generateRoute } from "./openapi.js";
import { replaceTemplateVariables } from "@repo/core/replacer";

/**
 * Main application instance extending OpenAPIHono for declarative OpenAPI compliance.
 */
const app = new OpenAPIHono();

// Enable CORS for all routes so the frontend can interact with the worker easily
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Redirect the root path to Swagger UI documentation for visual excellence
app.get("/", (c) => {
  return c.redirect("/docs");
});

// Hello world route implementation
app.openapi(helloRoute, (c) => {
  const { name } = c.req.valid("query");
  const greeting = name ? `Hello, ${name}!` : "Hello, World!";
  return c.json(
    {
      message: greeting,
    },
    200
  );
});

// Render template endpoint demonstrating @repo/core/replacer integration
app.openapi(generateRoute, (c) => {
  const { template, data } = c.req.valid("json");
  
  try {
    // Decode base64 template to buffer
    const blob = Buffer.from(template, "base64");
    
    // Leverage the core replacer from monorepo workspace package
    const outBuffer = replaceTemplateVariables(blob, data);
    
    // Encode output back to base64
    const base64Out = outBuffer.toString("base64");
    
    return c.json(
      {
        success: true,
        message: "Document template rendered successfully using @repo/core/replacer",
        base64: base64Out,
      },
      200
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return c.json(
      {
        success: false,
        message: `Failed to render template: ${errorMsg}`,
      },
      400
    );
  }
});

// Configure the OpenAPI documentation options
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Document Generation Workers API",
    description: "API Worker for handling document templates, data flattening, and PDF generation.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local development server",
    },
  ],
});

// Mount Swagger UI under /docs
app.get(
  "/docs",
  swaggerUI({
    url: "/openapi.json",
  })
);

// Determine target port (default 3001)
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

console.log(`🚀 Workers API starting up...`);
console.log(`👉 http://localhost:${port}`);
console.log(`📖 Documentation available at http://localhost:${port}/docs`);

// Start the server using @hono/node-server
serve({
  fetch: app.fetch,
  port,
});

export default app;
