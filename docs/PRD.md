# Agentic CFO — MVP Product Requirements Document

**Status:** MVP scope agreed; implementation in progress | **Date:** 2026-10-24  
**Audience:** Working professionals | **Challenge:** UOB Theme 3 — Proactive Financial Wellbeing and Engagement

## 1. Executive summary
Agentic CFO is a personal finance app with a budgeting foundation, a consolidated net-worth view, and an AI financial assistant that detects risks early and suggests practical steps toward healthier financial habits. Its purpose is **to help users become better at managing money** rather than just providing charts.

## 2. Problem statement
Working professionals manage regular income, bills, lifestyle spending, savings goals and debts, often across multiple accounts. While they can record expenses, a historical report alone does not answer whether upcoming commitments will cause them to exceed budgets or fall behind on goals. Their net worth may also be difficult to see in one place. Without timely, relevant guidance, financial problems become visible only after decisions have already been made.

**How might we help working professionals understand their financial position, anticipate avoidable problems and build healthier money-management habits?**

## 3. Proposed solution
A unified personal finance workspace with three MVP pillars:
1. **Budget Tracker:** Record income/expenses, categorise transactions, set monthly budgets and see remaining allowances.
2. **Wealth Tracker:** Record financial accounts, assets, debts and valuations; show assets − liabilities as estimated net worth, with update timestamps.
3. **AI CFO:** On a new transaction or an explicit/scheduled review, calculate budget health, upcoming known commitments and goal progress; flag meaningful risks and give transparent, actionable, personalised recommendations.

The agent does not make payments, offer regulated personalised investment advice, or change balances.

## 4. Intended outcomes
- Financial visibility: know how much is earned, spent and left in each budget.
- Wealth visibility: know the recorded estimated net worth and how it changes over time.
- Early identification: catch projected overspending or cash shortages while there is still time to act.
- Better habits: prompt informed decisions and consistent progress toward financial goals.

## 5. MVP user journey
1. User enters income, opening account balances and optionally existing assets / debts.
2. User creates a monthly budget by category and optionally a savings goal.
3. User records transactions, recurring bills and account transfers.
4. Dashboard displays income, spending, remaining budgets, assets, debts and net worth.
5. CFO review identifies a specific risk, cites supporting figures, suggests a next action.
6. User acknowledges or dismisses the suggestion; no money is moved.

**POC demo:** User has a S$500 dining budget, has spent S$425, and has ten days remaining. The app identifies that 85% has been used and recommends a realistic adjustment; a separate dashboard shows the user's estimated net worth with clearly dated balances.

## 6. MVP functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| B1 | Record income and expense transactions | User can add, edit and delete entries with amount, date, account and category |
| B2 | Monthly category budgets | Remaining budget = limit − eligible expenses for selected month |
| B3 | Dashboard | Displays monthly income, expense, net cash flow and budget usage |
| W1 | Track cash and other accounts | Users can add/edit an account and opening balance |
| W2 | Record assets/liabilities | Each item has value, currency, valuation date and source (manual for MVP) |
| W3 | Net worth calculation | Sum of recorded assets minus recorded liabilities; date/freshness indicated |
| A1 | Financial review | Can be triggered by user or relevant transaction event |
| A2 | Personalised insights | Recommendation cites actual budget/commitment data and a concrete next step |
| A3 | User control | No payment or external financial action without authorisation |

## 7. Data integrity rules
- Use decimal values / integer minor units, never binary floats for money.
- Transfers between owned accounts **are not expenses**, nor changes to net worth.
- Loan principal repayments reduce cash and liability; interest is an expense.
- New income raises cash and net worth; spending lowers cash and net worth.
- Net worth may use stale/manual estimates; avoid claims of perfect real-time precision.
- Account balances and transaction activity must reconcile or surface discrepancies rather than silently double count.
- Record source currency and conversion rate/date for any multi-currency totals; single-currency SGD POC is acceptable.

## 8. Out of scope for MVP
Bank feeds and open banking; payment initiation; full accounting ledger; investment recommendations; unrestricted custom schemas/database builders; multi-agent orchestration; SME workflows; market-price integrations; automatic email/receipt ingestion.

## 9. Success criteria
1. User can complete budget setup and add an expense.
2. Budget remaining values are mathematically correct.
3. User can enter assets/debts and see correctly computed net worth.
4. Agent raises at least one **early** relevant risk from provided data and explains why.
5. A demo user can understand and act on the advice without a lengthy setup.

## 10. Open validation questions
- How often will users manually keep financial information up to date?
- Do people understand net worth versus cash available to spend?
- Are recommendations useful enough to change behaviour?
- Would a budget-first onboarding feel less overwhelming than entering every asset/debt immediately?

See [BUILD_PLAN.md](./BUILD_PLAN.md) for architecture and [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for features implemented, remaining work and verification.
