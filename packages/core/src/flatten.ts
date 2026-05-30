export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Flattens a nested object into dot-notation keys so that nested AI JSON maps
 * onto dotted `{{a.b.c}}` placeholders. The original nested objects are kept
 * too, so both `{{address}}` (loops) and `{{address.city}}` resolve.
 *
 * @example flattenObject({ a: { b: 1 } }) // => { a: { b: 1 }, "a.b": 1 }
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
  result: Record<string, unknown> = {}
): Record<string, unknown> {
  for (const [key, value] of Object.entries(obj)) {
    const flatKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[flatKey] = value;
      flattenObject(value as Record<string, unknown>, flatKey, result);
    } else {
      result[flatKey] = value;
    }
    if (!prefix) result[key] = value;
  }
  return result;
}
