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
- **Guided CFO by default** — credential-free and read-only; optional direct API model integration is separate from ChatGPT subscription access
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

**CFO chat:** Runs in local guided mode without any model API key. Zo Codex and ChatGPT Sites can use your ChatGPT plan for their own supported workflows, but the custom AdonisJS CFO server cannot automatically reuse that subscription for inference. A separately authorised direct API remains optional for generative chat. See [CFO chat setup](docs/CFO_CHAT.md).

**Zo deployment:** Build with `bash scripts/zo-build.sh`, then register a Zo Node HTTP Service with working directory `build`, command `node bin/server.js`, and an absolute persistent `DB_FILE`. See [Zo deployment guide](docs/ZO_DEPLOYMENT.md).
