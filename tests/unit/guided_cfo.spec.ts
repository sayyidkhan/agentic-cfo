import { test } from '@japa/runner'
import { guidedCfoReply } from '../../app/services/cfo/guided_coach.js'
import type { CfoSnapshot } from '../../app/services/cfo/types.js'

const user: CfoSnapshot = {
  date: '2026-10-24', currency: 'SGD', accountsRecorded: 1,
  availableCashCents: 100_000, assetsCents: 500_000, liabilitiesCents: 50_000,
  netWorthCents: 450_000, currentMonth: '2026-10',
  monthlyIncomeCents: 200_000, monthlyExpenseCents: 40_000,
  budgets: [{category:'Dining',limitCents:50_000,spentCents:42_500,remainingCents:7_500,percentUsed:85}],
  unpaidBills: [{name:'Rent',amountCents:20_000,dueOn:'2026-10-27',isOverdue:false}],
  upcomingBillsCents:20_000,cashAfterBillsCents:80_000,
  goals:[{name:'Emergency fund',savedCents:30_000,targetCents:120_000,targetDate:'2027-01-01'}],
  valuations:[], insights:[],
}

test.group('guided financial coach', () => {
  test('answers a hypothetical purchase without pretending it is a forecast', ({ assert }) => {
    const output = guidedCfoReply('Can I afford a S$300 purchase?', user)
    assert.include(output, 'S$500.00')
    assert.include(output, 'not a future-month affordability forecast')
  })
  test('uses category budgets from computed records', ({ assert }) => {
    const output = guidedCfoReply('How is my dining budget?', user)
    assert.include(output, 'S$425.00')
    assert.include(output, '85%')
  })
  test('does not add savings goals to wealth balances', ({ assert }) => {
    const output = guidedCfoReply('How are my savings goals?', user)
    assert.include(output, 'S$300.00')
    assert.include(output, 'not be counted as extra net worth')
  })
  test('prompts onboarding when no recorded money exists', ({ assert }) => {
    const output = guidedCfoReply('What is my net worth?', {
      ...user, accountsRecorded: 0, valuations: [],
    })
    assert.include(output, 'do not have any financial accounts')
  })
  test('returns tool-backed cash, not a guessed figure', ({ assert }) => {
    const output = guidedCfoReply('What is my bank balance?', user)
    assert.include(output, 'S$1,000.00')
  })
})
