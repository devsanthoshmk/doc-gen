import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";

const variable = v.object({
  name: v.string(),
  description: v.string(),
  type: v.optional(
    v.union(v.literal("string"), v.literal("number"), v.literal("boolean"))
  ),
});

// Worker calls this, then PUTs the .docx bytes to the returned URL.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createTemplate = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    access: v.string(),
    storageId: v.id("_storage"),
    variables: v.array(variable),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("templates", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateTemplate = mutation({
  args: {
    id: v.id("templates"),
    name: v.optional(v.string()),
    variables: v.optional(v.array(variable)),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(rest)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch("templates", id, patch);
    return await ctx.db.get("templates", id);
  },
});

export const listTemplates = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("templates")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return args.status ? rows.filter((r) => r.status === args.status) : rows;
  },
});

export const getTemplate = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get("templates", args.id);
    if (!template) return null;
    const fileUrl = await ctx.storage.getUrl(template.storageId);
    return { ...template, fileUrl };
  },
});
