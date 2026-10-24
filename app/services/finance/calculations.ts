import type { Account, Budget, Money, Transaction, Valuation } from './types.js'

const assertCents = (value: Money, name: string) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative safe integer of cents`)
}
const assertDate = (date: string) => {
  const parsed = new Date(date + 'T00:00:00Z')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('Transaction date must be YYYY-MM-DD')
  }
}
const validateAccounts = (accounts: Account[]) => {
  const ids = new Set<string>()
  for (const account of accounts) {
    if (ids.has(account.id)) throw new Error('Duplicate account ID')
    ids.add(account.id)
    if (account.currency !== 'SGD') throw new Error('V1 supports SGD accounts only')
    assertCents(account.openingBalanceCents, 'Account opening balance')
  }
  return new Map(accounts.map(account => [account.id, account]))
}

export function accountBalances(accounts: Account[], transactions: Transaction[]): Record<string, Money> {
  const byId = validateAccounts(accounts)
  const balances = Object.fromEntries(accounts.map(a => [a.id, a.openingBalanceCents])) as Record<string, Money>
  const used = new Set<string>()

  for (const tx of transactions) {
    if (used.has(tx.id)) throw new Error('Duplicate transaction ID')
    used.add(tx.id)
    assertDate(tx.date)
    assertCents(tx.amountCents, 'Transaction amount')
    if (tx.amountCents === 0) throw new Error('Transaction amount must be positive')
    const origin = byId.get(tx.accountId)
    if (!origin) throw new Error('Unknown transaction account')
    if (tx.kind === 'income') {
      if (origin.kind !== 'asset') throw new Error('Income requires an asset account')
      balances[origin.id] += tx.amountCents
    } else if (tx.kind === 'expense') {
      if (origin.kind !== 'asset') throw new Error('Expense requires an asset account')
      if (tx.principalCents !== undefined) {
        throw new Error('Loan payments must be modelled as transfers for principal and separate expenses for interest')
      }
      balances[origin.id] -= tx.amountCents
    } else if (tx.kind === 'transfer') {
      const dest = tx.destinationAccountId && byId.get(tx.destinationAccountId)
      if (!dest || dest.id === origin.id) throw new Error('Transfer requires a different existing destination account')
      if (origin.kind !== 'asset') throw new Error('Transfers must start from an asset account')
      balances[origin.id] -= tx.amountCents
      if (dest.kind === 'asset') {
        balances[dest.id] += tx.amountCents
      } else {
        // Liability principal repayment reduces the amount owed.
        balances[dest.id] -= tx.amountCents
        if (balances[dest.id] < 0) throw new Error('Loan principal payment exceeds recorded amount owed')
      }
    } else {
      throw new Error('Unknown transaction kind')
    }
  }
  for (const amount of Object.values(balances)) {
    if (!Number.isSafeInteger(amount)) throw new Error('Balance exceeds safe integer range')
  }
  return balances
}

export function monthlyBudgetStatus(budgets: Budget[], transactions: Transaction[], month: string) {
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error('Month must be YYYY-MM')
  return budgets.filter(b => b.month === month).map(b => {
    assertCents(b.limitCents, 'Budget limit')
    const spentCents = transactions
      .filter(t => t.kind === 'expense' && t.categoryId === b.categoryId && t.date.slice(0, 7) === month)
      .reduce((sum, t) => { assertCents(t.amountCents, 'Transaction amount'); return sum + t.amountCents }, 0)
    return { ...b, spentCents, remainingCents: b.limitCents - spentCents, percentUsed: b.limitCents === 0 ? (spentCents ? 100 : 0) : spentCents * 100 / b.limitCents }
  })
}

export function netWorth(accounts: Account[], transactions: Transaction[], valuations: Valuation[]) {
  const balances = accountBalances(accounts, transactions)
  let assetsCents = 0
  let liabilitiesCents = 0
  for (const account of accounts) {
    if (account.kind === 'asset') assetsCents += balances[account.id]
    else liabilitiesCents += balances[account.id]
  }
  for (const value of valuations) {
    if (value.currency !== 'SGD') throw new Error('V1 supports SGD valuations only')
    assertCents(value.valueCents, 'Valuation')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.asOf)) throw new Error('Valuation must have an as-of date')
    if (value.kind === 'asset') assetsCents += value.valueCents
    else liabilitiesCents += value.valueCents
  }
  if (![assetsCents, liabilitiesCents].every(Number.isSafeInteger)) throw new Error('Net worth exceeds safe integer range')
  return { assetsCents, liabilitiesCents, netWorthCents: assetsCents - liabilitiesCents }
}
