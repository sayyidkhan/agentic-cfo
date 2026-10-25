# Acorra — Public ChatGPT Sites launch brief

**Goal:** Create and publish a functioning, public-facing ChatGPT Site for **Acorra**, with **Sandy the Squirrel** as the friendly money companion. Build from the existing product in this repository, not a generic template.

**Source repository:** https://github.com/sayyidkhan/agentic-cfo  
**Existing app:** AdonisJS 7 + React/Inertia + Lucid + SQLite. It is **not a drop-in ChatGPT Sites app**. Adapt architecture to Sites' supported runtime, authentication and persistent storage. Preserve the user-facing design, domain rules and product behavior, not the original Node server.

## Identity and product
- Product name: **Acorra**
- Tagline: **Grow your wealth, one habit at a time.**
- Companion: **Sandy the Squirrel**, friendly, encouraging, slightly playful; **only use the current temporary squirrel icon**. Final character artwork and expressions are explicitly deferred.
- Styling: premium, welcoming, forest green with warm ivory/champagne accents, clear mobile-first layout.
- Public homepage introduces Acorra and Sandy. Original UI lives under `inertia/` and brand requirements are in `docs/BRAND.md`.

## MVP capabilities to preserve
1. Overview: recorded cash, monthly income/expenses, estimated net worth, financial pulse and recent transactions.
2. Transactions: income, expenses, internal transfers, with edit/delete and category validation.
3. Budgets & Goals: categories, monthly spending limits, savings goals, monthly recurring bills, paid reminders and warning cards.
4. Wealth: recorded asset/debt accounts, manual dated valuations, net-worth calculation in **integer SGD cents**, avoid double-counting.
5. Chat with Sandy: **read-only**, credential-free **guided mode** using the deterministic finance tools and rules. Do not claim a live generative model or use the owner's ChatGPT subscription as a general user API. No payments or bank connections.

Pure domain files to consider porting:
- `app/services/finance/calculations.ts`
- `app/services/finance/money.ts`
- `app/services/finance/planning.ts`
- `app/services/finance/types.ts`
- `app/services/cfo/financial_tools.ts`
- `app/services/cfo/guided_coach.ts`

## Site runtime migration
- Do **not** attempt to run Node/AdonisJS/Lucid as-is in ChatGPT Sites.
- Use the supported Sites app framework and available persistent relational storage. Design a fresh migration/schema matching the required financial records and ownership checks.
- Every financial row and conversation message must be scoped to the authenticated viewer's stable identity.
- Use Sites-supported authentication for end-user accounts, if available, and confirm the exact data/identity semantics before enabling entry of real financial data.
- Don't hardcode `user_id=1`, share a single global SQLite file between visitors, or expose a secret in browser JS.
- Existing Zo SQLite data does **not** automatically sync with the new Sites database.
- If visitor-specific, securely stored finance records **cannot** be implemented/verified, launch a **clearly labelled public demo with synthetic data only** and disable real-user financial storage until authentication and isolation work.

## Public deployment gates
- Test public landing page on mobile and desktop.
- Test onboarding, creating and editing expenses, budgets, commitments, savings goals and valuations using *synthetic* records.
- Verify the actual signed-in visitor sees only their own data, with a separate test visitor; do not expose another person's balances or messages.
- Confirm Sandy's answers use the viewer's derived SGD figures, label static forecasts, and never mutate records.
- Confirm no real financial data or secrets are bundled in the public site.
- Save and review the Sites version before deploying.
- Deploy through ChatGPT Sites and then set **Share → Who has access → Anyone on the internet → Save**, if that audience option is available.
- Open the production URL in a fresh, non-owner browser session and verify the intended visitor experience.
- Return the verified public URL only **after** Sites confirms deployment; never invent it.

## Suggested ChatGPT Work / @Sites request

> Use @Sites to build and deploy a public website called **Acorra** from my GitHub repository https://github.com/sayyidkhan/agentic-cfo. The existing AdonisJS server is not directly Sites-compatible, so adapt the product to the supported Sites runtime and persistent database. Preserve its five screens: Overview, Transactions, Budgets & Goals, Wealth, and Chat with Sandy. Use the existing pure financial calculation and guided-chat rules with SGD integer cents. Use the premium forest-green/ivory branding from docs/BRAND.md. Sandy the Squirrel gets only a simple temporary avatar; do not redesign her character yet. Ensure each user has private, isolated records behind supported sign-in; if that isn't verified, publish a clearly marked synthetic-data demo rather than collecting personal financial data. Do not add Docker, LiteLLM or extra API costs. Build, preview, test key interactions, deploy and set public access to Anyone on the internet. Give me the verified live URL.

## Status

**This brief is preparation, not evidence of deployment.** The user must launch @Sites in a ChatGPT Work session with appropriate account permissions, because the ordinary chat connector context used to author this brief has no Sites create/deploy/share action.
