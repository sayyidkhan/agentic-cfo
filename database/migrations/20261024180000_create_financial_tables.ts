import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateFinancialTables extends BaseSchema {
  async up() {
    this.schema.createTable('financial_accounts', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.string('kind', 20).notNullable() // asset or liability
      table.bigInteger('opening_balance_cents').notNullable().defaultTo(0)
      table.string('currency', 3).notNullable().defaultTo('SGD')
      table.timestamp('created_at').notNullable()
      table.index(['user_id'])
    })

    this.schema.createTable('financial_categories', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 80).notNullable()
      table.unique(['user_id', 'name'])
    })

    this.schema.createTable('financial_transactions', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('account_id').notNullable().references('id').inTable('financial_accounts').onDelete('RESTRICT')
      table.integer('destination_account_id').nullable().references('id').inTable('financial_accounts').onDelete('RESTRICT')
      table.integer('category_id').nullable().references('id').inTable('financial_categories').onDelete('RESTRICT')
      table.string('kind', 16).notNullable()
      table.bigInteger('amount_cents').notNullable()
      table.string('booked_on', 10).notNullable()
      table.string('note', 255).nullable()
      table.timestamp('created_at').notNullable()
      table.index(['user_id', 'booked_on'])
    })

    this.schema.createTable('financial_budgets', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('category_id').notNullable().references('id').inTable('financial_categories').onDelete('CASCADE')
      table.string('month', 7).notNullable()
      table.bigInteger('limit_cents').notNullable()
      table.unique(['user_id', 'month', 'category_id'])
    })

    this.schema.createTable('financial_valuations', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.string('kind', 20).notNullable()
      table.bigInteger('value_cents').notNullable()
      table.string('as_of', 10).notNullable()
      table.timestamp('created_at').notNullable()
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable('financial_valuations')
    this.schema.dropTable('financial_budgets')
    this.schema.dropTable('financial_transactions')
    this.schema.dropTable('financial_categories')
    this.schema.dropTable('financial_accounts')
  }
}
