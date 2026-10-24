import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { cfoMessageValidator } from '#validators/cfo_chat'
import {
  cfoProviderConfigured, CfoProviderRequestError, CfoProviderUnavailableError, generateCfoReply,
} from '#services/cfo/agent'
import { loadCfoSnapshot } from '#services/cfo/snapshot'
import type { HistoryMessage } from '#services/cfo/agent'

const MAX_DAILY_MESSAGES = 20
const MAX_STORED_MESSAGES = 100

export default class CfoChatController {
  async index({ auth, inertia }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const rows = await db.from('cfo_chat_messages')
      .where('user_id', userId).orderBy('id', 'desc').limit(40)
    return inertia.render('cfo-chat', {
      configured: cfoProviderConfigured(),
      messages: rows.reverse().map(m => ({
        id: Number(m.id),
        role: m.role as 'user' | 'assistant',
        content: String(m.content),
      })),
      dailyMessageLimit: MAX_DAILY_MESSAGES,
    })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const input = await request.validateUsing(cfoMessageValidator)
    if (!cfoProviderConfigured()) {
      session.flash('errors', { message: 'Configure CFO_AI_API_KEY and CFO_AI_MODEL to enable the conversational CFO.' })
      return response.redirect().toRoute('cfo.chat')
    }

    // Per-user, server-enforced daily budget to contain unexpected provider costs.
    const today = new Date()
    const utcDayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString()
    const usedToday = await db.from('cfo_chat_messages').where('user_id', userId)
      .where('role', 'user').where('created_at', '>=', utcDayStart).count('* as total').first()
    if (Number(usedToday?.total ?? 0) >= MAX_DAILY_MESSAGES) {
      session.flash('errors', { message: 'Daily CFO chat limit reached. Please try again tomorrow.' })
      return response.redirect().toRoute('cfo.chat')
    }

    const previous = await db.from('cfo_chat_messages')
      .where('user_id', userId).orderBy('id', 'desc').limit(10)
    const history: HistoryMessage[] = previous.reverse()
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as HistoryMessage['role'], content: String(m.content) }))
    history.push({ role: 'user', content: input.message })
    try {
      const snapshot = await loadCfoSnapshot(userId)
      const answer = await generateCfoReply(history, snapshot)
      await db.transaction(async trx => {
        await trx.table('cfo_chat_messages').insert({
          user_id: userId, role: 'user', content: input.message, created_at: new Date().toISOString(),
        })
        await trx.table('cfo_chat_messages').insert({
          user_id: userId, role: 'assistant', content: answer, created_at: new Date().toISOString(),
        })
        const excess = await trx.from('cfo_chat_messages').where('user_id', userId)
          .orderBy('id', 'desc').offset(MAX_STORED_MESSAGES).select('id')
        if (excess.length) {
          await trx.from('cfo_chat_messages').where('user_id', userId)
            .whereIn('id', excess.map(row => row.id)).delete()
        }
      })
    } catch (error) {
      const message = error instanceof CfoProviderUnavailableError
        ? 'AI provider not configured.'
        : error instanceof CfoProviderRequestError
          ? 'Unable to get a CFO response right now. Your message was not saved; please retry.'
          : 'Unable to calculate your financial snapshot. Please verify your records.'
      session.flash('errors', { message })
    }
    return response.redirect().toRoute('cfo.chat')
  }

  async clear({ auth, response }: HttpContext) {
    await db.from('cfo_chat_messages').where('user_id', auth.getUserOrFail().id).delete()
    return response.redirect().toRoute('cfo.chat')
  }
}
