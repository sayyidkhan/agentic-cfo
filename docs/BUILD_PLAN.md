# Agentic CFO — Agreed Architecture & Build Plan

**Status:** Architecture approved; first runnable foundation implemented. See [implementation status](IMPLEMENTATION_STATUS.md).  
**Decision date:** 2026-10-23

## Product scope
A personal CFO application for working professionals, with three MVP pillars:
1. Monthly income, expense and budget tracking.
2. Asset, liability and net-worth tracking.
3. Conversational AI CFO providing proactive, actionable financial guidance.

## Architecture decision
**AdonisJS + React + Inertia + Tuyau + Lucid + SQLite** (PostgreSQL remains an optional future migration).

- **AdonisJS (TypeScript):** Single full-stack web application; server routes, controllers, validation, authentication and domain services.
- **React + Inertia:** UI served as part of the same application. No independent frontend or separate API deployment.
- **Tuyau:** Native AdonisJS ecosystem for end-to-end typed route/API clients; prefer this to introducing tRPC. Configure and verify inference and version compatibility during scaffolding.
- **VineJS:** Runtime validation at every data-writing boundary; static type inference alone is insufficient.
- **Lucid ORM:** SQLite models, migrations and transactional updates. Keep persistence behind domain services to make a future PostgreSQL migration manageable.
- **SQLite:** Default database for development and the Zo Computer deployment. Store the DB file on persistent storage and maintain backups; PostgreSQL is a possible future adapter, not an MVP requirement.
- **Conversational CFO (implemented):** Server-side Chat Completions-compatible provider integration with bounded read-only financial tool calls; the initial chat uses complete responses, not streaming. Model provider is configured through server environment variables.
- **Tailwind CSS:** UI styling.
- **Deployment:** Standalone AdonisJS build under Node.js 24+, registered as a Zo HTTP Service with a persistent SQLite directory; no Node.

### Logical structure
```text
React + Inertia pages (budget, wealth, transactions, chat)
                │
      Typed routes (Tuyau)
                │
AdonisJS controllers / endpoints / auth / VineJS
                │
 ┌──────────────┼──────────────────────┐
 Finance services    CFO agent & tools   Conversation service
 └──────────────┼──────────────────────┘
           Lucid ORM / SQLite
```

The AI may request read-only financial tool calls but cannot bypass validated domain services. Future mutation tools require explicit confirmation and permission checks. Financial totals must be computed deterministically outside the model.

## Initial proposed project layout
```text
app/
  controllers/
  models/
  services/
    finance/
    ai/
  validators/
  middleware/
inertia/
  pages/
  components/
database/
  migrations/
start/
  routes.ts
docs/
```
Actual generated directories may differ with selected Adonis starter and current framework conventions.

## Financial data rules
- Store money in integer minor units (e.g., SGD cents) or fixed-precision decimal.
- Avoid double counting an account transfer as an expense or net worth change.
- Distinguish loan principal repayment from interest.
- Net worth = known assets minus known liabilities; show data freshness for manually valued holdings.
- Every balance mutation must be validated, authorised and handled transactionally where applicable.
- Do not give an AI model authority to fabricate or persist balances.

## Build sequence
1. **Scaffold and schema:** AdonisJS + React/Inertia, Tuyau, Lucid/SQLite; implement testable finance services.
2. **Tracking experience:** manual entry, category budgets, accounts, assets/liabilities and dashboard.
3. **Conversational CFO:** read-only tools and persisted conversations are implemented; streaming responses can be added later.
4. **Proactive guidance:** deterministic warnings now implemented; AI explanations and user acknowledgment are future enhancements.
5. **POC validation:** test arithmetic, transfers, stale valuations and representative demo scenarios.

## Explicitly out of scope
No Next.js or SvelteKit; no tRPC layer unless requirements change; no bank connections, payment execution, complex multi-agent orchestration, dynamic user-defined database schema, or SME multi-tenant features.

## Deployment portability
- Maintain **one GitHub codebase** for ChatGPT-assisted development and a separate runnable copy on Zo Computer; ChatGPT is the development workflow, not necessarily an application host.
- Both environments can run the same application code but their SQLite files are independent unless explicit import/export or synchronization is implemented.
- Use environment-based database paths and secrets; never commit database files, credentials or private financial data.
- Keep finance, budgeting, wealth, agent, and infrastructure concerns modular within a single deployable application, not separate services.
- SQLite requires a writable persistent volume and backups in any hosted deployment.

## Deferred operational decisions
- Choose AI model provider and deployment host later.
- Start with demo/sample accounts; add secure authentication before storing real financial information.
- Scheduled background agent runs could eventually need a scheduler/worker; not required for initial POC.

**Implementation has started:** AdonisJS/React scaffold, SQLite migrations, finance dashboard, forms and tests are present. Conversational CFO and more advanced functionality remain future phases.
