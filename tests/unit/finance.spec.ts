import { describe, expect, it } from 'vitest'
import { accountBalances, monthlyBudgetStatus, netWorth } from '../../app/services/finance/calculations.js'
import type { Account, Transaction } from '../../app/services/finance/types.js'

const accounts: Account[] = [
  { id: 'bank', name: 'Bank', kind: 'asset', currency: 'SGD', openingBalanceCents: 100_000 },
  { id: 'savings', name: 'Savings', kind: 'asset', currency: 'SGD', openingBalanceCents: 50_000 },
  { id: 'loan', name: 'Loan', kind: 'liability', currency: 'SGD', openingBalanceCents: 30_000 },
]
const entry = (rest: Omit<Transaction, 'id' | 'date'>, id = 't1'): Transaction => ({ id, date: '2026-10-23', ...rest })

describe('finance calculations', () => {
  it('transfers between owned accounts do not change net worth', () => {
    const tx = [entry({ kind: 'transfer', amountCents: 20_000, accountId: 'bank', destinationAccountId: 'savings' })]
    expect(accountBalances(accounts, tx)).toEqual({ bank: 80_000, savings: 70_000, loan: 30_000 })
    expect(netWorth(accounts, tx, []).netWorthCents).toBe(120_000)
  })

  it('loan principal repayment lowers both cash and liability without changing net worth', () => {
    const tx = [entry({ kind: 'transfer', amountCents: 10_000, accountId: 'bank', destinationAccountId: 'loan' })]
    expect(netWorth(accounts, tx, [])).toEqual({ assetsCents: 140_000, liabilitiesCents: 20_000, netWorthCents: 120_000 })
  })

  it('expense reduces net worth and uses category budget', () => {
    const tx = [entry({ kind: 'expense', amountCents: 42_500, accountId: 'bank', categoryId: 'dining' })]
    expect(netWorth(accounts, tx, []).netWorthCents).toBe(77_500)
    expect(monthlyBudgetStatus([{ id:'b1', month:'2026-10', categoryId:'dining', limitCents:50_000 }], tx, '2026-10')[0]).toMatchObject({ spentCents:42_500, remainingCents:7_500, percentUsed:85 })
  })

  it('manual property valuation is added only when not already represented by an account', () => {
    expect(netWorth(accounts, [], [{ id:'property', label:'Property', kind:'asset', valueCents:50_000, currency:'SGD', asOf:'2026-10-01' }]).netWorthCents).toBe(170_000)
  })

  it('rejects invalid amounts and unknown accounts', () => {
    expect(() => accountBalances(accounts, [entry({ kind:'expense', amountCents:1.5, accountId:'bank' })])).toThrow()
    expect(() => accountBalances(accounts, [entry({ kind:'expense', amountCents:10, accountId:'missing' })])).toThrow()
  })
})
