# Navigalex

Navigalex is a React and Express advisory site for Indian businesses. Visitors can browse scoped finance, contract and controls reviews, use guided assessment tools, and send an inquiry. The app does not take payment online; engagements are scoped and quoted before work starts.

## Local setup

**Requirements:** Node.js 22 and npm.

1. Install the locked dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and add the values needed for local use.
3. Start the app with `npm run dev`.
4. Open the local URL shown in the terminal.

At least one AI provider key is required for AI-assisted features. The inquiry form also requires `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `INQUIRY_TO_EMAIL`; without all three, submissions return an error instead of appearing successful. Configure a strong `ADMIN_PASSWORD` before using the admin area.

## Production deployment

The included Railway configuration runs `npm run build` and then `npm start`. Set environment variables in the hosting provider's secret store; do not commit real keys or passwords.

Required launch settings:

- At least one supported AI provider, such as `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, or Vertex AI configuration.
- `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `INQUIRY_TO_EMAIL` so the team receives contact requests.
- A unique `ADMIN_PASSWORD`; set `ADMIN_USERNAME` and `ADMIN_EMAIL` as desired.
- `NAVIGALEX_DATA_DIR` pointing to a durable mounted volume.

The JSON store supports one running server process on durable storage. Do not add replicas until the app is moved to a shared database and rate limiting is shared across instances. Check `/api/health` after deployment to confirm that required integrations are configured.

## Business launch checklist

The nine distinct starter reviews display scope, inputs, timing and boundaries, while the fee is confirmed after a scoping call. Before paid campaigns, confirm delivery capacity and actual prices, verify the sender and reply workflow, and publish only approved credentials or client evidence. Add an online payment or booking provider only after its account, pricing and refund terms are configured.
