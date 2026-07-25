# SyntaxHQ — Sanity Backend Setup (separate project)

The frontend currently runs on **bundled mock data** (`src/lib/data.ts`) so it
renders with zero config. Follow these steps to connect a **new, separate**
Sanity project and serve live prompts + SOP playbooks.

## 1. Create the Sanity project
1. Go to <https://www.sanity.io/manage> → **Create project**.
2. Name it (e.g. `syntaxhq`) and create a **production** dataset.
3. Set the dataset to **Private** (Project → API → Datasets) so prompt content
   is never publicly readable.
4. Create a token: Project → **API → Tokens → Add API token**
   - **Viewer** is enough for read-only. Copy the token.

## 2. Add keys to `.env`
Copy `.env.example` → `.env` and fill in:
```
SANITY_PROJECT_ID=<your project id>
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=<your server-only token>
```
> All four are **non-PUBLIC**, so they are only used in server-side code
> (Astro frontmatter) and never bundled into client JS.

## 3. Stand up the Studio (schemas are ready)
The schema definitions live in `src/sanity/schemas/`:
- `prompt.ts` — the Prompt Armory documents
- `sopPlaybook.ts` — the SOP sidebar documents
- `index.ts` — the `schemaTypes` registry

Create a fresh Studio (`npm create sanity@latest` in a new folder), select the
**same project** from step 1, then copy these three files into that Studio's
`schemaTypes/` directory and export them from its `schemaTypes/index.ts`.
Deploy the Studio (`sanity deploy`) or run it locally (`sanity dev`).

> Note: `sanity` is intentionally **not** a dependency of this Astro app — the
> schema files are excluded from the app `tsconfig.json`. They compile inside
> the Studio project, not here.

## 4. Add content & verify
1. In the Studio, create a few **Prompt** docs (set Status → `published`) and
   some **SOP Playbook** docs.
2. Restart `npm run dev` in `mixfai-hub/`.
3. The home page now fetches live via `getPrompts()` / `getSopPlaybooks()`
   (`src/lib/data.ts`). If Sanity is unreachable it silently falls back to mock
   data and logs a server-side warning.

## Files
| Path | Purpose |
| --- | --- |
| `src/lib/sanity.ts` | Authenticated server client (`@sanity/client`), `isSanityConfigured` flag |
| `src/lib/queries.ts` | GROQ queries for prompts + playbooks |
| `src/lib/data.ts` | `getPrompts()` / `getSopPlaybooks()` with mock fallback |
| `src/types.ts` | Shared `Prompt` / `SopPlaybook` types |
| `src/sanity/schemas/*` | Studio schema definitions (copy into your Studio) |
