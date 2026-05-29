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
