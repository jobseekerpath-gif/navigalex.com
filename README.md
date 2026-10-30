# Navigalex

Navigalex is a React and Express advisory website for Indian businesses. It includes scoped finance, contract, risk and controls reviews; guided business assessments; a visitor/admin workspace; and MSME delayed-payment screening tools.

## Local setup

**Requirements:** Node.js 22 and npm.

1. Install locked dependencies with \`npm ci\`.
2. Copy \`.env.example\` to \`.env\` and fill only the services you intend to test.
3. Start the app with \`npm run dev\`.
4. Open the local URL shown in the terminal.

At least one AI provider key is required for AI-assisted features. Inquiry delivery requires \`RESEND_API_KEY\`, a verified \`RESEND_FROM_EMAIL\`, and \`INQUIRY_TO_EMAIL\`. Configure a strong \`ADMIN_PASSWORD\` before using the admin area.

## MSME payment screening

The \`/43b-h-check\` route provides:
- Browser-side CSV screening and a free CSV export. Invoice ledger rows are not uploaded or stored by the API.
- A paid, server-generated PDF report after verified Cashfree payment: ₹499 for one report or ₹3,000 for one year of report access. Annual access is a one-time payment for a 12-month period; it is not an automatic recurring subscription.
- A supplier-side delayed-payment interest estimate and a user-authored follow-up letter.

The interest rate is read from \`MSMED_BANK_RATE\` (default 6% p.a. as a placeholder). This is not a live RBI rate feed. Confirm the applicable bank rate, supplier's micro/small status and activity eligibility, acceptance date, agreement and tax treatment with a qualified professional. The checker is a screening tool, not tax or legal advice.

### Cashfree configuration

Start in Cashfree sandbox mode:

- \`CASHFREE_APP_ID\`: sandbox app ID.
- \`CASHFREE_SECRET_KEY\`: sandbox secret key.
- \`CASHFREE_ENV=sandbox\`.

The app creates payment links server-side using the fixed prices above. The frontend never receives Cashfree credentials. Access is not enabled by the return-page redirect; it is enabled only after the server validates the Cashfree webhook signature and checks the successful INR amount.

Configure the Cashfree Payment Links webhook to call:

\`\`\`
https://YOUR_DOMAIN/api/msme/cashfree/webhook
\`\`\`

Select the Payment Link event (\`PAYMENT_LINK_EVENT\`) in the Cashfree dashboard. Keep the configured webhook signing secret in \`CASHFREE_SECRET_KEY\` and do not expose it in client code or commit it to Git. Test the full payment and webhook flow in sandbox before switching \`CASHFREE_ENV=production\` and using production credentials. Verify the current API settings in the Cashfree dashboard/docs when activating the account.

### Persistence and privacy

The service stores payment reference IDs, entitlement token hashes, payment status, customer email and paid-access metadata in \`msme-payments.json\`; it does not store invoice rows. Set \`NAVIGALEX_DATA_DIR\` to a durable mounted volume in Railway. Mount a volume at that path before relying on paid access: losing the payment store removes access records. The JSON store and in-process rate limits are for a single server instance; do not add replicas without moving to a shared database and shared rate limiting.

The checker processes invoice data in browser memory and sends the result rows to the server only when the paid PDF is requested. Do not upload information unless you are authorised to share it. Review the site's privacy notice and applicable data-protection requirements before production launch.

## Production deployment

The Railway configuration runs \`npm run build\`, then \`npm start\`, with \`/api/health\` as the health check. Set all credentials in Railway's variable store; never commit real keys or passwords.

The deployment script \`deploy-railway.ps1\` checks Node 22, logs into and links Railway, transfers selected environment values from a local git-ignored \`.env\`, runs \`npm run ci\`, and starts \`railway up\`. Review the selected Railway service/environment and attach the volume before running it. Use \`-HealthUrl https://YOUR_DOMAIN\` to run a post-deploy health check.

## CI and scope boundaries

\`npm run ci\` runs static integration checks, TypeScript validation, a production Vite build, and runtime API smoke tests. The GitHub Actions workflow also runs \`npm audit --audit-level=high\`.

The advisory tools are screening aids. They do not provide legal opinions or representation, statutory audit/assurance, tax opinions or attestations, debt recovery, loan approval, investment recommendations, or regulatory certification. Service work is scoped and quoted separately.
