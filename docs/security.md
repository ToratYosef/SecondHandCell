# Security posture

- All sensitive API endpoints verify Firebase ID tokens and enforce role-based authorization.
- Admin token headers protect wholesale import and fulfillment endpoints.
- Firestore Security Rules (see `firestore/firestore.rules`) restrict reads/writes by ownership and role.
- Secrets are never hard-coded; use `.env.local` or deployment environment variables. Validate via `pnpm check:env`.
- Stripe and ShipEngine webhooks validate signatures with configured secrets.
- Background job failures emit admin notifications via the console adapter (replace with real push provider in production).
- Run `pnpm security:audit` to scan the repository for high-entropy strings and potential leaks.
