import { test } from '@japa/runner'

/**
 * HTTP-level smoke tests of authentication boundaries.
 * These are not a substitute for a full browser walkthrough.
 */
test.group('financial workspace access', () => {
  test('requires authentication for overview, finance views and CFO conversation', async ({ assert }) => {
    const origin = process.env.APP_URL ?? 'http://localhost:3333'
    for (const route of ['/dashboard', '/dashboard?view=transactions', '/dashboard?view=budget', '/dashboard?view=wealth', '/cfo']) {
      const reply = await fetch(new URL(route, origin), { redirect: 'manual' })
      assert.include([301, 302, 303, 307, 308], reply.status)
      assert.include(reply.headers.get('location') ?? '', 'login')
    }
  })
})
