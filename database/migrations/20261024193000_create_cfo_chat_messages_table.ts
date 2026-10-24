import { BaseSchema } from '@adonisjs/lucid/schema'

/** A single private conversational history per user for the MVP. */
export default class CreateCfoChatMessages extends BaseSchema {
  async up() {
    this.schema.createTable('cfo_chat_messages', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('role', 10).notNullable() // user | assistant
      table.text('content').notNullable()
      table.timestamp('created_at').notNullable()
      table.index(['user_id', 'id'])
    })
  }

  async down() {
    this.schema.dropTable('cfo_chat_messages')
  }
}
