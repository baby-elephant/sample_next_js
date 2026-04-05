# Repository Guidelines

## Project Structure & Module Organization
- `src/app` is the application root for the Next.js App Router. The base shell lives in `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/app/favicon.ico`.
- Feature routes are organized by URL segment. Current examples include `src/app/message` and `src/app/bento`.
- Shared UI belongs in `src/app/_components`. Route-specific UI stays under the owning route, such as `src/app/message/_components` or `src/app/message/[id]/_components`.
- Route Handlers live under `src/app/**/api/route.ts`. When a route needs request validation, keep `schema.ts` adjacent to the handler.
- Route-specific helpers and local persistence stay close to the feature. The `message` route uses `src/app/message/_lib/messages.ts` and `src/app/message/_data/messages.json`.
- Static assets live in `public/`.

## Architecture Overview
- This app is server-first. Route pages and details views are async server components unless browser-only behavior is required.
- Add `"use client"` only to interactive components. Current examples are `src/app/_components/Modal.tsx` and `src/app/message/_components/MessageCreateForm.tsx`.
- The `message` feature shows the preferred collocation pattern: page, API handlers, schemas, helper logic, data, and private components all live under one route subtree.
- The `bento` feature demonstrates parallel routes with named slots in `src/app/bento/@main` and `src/app/bento/@sidebar`, plus a slot-level `loading.tsx`.
- The modal flow in `src/app/message/@modal/(.)[id]` demonstrates intercepted routes. It reuses the shared `Modal` component and the normal message detail page.

## Build, Test, and Development Commands
- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create the production build.
- `npm run start`: run the production server after a build.
- `npm run lint`: run ESLint with the Next.js config.
- `npm test`: run the Jest test suite.
- `npm test -- --runInBand`: useful when debugging tests locally in a stable order.

## Coding Style & Naming Conventions
- Use TypeScript + React (TSX), 2-space indentation, and double quotes to match the existing codebase.
- Keep App Router filenames conventional: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, and `default.tsx`.
- Use PascalCase for React component files such as `Modal.tsx`, `MessageCreateForm.tsx`, and `MessageDetails.tsx`.
- Use `*.module.css` for route-level or component-level scoped styles. Global styles belong in `src/app/globals.css`.
- Import order is typically framework imports first, then third-party packages, then local modules and styles.
- The codebase supports the `@/*` alias from `tsconfig.json`. Use it when it improves readability, but route-local relative imports are also common.
- Build forms with `react-hook-form`, and define validation schemas with `zod`.

## Collocation Rules
- Prefer colocating route-specific code with the route that owns it.
- Keep pages, layouts, tests, schemas, helpers, and styles inside the relevant feature folder unless the code is shared across multiple routes.
- Use `_components/` for route-private UI, `_lib/` for route-private helpers, and `_data/` for route-private data files.
- Use `src/app/_components` only for genuinely shared UI.
- A good model is `src/app/message`, which contains `page.tsx`, `layout.tsx`, `message.module.css`, `_components/`, `_lib/`, `_data/`, `api/`, `[id]/`, and `@modal/`.

## API & Validation Patterns
- Keep Route Handlers thin. Move data access into colocated helpers such as `src/app/message/_lib/messages.ts`.
- Validate request data with Zod in adjacent `schema.ts` files. The collection route uses `createMessageBodySchema`; the `[id]` route uses `messageIdSchema` and `updateMessageBodySchema`.
- Current handlers export `runtime = "nodejs"` and `dynamic = "force-dynamic"` for file-backed message operations. Preserve that pattern for similar server-only handlers.
- Parse request JSON defensively and return structured `400` responses for invalid JSON or schema failures.
- For `[id]` routes, validate params before calling helper functions and return `404` when a record is missing.

## Testing Guidelines
- Jest is configured in `jest.config.js` through `next/jest` and runs in a Node environment.
- Keep tests close to the code they cover using `*.test.ts` or `*.test.tsx`.
- The current example is `src/app/message/api/route.test.ts`, which imports handlers directly from `route.ts` and mocks the colocated data layer with `jest.mock("../_lib/messages")`.
- When adding Route Handler tests, cover success, invalid JSON, schema validation failure, and not-found or helper-layer failure paths as applicable.
- `tsconfig.json` excludes `*.test.ts`, `*.test.tsx`, and `__tests__` from app compilation. Keep tests outside the runtime path assumptions.

## Commit & Pull Request Guidelines
- Recent commits are short and present-tense, for example `fix collocate`, `jest`, and `react-hook-form`.
- Keep commit messages concise and task-focused. Japanese or English is acceptable.
- Pull requests should include a short summary, screenshots for UI changes, and issue or routing notes when relevant.
- If a change affects route structure, API behavior, or modal/parallel routing behavior, call that out explicitly in the PR description.

## Configuration Notes
- Core project settings live in `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `jest.config.js`, and `package.json`.
- ESLint uses the Next.js core web vitals and TypeScript presets.
- Current runtime libraries include `next`, `react`, `react-dom`, `react-hook-form`, `@hookform/resolvers`, and `zod`.
