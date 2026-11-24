# Testing

## Existing client checks
From the repository root:

```sh
cd client
npm ci
npm run lint
npm run build
npm run test:duplicate-submit
npm run test:wakeup-banner
```

The regression scripts are Playwright scripts that drive the app at `BASE_URL` (default `http://localhost:5173`) and **mock `/api/*`**, so they need a running client (`npm run dev` or `npx vite preview --port 5173`) and Chromium (`npx playwright install chromium`), but no backend or Supabase. CI does exactly this.

CI also installs `server/` dependencies and checks syntax of `server/server.js`. This is a syntax check, **not** backend integration testing.

## Manual smoke tests
1. Draw, erase, undo and redo.
2. Plant a bloom, confirm the result and inspect the garden.
3. Attempt repeated confirmation clicks; ensure no duplicate records.
4. Share or download a PNG card.
5. Water a bloom and check expiry behavior.
6. Simulate backend unavailability and inspect fallback/retry messaging.
7. Verify telemetry excludes bloom text and author data.
8. Plant 3 blooms, confirm the 4th is blocked with the 24-hour message, and confirm it survives a refresh.
9. Check keyboard access and mobile layouts.

CI (lint, build, both regression scripts, server syntax) passed on 2026-11-23. No production test is claimed by this document.
