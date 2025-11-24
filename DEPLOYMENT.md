# Deployment Guide

This project can be hosted with the API on Render and the static frontend on GitHub Pages.

## Backend-only bundle helper
Run `npm run bundle:backend` (or execute `./scripts/make-backend-zip.sh`) to produce `backend-only.zip` that contains only the API code and shared schema files. The script skips frontend assets, `node_modules`, and build artifacts so you can upload the archive directly to Render or another backend-only host.

## Backend (Render)
1. Create a **Web Service** in Render pointing at this repo.
2. Set build and start commands:
   - **Build**: `npm install && npm run build`
   - **Start**: `npm run start`
3. Add the following environment variables:
   - `SESSION_SECRET` (required in production)
   - `CORS_ORIGINS` – comma-separated list of allowed frontend origins (for example, `https://<username>.github.io,https://buy.secondhandcell.com`).
   - Any existing app secrets (e.g., `STRIPE_SECRET_KEY`) you already use.
4. The server trusts the Render proxy and sets cookies with `SameSite=None; Secure` in production so sessions work cross-site.

## Frontend (GitHub Pages)
1. Create a Pages deployment (GitHub Actions or manual) that publishes `dist/public/`.
2. Before building, set `VITE_API_BASE_URL` to your Render app URL (e.g., `https://secondhandcell.onrender.com`).
3. Build the site with `npm run build` and deploy the contents of `dist/public`.
4. A `CNAME` file is included under `client/public` so the Pages deployment keeps the custom domain `buy.secondhandcell.com`.

With these settings the GitHub Pages frontend will call the Render API using the configured base URL and share session cookies across the two domains.
