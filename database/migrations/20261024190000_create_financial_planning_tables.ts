import { BaseSchema } from '@adonisjs/lucid/schema'

/** Planning data is kept separate from posted financial transactions. */
export default class CreateFinancialPlanningTables extends BaseSchema {
  async up() {
    this.schema.createTable('financial_commitments', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.bigInteger('amount_cents').notNullable()
      table.integer('due_day').notNullable() // 1..28, every month
      table.string('last_paid_month', 7).nullable() // YYYY-MM; marking paid does not post a transaction
      table.timestamp('created_at').notNullable()
      table.index(['user_id'])
    })

    this.schema.createTable('financial_goals', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.bigInteger('target_cents').notNullable()
      table.bigInteger('saved_cents').notNullable().defaultTo(0)
      table.string('target_date', 10).notNullable()
      table.timestamp('created_at').notNullable()
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable('financial_goals')
    this.schema.dropTable('financial_commitments')
  }
}
