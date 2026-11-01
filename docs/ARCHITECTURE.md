# Architecture

Bloomspace is a community flower-drawing and sharing application, rebuilt from a nwHacks 2025 concept.

## Main components
- `client/`: React, Vite, React Router, Tailwind UI; canvas, garden, sharing, client-side resilience.
- `server/`: Node.js/Express API, routes, controllers, middleware and data access.
- Supabase: shared flower records and privacy-filtered analytics, according to the repository documentation.
- Browser storage: local fallbacks and session-related state.
- Deployment documented as Vercel (client), Render (API), and Supabase (data).

## Main workflow
Draw and customize a flower, write a message, confirm planting, submit through the API, then view, water, or share the result. A share card can be generated and downloaded. The garden has a fallback during backend outages.

## Important boundaries
- A wellness-themed creative community, not a clinical or therapeutic service.
- Analytics must not include messages, drawings, personal names, email addresses, or author/location text.
- The browser/session planting-limit descriptions in `README.md` and `MEMORY.md` differ; confirm runtime behavior before asserting a specific limit.
- Client-side duplicate-submit protection and backend in-memory idempotency are not the same as database-enforced uniqueness.

See `../MEMORY.md` for earlier implementation notes, which may lag behind code changes.
