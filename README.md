# SecondHandCell Platform Skeleton

This repository combines the legacy Express server with a new production-ready Next.js (App Router) front-end. Firebase
is used across client and server components for authentication, Firestore, Storage, and role based access control.

## Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with Firestore and Storage enabled
- Stripe, ShipEngine or ShipStation, PayPal, and SendGrid accounts for integration keys

## Getting started

1. Copy `.env.example` to `.env` and fill in the required environment variables.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run database/schema checks for the existing Express API if needed:

   ```bash
   npm run check
   ```

4. Launch the Next.js app:

   ```bash
   npm run web:dev
   ```

   The App Router project lives under `apps/web/` and shares the Firebase project with the Express API.

5. (Optional) Start the legacy Express server:

   ```bash
   npm run dev
   ```

## Firebase configuration

- Update `firestore.rules` and `storage.rules` in this repo, then deploy with:

  ```bash
  firebase deploy --only firestore:rules,storage:rules
  ```

- The Firebase Admin SDK expects `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (with `\n`
  escapes) to be defined in your environment. `ADMIN_ALLOWED_EMAILS` enables an allowlist for admin-only pages.

## Scripts

- `node scripts/migrate_import_html.js <old_site_folder>`: migrate historical static HTML device pages. The script walks
  the provided directory, uploads referenced images to Cloud Storage, and creates/updates Firestore device documents.
- `tsx scripts/seed_sample_documents.ts`: seed sample devices, merchants, pricing snapshots, and an example order.

## Testing

- Run unit tests with Jest:

  ```bash
  npm test
  ```

- Run Playwright end-to-end stubs (requires the Next.js dev server running locally):

  ```bash
  npm run test:e2e
  ```

## Deployment

### Firebase Hosting or Cloud Run

1. Build the Next.js project:

   ```bash
   npm run web:build
   ```

2. Deploy via Firebase Hosting or containerise for Cloud Run. For Firebase Hosting, configure `firebase.json` to point to
   `.next` output in `apps/web/.next`.

3. Deploy Firestore and Storage rules:

   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

### Vercel

1. Import the repo into Vercel and set the environment variables from `.env.example`.
2. Set the project root to `apps/web` and the build command to `npm run web:build` with output directory `.next`.
3. Configure a webhook user for admin actions and update `ADMIN_ALLOWED_EMAILS`.

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies, runs unit tests, and builds the Next.js app.
Add deployment steps as needed.

## Additional notes

- The existing Express server in `server/` continues to work and can reuse the shared Firestore schema defined in
  `shared/schema.ts`.
- Extend `apps/web/app/admin/*` with real client-side interactivity using the provided API routes.
- Webhook handlers for Stripe and ShipEngine/ShipStation validate signatures and store processed event IDs to avoid
  duplicates. Update the placeholder logic with production-grade error handling once credentials are ready.
