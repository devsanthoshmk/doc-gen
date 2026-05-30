import * as fs from "fs";
import * as path from "path";
import { replaceTemplateVariables } from "./src/replacer";
import { extractTemplateVariables } from "./src/extract";
import { flattenObject, type JsonObject } from "./src/flatten";
import {
  checkPlaceholders,
  validateAgainstSchema,
  type TemplateSchema,
} from "./src/validate";

// ─── Debug CLI ──────────────────────────────────────────────────────────────
// Exercises each core module in isolation — no worker / Convex / AI needed.
//
//   pnpm --filter @repo/core dev                 # smoke test against samples
//   pnpm --filter @repo/core dev extract  <docx>
//   pnpm --filter @repo/core dev validate <docx> <data.json> [schema.json]
//   pnpm --filter @repo/core dev render   <docx> <data.json> [out.docx]

const SAMPLE_DOCX = "template.docx";
const SAMPLE_DATA = "sample-data.json";

function readDocx(p: string): Buffer {
  return fs.readFileSync(path.resolve(p));
}

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(path.resolve(p), "utf-8")) as T;
}

function printUsage(): void {
  console.log(`
@repo/core debug CLI

  extract  <docx>                          List {{placeholders}} found in a docx
  validate <docx> <data.json> [schema.json] Check placeholders (+ schema if given)
  render   <docx> <data.json> [out.docx]    Fill template, write output docx
  test                                     Run all checks against bundled samples

Defaults: docx=${SAMPLE_DOCX}, data=${SAMPLE_DATA}
`);
}

function cmdExtract(docxPath: string): string[] {
  const vars = extractTemplateVariables(readDocx(docxPath));
  console.log(`Variables in ${docxPath} (${vars.length}):`);
  for (const v of vars) console.log(`  • ${v}`);
  return vars;
}

function cmdValidate(
  docxPath: string,
  dataPath: string,
  schemaPath?: string
): boolean {
  const vars = extractTemplateVariables(readDocx(docxPath));
  const raw = readJson<JsonObject>(dataPath);
  const data = flattenObject(raw);

  const placeholder = checkPlaceholders(vars, data);
  console.log(
    placeholder.ok
      ? "✅ Placeholders: all present"
      : `❌ Placeholders missing: ${placeholder.missing.join(", ")}`
  );

  let schemaOk = true;
  if (schemaPath) {
    const schema = readJson<TemplateSchema>(schemaPath);
    const res = validateAgainstSchema(raw, schema);
    schemaOk = res.ok;
    console.log(
      res.ok
        ? "✅ Schema: valid"
        : `❌ Schema errors:\n  ${res.errors.join("\n  ")}`
    );
  }

  return placeholder.ok && schemaOk;
}

function cmdRender(
  docxPath: string,
  dataPath: string,
  outPath?: string
): string {
  const blob = readDocx(docxPath);
  const data = flattenObject(readJson<JsonObject>(dataPath));
  const outBuffer = replaceTemplateVariables(blob, data);

  const absTemplate = path.resolve(docxPath);
  const resolved =
    outPath ??
    path.join(
      path.dirname(absTemplate),
      path.basename(absTemplate, ".docx") + "-output.docx"
    );
  fs.writeFileSync(resolved, outBuffer);
  console.log(`✅ Rendered -> ${path.resolve(resolved)}`);
  return resolved;
}

function cmdTest(): boolean {
  console.log("── core smoke test ──");
  let pass = true;
  try {
    const vars = cmdExtract(SAMPLE_DOCX);
    pass = pass && vars.length > 0;
  } catch (e) {
    pass = false;
    console.error(`extract failed: ${(e as Error).message}`);
  }
  try {
    pass = cmdValidate(SAMPLE_DOCX, SAMPLE_DATA) && pass;
  } catch (e) {
    pass = false;
    console.error(`validate failed: ${(e as Error).message}`);
  }
  try {
    cmdRender(SAMPLE_DOCX, SAMPLE_DATA, "output/filled.docx");
  } catch (e) {
    pass = false;
    console.error(`render failed: ${(e as Error).message}`);
  }
  console.log(pass ? "\n✅ ALL PASS" : "\n❌ FAILURES — see above");
  return pass;
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);

  try {
    switch (cmd) {
      case "extract":
        cmdExtract(rest[0] ?? SAMPLE_DOCX);
        break;
      case "validate":
        cmdValidate(rest[0] ?? SAMPLE_DOCX, rest[1] ?? SAMPLE_DATA, rest[2]);
        break;
      case "render":
        cmdRender(rest[0] ?? SAMPLE_DOCX, rest[1] ?? SAMPLE_DATA, rest[2]);
        break;
      case undefined:
      case "test":
        if (!cmdTest()) process.exit(1);
        break;
      case "--help":
      case "-h":
        printUsage();
        break;
      default:
        console.error(`Unknown command: ${cmd}`);
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Error: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
