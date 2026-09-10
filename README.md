# ZAVALI20 — Cloudflare Workers Direct Deploy

This repository is prepared for direct deployment from GitHub to Cloudflare Workers.

## Cloudflare Dashboard
- Connect this GitHub repository.
- Production branch: `main`.
- Build command: `npx wrangler deploy`.
- Deploy command: leave empty if the dashboard uses the build command as deployment, or use `npx wrangler deploy` where required by the UI.
- Root directory: `/`.

## Required before first deploy
Edit `wrangler.jsonc` and replace `REPLACE_WITH_KV_NAMESPACE_ID` with your real Cloudflare KV namespace ID.

The Worker entrypoint is `worker.js`.

## GitHub Actions (optional)
Add these repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

A push to `main` will then deploy automatically.
