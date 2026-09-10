ZAVALI - Cloudflare Workers Builds

This package is prepared for the Cloudflare Workers & Pages Git deployment screen.

Cloudflare dashboard settings:

Build command:
npm run build

Deploy command:
npx wrangler deploy

Root directory:
/

Build output directory:
Leave empty / not applicable for Workers.

Important:
- Upload/extract these files into the ROOT of the GitHub repository.
- Do NOT upload only the ZIP file to GitHub.
- The Worker name in wrangler.jsonc is "mostafa23", matching the Worker shown in the dashboard screenshot.
- No npm build artifact is required; the build command only syntax-checks worker.js.
- The Worker/config structure has not been changed by the dashboard styling changes.
