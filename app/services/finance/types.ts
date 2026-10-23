/** Domain types for the portable Agentic CFO finance engine. Monetary amounts are integer minor units (SGD cents in V1). */
export type Money = number
export type AccountKind = 'asset' | 'liability'
export type TransactionKind = 'income' | 'expense' | 'transfer'

export interface Account {
  id: string
  name: string
  kind: AccountKind
  /** Starting recorded balance; positive numbers only for liabilities (amount owed). */
  openingBalanceCents: Money
  currency: 'SGD'
}

export interface Transaction {
  id: string
  date: string // ISO YYYY-MM-DD, local financial date
  kind: TransactionKind
  amountCents: Money // always positive
  accountId: string
  /** Transfers must include destination account ID. */
  destinationAccountId?: string
  categoryId?: string
  /** For a liability payment, how much of the transaction reduces principal. */
  principalCents?: Money
}

export interface Budget {
  id: string
  month: string // ISO YYYY-MM
  categoryId: string
  limitCents: Money
}

export interface Valuation {
  id: string
  /** Property or other manually valued items NOT already represented as accounts. */
  label: string
  kind: AccountKind
  valueCents: Money
  asOf: string
  currency: 'SGD'
}
