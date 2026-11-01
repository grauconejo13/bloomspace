# Roadmap

## Documented existing functionality
- React drawing canvas and bloom-sharing experience
- Garden browsing and watering interaction
- Express API, Supabase persistence, and local fallback
- Privacy-oriented usage events
- Duplicate-submit safeguards
- Client regression scripts for duplicate submission and delayed backend wake-up

## First verification milestone
- [ ] Resolve the conflicting planting-limit descriptions (per 24 hours vs per browser session).
- [ ] Run and confirm existing regression checks locally and in CI.
- [ ] Verify backend error handling, rate-limiting and Supabase configuration without exposing secrets.
- [ ] Audit canvas, dialog and form keyboard accessibility.
- [ ] Validate deployment paths and production smoke tests.

## Future, not claimed complete
- [ ] Consider database-enforced uniqueness on `clientPlantId` if needed.
- [ ] Assess long-term moderation, abuse prevention and content retention policies.
- [ ] Reassess optional support/donation features only with an explicit product decision.

Avoid feature expansion until documented behavior and tested behavior agree.
