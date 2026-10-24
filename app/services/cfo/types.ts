import type { FinancialInsight } from '#services/finance/planning'

export interface CfoSnapshot {
  date: string
  currency: 'SGD'
  accountsRecorded: number
  availableCashCents: number
  assetsCents: number
  liabilitiesCents: number
  netWorthCents: number
  currentMonth: string
  monthlyIncomeCents: number
  monthlyExpenseCents: number
  budgets: {
    category: string
    limitCents: number
    spentCents: number
    remainingCents: number
    percentUsed: number
  }[]
  /** Includes previous due dates this month if not marked paid. */
  unpaidBills: {
    name: string
    amountCents: number
    dueOn: string
    isOverdue: boolean
  }[]
  upcomingBillsCents: number
  cashAfterBillsCents: number
  goals: {
    name: string
    savedCents: number
    targetCents: number
    targetDate: string
  }[]
  valuations: { label: string; kind: 'asset' | 'liability'; valueCents: number; asOf: string }[]
  insights: FinancialInsight[]
}

export interface ReadOnlyToolCall {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

export interface ModelResponse {
  role: 'assistant'
  content: string | null
  tool_calls?: ReadOnlyToolCall[]
}
