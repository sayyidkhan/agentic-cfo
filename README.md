# Agentic CFO

An AI-powered personal finance application helping **working professionals** manage monthly budgets, understand their estimated net worth, and improve financial habits with proactive conversational guidance.

**Hackathon:** UOB Theme 3 — Proactive Financial Wellbeing and Engagement.

## MVP pillars
1. **Budget tracker** — income, expenses, monthly budgets.
2. **Wealth tracker** — accounts, assets, liabilities and estimated net worth.
3. **AI CFO** — conversational financial reviews, early risk detection and practical recommendations.

## Agreed technical architecture
- **AdonisJS + TypeScript** — full-stack application and server logic
- **React + Inertia** — frontend in the same deployment
- **Tuyau** — end-to-end type-safe routes/API calls; no tRPC needed initially
- **VineJS** — runtime request validation
- **Lucid + PostgreSQL** — persistence and financial models
- **AI SDK (planned)** — streaming conversation and model tool calls
- **Tailwind CSS** — styling
- **Docker** — single application deployment; PostgreSQL separate

Financial calculations remain deterministic and testable; AI explains and advises, with no autonomous payments.

## Documentation
- [Product requirements](docs/PRD.md)
- [Agreed architecture and build plan](docs/BUILD_PLAN.md)
- [UOB challenge statements](docs/uob-challenge-statements.md)

**Status:** Initial AdonisJS/React/SQLite application and finance dashboard implemented. See [implementation status](docs/IMPLEMENTATION_STATUS.md) and [CI verification](docs/CI_VERIFICATION.md).\n\n**Local setup:** Node.js 24+, npm 11+, then run `npm ci`, copy `.env.example` to `.env`, `node ace generate:key`, `node ace migration:run`, and `npm run dev`.\n\n**Zo deployment:** Set `DB_FILE` to an existing writable persistent volume; use a separate SQLite file for each deployment.
