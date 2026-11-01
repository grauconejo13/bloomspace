# Decision log

## 2026-11-01: Preserve current app architecture
Keep the separate `client/` and `server/` directories; do not replatform during repository standardization.

## 2026-11-01: Share a consistent taxonomy
Use `.project/manifest.json` to describe purpose, capabilities, status and approved tags. The source code remains authoritative for implementation claims.

## 2026-11-01: CI should use existing scripts
Run frontend lint/build and the two existing client regression scripts. Do not introduce a new testing framework merely to satisfy a checklist.

## Open decision: Planting limit
`README.md` describes three blooms per 24 hours per browser, whereas `MEMORY.md` describes three successful blooms per browser session. Confirm which rule code enforces, update documents and tests accordingly.
