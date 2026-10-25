# Acorra on ChatGPT Sites

This is an additive Cloudflare Worker adaptation of the existing application. The Adonis/Zo application is retained in the repository root. No Next.js, Docker, model API, bank API or paid AI dependency is added.

## Current public release: synthetic-data demo

All five original React views and the temporary Sandy avatar are reused through `src/bridge.tsx`. Original finance calculations, planning rules and guided coaching are imported from `app/services`, rather than reimplemented. Build aliases replace only Inertia navigation/forms and the runtime-specific shell. The premium Sites landing page and warm forest/ivory styling are additive.

Demo records and chat history live only in this browser tab's memory. Reloading resets the demo. There is no localStorage, cookie-based financial state or server-side demo record storage. Do not enter personal information. The sample balances are fictional and calculated by the same finance engine as the original app.

## Build and checks

From the repository root:

```sh
cd sites
npm ci
cd ..
npm run build:sites
npm run test:sites
```

The Worker is `dist/server/index.js`; `.openai/hosting.json` at the repository root is the canonical deployment configuration. `sites/.openai/hosting.json` is refreshed from it during build and supports local preview. The Worker contains the compiled React application and styles; no CDN scripts or secrets are needed. `sites/preview.mjs` is only a development server; `/__qa/mobile` creates a 390px iframe for responsive browser QA and is not a production route.

## Persistent account implementation and release lock

`src/server.ts` implements a server-only authenticated D1 workspace API. Owner identity comes exclusively from Sites' `oai-authenticated-user-id` dispatch header. Browser body/query user IDs are ignored. Missing identity returns 401. Same-origin mutation checks, action-level validation and optimistic revision checks apply to every write. SQL always binds the authenticated owner ID; all records and chat messages in a workspace belong to that owner.

D1 migration `drizzle/0000_financial_workspaces.sql` stores one aggregate financial ledger per owner with a revision. This permits atomic full-ledger validation and replacement without partial transfers or lost updates. Money inside the ledger is integer SGD cents, with safe-integer domain validation. A Sites D1 database is separate from the Zo SQLite database; no data was imported or synchronized.

`REAL_DATA_ENABLED` is hardcoded **false** in the shipped server. Even a signed-in caller receives 423 for personal storage. There is no environment-variable override. Automated API tests verify isolation with two simulated identities against a real in-memory SQLite database, but these do not establish that production dispatch strips forged identity headers or that two actual signed-in visitors remain isolated. The public build therefore cannot collect or persist real finances.

Before a personal-data release: verify native sign-in and identity-header stripping on the actual public Site with two independent visitors; verify anonymous denial, record-ID tampering, chat isolation, cross-origin rejection and concurrent write conflict handling. Connect the UI to the protected API (currently it deliberately runs only the synthetic session), then change the release lock in a reviewed source revision and repeat browser tests. Do not treat the demo as a verified personal finance service.

## Product details

- Exact SGD input; income, expenses, internal transfers and liability repayments.
- Create/edit/delete transactions; categories and monthly budget upsert.
- Savings progress does not add to net worth; marking a bill paid does not post an expense.
- One current dated valuation per named item; case-insensitive duplicate prevention across accounts and valuations. Differently named duplicates remain a manual review responsibility, as in the original product.
- Sandy is read-only guided mode, not a generative AI model. No external inference, mutations, payments or trades.
- The original Adonis implementation and its database remain separate and unchanged except for additive npm scripts and documentation.
