# SyntaxHQ — Go-Live Runbook

> **Status: LIVE** ✅ — https://mixfai-hub.vercel.app (go-live completed 2026-07-25)
> Verified: branded sign-in, Armory, employee Review (Run Judge + Preview via Kimi), Approve, Submit, Collections, Editor's Choice, Studio.

Code-side go-live is **done**: pushed to `Mixfai/mixfai-hub` (Vercel auto-redeploys) and `sanity schema deploy` completed. Remaining steps are runtime configuration.

## Production config notes (learned during go-live)
- **Moonshot base URL is `https://api.moonshot.cn/v1`** (NOT `.ai`) — the API key is on the China platform. `MOONSHOT_MODEL=kimi-k3` (confirmed valid + 200). Wrong host → `401 Invalid Authentication`.
- **`kimi-k3` is a reasoning model**: it (a) **only allows `temperature=1`** (any other value → `400 invalid temperature: only 1 is allowed`), (b) returns final output in `content` but reasoning in `reasoning_content` (read both / fall back), and (c) wraps JSON in ```` ```json ```` fences (strip before `JSON.parse`). Give it a generous `max_tokens` (≥1500) so the reasoning doesn't consume the whole budget.
- **Paste every Vercel env value as a single clean line** (no trailing newline/space/quotes) — a stray `\n` in `MOONSHOT_BASE_URL` or a Sanity token silently breaks calls. Code sanitizes defensively.
- **Sanity/Vercel tokens must be pasted as a single clean line** — no trailing newline/space/quotes, else every Sanity call throws `Invalid character in header content ["authorization"]` → 500. Code sanitizes this defensively (`src/lib/sanity.ts`).
- **Employee = member of Clerk org slug `mixfai`**; user must switch/activate that org (or set it as default) for `auth().orgSlug` to populate.

## 1. Vercel → mixfai-hub → Settings → Environment Variables
Add/update, then **Redeploy**:
| Key | Value | Notes |
| --- | --- | --- |
| `SANITY_WRITE_TOKEN` | `<Editor token>` | sanity.io/manage → project `ese0i6jm` → API → Tokens → **Editor** |
| `MOONSHOT_API_KEY` | `sk-...` | Kimi judge + preview (China-platform key) |
| `MOONSHOT_BASE_URL` | `https://api.moonshot.cn/v1` | **`.cn` not `.ai`** |
| `MOONSHOT_MODEL` | `kimi-k3` | confirmed valid |
| `MIXFAI_ORG_SLUG` | `mixfai` | employee gating |
| `JUDGE_AUTO_APPROVE_THRESHOLD` | `80` | optional |
| (already set) | `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_READ_TOKEN` | |

## 2. Clerk dashboard → Paths
- Sign-in URL = `/sign-in`
- Sign-up URL = `/sign-up`

## 3. Clerk dashboard → Organizations
- Create org with **slug `mixfai`**; add employee users (gates judge/review/studio).

## 4. Local `.env`
- Paste the same `SANITY_WRITE_TOKEN` so `npm run dev` matches prod.

## 5. Verify live
- Visit URL → branded `/sign-in` (not Clerk hosted page).
- Sign in → Armory loads; employees see **Review** + **Studio**.
- Employee: `/review` → Run Judge → Preview → Approve → appears in Armory.
- Submit via **+ Submit**; star into **My Collection**.

## Feature map
- Discover/inspect/use/judge/curate: `/`, `/prompts/[id]`, Fill-variables, StarRating, `/review`
- Contribute: `/submit` (+ `POST /api/prompts/submit`)
- Collections: `/my` (+ `POST /api/collect`)
- Editor's Choice: `/editors-choice` (flag set in review console)
- Output preview: `POST /api/run` (employee)
- Internal builder: `/studio` (+ `POST /api/playbooks/save`)
- Auto-collect: `POST /api/candidates/import` (employee, GitHub → Kimi judge → auto-approve/queue)
