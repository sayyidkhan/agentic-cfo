import db from '@adonisjs/lucid/services/db'
import { accountBalances, monthlyBudgetStatus, netWorth } from '#services/finance/calculations'
import { financialPlan } from '#services/finance/planning'
import type { Account, Budget, Transaction, Valuation } from '#services/finance/types'
import type { CfoSnapshot } from './types.js'

/** Time-zone consistent local calendar day for the POC's SGD budgeting rules. */
export function financialToday(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

/**
 * This is the only route from conversational tools into the financial DB.
 * Never accept user IDs, table names, SQL, or row selectors from model output.
 */
export async function loadCfoSnapshot(userId: number): Promise<CfoSnapshot> {
  const [accountRows, transactionRows, categoryRows, budgetRows, valuationRows, commitmentRows, goalRows] =
    await Promise.all([
      db.from('financial_accounts').where('user_id', userId).orderBy('id'),
      db.from('financial_transactions').where('user_id', userId).orderBy('booked_on').orderBy('id'),
      db.from('financial_categories').where('user_id', userId),
      db.from('financial_budgets').where('user_id', userId),
      db.from('financial_valuations').where('user_id', userId),
      db.from('financial_commitments').where('user_id', userId),
      db.from('financial_goals').where('user_id', userId),
    ])

  const accounts: Account[] = accountRows.map(a => ({
    id: String(a.id), name: a.name, kind: a.kind, currency: 'SGD',
    openingBalanceCents: Number(a.opening_balance_cents),
  }))
  const transactions: Transaction[] = transactionRows.map(t => ({
    id: String(t.id), date: t.booked_on, kind: t.kind,
    amountCents: Number(t.amount_cents),
    accountId: String(t.account_id),
    destinationAccountId: t.destination_account_id == null ? undefined : String(t.destination_account_id),
    categoryId: t.category_id == null ? undefined : String(t.category_id),
  }))
  const valuations: Valuation[] = valuationRows.map(v => ({
    id: String(v.id), label: v.name, kind: v.kind, currency: 'SGD',
    valueCents: Number(v.value_cents), asOf: v.as_of,
  }))
  const budgets: Budget[] = budgetRows.map(b => ({
    id: String(b.id), categoryId: String(b.category_id),
    month: b.month, limitCents: Number(b.limit_cents),
  }))

  const date = financialToday()
  const currentMonth = date.slice(0, 7)
  const balances = accountBalances(accounts, transactions)
  const availableCashCents = accounts
    .filter(a => a.kind === 'asset')
    .reduce((sum, a) => sum + balances[a.id], 0)
  const wealth = netWorth(accounts, transactions, valuations)
  const categories = new Map(categoryRows.map(c => [String(c.id), c.name]))
  const budgetStatus = monthlyBudgetStatus(budgets, transactions, currentMonth)
  const namedBudgets = budgetStatus.map(b => ({
    category: categories.get(b.categoryId) ?? 'Uncategorised',
    limitCents: b.limitCents, spentCents: b.spentCents,
    remainingCents: b.remainingCents, percentUsed: b.percentUsed,
  }))
  const commitments = commitmentRows.map(c => ({
    id: String(c.id), name: c.name, amountCents: Number(c.amount_cents),
    dueDay: Number(c.due_day), lastPaidMonth: c.last_paid_month,
  }))
  const goals = goalRows.map(g => ({
    id: String(g.id), name: g.name,
    targetCents: Number(g.target_cents), savedCents: Number(g.saved_cents),
    targetDate: g.target_date,
  }))
  const plan = financialPlan({
    today: date, availableCashCents, commitments, goals,
    budgets: namedBudgets.map(b => ({
      categoryName: b.category, remainingCents: b.remainingCents, percentUsed: b.percentUsed,
    })),
  })
  const monthly = transactions.filter(t => t.date.startsWith(currentMonth))
  return {
    date, currency: 'SGD', accountsRecorded: accounts.length,
    availableCashCents, assetsCents: wealth.assetsCents, liabilitiesCents: wealth.liabilitiesCents,
    netWorthCents: wealth.netWorthCents, currentMonth,
    monthlyIncomeCents: monthly.filter(t => t.kind === 'income').reduce((s, t) => s + t.amountCents, 0),
    monthlyExpenseCents: monthly.filter(t => t.kind === 'expense').reduce((s, t) => s + t.amountCents, 0),
    budgets: namedBudgets,
    unpaidBills: plan.upcoming.map(b => ({
      name: b.name, amountCents: b.amountCents, dueOn: b.dueOn,
      isOverdue: b.dueOn < date,
    })),
    upcomingBillsCents: plan.upcomingTotalCents,
    cashAfterBillsCents: plan.cashAfterUpcomingCents,
    goals: goals.map(g => ({
      name: g.name, savedCents: g.savedCents, targetCents: g.targetCents,
      targetDate: g.targetDate,
    })),
    valuations: valuations.map(v => ({
      label: v.label, kind: v.kind, valueCents: v.valueCents, asOf: v.asOf,
    })),
    insights: plan.insights,
  }
}
