import { Form } from '@adonisjs/inertia/react'
import { useState } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'

interface DashboardProps {
  accounts: { id: number; name: string; kind: 'asset' | 'liability' }[]
  categories: { id: number; name: string }[]
  currentDate: string
  month: string
  incomeCents: number
  expenseCents: number
  financialPosition: { assetsCents: number; liabilitiesCents: number; netWorthCents: number }
  budgetStatus: { id: string; categoryId: string; limitCents: number; spentCents: number; remainingCents: number; percentUsed: number }[]
  valuations: { id: number; name: string; kind: string; valueCents: number; asOf: string }[]
  recentTransactions: { id: number; bookedOn: string; kind: string; amountCents: number; note: string | null; categoryId: number | null }[]
}

const money = (cents: number) =>
  new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(cents / 100)

const fieldStyle = { width: '100%', padding: '9px', border: '1px solid #aeb8c0', borderRadius: '6px' }
const sectionStyle = { padding: '20px', border: '1px solid #d4d9dd', borderRadius: '12px', marginBottom: '18px' }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }

export default function Dashboard({
  accounts, categories, currentDate, month, incomeCents, expenseCents,
  financialPosition, budgetStatus, valuations, recentTransactions,
}: DashboardProps) {
  const [transactionKind, setTransactionKind] = useState<'income' | 'expense' | 'transfer'>('expense')
  const assets = accounts.filter((a) => a.kind === 'asset')
  const categoryName = (id: string | number | null) =>
    categories.find((c) => String(c.id) === String(id))?.name ?? 'Uncategorised'

  return (
    <Page title="Agentic CFO" description="Your money, your choices. Start by recording an account, then add transactions and budgets.">
      <div style={gridStyle}>
        {[
          ['Income this month', incomeCents],
          ['Expenses this month', expenseCents],
          ['Cash flow this month', incomeCents - expenseCents],
          ['Estimated net worth', financialPosition.netWorthCents],
        ].map(([title, value]) => (
          <div key={String(title)} style={sectionStyle}>
            <small>{title}</small>
            <h2 style={{ marginTop: '8px' }}>{money(value as number)}</h2>
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <h2>Monthly budgets — {month}</h2>
        {budgetStatus.length === 0 ? <p>No budgets yet. Create a category and set a monthly limit below.</p> : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {budgetStatus.map((b) => (
              <div key={b.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{categoryName(b.categoryId)}</strong>
                  <span>{money(b.spentCents)} of {money(b.limitCents)}</span>
                </div>
                <progress max={100} value={Math.min(100, b.percentUsed)} style={{ width: '100%' }} />
                <small>{money(b.remainingCents)} remaining {b.percentUsed >= 80 ? '— approaching limit' : ''}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={gridStyle}>
        <section style={sectionStyle}>
          <h2>Add an account</h2>
          <p>Enter the balance you already have (or debt owed). This is the starting point for tracking.</p>
          <Form route="finance.accounts.store">
            {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
              <label>Name<input name="name" placeholder="Bank savings" required style={fieldStyle}/></label>
              <label>Type<select name="kind" style={fieldStyle}><option value="asset">Asset</option><option value="liability">Debt</option></select></label>
              <label>Opening balance (S$)<input name="openingBalance" inputMode="decimal" defaultValue="0.00" required style={fieldStyle}/></label>
              {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
              <button className="btn btn--primary" type="submit" disabled={processing}>Save account</button>
            </div>}
          </Form>
        </section>

        <section style={sectionStyle}>
          <h2>Record a transaction</h2>
          <p>Record income, expenses or transfers. Transfers between your own accounts do not count as spending.</p>
          <Form route="finance.transactions.store">
            {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
              <label>Type<select name="kind" value={transactionKind} onChange={(event) => setTransactionKind(event.target.value as typeof transactionKind)} style={fieldStyle}><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></select></label>
              <label>Account<select name="accountId" required style={fieldStyle} defaultValue=""><option value="" disabled>Choose account</option>{assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
              <label>Amount (S$)<input name="amount" inputMode="decimal" placeholder="12.50" required style={fieldStyle}/></label>
              <label>Date<input name="bookedOn" type="date" defaultValue={currentDate} required style={fieldStyle}/></label>
              {transactionKind === 'expense' && <label>Category<select name="categoryId" required style={fieldStyle} defaultValue=""><option value="" disabled>Choose category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
              {transactionKind === 'transfer' && <label>Destination account<select name="destinationAccountId" required style={fieldStyle} defaultValue=""><option value="" disabled>Choose destination</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>}
              {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
              <button className="btn btn--primary" type="submit" disabled={processing || !assets.length}>Save transaction</button>
            </div>}
          </Form>
        </section>

        <section style={sectionStyle}>
          <h2>Set a category and budget</h2>
          <Form route="finance.categories.store">
            {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
              <label>Category name<input name="name" placeholder="Dining" required style={fieldStyle}/></label>
              {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
              <button className="btn btn--secondary" type="submit" disabled={processing}>Add category</button>
            </div>}
          </Form>
          <hr style={{ margin: '16px 0' }}/>
          <Form route="finance.budgets.store">
            {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
              <label>Category<select name="categoryId" required style={fieldStyle} defaultValue=""><option value="" disabled>Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label>Month<input name="month" type="month" defaultValue={month} required style={fieldStyle}/></label>
              <label>Monthly limit (S$)<input name="limit" inputMode="decimal" placeholder="500" required style={fieldStyle}/></label>
              {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
              <button className="btn btn--primary" type="submit" disabled={processing || !categories.length}>Save budget</button>
            </div>}
          </Form>
        </section>

        <section style={sectionStyle}>
          <h2>Record an asset or debt valuation</h2>
          <p>Only add items not already counted as accounts, to avoid double-counting.</p>
          <Form route="finance.valuations.store">
            {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
              <label>Name<input name="name" placeholder="Property, CPF, car loan..." required style={fieldStyle}/></label>
              <label>Type<select name="kind" style={fieldStyle}><option value="asset">Asset</option><option value="liability">Liability</option></select></label>
              <label>Value (S$)<input name="value" inputMode="decimal" placeholder="50000" required style={fieldStyle}/></label>
              <label>Valuation date<input name="asOf" type="date" defaultValue={currentDate} required style={fieldStyle}/></label>
              {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
              <button className="btn btn--primary" type="submit" disabled={processing}>Save valuation</button>
            </div>}
          </Form>
          {valuations.length > 0 && <ul style={{ marginTop: 12 }}>{valuations.map((v) => <li key={v.id}>{v.name}: {money(v.valueCents)} ({v.kind}, as of {v.asOf})</li>)}</ul>}
        </section>
      </div>

      <section style={sectionStyle}>
        <h2>Recent transactions</h2>
        {recentTransactions.length === 0 ? <p>No transactions recorded yet.</p> :
          <div style={{ display: 'grid', gap: 8 }}>
            {recentTransactions.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>{t.bookedOn} · {t.note || categoryName(t.categoryId)} · {t.kind}</span>
                <strong>{money(t.amountCents)}</strong>
              </div>
            ))}
          </div>}
      </section>
      <small>All figures are SGD. Wealth estimates depend on the balances and valuation dates you provide. No payments are initiated.</small>
    </Page>
  )
}

Dashboard.layout = [AppLayout]
