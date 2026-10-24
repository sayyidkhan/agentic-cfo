import { test } from '@japa/runner'
import { accountBalances, monthlyBudgetStatus, netWorth } from '../../app/services/finance/calculations.js'
import type { Account, Transaction } from '../../app/services/finance/types.js'

const accounts: Account[] = [
  { id: 'bank', name: 'Bank', kind: 'asset', currency: 'SGD', openingBalanceCents: 100_000 },
  { id: 'savings', name: 'Savings', kind: 'asset', currency: 'SGD', openingBalanceCents: 50_000 },
  { id: 'loan', name: 'Loan', kind: 'liability', currency: 'SGD', openingBalanceCents: 30_000 },
]
const entry = (rest: Omit<Transaction, 'id' | 'date'>, id = 't1'): Transaction => ({
  id, date: '2026-10-23', ...rest,
})

test.group('financial calculations', () => {
  test('transfers between owned accounts do not change net worth', ({ assert }) => {
    const tx = [entry({ kind: 'transfer', amountCents: 20_000, accountId: 'bank', destinationAccountId: 'savings' })]
    assert.deepEqual(accountBalances(accounts, tx), { bank: 80_000, savings: 70_000, loan: 30_000 })
    assert.equal(netWorth(accounts, tx, []).netWorthCents, 120_000)
  })

  test('loan principal repayment reduces cash and liability equally', ({ assert }) => {
    const tx = [entry({ kind: 'transfer', amountCents: 10_000, accountId: 'bank', destinationAccountId: 'loan' })]
    assert.deepEqual(netWorth(accounts, tx, []), {
      assetsCents: 140_000, liabilitiesCents: 20_000, netWorthCents: 120_000,
    })
  })

  test('spending decreases net worth and consumes budget', ({ assert }) => {
    const tx = [entry({ kind: 'expense', amountCents: 42_500, accountId: 'bank', categoryId: 'dining' })]
    assert.equal(netWorth(accounts, tx, []).netWorthCents, 77_500)
    const budget = monthlyBudgetStatus(
      [{ id: 'b1', month: '2026-10', categoryId: 'dining', limitCents: 50_000 }],
      tx, '2026-10'
    )[0]
    assert.equal(budget.spentCents, 42_500)
    assert.equal(budget.remainingCents, 7_500)
    assert.equal(budget.percentUsed, 85)
  })

  test('manual valuation is added to net worth', ({ assert }) => {
    const result = netWorth(accounts, [], [
      { id: 'property', label: 'Property', kind: 'asset', valueCents: 50_000, currency: 'SGD', asOf: '2026-10-01' },
    ])
    assert.equal(result.netWorthCents, 170_000)
  })

  test('invalid amounts and unknown accounts are rejected', ({ assert }) => {
    assert.throws(() => accountBalances(accounts, [entry({ kind: 'expense', amountCents: 1.5, accountId: 'bank' })]))
    assert.throws(() => accountBalances(accounts, [entry({ kind: 'expense', amountCents: 10, accountId: 'missing' })]))
    assert.throws(() => accountBalances(accounts, [{...entry({kind:'expense',amountCents:10,accountId:'bank'}), date:'2026-02-31'}]))
  })
})
