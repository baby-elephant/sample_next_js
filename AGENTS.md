# Repository Guidelines

## Project Structure & Module Organization
- `src/app` contains the Next.js App Router routes, layouts, and pages (e.g., `src/app/page.tsx`, `src/app/message/page.tsx`).
- API endpoints use Next.js Route Handlers colocated under `src/app/**/api/route.ts` (e.g., `src/app/message/api/route.ts`, `src/app/message/[id]/api/route.ts`), with adjacent validation/types in `schema.ts` when needed.
- Route-level styles live alongside pages as CSS Modules (e.g., `src/app/page.module.css`).
- Shared UI lives in `src/app/_components` with paired `*.module.css` styles.
- Static assets are in `public/` (icons, images, etc.).

## Build, Test, and Development Commands
- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create a production build with Next.js.
- `npm run start`: run the production server after a build.
- `npm run lint`: run ESLint with the Next.js config.

## Libraries
- Runtime: `next`, `react`, `react-dom`
- Forms: `react-hook-form` + `@hookform/resolvers`
- Validation: `zod`
- Tooling: `typescript`, `eslint` + `eslint-config-next`, `babel-plugin-react-compiler`, `@types/*`

## Coding Style & Naming Conventions
- TypeScript + React (TSX) with 2-space indentation and double quotes, matching existing files.
- Use CSS Modules for component/page styles (`*.module.css`).
- Route folders map to URLs; keep file names conventional: `page.tsx`, `layout.tsx`.
- Components in `src/app/_components` should use PascalCase (e.g., `Modal.tsx`).

## Testing Guidelines
- Jest is configured for unit tests.
- Run tests with `npm test`.

## Commit & Pull Request Guidelines
- Recent commits are short and present-tense (e.g., `fix collocate`, `api簡易実装`). Keep messages concise and task-focused; Japanese or English is acceptable.
- PRs should include a brief summary, key UI screenshots for visual changes, and any relevant links to issues or notes about routing changes.

## Configuration & Tips
- Framework config lives in `next.config.ts`; TypeScript settings are in `tsconfig.json`.
- Prefer colocating route-specific assets and styles within the route folder to keep changes localized.
