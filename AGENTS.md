# Bloomspace: agent instructions

Shared by Claude Code, Codex and other agents (`CLAUDE.md` points here). Product context and history are in `MEMORY.md`. Architecture, decisions, roadmap and testing are in `docs/`.

## What this is

A **public** community wellness garden: visitors draw a flower, attach a kind message, plant it in a shared garden, water other blooms (which refreshes them to 3 days), and share a PNG card. Public beta, portfolio project, not monetized.

```text
client/   React 19 + Vite + Tailwind 4 + React Router  →  Vercel
server/   Node + Express 5 + @supabase/supabase-js      →  Render
          Supabase holds flowers + analytics_events
```

## Commands

```bash
# client
cd client && npm ci
npm run dev                  # http://localhost:5173
npm run lint
npm run build
# regression scripts (Playwright; they mock /api/* so no backend is needed)
npx vite preview --port 5173 &      # or npm run dev
npm run test:duplicate-submit
npm run test:wakeup-banner

# server
cd server && npm ci
node --check server.js       # CI's only server check (no backend tests yet)
npm run dev                  # needs server/.env (see .env.example)
```

**Definition of done:** client lint, build and both regression scripts pass, plus `node --check server.js`. That's exactly what `.github/workflows/ci.yml` runs. `npm ci` must succeed, so commit `package-lock.json` whenever dependencies change.

## Behavior that must not regress

- **Planting limit:** 3 successful plants per **rolling 24 hours per browser**, tracked as timestamps in `localStorage` (`bloomspacePlantTimestamps`, `client/src/utils/plantLimit.js`). Only successful plants count. It's a client-side courtesy limit, not abuse protection; server rate limiting is separate.
- **Duplicate-submit guard:** `isSubmittingRef` plus disabled buttons in `CreateFlower.jsx`, and one `clientPlantId` per attempt with server-side idempotency. `test:duplicate-submit` covers this.
- **Wake-up UX:** the banner appears only after 5s and always clears on success, failure or timeout. `test:wakeup-banner` covers this.
- **Lifespan:** blooms last 3 days. Watering resets to 3 days from now and never stacks. Expired blooms are hidden.
- **Fallback:** if the API is unreachable, the garden shows `localStorage` flowers (`bloomspaceFlowers`) with a retry notice, never a blank page.

## Privacy and content rules

- **Analytics never include** flower messages, drawings, names, emails or author/location text. The server strips blocked metadata keys as defense in depth (`ANALYTICS_METADATA_BLOCKLIST` in `server/middleware/validation.js`), so keep it. It's a top-level-key blocklist; prefer tightening it to an allowlist over loosening it. Analytics must never block or break the app.
- User-submitted text is community content: render it as text (no `dangerouslySetInnerHTML`), keep `server/utils/filterWords.js` and the validation middleware, and keep rate limiting.
- **This repo is public.** Never commit secrets, Supabase keys or project refs, and never mention private repositories or private implementation details in code, docs or commits.
- The Supabase service key stays server-side only. The client must never get it or any `VITE_*` secret.

## Working style

- Branch plus PR. Never push to `main` or deploy. The deploy order (Supabase SQL → Render → Vercel) is the owner's call.
- Keep the calm, gentle tone: no ads, no dark patterns, nothing aggressively gamified.
- Make claims only from verified behavior (the code, or tests you ran). Update `README.md`, `MEMORY.md`, `docs/` and `.project/` when behavior changes, and `CHANGELOG.md` for user-visible changes.
- Cross-review: Claude ↔ Codex review each other's PRs. The reviewer comments only, there's one round, CI is the referee, and the owner merges.

## Handoff report (end every task with this; it matches `.github/pull_request_template.md`)

- **Summary:** what changed and why
- **Verification:** the checks you actually ran and their results
- **Not verified:** for example the live Supabase, Render or Vercel, real devices
- **Privacy:** does it touch analytics, community content or secrets?
- **Needs owner approval:** deploys, SQL, anything public-facing
