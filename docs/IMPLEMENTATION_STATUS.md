# Implementation Status

## First engineering increment
The repository contains an initial **framework-independent TypeScript financial core**:
- `app/services/finance/types.ts` — money/account/transaction/budget/valuation interfaces.
- `app/services/finance/calculations.ts` — deterministic balance, budget, transfer and net worth calculations.
- `tests/unit/finance.spec.ts` — regression scenarios (bank transfers, loan principal, budget utilisation, net worth, invalid transactions).

This code is a **starting vertical slice**, not a running AdonisJS application. It has no database persistence, authentication, interface or chat UI yet.

### Next actions
1. Generate an official AdonisJS React/Inertia starter with the supported toolchain.
2. Configure SQLite and Lucid migrations; map persisted entities to the finance service.
3. Set up Vitest or the official Adonis test runner and execute regression tests.
4. Build account and transaction interfaces with validation.
5. Add budget/net worth dashboard and conversational read-only CFO.

### Known limitations
- SGD only; no FX conversions.
- Non-cash valuations are manually supplied, with an as-of date.
- Callers must not count the same asset twice as both an account and manual valuation.
- This engine models transfers and loan principal; loan interest must be posted separately as an expense.
- Real financial data must never be persisted without authentication and access controls.
