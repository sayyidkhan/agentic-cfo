# Agentic CFO — Implementation Status

**As of 2026-10-24:** Budgeting and wealth foundation plus a new forward-looking planning vertical slice committed. See [automated verification](CI_VERIFICATION.md).

## Implemented
- Official **AdonisJS 7 + React/Inertia** starter (Tuyau, Lucid, authentication).
- **SQLite** migration for user-scoped accounts, categories, transactions, budgets, and dated asset/liability valuations.
- Auth-protected dashboard using one full-stack deployment.
- Manual account, expense, income, transfer, budget, category and valuation entry forms.
- Transaction edit/delete with user-scoped access and full ledger revalidation before database commit.
- Manual asset/debt valuation edit/delete, with exact-name duplicate checks against recorded accounts.
- Account-by-account balances displayed to support manual reconciliation.
- Monthly bill commitments (1st–28th), user-marked payment status and unposted cash projections.
- Savings goals with target dates, progress tracking and updates.
- Rules-based warnings for over-budget spending, cash shortfalls, overdue bills and overdue goals.
- Deterministic balance, net-worth and monthly budget calculations in integer cents.
- Exact SGD input parsing with validation.
- Japa unit tests for transactions, transfers, loan principal, budget totals and input parsing.
- CI run: migrations, typecheck after Adonis codegen, unit tests, production build.

## Run locally
Node.js **24+** and npm **11+** required.

```bash
npm ci
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

Open `http://localhost:3333`, sign up, and open the protected `/dashboard`.

To verify locally:
```bash
npm run typecheck
npm test -- --suite=unit
npm run build
```

## Running a separate copy on Zo Computer
Set `DB_FILE` to a **writable, persistent, backed-up path**; e.g. `/data/agentic-cfo.sqlite` with the `/data` directory already created and mounted persistently. Otherwise the default is `tmp/db.sqlite3` inside the application, which is not necessarily durable on hosting systems.

Each deployment has its **own SQLite file**; copies do not automatically synchronize. Keep `.env`, APP_KEY, SQLite files and personal financial data out of Git.

## Important limitations
- **No conversational CFO yet.** Warnings are currently deterministic, with no AI conversation or personalised natural-language reasoning. The next phase will introduce a read-only conversational CFO.
- Transactions and manual valuations now support edit/delete; accounts, categories and budgets do not yet have full edit/delete flows. Historical snapshots, automatic bank reconciliation, FX, robust debt schedules and recurring-bill transaction posting are future work.
- Manually entered valuations can be stale and must **not double-count** balances already represented by accounts. Exact-name duplicate protection has been added, but it cannot identify two differently named records representing the same asset.
- For this POC, asset accounts represent spendable bank/cash balances; less-liquid assets should be entered as dated valuations. The projected cash figure assumes account balances are available and commitments have been correctly marked paid.
- Proactive warning cards appear when the user visits the dashboard, but there is no scheduled/background review, notification system or automatic bill posting. Marking a recurring bill paid does not post a bank transaction; users must also record the corresponding expense.
- Starter authentication is present; security review, tenant isolation tests, and deployment hardening remain necessary before handling real financial records.
- All figures use SGD and a fixed minor-unit representation. Financial totals, not language models, are the source of truth.

## POC demonstration path
1. Sign up, create a bank account with a starting balance.
2. Add spending categories and a monthly dining budget.
3. Record expenses, then edit or delete one and verify the budget recalculates.
4. Add a future unpaid bill larger than available cash and observe the shortfall warning.
5. Mark it paid (the reminder changes, but money does not move); separately record the actual transaction.
6. Set an emergency-fund savings goal; update progress; add manually valued assets.
7. Review account balances, estimated net worth and warning cards.

**Release gate:** CI typecheck/migrations/tests/build are necessary but not sufficient. Browser-based walkthrough, financial edge-case tests, cross-user access tests, and deployment security review are outstanding.
