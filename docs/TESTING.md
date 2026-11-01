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

CI also installs `server/` dependencies and checks syntax of `server/server.js`. This is a syntax check, **not** backend integration testing. If regression scripts require Playwright browsers or live services, their CI setup may need additional configuration; see the workflow.

## Manual smoke tests
1. Draw, erase, undo and redo.
2. Plant a bloom, confirm the result and inspect the garden.
3. Attempt repeated confirmation clicks; ensure no duplicate records.
4. Share or download a PNG card.
5. Water a bloom and check expiry behavior.
6. Simulate backend unavailability and inspect fallback/retry messaging.
7. Verify telemetry excludes bloom text and author data.
8. Confirm actual planting-limit semantics against documentation.
9. Check keyboard access and mobile layouts.

No successful CI run or production test is claimed by this document.
