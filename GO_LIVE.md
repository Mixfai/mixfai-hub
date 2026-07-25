# SyntaxHQ — Go-Live Runbook

Code-side go-live is **done**: pushed to `Mixfai/mixfai-hub` (Vercel auto-redeploys) and `sanity schema deploy` completed. Remaining steps are runtime configuration.

## 1. Vercel → mixfai-hub → Settings → Environment Variables
Add/update, then **Redeploy**:
| Key | Value | Notes |
| --- | --- | --- |
| `SANITY_WRITE_TOKEN` | `<Editor token>` | sanity.io/manage → project `ese0i6jm` → API → Tokens → **Editor** |
| `MOONSHOT_API_KEY` | `sk-...` | Kimi judge + preview |
| `MOONSHOT_BASE_URL` | `https://api.moonshot.ai/v1` | |
| `MOONSHOT_MODEL` | `moonshot-v1-8k` | |
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
