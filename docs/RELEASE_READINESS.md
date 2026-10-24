# Agentic CFO — POC release readiness

**Updated:** 2026-10-24

## Development completed in repository
- AdonisJS + React/Inertia + Tuyau single full-stack application.
- SQLite, signed-in per-user financial records, budget/wealth calculations and monthly planning.
- Income/expense/transfer CRUD; budgets, commitments, savings goals and estimated wealth.
- Read-only financial CFO with local guided mode (no API key or gateway), per-user history and verified finance calculations; separate direct API integration is optional.
- Responsive five-view UI and helpful empty states.
- Production POC signup control (`CFO_ALLOW_SIGNUP=false` by default).
- Browser journey and two-user isolation tests committed under `tests/browser`.
- Native Node.js/Zo Service deployment instructions, online SQLite backup script and persistent DB path support.

## Verification gates
- [x] Existing finance unit tests, migrations, typecheck and production build previously passed.
- [x] Browser testing infrastructure and scenarios authored.
- [x] Native Node build and migration checks wired into CI.
- [ ] **Fresh end-to-end Chromium result for the latest changes**; see `CI_VERIFICATION.md` and repository Actions. Do not confuse older reports with a pass for this commit.
- [ ] **Native Node build and migration smoke verified on the final commit**.
- [ ] Real AI provider credential configured, live model interaction and answer-quality evaluation.
- [ ] Actual Zo Computer deployment, HTTPS, persistent-volume test and off-host backup/restore.
- [ ] Security/privacy review with synthetic and then consented data.

## Recommended release sequence
1. Confirm CI green on the latest commit and review synthetic screenshots from the `cfo-browser-verification` Actions artifact.
2. Deploy privately on Zo per [ZO_DEPLOYMENT.md](ZO_DEPLOYMENT.md) and open temporary signups only long enough to provision a test account.
3. Set a supported model and provider key in server-only environment variables; run the scenarios in [CFO_CHAT.md](CFO_CHAT.md).
4. Test two independently authenticated users, invalid record submissions, reconciliation edge cases, and mobile layouts.
5. Back up and restore the SQLite database to a separate environment, then lock public signup and do not expose raw financial data until privacy handling is confirmed.

**Product milestone:** POC code is present; releasing it for real financial data is intentionally blocked until the above environment-dependent checks pass. There is no autonomous payment execution.
