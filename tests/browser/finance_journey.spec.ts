import { test } from '@japa/runner'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import testUtils from '@adonisjs/core/services/test_utils'
import { mkdirSync } from 'node:fs'

test.group('Agentic CFO browser journey', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('a working professional can build a budget and move through the financial workspace', async ({
    visit, browserContext, assert,
  }) => {
    const user = await User.create({
      fullName: 'Browser Test Professional',
      email: 'financial-journey@example.test',
      password: 'TestPassword123!',
    })
    await browserContext.loginAs(user)
    const page = await visit('/dashboard')
    await page.getByRole('heading', { name: 'Your money, in focus.' }).waitFor()
    await page.getByRole('link', { name: /Get started/ }).click()
    await page.getByRole('heading', { name: 'Know what you own.' }).waitFor()

    // Create a real account using the React/Inertia form.
    await page.getByLabel('Account name').fill('Everyday bank')
    await page.getByLabel('Opening balance (SGD)').fill('4000.00')
    await page.getByRole('button', { name: 'Save account' }).click()
    await page.getByText('Everyday bank').first().waitFor()
    await page.getByRole('link', { name: /Budgets & goals/ }).click()
    await page.getByRole('heading', { name: 'Spend with intention.' }).waitFor()
    await page.getByLabel('New category').fill('Dining')
    await page.getByRole('button', { name: 'Add category' }).click()
    await page.getByText('Dining').first().waitFor()
    await page.getByLabel('Monthly limit (SGD)').fill('500.00')
    await page.getByRole('button', { name: 'Save monthly budget' }).click()
    await page.getByText('Dining').first().waitFor()

    await page.getByRole('link', { name: /Transactions/ }).click()
    await page.getByRole('heading', { name: 'Every dollar accounted for.' }).waitFor()
    await page.getByLabel('Amount in Singapore dollars').fill('425.00')
    await page.getByLabel('From account').selectOption({ label: 'Everyday bank' })
    await page.getByLabel('Category', { exact: true }).selectOption({ label: 'Dining' })
    await page.getByRole('button', { name: 'Save transaction' }).click()
    await page.getByText('S$425.00').first().waitFor()

    await page.getByRole('link', { name: /Overview/ }).click()
    await page.getByRole('heading', { name: 'Your money, in focus.' }).waitFor()
    await page.getByText('S$425.00').first().waitFor()

    // Screenshot contains synthetic data only; artifact available in Actions.
    mkdirSync('artifacts', { recursive: true })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.screenshot({ path: 'artifacts/mobile-overview.png', fullPage: true })
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    assert.isAtMost(documentWidth, 390)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.screenshot({ path: 'artifacts/desktop-overview.png', fullPage: true })
  })

  test('logged-in users only see their own bank and chat records', async ({ visit, browserContext }) => {
    const alice = await User.create({
      fullName: 'User Alice', email: 'alice@example.test', password: 'TestPassword123!',
    })
    const bob = await User.create({
      fullName: 'User Bob', email: 'bob@example.test', password: 'TestPassword123!',
    })
    const now = new Date().toISOString()
    await db.table('financial_accounts').insert([
      { user_id: alice.id, name: 'Alice only savings', kind: 'asset', opening_balance_cents: 908000, currency: 'SGD', created_at: now },
      { user_id: bob.id, name: 'Bob everyday wallet', kind: 'asset', opening_balance_cents: 210000, currency: 'SGD', created_at: now },
    ])
    await db.table('cfo_chat_messages').insert({
      user_id: alice.id, role: 'user', content: 'Alice private chat token', created_at: now,
    })
    await browserContext.loginAs(bob)
    const page = await visit('/dashboard?view=wealth')
    await page.getByText('Bob everyday wallet').waitFor()
    await page.getByText('Alice only savings').waitFor({ state: 'detached' })
    await page.getByRole('link', { name: /Ask CFO/ }).click()
    await page.getByRole('heading', { name: 'Your financial copilot.' }).waitFor()
    await page.getByText('Alice private chat token').waitFor({ state: 'detached' })
  })
})
