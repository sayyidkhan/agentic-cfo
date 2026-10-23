# Proposed Build Plan — For Approval

**Status:** Proposal only; no application implementation started.

## Technical direction
Build a responsive web POC. Suggested stack:
- **Next.js + TypeScript** for a single full-stack codebase.
- **PostgreSQL + Prisma** for persistent financial records and explicit relationships.
- **Tailwind CSS** for rapid UI development.
- **Server-side deterministic financial calculations** for totals, remaining budgets and net worth.
- **AI model API behind a small service abstraction**, given structured computed facts, with explanations and suggestions returned in a validated JSON shape.

Stack is a proposal, not an irreversible choice. A local SQLite development mode is also viable if speed is a priority.

## Data model (first pass)
- **User** — profile and preferred currency (SGD initially).
- **Account** — cash/bank/investment/debt account, opening balance and dates.
- **Transaction** — date, amount, type, category, source account and optional destination account for transfers.
- **Budget** — month, category, spending limit.
- **AssetValuation / LiabilityBalance** — externally estimated/manual values with as-of date; prevent double-counting account balances.
- **FinancialGoal** — target amount and date (minimal).
- **Insight** — detected issue, evidence, suggestion, created timestamp, acknowledgment state.

The exact modeling of loans, account balances and standalone asset valuations must be nailed down before implementation to avoid double counting.

## Build sequence

### Phase 1 — Finance engine and data model
Implement account, transaction and budget persistence; calculate account balances, budgets, transfers and net worth with automated tests. Use SGD integer cents.

### Phase 2 — Working dashboard
Onboard a user with sample/manual data. Build transaction entry, monthly budget view, and assets/liabilities/net worth views. Display last updated dates.

### Phase 3 — CFO review
Start with deterministic triggers (e.g. >80% of budget used before month-end, upcoming bills exceed available funds). Pass verified figures to an LLM for plain-language recommendations. Cite the numbers and show optional user acknowledgment.

### Phase 4 — POC polish
Seed realistic working-professional example data; write a demo script; test edge cases and verify the Theme 3 narrative (early identification → timely guidance → better habit).

## Main technical risks and mitigations
- **Wrong financial totals:** deterministic computation, unit tests, transfer/debt scenarios.
- **Hallucinated AI numbers:** strict structured fact payload and validation; AI never calculates authoritative account balances.
- **Unreliable wealth estimates:** show valuation timestamps and source.
- **Scope creep:** no bank integrations, dynamic schema generation or autonomous payments.
- **Sensitive data exposure:** protect personal financial data, use least-privilege access, never send unnecessary identifiers to an AI model.

## Decisions to settle before coding
1. Next.js/TypeScript + PostgreSQL as the default stack?
2. Single-user POC with sample data or multi-user login from day one?
3. Manual balances plus transactions, or a fully ledger-based approach in V1?

**Recommended default:** Start with single-user sample data, transaction-backed bank balances, manually valued non-cash assets, no external payments, and add authentication before any real personal data is stored.
