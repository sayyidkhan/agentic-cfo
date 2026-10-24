import vine from '@vinejs/vine'

const amount = vine.string().trim().regex(/^(0|[1-9]\d{0,11})(?:\.\d{1,2})?$/)
const date = vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const createAccountValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120),
  kind: vine.enum(['asset', 'liability']),
  openingBalance: amount,
})

export const createCategoryValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(80),
})

export const createTransactionValidator = vine.create({
  kind: vine.enum(['income', 'expense', 'transfer']),
  bookedOn: date,
  amount,
  accountId: vine.number(),
  destinationAccountId: vine.number().optional(),
  categoryId: vine.number().optional(),
  note: vine.string().trim().maxLength(255).optional(),
})

export const upsertBudgetValidator = vine.create({
  month: vine.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  categoryId: vine.number(),
  limit: amount,
})

export const createValuationValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120),
  kind: vine.enum(['asset', 'liability']),
  value: amount,
  asOf: date,
})
