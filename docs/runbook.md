# SecondHandCell Operations Runbook

## Rotating ShipEngine credentials
1. Generate a new ShipEngine API key in the ShipEngine dashboard.
2. Update the secret in the deployment environment (`SHIPENGINE_API_KEY`).
3. Trigger the GitHub Actions `Deploy` workflow or redeploy via Vercel.
4. Confirm new labels generate successfully from `/admin/print-label`.

## Rotating Stripe keys
1. Create a new restricted key in Stripe.
2. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in the secrets manager.
3. Re-run `pnpm check:env` locally to ensure the configuration passes.
4. Trigger a test checkout from `/buy/checkout.html` using the emulator.

## Voiding labels
1. Navigate to `/admin/print-label`.
2. Use the `Void` button in the admin tools (or call `POST /api/orders/:id/void-label`).
3. Confirm the audit log entry appears in Firestore under `adminAuditLogs`.

## Handling returned kits
1. Update the order status via `POST /api/orders/:id/status` with `returned`.
2. Generate a new outbound label if required with `POST /api/generate-label/:id`.
3. Notify the customer using `/api/orders/:id/send-review-request`.

## Tracking sync failures
1. Review Cloud Function logs for `autoRefreshInboundTracking`.
2. Re-run the job manually: `pnpm tsx scripts/run-job.ts autoRefreshInboundTracking`.
3. If ShipEngine is degraded, switch the feature flag `SHIPENGINE_DISABLED=true` and retry once service resumes.
