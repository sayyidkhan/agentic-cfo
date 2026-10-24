# Agentic CFO — UI/UX Milestone

**Updated:** 2026-10-24  
**Status:** Responsive multi-view UI implemented and automated checks pass. A real browser-based visual walkthrough is still outstanding.

## Experience design
The authenticated app now has five navigation destinations, all under the same AdonisJS + React/Inertia deployment:

| View | URL | Purpose |
|---|---|---|
| Overview | `/dashboard` | Estimated net worth, balances, monthly cash flow, alert summary, budget health and recent transactions |
| Transactions | `/dashboard?view=transactions` | Create/edit/delete income, expenses and transfers |
| Budgets & Goals | `/dashboard?view=budget` | Categories, monthly limits, recurring commitments and savings goals |
| Wealth | `/dashboard?view=wealth` | Accounts, assets, liabilities, dated valuations and recorded net worth |
| Ask CFO | `/cfo` | Private read-only AI conversation with clickable example questions |

The main dashboard shares one server-computed financial payload and uses a query-string view selection for the four financial sections. This avoids adding new API services or duplicating domain calculations, while still giving users a dedicated link for each section.

## UI principles
- Show real recorded balances only; do not manufacture historic trends or sample data on a user's financial overview.
- Disclose when a figure is a dated manual estimate.
- Use the existing finance services and validated server endpoints for all writes.
- Show useful empty states and the next appropriate action.
- Provide keyboard-accessible navigation and descriptive form labels.
- Use a restrained financial visual system with neutral surfaces, teal accents, and warning coloration only for meaningful risks.
- Mobile: scrolling top-level navigation, single-column cards and forms, readable amounts and conversation messages.

## Automated verification
The GitHub CI workflow checks:
1. Application-key generation.
2. SQLite migrations.
3. TypeScript and Tuyau code generation/typechecking.
4. Finance and AI-tool unit tests.
5. Authentication-route HTTP smoke tests for overview, each financial view, and CFO chat.
6. Production build.

See [CI verification](CI_VERIFICATION.md) for the most recent outcome.

## Required manual browser review
- Desktop at approximately 1440px, tablet at 768px and mobile at 375px.
- Create a test user and verify the five navigation destinations, back/forward behaviour and active navigation indication.
- With no finance records, check onboarding and empty states. In Wealth, add an account. In Transactions, record a salary and an expense.
- Create a dining category and monthly budget. Verify the overview budget bar and monthly spending totals update.
- Edit and delete a transaction. Confirm the ledger and net-worth figures recompute as expected.
- Create a recurring commitment and savings goal. Verify warning cards and planning totals.
- Add a manual property valuation; verify a timestamp appears and totals update.
- Confirm that unconfigured CFO chat shows a disabled composer and informative message.
- Configure a compatible model in a test environment and verify that example-question buttons populate the composer and the answer uses the signed-in user's figures.
- Check focus outlines, error messages, text wrapping, dark mode, and horizontal overflow.
- Verify two distinct users cannot read each other's accounts, transactions or chat.
- Inspect error states and network behaviour; no model keys should be exposed to the browser.

## Still pending before real-user or judged POC release
- Real browser walkthrough and screenshot review (not performed within this work session).
- Secure model-provider configuration and live AI conversation test.
- Multi-user cross-account isolation tests with seeded records.
- Persistent Zo Computer deployment, SQLite backups and restore test.
- Further accessibility and mobile-device validation.
