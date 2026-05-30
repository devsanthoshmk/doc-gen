import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// A single template variable + an AI/user-authored description used to guide
// the model when it structures raw content into JSON.
const variable = v.object({
  name: v.string(),
  description: v.string(),
  type: v.optional(
    v.union(v.literal("string"), v.literal("number"), v.literal("boolean"))
  ),
});

const emailDraft = v.object({
  to: v.string(),
  subject: v.string(),
  body: v.string(),
});

export default defineSchema(
  {
    templates: defineTable({
      name: v.string(),
      category: v.string(),
      access: v.string(),
      storageId: v.id("_storage"), // uploaded .docx blob
      variables: v.array(variable),
      status: v.union(v.literal("draft"), v.literal("published")),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    }).index("by_createdAt", ["createdAt"]),

    documents: defineTable({
      templateId: v.id("templates"),
      templateName: v.string(),
      inputContent: v.string(), // raw blob the user pasted
      structuredData: v.any(), // AI JSON keyed by template variables
      outputStorageId: v.optional(v.id("_storage")), // rendered .docx
      emailDraft: v.optional(emailDraft),
      status: v.union(
        v.literal("doc_review"),
        v.literal("approved"),
        v.literal("email_review")
      ),
      createdAt: v.number(),
    }).index("by_createdAt", ["createdAt"]),
  },
  { schemaValidation: true }
);
