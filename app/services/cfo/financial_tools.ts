import type { CfoSnapshot } from './types.js'

/**
 * The model can choose a tool, but cannot supply a user ID or raw SQL.
 * All data comes from a server-computed, authenticated financial snapshot.
 */
export const CFO_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_financial_overview',
      description: 'Retrieve recorded cash, monthly income/spending and estimated net worth in SGD cents.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_budget_status',
      description: 'Retrieve current-month category budgets, spending and remaining allowances.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_upcoming_bills',
      description: 'Retrieve unpaid current-month commitments and projected recorded cash after those bills.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_savings_goals',
      description: 'Retrieve saved amounts, targets and dates for the user’s savings goals.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'assess_planned_purchase',
      description: 'Estimate the impact of a hypothetical SGD purchase on current recorded cash after this month’s unpaid bills. Not a future-month forecast.',
      parameters: {
        type: 'object',
        properties: {
          amountCents: { type: 'integer', minimum: 1, maximum: 100000000000, description: 'Cost of the proposed purchase in Singapore cents, not dollars.' },
        },
        required: ['amountCents'],
        additionalProperties: false,
      },
    },
  },
] as const

export type FinancialToolName =
  | 'get_financial_overview'
  | 'get_budget_status'
  | 'get_upcoming_bills'
  | 'get_savings_goals'
  | 'assess_planned_purchase'

export function runFinancialTool(snapshot: CfoSnapshot, name: string, args: unknown): object {
  if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('Invalid tool arguments')
  const raw = args as Record<string, unknown>
  switch (name as FinancialToolName) {
    case 'get_financial_overview':
      return {
        date: snapshot.date, currency: snapshot.currency, accountsRecorded: snapshot.accountsRecorded,
        availableCashCents: snapshot.availableCashCents, assetsCents: snapshot.assetsCents,
        liabilitiesCents: snapshot.liabilitiesCents, netWorthCents: snapshot.netWorthCents,
        currentMonth: snapshot.currentMonth, monthlyIncomeCents: snapshot.monthlyIncomeCents,
        monthlyExpenseCents: snapshot.monthlyExpenseCents,
        valuations: snapshot.valuations,
        caveat: 'Net worth uses manually entered, possibly stale asset values. Recorded cash may not include untracked obligations.',
      }
    case 'get_budget_status':
      return { month: snapshot.currentMonth, budgets: snapshot.budgets }
    case 'get_upcoming_bills':
      return {
        month: snapshot.currentMonth, bills: snapshot.unpaidBills,
        unpaidBillsTotalCents: snapshot.upcomingBillsCents,
        availableCashCents: snapshot.availableCashCents,
        cashAfterBillsCents: snapshot.cashAfterBillsCents,
        caveat: 'Does not forecast salary, daily spending, or future months. Marking a bill paid only changes a reminder.',
      }
    case 'get_savings_goals':
      return { date: snapshot.date, goals: snapshot.goals, guidance: 'Goal savings are user-recorded planning figures; do not add to net worth again.' }
    case 'assess_planned_purchase': {
      const amountCents = raw.amountCents
      if (!Number.isSafeInteger(amountCents) || typeof amountCents !== 'number' || amountCents < 1 || amountCents > 100000000000) {
        throw new Error('amountCents must be a positive safe integer')
      }
      return {
        hypotheticalPurchaseCents: amountCents,
        recordedCashCents: snapshot.availableCashCents,
        unpaidCurrentMonthBillsCents: snapshot.upcomingBillsCents,
        remainingAfterPurchaseAndBillsCents: snapshot.cashAfterBillsCents - amountCents,
        currency: snapshot.currency,
        caveat: 'This is only a current-month static subtraction from recorded cash, not a prediction or recommendation that a purchase is affordable.',
      }
    }
    default:
      throw new Error('Unknown or forbidden financial tool')
  }
}
