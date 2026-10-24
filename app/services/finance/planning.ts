/** Pure financial planning rules; these never write transactions or execute payments. */
export interface MonthlyCommitment {
  id: string
  name: string
  amountCents: number
  dueDay: number // 1..28
  lastPaidMonth?: string | null
}

export interface SavingsGoal {
  id: string
  name: string
  targetCents: number
  savedCents: number
  targetDate: string
}

export interface FinancialInsight {
  code: string
  severity: 'notice' | 'warning'
  title: string
  detail: string
}

const assertCents = (value: number, label: string) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${label}`)
}
const assertDate = (value: string) => {
  const date = new Date(value + 'T00:00:00Z')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('Expected valid YYYY-MM-DD date')
  }
}

export function financialPlan(params: {
  today: string
  availableCashCents: number
  commitments: MonthlyCommitment[]
  goals: SavingsGoal[]
  budgets: { categoryName: string; remainingCents: number; percentUsed: number }[]
}): { upcoming: (MonthlyCommitment & { dueOn: string })[]; upcomingTotalCents: number; cashAfterUpcomingCents: number; insights: FinancialInsight[] } {
  const { today, commitments, goals, budgets, availableCashCents } = params
  assertDate(today)
  if (!Number.isSafeInteger(availableCashCents)) throw new Error('Invalid cash amount')
  const month = today.slice(0, 7)
  const day = Number(today.slice(8, 10))
  const upcoming = commitments.flatMap((commitment) => {
    assertCents(commitment.amountCents, 'commitment amount')
    if (!Number.isInteger(commitment.dueDay) || commitment.dueDay < 1 || commitment.dueDay > 28) {
      throw new Error('Due day must be from 1 to 28')
    }
    if (commitment.lastPaidMonth === month) return []
    return [{ ...commitment, dueOn: `${month}-${String(commitment.dueDay).padStart(2, '0')}` }]
  }).sort((a, b) => a.dueOn.localeCompare(b.dueOn))
  const upcomingTotalCents = upcoming.reduce((sum, c) => sum + c.amountCents, 0)
  if (!Number.isSafeInteger(upcomingTotalCents)) throw new Error('Upcoming total exceeds safe integer')
  const cashAfterUpcomingCents = availableCashCents - upcomingTotalCents
  const insights: FinancialInsight[] = []
  const overdue = upcoming.filter(c => c.dueDay < day)
  if (overdue.length) {
    insights.push({
      code: 'past_due_bills',
      severity: 'warning',
      title: 'Check unpaid bills from earlier this month',
      detail: `${overdue.length} monthly commitment(s) have passed their scheduled due day without being marked paid. Confirm whether they were settled.`,
    })
  }

  if (upcomingTotalCents > 0 && cashAfterUpcomingCents < 0) {
    insights.push({
      code: 'cash_shortfall', severity: 'warning', title: 'Upcoming bills may exceed your recorded cash',
      detail: `Upcoming unpaid commitments total S$${(upcomingTotalCents / 100).toFixed(2)}; your recorded cash would be S$${(cashAfterUpcomingCents / 100).toFixed(2)} after those bills. Review your payments and balances.`,
    })
  }
  for (const budget of budgets) {
    if (budget.percentUsed >= 80 && budget.remainingCents >= 0) {
      insights.push({
        code: 'budget_' + budget.categoryName, severity: 'notice', title: `${budget.categoryName} budget approaching its limit`,
        detail: `You've used ${Math.round(budget.percentUsed)}% of this month's ${budget.categoryName} budget. You have S$${(budget.remainingCents / 100).toFixed(2)} remaining.`,
      })
    } else if (budget.remainingCents < 0) {
      insights.push({
        code: 'overbudget_' + budget.categoryName, severity: 'warning', title: `${budget.categoryName} budget exceeded`,
        detail: `Spending is S$${(-budget.remainingCents / 100).toFixed(2)} above your planned monthly limit. Consider adjusting upcoming discretionary purchases.`,
      })
    }
  }
  for (const goal of goals) {
    assertCents(goal.targetCents, 'goal target')
    assertCents(goal.savedCents, 'goal progress')
    assertDate(goal.targetDate)
    if (goal.savedCents >= goal.targetCents) continue
    if (goal.targetDate < today) {
      insights.push({
        code: 'goal_overdue_' + goal.id, severity: 'notice', title: `Review your ${goal.name} goal`,
        detail: 'The target date has passed and the recorded saved amount is below your goal. Consider revising the target or contributions.',
      })
    }
  }
  return { upcoming, upcomingTotalCents, cashAfterUpcomingCents, insights }
}
