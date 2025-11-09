# SecondHandCell Next.js Platform

SecondHandCell is a production-minded starter for device buyback, wholesale catalog, and admin operations built on Next.js 14 and Firestore. It demonstrates secure serverless APIs, background automations, and integration adapters for shipping, payments, email, and support tooling.

## Features
- Marketing landing with live chat placeholder and shared components
- Quote builder and sequential order creation with Firestore mirroring
- Admin dashboard with protected routes, audit logging, and label generation stubs
- Wholesale storefront with Stripe checkout scaffolding and admin-import endpoints
- Firestore security rules, emulator seed script, and GitHub Actions CI workflow
- Mermaid flowcharts with JSON representations for critical flows

## Getting started
```bash
pnpm install
pnpm check:env # ensure required env vars are present
pnpm dev        # launches Next.js (expects Firestore emulator by default)
```

### Environment variables
See [`env.example`](./env.example) for the full list. Core values:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_ADMIN_CREDENTIALS` (JSON string for production; omit when using emulator)
- `SHIPENGINE_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`
- `WHOLESALE_ADMIN_TOKEN`

Run `pnpm check:env` locally to ensure everything is configured.

### Firestore emulator & seed data
```bash
pnpm emulators # starts firestore/auth emulators
pnpm dev:seed  # populates sample admins, orders, wholesale items
```

The seed script writes documents under `orders`, `users`, `admins`, `wholesaleInventory`, and `adminAuditLogs` collections.

### Testing
- `pnpm test:unit` runs Vitest unit suites
- `pnpm test:integration` spins up the Firestore emulator and exercises order submission + label generation
- `pnpm test:e2e` covers end-to-end happy path using the emulator

### Deployment
- The repo ships with `.github/workflows/ci.yml` for lint, test, build, and deploy placeholders.
- Default deployment target is Vercel; export environment variables in the Vercel dashboard.
- For Firebase Hosting + Cloud Functions, adapt the GitHub Action to run `firebase deploy` after build.

### Runbook & Security
- Operational procedures live in [`docs/runbook.md`](./docs/runbook.md).
- Security posture and outstanding hardening tasks are tracked in [`docs/security.md`](./docs/security.md).
- Flow diagrams are available in [`flows/`](./flows).

### ASCII flow summary
```
Customer -> Sell page -> POST /api/submit-order -> Firestore -> Emails/Admin notifications
Admin -> Dashboard -> GET /api/orders -> Manage status -> Generate labels -> Audit logs
Wholesale buyer -> /buy -> Checkout -> Stripe intent -> Firestore wholesaleOrders
```

## TODO
- Swap mock adapters with live implementations for ShipEngine, FCM, and Zendesk.
- Add real-time Firestore listeners for chat and admin dashboards.
- Expand integration tests to cover wholesale checkout and webhook reconciliation.
- Implement rate limiting on sensitive endpoints.
