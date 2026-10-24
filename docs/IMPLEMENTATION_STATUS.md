# Agentic CFO — Implementation Status

**As of 2026-10-24:** First runnable full-stack foundation committed. See [automated verification](CI_VERIFICATION.md).

## Implemented
- Official **AdonisJS 7 + React/Inertia** starter (Tuyau, Lucid, authentication).
- **SQLite** migration for user-scoped accounts, categories, transactions, budgets, and dated asset/liability valuations.
- Auth-protected dashboard using one full-stack deployment.
- Manual account, expense, income, transfer, budget, category and valuation entry forms.
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
- **No conversational CFO yet**; chat and proactive personalised coaching are next phases.
- Initial transaction/valuation flow supports creation; full edit/delete, snapshots, reconciliations, FX and richer liability accounting are future work.
- Manually entered valuations can be stale and must **not double-count** balances already represented by accounts. Do not enter the same asset twice.
- Budget alerts are currently basic UI indicators, not scheduled reviews.
- Starter authentication is present; security review, tenant isolation tests, and deployment hardening remain necessary before handling real financial records.
- All figures use SGD and a fixed minor-unit representation. Financial totals, not language models, are the source of truth.
