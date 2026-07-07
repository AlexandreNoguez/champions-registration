# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 14 application for tournament registration. Application code lives in `src/`: `src/app` contains App Router pages and API routes, `src/app/api/registrations/route.ts` handles registration requests, and `src/lib` contains shared infrastructure such as MongoDB connection logic. Use `src/components` for reusable UI components. Product and architecture notes live in `openspec/`, including feature specs, functional requirements, non-functional requirements, and the MongoDB model. Local services are defined in `docker-compose.yml`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `docker compose up -d`: start the local MongoDB service used by the app.
- `npm run dev`: run the Next.js development server.
- `npm run build`: create a production build and catch type/build errors.
- `npm run start`: serve the production build after `npm run build`.
- `npm run lint`: run Next.js linting if the local Next lint setup is available.

Create `.env.local` with `MONGODB_URI=mongodb://admin:admin123@localhost:27017/champions?authSource=admin` for local development.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing style: 2-space indentation, single quotes, semicolons, named imports, and concise App Router files such as `page.tsx`, `layout.tsx`, and `route.ts`. Prefer Material UI components and `sx` props for UI styling. Keep shared utilities in `src/lib` and domain-specific code in `src/features`. Code, variables, and file names should be in English; user-facing labels and messages should be in PT-BR.

## Testing Guidelines

No test framework is configured yet. Before merging behavior changes, at minimum run `npm run build` and manually exercise the relevant page or API route. When adding tests, prefer colocated `*.test.ts` or `*.test.tsx` files near the implementation, and document any new test command in `package.json` and this guide.

## Commit & Pull Request Guidelines

Git history was not available from this checkout, so no repository-specific commit convention could be inferred. Use short, imperative commit messages such as `Add registration validation` or `Update MongoDB model notes`. Pull requests should include a brief summary, testing performed, linked issue or OpenSpec feature when applicable, and screenshots for visible UI changes.

## Agent-Specific Instructions

Read `openspec/context.md` and the relevant `openspec/features/*.md` file before changing product behavior. Keep generated changes scoped, avoid unrelated refactors, and update OpenSpec documents when implementation choices alter requirements or data models.
