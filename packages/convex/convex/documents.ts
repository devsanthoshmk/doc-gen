import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";

const emailDraft = v.object({
  to: v.string(),
  subject: v.string(),
  body: v.string(),
});

export const createDocument = mutation({
  args: {
    templateId: v.id("templates"),
    templateName: v.string(),
    inputContent: v.string(),
    structuredData: v.any(),
    outputStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("doc_review"),
      v.literal("approved"),
      v.literal("email_review")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    structuredData: v.optional(v.any()),
    outputStorageId: v.optional(v.id("_storage")),
    emailDraft: v.optional(emailDraft),
    status: v.optional(
      v.union(
        v.literal("doc_review"),
        v.literal("approved"),
        v.literal("email_review")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(rest)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch("documents", id, patch);
    return await ctx.db.get("documents", id);
  },
});

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const getDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get("documents", args.id);
    if (!doc) return null;
    const outputUrl = doc.outputStorageId
      ? await ctx.storage.getUrl(doc.outputStorageId)
      : null;
    return { ...doc, outputUrl };
  },
});
