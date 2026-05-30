const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export type VariableType = "string" | "number" | "boolean";

export interface TemplateVariable {
  name: string;
  description: string;
  type?: VariableType;
}

export interface TemplateRow {
  _id: string;
  name: string;
  category: string;
  access: string;
  storageId: string;
  variables: TemplateVariable[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt?: number;
  fileUrl?: string | null;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

export interface DocumentRow {
  _id: string;
  templateId: string;
  templateName: string;
  inputContent: string;
  structuredData: Record<string, unknown>;
  outputStorageId?: string;
  emailDraft?: EmailDraft;
  status: "doc_review" | "approved" | "email_review";
  createdAt: number;
  outputUrl?: string | null;
}

export interface ApiError extends Error {
  body?: { success: false; message: string; errors?: string[] };
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    const err = new Error(body?.message ?? `Request failed (${res.status})`) as ApiError;
    err.body = body;
    throw err;
  }
  return body as T;
}

/** Read a File as base64 (strips the `data:...;base64,` prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export const api = {
  uploadTemplate: (b: {
    filename: string;
    category: string;
    access: string;
    base64: string;
  }) =>
    req<{ success: true; templateId: string; variables: TemplateVariable[] }>(
      "/templates/upload",
      { method: "POST", body: JSON.stringify(b) }
    ),

  updateTemplate: (
    id: string,
    b: { name?: string; variables?: TemplateVariable[]; status?: "draft" | "published" }
  ) => req<TemplateRow>(`/templates/${id}`, { method: "PATCH", body: JSON.stringify(b) }),

  listTemplates: (status?: "draft" | "published") =>
    req<TemplateRow[]>(`/templates${status ? `?status=${status}` : ""}`),

  getTemplate: (id: string) => req<TemplateRow>(`/templates/${id}`),

  generateDocument: (b: { templateId: string; content: string }) =>
    req<{
      success: true;
      documentId: string;
      structuredData: Record<string, unknown>;
      outputUrl: string | null;
    }>("/documents/generate", { method: "POST", body: JSON.stringify(b) }),

  draftEmail: (id: string) =>
    req<{ success: true } & EmailDraft>(`/documents/${id}/email`, { method: "POST" }),

  listDocuments: () => req<DocumentRow[]>("/documents"),

  getDocument: (id: string) => req<DocumentRow>(`/documents/${id}`),
};
