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
- [CFO chat setup and security](docs/CFO_CHAT.md)
- [UOB challenge statements](docs/uob-challenge-statements.md)

**Status:** AdonisJS/React/SQLite app, finance dashboard, planning rules and read-only conversational CFO implemented. See [implementation status](docs/IMPLEMENTATION_STATUS.md) and [CI verification](docs/CI_VERIFICATION.md).

**Local setup:** Node.js 24+, npm 11+, then run `npm ci`, copy `.env.example` to `.env`, `node ace generate:key`, `node ace migration:run`, and `npm run dev`.

**CFO chat:** Configure `CFO_AI_API_KEY`, `CFO_AI_MODEL`, and optionally `CFO_AI_BASE_URL` on the server. Chat requires a Chat Completions-compatible model with function calling; without credentials it stays disabled. See [CFO chat setup](docs/CFO_CHAT.md).

**Zo deployment:** Set `DB_FILE` to an existing writable persistent volume; use a separate SQLite file for each deployment.
