# Handoff — Food Call for Startups

This is a **prototype** for the Global Call for Startups application form. It was generated from an HTML/CSS/JS design handoff (see `project/`) and partially converted into a Next.js app. The goal of this document is to give the engineering team everything needed to take it from prototype to production.

## Current state — at a glance

| Area | State |
|---|---|
| Visual design / UI | Complete, matches design intent |
| Multi-step form (6 steps) | Working, persists to `localStorage` |
| Inline validation | Working |
| Pre-submission heuristic review | Working (runs in-browser, see `lib/review.ts`) |
| AI-driven review (Anthropic) | Skeleton only — empty `app/api/review/` |
| Form submission | **Not wired up** — empty `app/api/submit/` |
| Deck file upload (client-side) | Working (size limit, drag/drop, preview) |
| Persistence to AWS / DB | **Not implemented** |
| Email notifications | **Not implemented** |
| Vercel deploy | Working as a visual preview |

## What needs to be built for production

### 1. `app/api/submit/route.ts` — primary work item
Currently empty. The client (`components/ApplicationForm.tsx`, `handleConfirmSubmit`) POSTs a `multipart/form-data` request to `/api/submit` containing:
- `application` — JSON-stringified `FormState` minus the file (see `lib/types.ts`) plus a `reviewScore` field
- `deck` — the actual file (PDF / PPTX / KEY)

The route should:
1. Validate inputs (size limits in `config.json` → `maxDeckSizeMb`, currently 25).
2. Upload deck to **S3** (or equivalent). Record the object key.
3. Persist the application record to a datastore (DynamoDB, RDS, etc.) — schema follows `FormState` in `lib/types.ts`. Generate a reference ID.
4. Optionally: send a confirmation email to the applicant + a notification email to `submissionsEmail` from `config.json`.
5. Return `{ ref: string }`. The client uses this for the success screen.

The current `package.json` includes `resend` as a dependency from the prototype scaffold — remove it (and the `RESEND_API_KEY` reference in `.env.local.example`) once the AWS submission path is in place.

### 2. `app/api/review/route.ts` — optional, deferred
Only needed if `config.json` → `reviewMode` is set to `"api"`. Currently `"heuristic"`, so the in-browser scoring in `lib/review.ts` runs instead. If/when AI review is wanted, this route should accept `{ form: FormState, strictness: ReviewStrictness }`, call Anthropic's API using `@anthropic-ai/sdk` (already in deps), and return a `ReviewResult` (shape in `lib/types.ts`). The `anthropicModel` field in `config.json` controls which model is used.

### 3. `app/api/config/route.ts`
Empty folder — but nothing currently calls this endpoint. The page reads config server-side via `lib/config.ts` directly. Safe to delete the empty folder unless there's a future use case.

### 4. Deck upload size handling
The client sends the deck as part of a multipart POST. **Vercel's serverless function bodies are capped at 4.5 MB by default** — if you keep the 25 MB deck limit, you'll need a presigned-URL upload flow (client → S3 directly → API records the key) or move to Vercel's Edge runtime / a separate API host. This is a real architectural decision; flag it early.

### 5. Auth / abuse prevention
There is currently no auth, no rate limiting, no CAPTCHA. The form is open to the world. Decide whether to add Cloudflare Turnstile / hCaptcha + per-IP rate limiting at the API layer.

## Architecture

- **Framework:** Next.js 15.5 (App Router), React 19, TypeScript.
- **Styling:** Plain CSS in `app/globals.css` (CSS variables for theming). No Tailwind, no CSS-in-JS.
- **State:** Local React state + `localStorage` persistence for in-progress applications. No backend session.
- **Config:** `config.json` at the project root, read at request time by `lib/config.ts`. The `getClientConfig()` exposes a safe subset to the browser.
- **Server reads of `config.json`:** uses `fs.readFileSync(path.join(process.cwd(), "config.json"))`. Watch for Vercel file-tracing: if a future deployment fails to find `config.json` in the serverless bundle, switch to `import config from "@/config.json"` (loses hot-reload of config but is bundling-safe).
- **Standalone output:** `next.config.ts` has `output: "standalone"` for the Docker setup. Vercel ignores this; it's only used by `Dockerfile` / `docker-compose.yml`. Either keep or drop the Docker setup based on team preference — Vercel handles deploy without it.

## File map

```
app/
  page.tsx                    Landing page (server component)
  layout.tsx                  Root layout
  globals.css                 All app styles (CSS variables, no preprocessor)
  api/
    submit/                   ← EMPTY, needs route.ts
    review/                   ← EMPTY, optional route.ts
    config/                   ← EMPTY, can delete

components/
  ApplicationForm.tsx         Main client component — orchestrates steps, validation, review, submit
  Topbar.tsx, Hero.tsx,
  Criteria.tsx,
  ApplyDivider.tsx            Marketing/landing sections
  Stepper.tsx                 Step progress UI
  ReviewModal.tsx             Pre-submission review modal
  form/
    Field.tsx                 Wrapper: label, help text, error, counter
    TextField.tsx
    TextArea.tsx
    SelectField.tsx
    FileUpload.tsx
    steps/
      StepContact.tsx
      StepCompany.tsx
      StepStage.tsx
      StepSolution.tsx
      StepFramework.tsx
      StepDeck.tsx

lib/
  config.ts                   Reads config.json
  content.ts                  All UI copy + dropdown options + demo data
  review.ts                   Heuristic scoring + word counts + basic checks
  types.ts                    All shared types (FormState, ReviewResult, etc.)

config.json                   Runtime config (review mode, strictness, email targets)
project/                      Original HTML/JS design prototype — kept for reference, not used at runtime

Dockerfile, docker-compose.yml, .dockerignore   Optional Docker setup (unused on Vercel)
```

## Configuration switches (`config.json`)

| Field | Purpose |
|---|---|
| `reviewMode` | `"heuristic"` (browser) or `"api"` (server, requires `/api/review` route + `ANTHROPIC_API_KEY`) |
| `reviewStrictness` | `"lenient" \| "standard" \| "strict"` — affects basic checks and pass thresholds |
| `anthropicModel` | Model name passed to the SDK when in API review mode |
| `maxDeckSizeMb` | Client-side enforced deck size limit |
| `submissionsEmail` | Comma-separated list — where notifications should go (used by future submit route) |
| `emailFrom` | Sender address (used by future submit route) |

## Environment variables

`.env.local.example` lists what the prototype expected. **Currently nothing is required for the app to render and let users complete the form** (heuristic review runs locally; submit is stubbed). Add real values as you implement:

- `ANTHROPIC_API_KEY` — only when `reviewMode: "api"` is enabled.
- AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, etc.) — when submit route is built.
- Replace `RESEND_API_KEY` with whatever email provider you choose (or use SES if going AWS-native).

## Local dev

```
npm install
npm run dev
```

Visit http://localhost:3000. Use the **"Fill demo data"** button at the top of the form to skip data entry while testing UI.

## Deploy

Currently deployed to Vercel via `git push origin main` → auto-deploy. No env vars set yet (none are needed for the current preview).

When adding the submit route + AWS, add the corresponding env vars in **Vercel project → Settings → Environment Variables** before deploying.

## Known stubs / TODOs (quick scan)

- Empty API route folders (above).
- `Dockerfile` / `docker-compose.yml` — present from prototype scaffold; team to decide whether to maintain in parallel with Vercel.
- No tests. Worth adding at minimum: validation (`lib/review.ts → basicChecks`), word counting, and the submit route once it exists.
- No analytics / observability.
- The form persists to `localStorage` per browser — fine for individual applicants but means in-browser test data leaks across QA sessions on the same machine. Add a "Reset" affordance prominently if this becomes a UX issue.

## Design source

`project/` contains the original HTML/CSS/JS prototype from the design tool. **Not used at runtime** — kept as a reference for visual fidelity. If the design needs to change, update the React components directly; the prototype files are frozen.
