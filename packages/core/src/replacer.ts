import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

/**
 * Replaces template variables in a DOCX document buffer using provided data.
 *
 * This function uses `pizzip` to read the document and `docxtemplater` to render
 * the template with the provided data. It expects variables in the document to be
 * enclosed in double curly braces (e.g., `{{variableName}}`).
 * 
 * @param blob - The original DOCX document as a Buffer.
 * @param data - A key-value object containing the data to inject into the template.
 * @returns A new Buffer containing the generated DOCX document.
 * @throws {Error} Throws an error with detailed messages if template rendering fails.
 */
export function replaceTemplateVariables(
  blob: Buffer,
  data: Record<string, unknown>
): Buffer {
  const zip = new PizZip(blob);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks:    true,
    delimiters:    { start: "{{", end: "}}" },
  });

  try {
    doc.render(data);
  } catch (err: unknown) {
    const e = err as { properties?: { errors?: Array<{ message?: string }> } };
    if (e?.properties?.errors?.length) {
      const details = e.properties.errors.map((x) => x.message).join("\n  ");
      throw new Error(`Template rendering failed:\n  ${details}`);
    }
    throw err;
  }

  return doc.getZip().generate({ type: "nodebuffer" });
}
