# Acorra

A personal finance application helping **working professionals** manage monthly budgets, understand their estimated net worth, and improve financial habits with proactive conversational guidance.

**Hackathon:** UOB Theme 3 — Proactive Financial Wellbeing and Engagement.

**Mascot:** Sandy the Squirrel. Sites uses original rendered artwork and animation; the separate Adonis app retains its placeholder.

**Former working title:** Agentic CFO. The GitHub repository retains its technical name to avoid breaking existing integrations.

## Current product structure

Overview owns financial highlights and current net worth; Spending owns transactions; Plan owns spending limits, goals and bills; Sandy provides read-only guidance. Mobile navigation is Overview · Spending · Sandy · Plan · Profile, with Settings inside Profile. Desktop retains direct Profile and Settings links. Net-worth/account detail lives under Overview.

The [revised PRD v2.1](docs/PRD.md), dated 31 October 2026, is the product baseline for the dashboard refinement and distinguishes current delivery from proposed enhancements.

## MVP pillars
1. **Budget tracker** — income, expenses, monthly budgets.
2. **Wealth tracker** — accounts, assets, liabilities and estimated net worth.
3. **Sandy** — read-only guided financial conversations, proactive risk signals and practical suggestions. Optional generative AI can be configured separately.

## Original Adonis/Zo architecture
- **AdonisJS + TypeScript** — full-stack application and server logic
- **React + Inertia** — frontend in the same deployment
- **Tuyau** — end-to-end type-safe routes/API calls; no tRPC needed initially
- **VineJS** — runtime request validation
- **Lucid + SQLite** — persistent per-deployment financial records
- **Guided CFO by default** — credential-free and read-only; optional direct API model integration is separate from ChatGPT subscription access
- **Responsive CSS** — custom financial workspace styling
- **Native Node.js service** — one full-stack deployment on Zo Computer (no Docker)

Financial calculations remain deterministic and testable; AI explains and advises, with no autonomous payments.

## ChatGPT Sites version

The additive Sites implementation lives in [`sites/`](sites/README.md), reusing the existing React views, finance calculations and Sandy guided coach. The public release uses synthetic data in browser memory. The account screen and personal D1 workspace UI/API are implemented behind a hard server-side release lock until live native sign-in and two-visitor isolation are verified. Signed-in visitors can save optional profile details and a private profile photo separately from the locked financial workspace. The earlier fixed-marker test is no longer a user-facing profile feature. The Zo SQLite application and Sites deployment do not synchronize.

See [Sites verification](docs/SITES_VERIFICATION.md). Build with `npm run build:sites` after installing `sites/` dependencies; test with `npm run test:sites`.

## Documentation
- [Product requirements](docs/PRD.md)
- [Agreed architecture and build plan](docs/BUILD_PLAN.md)
- [CFO chat setup and security](docs/CFO_CHAT.md)
- [UI design and browser-review checklist](docs/UI_REVIEW.md)
- [Acorra branding and Sandy mascot](docs/BRAND.md)
- [Zo native Node deployment](docs/ZO_DEPLOYMENT.md)
- [ChatGPT Sites compatibility](docs/SITES_COMPATIBILITY.md)
- [UOB challenge statements](docs/uob-challenge-statements.md)

**Status:** The Sites application is publicly deployed as an interactive synthetic-data demo. Finance calculations and guided Sandy are implemented; real financial persistence remains locked pending production identity/isolation verification. The latest engineering checkpoint passed 34 Sites tests. Historical Adonis/Zo status is documented separately in [implementation status](docs/IMPLEMENTATION_STATUS.md) and [CI verification](docs/CI_VERIFICATION.md); those reports are not evidence of a verified personal-data release.

**Local setup:** Node.js 24+, npm 11+, then run `npm ci`, copy `.env.example` to `.env`, `node ace generate:key`, `node ace migration:run`, and `npm run dev`.

**CFO chat:** Runs in local guided mode without any model API key. Zo Codex and ChatGPT Sites can use your ChatGPT plan for their own supported workflows, but the custom AdonisJS CFO server cannot automatically reuse that subscription for inference. A separately authorised direct API remains optional for generative chat. See [CFO chat setup](docs/CFO_CHAT.md).

**Zo deployment:** Build with `bash scripts/zo-build.sh`, then register a Zo Node HTTP Service with working directory `build`, command `node bin/server.js`, and an absolute persistent `DB_FILE`. See [Zo deployment guide](docs/ZO_DEPLOYMENT.md).
