import { test } from '@japa/runner'
import { runFinancialTool } from '../../app/services/cfo/financial_tools.js'
import type { CfoSnapshot } from '../../app/services/cfo/types.js'

const snapshot: CfoSnapshot = {
  date: '2026-10-24', currency: 'SGD', accountsRecorded: 1,
  availableCashCents: 100_000, assetsCents: 150_000, liabilitiesCents: 20_000,
  netWorthCents: 130_000, currentMonth: '2026-10',
  monthlyIncomeCents: 100_000, monthlyExpenseCents: 35_000,
  budgets: [{ category: 'Dining', limitCents: 50_000, spentCents: 42_500, remainingCents: 7_500, percentUsed: 85 }],
  unpaidBills: [{ name: 'Rent', amountCents: 20_000, dueOn: '2026-10-28', isOverdue: false }],
  upcomingBillsCents: 20_000, cashAfterBillsCents: 80_000,
  goals: [{ name: 'Emergency fund', savedCents: 30_000, targetCents: 120_000, targetDate: '2027-01-01' }],
  valuations: [{ label: 'CPF', kind: 'asset', valueCents: 50_000, asOf: '2026-10-01' }], insights: [],
}

test.group('read-only CFO tools', () => {
  test('returns verified budget values, without mutating source', ({ assert }) => {
    const answer = runFinancialTool(snapshot, 'get_budget_status', {})
    assert.deepEqual(answer, { month: '2026-10', budgets: snapshot.budgets })
    assert.equal(snapshot.budgets[0].spentCents, 42_500)
  })
  test('assesses a hypothetical purchase in integer cents', ({ assert }) => {
    const value = runFinancialTool(snapshot, 'assess_planned_purchase', { amountCents: 30_000 })
    assert.propertyVal(value, 'remainingAfterPurchaseAndBillsCents', 50_000)
  })
  test('rejects unknown operations or invalid model-generated arguments', ({ assert }) => {
    assert.throws(() => runFinancialTool(snapshot, 'delete_all_transactions', {}))
    assert.throws(() => runFinancialTool(snapshot, 'assess_planned_purchase', { amountCents: -10 }))
    assert.throws(() => runFinancialTool(snapshot, 'assess_planned_purchase', { amountCents: '10000' }))
    assert.throws(() => runFinancialTool(snapshot, 'get_financial_overview', null))
  })
})
