# Automated documentation generator

## Purpose

doc-gen is an automated documentation generator, developer docs CLI, API document generator, and DOCX template engine. It converts plain text, markdown documentation, and structured data into formatted Microsoft Word .docx documents. The system parses OpenXML templates, extracts variable placeholders, generates Zod schemas with language models, and validates input data before document assembly. It provides a CLI, an HTTP API with OpenAPI documentation, and a web interface for document generation workflows.

## Architecture

Turborepo and pnpm workspaces manage the monorepo packages and applications.

- `packages/core`, named `@repo/core` in the workspace: Core library and CLI for DOCX extraction, validation, and rendering. It opens the OpenXML zip archive with PizZip, finds double-bracket placeholders such as `{{company_name}}`, flattens nested JSON into dot-notation paths, and fills templates with docxtemplater.
- `packages/convex`, named `@repo/convex` in the workspace: Cloud backend schema and file storage. It stores template records, variable definitions, generated document records, and binary files in Convex.
- `apps/workers`, named `workers` in the workspace: Node.js HTTP service built with Hono and OpenAPI. It exposes REST endpoints, serves Swagger UI documentation, and coordinates calls to Convex and NVIDIA NIM language models for schema drafting, content structuring, and email generation.
- `apps/frontend`, named `doc-manager` in the workspace: Single-page application built with React 19, Vite, and React Router. It lets users upload templates, inspect extracted variables, submit raw text for structured conversion, and download output documents.

The generation workflow proceeds in four stages:

1. Template ingestion. The user uploads a .docx file. The core package decompresses the archive and extracts all top-level placeholders.
2. Schema generation. The worker sends placeholder names to an LLM on NVIDIA NIM, which infers data types and variable descriptions.
3. Content structuring and validation. The user provides unstructured text. The worker structures that text into JSON through model-assisted structured output, then validates the JSON against Zod schemas.
4. Document rendering. The template engine replaces placeholder tags with validated data and writes the final .docx file to Convex storage.

## Setup

### Prerequisites

- Node.js version 18 or higher.
- pnpm version 9 or higher.

### Environment configuration

Create the worker environment file:

```bash
cp apps/workers/.env.example apps/workers/.env
```

Set the required environment variables in `apps/workers/.env`:

- `CONVEX_URL`: Convex deployment URL.
- `NVIDIA_API_KEY`: NVIDIA NIM API key.
- `NVIDIA_BASE_URL`: NVIDIA API base URL, such as `https://integrate.api.nvidia.com/v1`.
- `NVIDIA_MODEL`: Model identifier, such as `meta/llama-3.1-70b-instruct`.
- `PORT`: HTTP server port, default is 3001.

Create the frontend environment file if the worker runs on a non-default host or port:

```bash
echo "VITE_API_BASE_URL=http://localhost:3001" > apps/frontend/.env
```

### Installation

Install dependencies across all workspaces:

```bash
pnpm install
```

## Usage

### Core CLI

The `@repo/core` package includes a command-line interface for local document operations.

Extract placeholders from a template:

```bash
pnpm --filter @repo/core dev extract <path-to-template.docx>
```

Validate data against a template and optional schema:

```bash
pnpm --filter @repo/core dev validate <path-to-template.docx> <path-to-data.json> [path-to-schema.json]
```

Render a document from a template and data file:

```bash
pnpm --filter @repo/core dev render <path-to-template.docx> <path-to-data.json> [output.docx]
```

Run the built-in test suite:

```bash
pnpm --filter @repo/core dev test
```

### Development servers

Start all workspaces in development mode:

```bash
pnpm run dev
```

To run individual workspaces:

```bash
# Start Convex backend
cd packages/convex && pnpm dev

# Start worker API server on port 3001
pnpm --filter workers dev

# Start frontend development server on port 5173
pnpm --filter doc-manager dev
```

### API endpoints

The worker application exposes an OpenAPI 3.0 REST API with interactive Swagger UI at `http://localhost:3001/docs`.

Primary endpoints:

- `POST /templates/upload`: Ingests base64 DOCX files, extracts template placeholders, and saves template records.
- `GET /templates`: Lists available templates.
- `GET /templates/:id`: Retrieves template details and download URL.
- `PATCH /templates/:id`: Updates template metadata, variable definitions, and published status.
- `POST /documents/generate`: Converts unstructured input text into structured JSON, validates against schema, and renders a DOCX document.
- `POST /documents/:id/email`: Drafts an email corresponding to generated document records.
- `GET /documents`: Lists document generation history and download links.
- `GET /documents/:id`: Retrieves details and storage URL for a single document.

## Configuration

The monorepo coordinates packages with the following configuration files:

- `pnpm-workspace.yaml`: Defines workspace packages in `packages/*` and applications in `apps/frontend` and `apps/workers`.
- `turbo.json`: Defines pipeline dependencies, task caching, and environment variable requirements across builds.
- `packages/typescript-config`: Stores shared TypeScript compiler settings.
- `packages/eslint-config`: Stores shared ESLint configurations.

## Quality checks

Run type checking across all workspaces:

```bash
pnpm run check-types
```

Run ESLint across all workspaces:

```bash
pnpm run lint
```

Build all packages and applications:

```bash
pnpm run build
```
