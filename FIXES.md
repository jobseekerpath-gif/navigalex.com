# Navigalex fixes — 26 October 2026

## Applied changes
- Corrected literal newline escapes in inquiry mail text, offline chat replies, and service-tile chat messages.
- Expanded contract review text handling to 30,000 characters and disclose when longer documents are only partially reviewed.
- Allowed decimal values in all five bank-readiness numeric fields.
- Corrected route precedence for the MSME payment-timing and family-office pages.
- Loaded local `.env` values, corrected missing-file handling, and made the PowerShell deployment script independent of a hard-coded Windows folder.
- Changed admin session handling to avoid polling hidden tabs and avoid logging out on temporary verification/network errors; expired-token responses still log out.
- Surfaced case-study save errors and removed invented region/turnover defaults; new submissions default to Draft.
- Coalesced telemetry/audit writes, flush persistent data on shutdown, split PDF rate limiting from document analysis, and label generated PDF analysis as user-supplied and not independently verified.

## Validation
GitHub Actions CI will run after this commit. Do not treat deployment as live until the CI and Railway status checks complete.
