import type { CfoSnapshot } from './types.js'
import { runFinancialTool } from './financial_tools.js'
import { parseSgdAmount, formatSgd } from '#services/finance/money'

const money = formatSgd

/**
 * Credential-free guided POC. This is NOT an LLM and must not be presented as one.
 * Uses the same read-only, audited tools as the optional AI integration.
 */
export function guidedCfoReply(question: string, snapshot: CfoSnapshot): string {
  const query = question.trim().toLowerCase()
  if (!snapshot.accountsRecorded && !snapshot.valuations.length) {
    return 'I do not have any financial accounts or valuations recorded yet. Add your first bank or cash balance in Wealth, then enter spending and budgets. These records are the foundation of meaningful guidance.'
  }

  if (/afford|buy|purchase|spend s\$|can i spend/.test(query)) {
    const match = question.match(/(?:s\$|sgd\s*|\$)\s*([0-9]+(?:\.[0-9]{1,2})?)/i)
    if (!match) return 'Tell me the price in SGD, for example: “Can I spend S$300 this month?” I can show a simple cash-after-bills scenario, not guarantee affordability.'
    try {
      const amountCents = parseSgdAmount(match[1])
      if (amountCents === 0) return 'Enter a positive purchase amount to evaluate.'
      const result = runFinancialTool(snapshot, 'assess_planned_purchase', { amountCents }) as {
        remainingAfterPurchaseAndBillsCents: number
        recordedCashCents: number
        unpaidCurrentMonthBillsCents: number
      }
      return `For a hypothetical ${money(amountCents)} purchase this month, your recorded cash of ${money(result.recordedCashCents)}, after ${money(result.unpaidCurrentMonthBillsCents)} in known unpaid bills and that purchase, would be ${money(result.remainingAfterPurchaseAndBillsCents)}. This is not a future-month affordability forecast; untracked expenses and savings commitments may change the outcome.`
    } catch {
      return 'That amount could not be evaluated. Use a positive SGD value with at most two decimal places.'
    }
  }

  if (/bill|commitment|due|payment|rent|insurance/.test(query)) {
    const data = runFinancialTool(snapshot, 'get_upcoming_bills', {}) as {
      bills: { name: string; amountCents: number; dueOn: string }[]
      unpaidBillsTotalCents: number
      cashAfterBillsCents: number
    }
    if (!data.bills.length) return 'You have no unpaid monthly commitments recorded for the remainder of this month. This does not mean there are no bills—add your recurring commitments under Budgets & Goals.'
    const detail = data.bills.slice(0, 4).map(b => `${b.name} ${money(b.amountCents)} (due ${b.dueOn})`).join('; ')
    return `Your recorded unpaid commitments this month total ${money(data.unpaidBillsTotalCents)}: ${detail}. Your recorded cash would be ${money(data.cashAfterBillsCents)} after those bills, before untracked purchases or income. Check that bills are marked paid when settled.`
  }

  if (/budget|expense|overspend|dining|category|spending/.test(query)) {
    const data = runFinancialTool(snapshot, 'get_budget_status', {}) as {
      budgets: { category: string; limitCents: number; spentCents: number; remainingCents: number; percentUsed: number }[]
    }
    if (!data.budgets.length) return 'You have not set any category budgets for this month. Add a category and monthly limit under Budgets & Goals, then I can help review how closely you are following your plan.'
    const specific = data.budgets.find(b => query.includes(b.category.toLowerCase()))
    const budgets = specific ? [specific] : [...data.budgets].sort((a, b) => b.percentUsed - a.percentUsed).slice(0, 3)
    return budgets.map(b =>
      `${b.category}: ${money(b.spentCents)} of ${money(b.limitCents)} used (${Math.round(b.percentUsed)}%), ${money(b.remainingCents)} remaining.`
    ).join(' ') + ' Consider limiting discretionary purchases in any category nearing or exceeding its limit.'
  }

  if (/goal|saving|fund|target/.test(query)) {
    const data = runFinancialTool(snapshot, 'get_savings_goals', {}) as {
      goals: { name: string; savedCents: number; targetCents: number; targetDate: string }[]
    }
    if (!data.goals.length) return 'You have not recorded a savings goal yet. Add an amount and target date under Budgets & Goals, and revisit it regularly.'
    return data.goals.slice(0, 4).map(g =>
      `${g.name}: ${money(g.savedCents)} saved toward ${money(g.targetCents)}, target date ${g.targetDate}.`
    ).join(' ') + ' These are manually recorded goals; saved amounts should not be counted as extra net worth.'
  }

  if (/net worth|wealth|assets|liabilit|debt/.test(query)) {
    const data = runFinancialTool(snapshot, 'get_financial_overview', {}) as {
      assetsCents: number; liabilitiesCents: number; netWorthCents: number
    }
    return `Your recorded estimated net worth is ${money(data.netWorthCents)}: assets of ${money(data.assetsCents)} less liabilities of ${money(data.liabilitiesCents)}. Property and other valuations may be outdated; review their as-of dates in Wealth.`
  }

  if (/cash|balance|money|income|financial position/.test(query)) {
    const data = runFinancialTool(snapshot, 'get_financial_overview', {}) as {
      availableCashCents: number; monthlyIncomeCents: number; monthlyExpenseCents: number
    }
    return `You have ${money(data.availableCashCents)} in recorded bank/cash accounts. This month you've recorded ${money(data.monthlyIncomeCents)} in income and ${money(data.monthlyExpenseCents)} in expenses. Recorded cash is not the same as disposable money after all commitments.`
  }

  return 'In guided mode I can explain your recorded cash, net worth, monthly budgets, unpaid bills and savings goals, or estimate the effect of an S$ purchase this month. Try one of those questions. Configure a compatible AI model for open-ended conversations.'
}
