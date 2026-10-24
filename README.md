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
- **Lucid + SQLite** — persistent per-deployment financial records
- **Server-side Chat Completions integration** — read-only CFO tool calls; no extra AI orchestration service
- **Responsive CSS** — custom financial workspace styling
- **Native Node.js service** — one full-stack deployment on Zo Computer (no Docker)

Financial calculations remain deterministic and testable; AI explains and advises, with no autonomous payments.

## Documentation
- [Product requirements](docs/PRD.md)
- [Agreed architecture and build plan](docs/BUILD_PLAN.md)
- [CFO chat setup and security](docs/CFO_CHAT.md)
- [UI design and browser-review checklist](docs/UI_REVIEW.md)
- [Zo native Node deployment](docs/ZO_DEPLOYMENT.md)
- [ChatGPT Sites compatibility](docs/SITES_COMPATIBILITY.md)
- [UOB challenge statements](docs/uob-challenge-statements.md)

**Status:** Full-stack budgeting and wealth app, redesigned five-view finance interface, planning rules and read-only conversational CFO implemented. Previous baseline checks passed; latest expanded browser and native Node verification is pending. Zo deployment remains outstanding. See [implementation status](docs/IMPLEMENTATION_STATUS.md) and [CI verification](docs/CI_VERIFICATION.md).

**Local setup:** Node.js 24+, npm 11+, then run `npm ci`, copy `.env.example` to `.env`, `node ace generate:key`, `node ace migration:run`, and `npm run dev`.

**CFO chat:** Configure `CFO_AI_API_KEY`, `CFO_AI_MODEL`, and optionally `CFO_AI_BASE_URL` on the server. With no credentials, the CFO uses a clearly labelled local guided mode for common financial questions. A Chat Completions-compatible model with function calling enables flexible AI chat. See [CFO chat setup](docs/CFO_CHAT.md).

**Zo deployment:** Build with `bash scripts/zo-build.sh`, then register a Zo Node HTTP Service with working directory `build`, command `node bin/server.js`, and an absolute persistent `DB_FILE`. See [Zo deployment guide](docs/ZO_DEPLOYMENT.md).
