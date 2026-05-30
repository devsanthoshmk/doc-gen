import PizZip from "pizzip";

// Capture the raw tag body (incl. any leading sigil) so we can classify it.
const TAG_RE = /\{\{\s*([#/^]?)\s*([\w.]+)\s*\}\}/g;

/**
 * Extracts the unique top-level `{{variable}}` placeholder names from a DOCX
 * document.
 *
 * Scans the main document body plus all header and footer parts, since
 * placeholders frequently live in headers/footers (addresses, dates, etc.).
 *
 * Docxtemplater section/loop syntax is handled so loop-internal vars don't get
 * mistaken for required top-level data:
 *   - `{{#section}}` / `{{/section}}` / `{{^section}}` markers are recorded as
 *     section names and excluded from the required list.
 *   - any plain `{{var}}` nested between a `{{#x}}`..`{{/x}}` pair is treated as
 *     loop-scoped and excluded.
 * The result is the source of truth for "what top-level variables this template
 * needs", which the validation layer cross-checks against the AI data.
 */
export function extractTemplateVariables(blob: Buffer): string[] {
  const zip = new PizZip(blob);

  const parts = Object.keys(zip.files).filter((name) =>
    /^word\/(document|header\d*|footer\d*)\.xml$/.test(name)
  );

  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const part of parts) {
    const xml = zip.files[part]?.asText() ?? "";
    let depth = 0; // section nesting depth
    for (const match of xml.matchAll(TAG_RE)) {
      const sigil = match[1];
      const name = match[2];
      if (!name) continue;

      if (sigil === "#" || sigil === "^") {
        depth++;
        continue; // section opener is not a required scalar
      }
      if (sigil === "/") {
        if (depth > 0) depth--;
        continue;
      }
      if (depth > 0) continue; // loop-scoped variable, not top-level

      if (!seen.has(name)) {
        seen.add(name);
        ordered.push(name);
      }
    }
  }

  return ordered;
}
