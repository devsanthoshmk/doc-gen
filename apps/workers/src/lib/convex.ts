import { ConvexHttpClient } from "convex/browser";
import * as convexApi from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";

const api = convexApi.api;

const url = process.env.CONVEX_URL;
if (!url) throw new Error("CONVEX_URL is not set");

export const convex = new ConvexHttpClient(url);

export type TemplateVariable = {
  name: string;
  description: string;
  type?: "string" | "number" | "boolean";
};

/**
 * Uploads docx bytes to Convex file storage and returns the storageId.
 */
export async function uploadDocx(bytes: Buffer): Promise<Id<"_storage">> {
  const uploadUrl = await convex.mutation(api.templates.generateUploadUrl, {});
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    body: new Uint8Array(bytes),
  });
  if (!res.ok) {
    throw new Error(`Convex storage upload failed: ${res.status}`);
  }
  const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
  return storageId;
}

/**
 * Downloads docx bytes from a Convex storage file URL.
 */
export async function downloadFromUrl(fileUrl: string): Promise<Buffer> {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export { api };
