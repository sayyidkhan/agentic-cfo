import { test } from '@japa/runner'
import { financialPlan } from '../../app/services/finance/planning.js'

test.group('financial planning', () => {
  test('tracks upcoming unpaid bills without posting transactions', ({ assert }) => {
    const result = financialPlan({
      today: '2026-10-24', availableCashCents: 30_000,
      commitments: [
        { id: 'rent', name: 'Rent', amountCents: 25_000, dueDay: 28 },
        { id: 'gym', name: 'Gym', amountCents: 8_000, dueDay: 26, lastPaidMonth: '2026-10' },
        { id: 'phone', name: 'Phone', amountCents: 1_000, dueDay: 5 },
      ],
      budgets: [], goals: [],
    })
    assert.equal(result.upcoming.length, 1)
    assert.equal(result.upcomingTotalCents, 25_000)
    assert.equal(result.cashAfterUpcomingCents, 5_000)
    assert.lengthOf(result.insights, 0)
  })

  test('alerts for projected shortfall and budget pressure', ({ assert }) => {
    const result = financialPlan({
      today: '2026-10-24', availableCashCents: 10_000,
      commitments: [{ id: 'rent', name: 'Rent', amountCents: 15_000, dueDay: 28 }],
      budgets: [{ categoryName: 'Dining', percentUsed: 85, remainingCents: 7_500 }],
      goals: [],
    })
    assert.equal(result.cashAfterUpcomingCents, -5_000)
    assert.deepEqual(result.insights.map(i => i.code), ['cash_shortfall', 'budget_Dining'])
  })

  test('flags overdue savings goal, not completed goals', ({ assert }) => {
    const result = financialPlan({
      today: '2026-10-24', availableCashCents: 0, commitments: [], budgets: [],
      goals: [
        { id: '1', name: 'Emergency fund', targetCents: 100_000, savedCents: 10_000, targetDate: '2026-10-01' },
        { id: '2', name: 'Holiday', targetCents: 20_000, savedCents: 20_000, targetDate: '2026-10-01' },
      ],
    })
    assert.deepEqual(result.insights.map(i => i.code), ['goal_overdue_1'])
  })

  test('rejects unrealistic due day and invalid date', ({ assert }) => {
    assert.throws(() => financialPlan({
      today: '2026-10-24', availableCashCents: 0,
      commitments: [{id:'a', name:'Bill', amountCents:100, dueDay:31}], budgets:[], goals:[],
    }))
    assert.throws(() => financialPlan({today:'2026-02-31', availableCashCents:0, commitments:[], budgets:[], goals:[]}))
  })
})
