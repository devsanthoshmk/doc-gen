import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import type { TemplateVariable } from "./convex.js";

const apiKey = process.env.NVIDIA_API_KEY;
const baseURL = process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
const model = process.env.NVIDIA_MODEL ?? "meta/llama-3.1-70b-instruct";

if (!apiKey) throw new Error("NVIDIA_API_KEY is not set");

function makeModel(temperature = 0.2): ChatOpenAI {
  return new ChatOpenAI({
    apiKey,
    model,
    temperature,
    configuration: { baseURL },
  });
}

/**
 * Given the raw placeholder names extracted from a docx, ask the model to draft
 * a human-readable description (and a guessed scalar type) for each — this is
 * the JSON schema the user then reviews/edits.
 */
export async function draftVariableDescriptions(
  varNames: string[]
): Promise<TemplateVariable[]> {
  if (varNames.length === 0) return [];

  const schema = z.object({
    variables: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(["string", "number", "boolean"]).nullable(),
      })
    ),
  });

  const structured = makeModel(0.3).withStructuredOutput(schema, {
    name: "variable_descriptions",
  });

  const result = await structured.invoke([
    {
      role: "system",
      content:
        "You document templates. For each placeholder variable name, write a short, clear description of what value it should hold and infer its scalar type (string, number, or boolean). Keep descriptions under 15 words. Return every variable given, unchanged names.",
    },
    {
      role: "user",
      content: `Template placeholder variables:\n${varNames.map((v) => `- ${v}`).join("\n")}`,
    },
  ]);

  // Guarantee one entry per input name even if the model drops some.
  const byName = new Map(result.variables.map((v) => [v.name, v]));
  return varNames.map((name) => {
    const v = byName.get(name);
    if (!v) return { name, description: `Value for ${name}`, type: "string" as const };
    return { name: v.name, description: v.description, type: v.type ?? undefined };
  });
}

/**
 * Turn the user's raw content blob into a flat JSON object keyed by the
 * template's variable names, guided by each variable's description.
 */
export async function structureContent(
  content: string,
  variables: TemplateVariable[]
): Promise<Record<string, unknown>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const variable of variables) {
    const base =
      variable.type === "number"
        ? z.number()
        : variable.type === "boolean"
          ? z.boolean()
          : z.string();
    shape[variable.name] = base.describe(variable.description);
  }
  const schema = z.object(shape);

  const structured = makeModel(0.1).withStructuredOutput(schema, {
    name: "structured_document_data",
  });

  const fieldList = variables
    .map((v) => `- ${v.name}${v.type ? ` (${v.type})` : ""}: ${v.description}`)
    .join("\n");

  const result = await structured.invoke([
    {
      role: "system",
      content:
        "Extract structured data from the user's content to fill a document template. Use only information present in the content; if a value is not stated, infer the most reasonable value from context. Return every requested field.",
    },
    {
      role: "user",
      content: `Fields to fill:\n${fieldList}\n\nContent:\n"""\n${content}\n"""`,
    },
  ]);

  return result as Record<string, unknown>;
}

/**
 * Draft a client email from the approved document's structured data.
 */
export async function draftEmail(
  templateName: string,
  structuredData: Record<string, unknown>
): Promise<{ to: string; subject: string; body: string }> {
  const schema = z.object({
    to: z.string().describe("Recipient email address, or a placeholder if unknown"),
    subject: z.string(),
    body: z.string(),
  });

  const structured = makeModel(0.4).withStructuredOutput(schema, {
    name: "email_draft",
  });

  const result = await structured.invoke([
    {
      role: "system",
      content:
        "Write a concise, professional client email accompanying a generated document. Reference the relevant details. If no recipient address is known, use a clear placeholder like client@example.com.",
    },
    {
      role: "user",
      content: `Document type: ${templateName}\nDocument data:\n${JSON.stringify(structuredData, null, 2)}`,
    },
  ]);

  return result;
}
