# Proposed Build Plan — For Approval

**Status:** Architecture proposal only; no application implementation started.

## Deployment requirement
**One full-stack application** serving frontend pages and backend logic from the same deployable Node.js process/container. **PostgreSQL is the only separate infrastructure service** in the MVP. No Next.js, separate Express API, or independently deployed frontend.

## Proposed stack
- **SvelteKit + TypeScript** — integrated frontend, server-side route handlers, form actions and pages within one project.
- **Tailwind CSS** — rapid, maintainable responsive UI.
- **PostgreSQL + Drizzle ORM** — explicit relational financial data and migrations.
- **Server-side financial services** — deterministic calculations for balances, transfers, budgets and net worth.
- **AI provider behind a server-side adapter** — receives verified financial facts; returns validated recommendations.

Deployment: one Docker container / Node application + one managed PostgreSQL database, with secrets held server-side.

## Suggested project structure
```text
src/
  routes/
    +page.svelte
    budget/+page.svelte
    transactions/+page.svelte
    wealth/+page.svelte
    insights/+page.svelte
    api/review/+server.ts
  lib/
    components/
    server/
      db/
      finance/
      ai/
  app.css
drizzle/
docs/
```
The UI calls server actions or same-origin routes within this single app. There is no separate backend project.

## Data model (first pass)
- **User** — optional for sample-data POC, currency (SGD).
- **Account** — cash/bank/investment/debt account, opening balance and date.
- **Transaction** — date, amount in integer cents, category, type, source account and optional destination account for transfers.
- **Budget** — month, category and limit.
- **AssetValuation / LiabilityBalance** — dated manual values; avoid double-counting account balances.
- **FinancialGoal** — target amount and date (minimal).
- **Insight** — risk, evidence, suggestion, timestamp and acknowledgement.

## Build sequence
1. **Financial core:** schema, migrations, calculation services, tests for transfers, loans and budget consumption.
2. **Working UI:** transaction entry, monthly budget dashboard, asset and liability entry, net worth display with timestamps.
3. **AI CFO:** deterministic risk triggers (e.g. budget 80% used with time remaining), model-written guidance grounded in verified numbers.
4. **POC validation:** seeded working-professional scenario, demo script, acceptance and privacy checks.

## Guardrails
- User-controlled decisions; no payments or bank integration.
- No arbitrary user-generated database schemas in MVP.
- No promises of perfectly current wealth figures: show valuation dates and sources.
- Server computes all monetary results; AI interprets.
- For demonstration start with a single sample user; add authentication before storing real personal financial data.

## Decisions to settle before coding
1. Confirm **SvelteKit** as the integrated full-stack framework.
2. Confirm Drizzle + PostgreSQL.
3. Decide whether the first POC uses sample data only or protected real-user accounts.

**Not implemented yet.**
