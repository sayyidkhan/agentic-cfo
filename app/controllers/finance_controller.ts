import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { netWorth, monthlyBudgetStatus } from '#services/finance/calculations'
import { parseSgdAmount } from '#services/finance/money'
import type { Account, Budget, Transaction, Valuation } from '#services/finance/types'
import {
  createAccountValidator,
  createCategoryValidator,
  createTransactionValidator,
  createValuationValidator,
  upsertBudgetValidator,
} from '#validators/finance'

const todayInSingapore = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

const isValidCalendarDate = (value: string) => {
  const d = new Date(value + 'T00:00:00Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export default class FinanceController {
  async index({ auth, inertia }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const [rawAccounts, categories, rawTransactions, rawBudgets, rawValuations] = await Promise.all([
      db.from('financial_accounts').where('user_id', userId).orderBy('id'),
      db.from('financial_categories').where('user_id', userId).orderBy('name'),
      db.from('financial_transactions').where('user_id', userId).orderBy('booked_on', 'desc').orderBy('id', 'desc'),
      db.from('financial_budgets').where('user_id', userId),
      db.from('financial_valuations').where('user_id', userId).orderBy('id', 'desc'),
    ])

    const accounts: Account[] = rawAccounts.map((a) => ({
      id: String(a.id),
      name: a.name,
      kind: a.kind,
      openingBalanceCents: Number(a.opening_balance_cents),
      currency: 'SGD',
    }))
    const transactions: Transaction[] = rawTransactions.map((t) => ({
      id: String(t.id),
      date: t.booked_on,
      kind: t.kind,
      amountCents: Number(t.amount_cents),
      accountId: String(t.account_id),
      destinationAccountId: t.destination_account_id ? String(t.destination_account_id) : undefined,
      categoryId: t.category_id ? String(t.category_id) : undefined,
    }))
    const budgets: Budget[] = rawBudgets.map((b) => ({
      id: String(b.id),
      month: b.month,
      categoryId: String(b.category_id),
      limitCents: Number(b.limit_cents),
    }))
    const valuations: Valuation[] = rawValuations.map((v) => ({
      id: String(v.id),
      label: v.name,
      kind: v.kind,
      valueCents: Number(v.value_cents),
      currency: 'SGD',
      asOf: v.as_of,
    }))
    const currentDate = todayInSingapore()
    const month = currentDate.slice(0, 7)
    const financialPosition = netWorth(accounts, transactions, valuations)
    const budgetStatus = monthlyBudgetStatus(budgets, transactions, month)
    const monthly = transactions.filter((t) => t.date.startsWith(month))
    const incomeCents = monthly.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amountCents, 0)
    const expenseCents = monthly.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amountCents, 0)

    return inertia.render('dashboard', {
      accounts: rawAccounts.map((a) => ({ id: a.id, name: a.name, kind: a.kind })),
      categories: categories.map((c) => ({ id: c.id, name: c.name })),
      recentTransactions: rawTransactions.slice(0, 20).map((t) => ({
        id: t.id, bookedOn: t.booked_on, kind: t.kind, amountCents: Number(t.amount_cents),
        note: t.note, categoryId: t.category_id,
      })),
      valuations: rawValuations.map((v) => ({
        id: v.id, name: v.name, kind: v.kind, valueCents: Number(v.value_cents), asOf: v.as_of,
      })),
      budgetStatus,
      financialPosition,
      currentDate,
      month,
      incomeCents,
      expenseCents,
    })
  }

  async storeAccount({ request, auth, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const input = await request.validateUsing(createAccountValidator)
    await db.table('financial_accounts').insert({
      user_id: userId,
      name: input.name,
      kind: input.kind,
      opening_balance_cents: parseSgdAmount(input.openingBalance),
      currency: 'SGD',
      created_at: new Date().toISOString(),
    })
    return response.redirect().toRoute('dashboard')
  }

  async storeCategory({ request, auth, response }: HttpContext) {
    const input = await request.validateUsing(createCategoryValidator)
    const userId = auth.getUserOrFail().id
    const exists = await db.from('financial_categories').where('user_id', userId).where('name', input.name).first()
    if (!exists) {
      await db.table('financial_categories').insert({ user_id: userId, name: input.name })
    }
    return response.redirect().toRoute('dashboard')
  }

  async storeTransaction({ request, auth, response }: HttpContext) {
    const input = await request.validateUsing(createTransactionValidator)
    const userId = auth.getUserOrFail().id
    const amountCents = parseSgdAmount(input.amount)
    if (amountCents === 0 || !isValidCalendarDate(input.bookedOn)) return response.badRequest('Invalid amount or date')

    const source = await db.from('financial_accounts').where('user_id', userId).where('id', input.accountId).first()
    if (!source || source.kind !== 'asset') return response.badRequest('Select an owned asset account')
    if (input.kind === 'transfer') {
      if (!input.destinationAccountId || input.destinationAccountId === input.accountId) {
        return response.badRequest('Transfers need a different destination account')
      }
      const destination = await db.from('financial_accounts')
        .where('user_id', userId).where('id', input.destinationAccountId).first()
      if (!destination) return response.badRequest('Unknown destination account')
      if (destination.kind === 'liability') {
        const rows = await db.from('financial_transactions').where('user_id', userId)
        // Repayment cannot exceed recorded principal. The dashboard also validates this rule.
        const opening = Number(destination.opening_balance_cents)
        const principalPaid = rows.filter((r) => r.kind === 'transfer' && r.destination_account_id === destination.id)
          .reduce((sum, r) => sum + Number(r.amount_cents), 0)
        if (principalPaid + amountCents > opening) return response.badRequest('Repayment exceeds outstanding principal')
      }
    }

    if (input.kind === 'expense' || input.categoryId) {
      if (!input.categoryId && input.kind === 'expense') return response.badRequest('Expenses need a category')
      if (input.categoryId) {
        const category = await db.from('financial_categories')
          .where('user_id', userId).where('id', input.categoryId).first()
        if (!category) return response.badRequest('Unknown category')
      }
    }

    await db.table('financial_transactions').insert({
      user_id: userId,
      kind: input.kind,
      booked_on: input.bookedOn,
      amount_cents: amountCents,
      account_id: input.accountId,
      destination_account_id: input.kind === 'transfer' ? input.destinationAccountId : null,
      category_id: input.kind !== 'transfer' ? input.categoryId ?? null : null,
      note: input.note ?? null,
      created_at: new Date().toISOString(),
    })
    return response.redirect().toRoute('dashboard')
  }

  async storeBudget({ request, auth, response }: HttpContext) {
    const input = await request.validateUsing(upsertBudgetValidator)
    const userId = auth.getUserOrFail().id
    const category = await db.from('financial_categories').where('user_id', userId).where('id', input.categoryId).first()
    if (!category) return response.badRequest('Unknown category')
    const limit = parseSgdAmount(input.limit)
    const found = await db.from('financial_budgets').where('user_id', userId)
      .where('category_id', input.categoryId).where('month', input.month).first()
    if (found) {
      await db.from('financial_budgets').where('id', found.id).where('user_id', userId).update({ limit_cents: limit })
    } else {
      await db.table('financial_budgets').insert({
        user_id: userId, category_id: input.categoryId, month: input.month, limit_cents: limit,
      })
    }
    return response.redirect().toRoute('dashboard')
  }

  async storeValuation({ request, auth, response }: HttpContext) {
    const input = await request.validateUsing(createValuationValidator)
    if (!isValidCalendarDate(input.asOf)) return response.badRequest('Invalid valuation date')
    await db.table('financial_valuations').insert({
      user_id: auth.getUserOrFail().id,
      name: input.name,
      kind: input.kind,
      value_cents: parseSgdAmount(input.value),
      as_of: input.asOf,
      created_at: new Date().toISOString(),
    })
    return response.redirect().toRoute('dashboard')
  }
}
