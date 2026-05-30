import { z } from "zod";

export type VariableType = "string" | "number" | "boolean";

export interface SchemaField {
  name: string;
  description: string;
  type?: VariableType;
}

export type TemplateSchema = SchemaField[];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export interface PlaceholderResult {
  ok: boolean;
  missing: string[];
}

function zodForType(type?: VariableType): z.ZodTypeAny {
  switch (type) {
    case "number":
      return z.number();
    case "boolean":
      return z.boolean();
    default:
      return z.string().min(1);
  }
}

/**
 * Validates AI-produced data against the template's field schema.
 * Builds a zod object from the schema at runtime and reports field-level errors.
 */
export function validateAgainstSchema(
  data: Record<string, unknown>,
  schema: TemplateSchema
): ValidationResult {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of schema) {
    shape[field.name] = zodForType(field.type);
  }

  const result = z.object(shape).safeParse(data);
  if (result.success) return { ok: true, errors: [] };

  const errors = result.error.issues.map(
    (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`
  );
  return { ok: false, errors };
}

/**
 * Cross-checks that every `{{placeholder}}` the template requires has a
 * non-empty value. Catches the real docxtemplater failure mode (undefined
 * placeholder -> render error) before rendering.
 *
 * @param requiredVars - Output of `extractTemplateVariables`.
 * @param data - The flattened data object that will be rendered.
 */
export function checkPlaceholders(
  requiredVars: string[],
  data: Record<string, unknown>
): PlaceholderResult {
  const missing: string[] = [];
  for (const key of requiredVars) {
    const value = data[key];
    if (value === undefined || value === null || value === "") {
      missing.push(key);
    }
  }
  return { ok: missing.length === 0, missing };
}
