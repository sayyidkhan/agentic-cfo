import { test } from '@japa/runner'
import { generateCfoReply, CfoProviderRequestError } from '../../app/services/cfo/agent.js'
import type { CfoSnapshot } from '../../app/services/cfo/types.js'

const snapshot: CfoSnapshot = {
  date: '2026-10-24', currency: 'SGD', accountsRecorded: 1,
  availableCashCents: 100_000, assetsCents: 100_000, liabilitiesCents: 0,
  netWorthCents: 100_000, currentMonth: '2026-10',
  monthlyIncomeCents: 200_000, monthlyExpenseCents: 25_000,
  budgets: [], unpaidBills: [], upcomingBillsCents: 0, cashAfterBillsCents: 100_000,
  goals: [], valuations: [], insights: [],
}

test.group('CFO model integration', () => {
  test('uses a read-only tool result before generating final advice', async ({ assert }) => {
    const oldKey = process.env.CFO_AI_API_KEY
    const oldModel = process.env.CFO_AI_MODEL
    const oldBase = process.env.CFO_AI_BASE_URL
    const originalFetch = globalThis.fetch
    const requests: { tool_choice?: string; messages?: { role: string; content: string }[] }[] = []
    try {
      process.env.CFO_AI_API_KEY = 'test-in-memory-key'
      process.env.CFO_AI_MODEL = 'model-with-tools'
      process.env.CFO_AI_BASE_URL = 'https://example.invalid/v1'
      globalThis.fetch = (async (_input, init) => {
        const body = JSON.parse(String(init?.body))
        requests.push(body)
        if (requests.length === 1) {
          return Response.json({
            choices: [{ message: {
              role: 'assistant', content: null,
              tool_calls: [{
                type: 'function', id: 'call_1',
                function: { name: 'get_financial_overview', arguments: '{}' },
              }],
            } }],
          })
        }
        return Response.json({ choices: [{ message: {
          role: 'assistant', content: 'Your recorded cash is S$1,000.00. This may omit untracked commitments.',
        } }] })
      }) as typeof fetch

      const text = await generateCfoReply([{ role: 'user', content: 'How much cash do I have?' }], snapshot)
      assert.include(text, 'S$1,000.00')
      assert.equal(requests.length, 2)
      assert.equal(requests[0].tool_choice, 'required')
      assert.equal(requests[1].tool_choice, 'none')
      const toolMessage = requests[1].messages?.find(m => m.role === 'tool')
      assert.exists(toolMessage)
      assert.equal(JSON.parse(toolMessage!.content).availableCashCents, 100_000)
    } finally {
      globalThis.fetch = originalFetch
      if (oldKey === undefined) delete process.env.CFO_AI_API_KEY
      else process.env.CFO_AI_API_KEY = oldKey
      if (oldModel === undefined) delete process.env.CFO_AI_MODEL
      else process.env.CFO_AI_MODEL = oldModel
      if (oldBase === undefined) delete process.env.CFO_AI_BASE_URL
      else process.env.CFO_AI_BASE_URL = oldBase
    }
  })

  test('does not expose errors returned by a provider', async ({ assert }) => {
    const oldKey = process.env.CFO_AI_API_KEY
    const oldModel = process.env.CFO_AI_MODEL
    const oldBase = process.env.CFO_AI_BASE_URL
    const originalFetch = globalThis.fetch
    try {
      process.env.CFO_AI_API_KEY = 'test-in-memory-key'
      process.env.CFO_AI_MODEL = 'model-with-tools'
      process.env.CFO_AI_BASE_URL = 'https://example.invalid/v1'
      globalThis.fetch = (async () => new Response('PRIVATE_INFORMATION', { status: 401 })) as typeof fetch
      let captured: unknown
      try {
        await generateCfoReply([{ role: 'user', content: 'What can I spend?' }], snapshot)
      } catch (error) {
        captured = error
      }
      assert.instanceOf(captured, CfoProviderRequestError)
      assert.notInclude(String(captured), 'PRIVATE_INFORMATION')
    } finally {
      globalThis.fetch = originalFetch
      if (oldKey === undefined) delete process.env.CFO_AI_API_KEY
      else process.env.CFO_AI_API_KEY = oldKey
      if (oldModel === undefined) delete process.env.CFO_AI_MODEL
      else process.env.CFO_AI_MODEL = oldModel
      if (oldBase === undefined) delete process.env.CFO_AI_BASE_URL
      else process.env.CFO_AI_BASE_URL = oldBase
    }
  })
})
