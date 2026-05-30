# Frontend Integration Guide

How to wire the React app (`apps/frontend`) to the Hono worker backend. The
backend is built and verified; this doc is the contract so the frontend can be
wired or extended without re-reading worker/Convex code.

## Ground rules

- **Frontend talks only to the worker** (`apps/workers`, default
  `http://localhost:3001`). Never call Convex directly — the NVIDIA AI key and
  all DB access live in the worker.
- Add `apps/frontend/.env` with `VITE_API_BASE_URL=http://localhost:3001`.
- All request/response bodies are JSON. Files (.docx) are sent **base64-encoded**
  inside JSON, not multipart.
- Run order locally: `npx convex dev` (in `packages/convex`) → `pnpm --filter
  workers dev` → `pnpm --filter doc-manager dev`.

---

## Endpoints

### POST `/templates/upload`
Upload a .docx template. Worker extracts `{{placeholders}}`, AI drafts a
description + type per variable, stores the file in Convex, returns the draft
schema for the user to edit.

Request:
```json
{ "filename": "offer-letter.docx", "category": "HR", "access": "Private", "base64": "<docx base64>" }
```
Response `200`:
```json
{
  "success": true,
  "templateId": "j97...",
  "variables": [
    { "name": "firstName", "description": "Employee's first name", "type": "string" },
    { "name": "salary", "description": "Annual salary", "type": "number" }
  ]
}
```
Error `400`: `{ "success": false, "message": "Upload failed: ..." }`

### PATCH `/templates/{id}`
Save user-edited variable descriptions, rename, or publish.
Request (all fields optional):
```json
{ "name": "Offer Letter", "variables": [ ... ], "status": "published" }
```
Response `200`: the updated template row.

Note:
- The current frontend passes `templateId` into `TemplateEditor` via query string: `/templates/editor?templateId=<id>`.
- Refresh-safe editing depends on this query string, not only route state.

### GET `/templates?status=published`
List templates (newest first). `status` query optional (`draft` | `published`).
Response `200`: array of template rows:
```json
[ { "_id": "j97...", "name": "...", "category": "HR", "access": "Private",
    "variables": [...], "status": "draft", "createdAt": 1730000000000,
    "fileUrl": null } ]
```
(`fileUrl` is only populated by GET `/templates/{id}`.)

### GET `/templates/{id}`
Single template + `fileUrl` (Convex download URL for the .docx).
Response `200`: template row with `fileUrl`. `404` if missing.

### POST `/documents/generate`
Structure content → validate → render docx → store → record history.
Request:
```json
{ "templateId": "j97...", "content": "<the raw blob the user pasted>" }
```
Response `200`:
```json
{
  "success": true,
  "documentId": "j57...",
  "structuredData": { "firstName": "Jane", "salary": 135000, "address.city": "Springfield" },
  "outputUrl": "https://<deployment>.convex.cloud/api/storage/<id>"
}
```
Validation failure `400` (THIS is the flowchart's "Validation layer"):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "firstName: String must contain at least 1 character(s)",
    "Missing value for {{firstName}}"
  ]
}
```
Show `errors[]` to the user; let them edit content and retry (the "Reject with
feedback" loop).

### POST `/documents/{id}/email`
Draft a client email from the generated document. Sets status `email_review`.
Response `200`:
```json
{ "success": true, "to": "client@example.com", "subject": "...", "body": "..." }
```

### GET `/documents`
History — all generated documents, newest first.
Response `200`: array of document rows (`templateName`, `status`,
`structuredData`, `emailDraft?`, `createdAt`, `_id`, ...).

### GET `/documents/{id}`
Single document + `outputUrl` (download URL for the rendered docx). `404` if missing.

---

## Suggested API client — `apps/frontend/src/api/client.ts`

```ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json();
  if (!res.ok || body?.success === false) {
    throw Object.assign(new Error(body?.message ?? "Request failed"), { body });
  }
  return body as T;
}

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1]); // strip data: prefix
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const api = {
  uploadTemplate: (b: { filename: string; category: string; access: string; base64: string }) =>
    req("/templates/upload", { method: "POST", body: JSON.stringify(b) }),
  updateTemplate: (id: string, b: object) =>
    req(`/templates/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  listTemplates: (status?: "draft" | "published") =>
    req(`/templates${status ? `?status=${status}` : ""}`),
  getTemplate: (id: string) => req(`/templates/${id}`),
  generateDocument: (b: { templateId: string; content: string }) =>
    req("/documents/generate", { method: "POST", body: JSON.stringify(b) }),
  draftEmail: (id: string) => req(`/documents/${id}/email`, { method: "POST" }),
  listDocuments: () => req("/documents"),
  getDocument: (id: string) => req(`/documents/${id}`),
};
```

The thrown error carries `.body.errors` (string[]) on validation failures — use
it to render the validation panel.

---

## What is already wired

This repo's existing pages are now connected directly to the worker API:

- `UploadTemplate.tsx`
  Uploads a real `.docx`, calls `/templates/upload`, then navigates to `TemplateEditor` with `templateId`.
- `TemplateEditor.tsx`
  Loads template data from the worker when needed, edits variable descriptions/types, and persists via `PATCH /templates/{id}`.
- `TemplateLibrary.tsx`
  Lists live templates from the worker, filters client-side, and routes to generate or edit flows.
- `SelectTemplate.tsx`
  Loads only published templates and stores `templateId` + template name in `GenerateContext`.
- `EnterContent.tsx`
  Calls `/documents/generate`, shows validation failures, stores `documentId`, `structuredData`, and `outputUrl`.
- `ReviewEmail.tsx`
  Calls `/documents/{id}/email`, stores the returned draft in `GenerateContext`, and shows the real draft content.
- `DocumentHistory.tsx`
  Loads live history from `/documents`, fetches record details with `/documents/{id}`, and exposes real output downloads.
- `Success.tsx`
  Reflects the actual backend scope: generated doc + drafted email, no send.

---

## Page-by-page wiring

### `UploadTemplate.tsx`  (`/templates/upload`)
- Connected.
- Accept only `.docx`.
- On `INITIALIZE SCHEMA`: `base64 = await fileToBase64(selectedFile)`, then
  `api.uploadTemplate({ filename, category: activeCategory, access: activePrivacy, base64 })`.
- Navigate to `/templates/editor?templateId=<id>` and also pass state for an immediate handoff.

### `TemplateEditor.tsx`  (`/templates/editor`)
- Connected.
- Variables panel is now bound to the real template `variables` with editable
  descriptions and scalar types.
- `STORE LOCALLY` / `PUBLISH SCHEMA` call
  `api.updateTemplate(id, { name, variables, status })`.

### `TemplateLibrary.tsx`  (`/templates`) and `SelectTemplate.tsx`
- Connected.
- `TemplateLibrary` uses `api.listTemplates()` and routes to either:
  `EnterContent` with context set, or `TemplateEditor` with `templateId`.
- `SelectTemplate` uses `api.listTemplates("published")`.
- Each live record `_id` is passed through `GenerateContext`.

### `EnterContent.tsx`  (`/generate/enter-content`)
- Connected.
- Calls `api.generateDocument({ templateId, content })`.
- On success: stores `documentId`, `structuredData`, `outputUrl`, and a JSON
  preview string in `GenerateContext`.
- On `400`: reads `err.body.errors` and shows the validation panel.
- "Reject & Refine" currently appends the user's note back into the content and
  regenerates. This avoids a new backend endpoint for now.

### `ReviewEmail.tsx`  (`/generate/review-email`)
- Connected.
- On entry: `api.draftEmail(documentId)`; renders the real `{ to, subject, body }`.
- "Reject & Recalibrate" currently re-runs the same backend draft endpoint.
  The feedback text is intentionally not sent yet because the backend does not
  expose a prompt override endpoint in this pass.

### `DocumentHistory.tsx`  (`/history`)
- Connected.
- Uses `api.listDocuments()` for the grid and `api.getDocument(id)` for the drawer.
- Maps `doc_review` / `approved` / `email_review` into the current UI labels.
- Drawer now shows the real structured JSON, any saved email draft, and the
  real `outputUrl` when present.

---

## `GenerateContext` extension

Add to `apps/frontend/src/context/GenerateContext.tsx`:
```ts
templateId: string; setTemplateId: (v: string) => void;
documentId: string; setDocumentId: (v: string) => void;
structuredData: Record<string, unknown>; setStructuredData: (v: Record<string, unknown>) => void;
outputUrl: string; setOutputUrl: (v: string) => void;
```
These carry the selected template and generated-doc identifiers across the
4-step generate flow (SelectTemplate → EnterContent → ReviewEmail → Success).

---

## Deferred Component Work

No new frontend components were added in this pass. The existing pages were
connected directly with minimal structural changes.

If you want to deepen the UX later, add these as dedicated components instead of
expanding the current pages further:

- `SchemaFieldEditor`
  Purpose: richer per-variable editing with validation hints, duplicate-name
  detection, and better type affordances.
  Inputs:
  `variable`, `onChange`, `onRemove`

- `StructuredPreviewPanel`
  Purpose: show generated JSON in a formatted inspector and optionally render a
  downloadable-doc callout beside it.
  Inputs:
  `structuredData`, `outputUrl`, `validationErrors`

- `EmailDraftRegenerateForm`
  Purpose: support true "reject and recalibrate" behavior once the backend
  accepts custom email-redraft instructions.
  Inputs:
  `documentId`, `initialFeedback`, `onRegenerated`

- `BlankTemplateComposer`
  Purpose: create schemas without uploading a DOCX first.
  Reason deferred:
  current backend flow is intentionally DOCX-first, so `Create New` routes to
  upload rather than exposing a partially supported blank-authoring path.

With only this doc as context, a future implementation should keep those
components page-owned first, and only extract shared subcomponents if at least
two pages use the same UI contract.

---

## Notes / gotchas

- Convex IDs are strings; pass them through verbatim.
- `structuredData` uses **dotted keys** for nested template vars (e.g.
  `"address.city"`) — that's intentional (matches `{{address.city}}`).
- The worker's NVIDIA model id is env-configurable (`NVIDIA_MODEL` in
  `apps/workers/.env`); default `meta/llama-3.1-70b-instruct`.
- AI structured output requires `.nullable()` (not `.optional()`) on optional
  fields — already handled in the worker; only relevant if you add new AI calls.
- The current "approve" and "send" semantics are UI-only beyond the existing
  backend status transitions. If you later need a true approval/send workflow,
  add explicit worker endpoints instead of overloading the current draft routes.
