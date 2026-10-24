import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useState } from 'react'

export interface Commitment {
  id: number
  name: string
  amountCents: number
  dueDay: number
  lastPaidMonth: string | null
}
export interface Goal {
  id: number
  name: string
  targetCents: number
  savedCents: number
  targetDate: string
}
export interface Planning {
  upcoming: { id: string; name: string; amountCents: number; dueDay: number; dueOn: string; lastPaidMonth?: string | null }[]
  upcomingTotalCents: number
  cashAfterUpcomingCents: number
  insights: { code: string; severity: 'notice' | 'warning'; title: string; detail: string }[]
}

const dollars = (cents: number) => new Intl.NumberFormat('en-SG', {
  style: 'currency', currency: 'SGD',
}).format(cents / 100)
const inputStyle = { display: 'block', width: '100%', padding: 9, borderRadius: 6, border: '1px solid #aeb8c0' }
const box = { padding: 20, border: '1px solid #d4d9dd', borderRadius: 12, marginBottom: 18 }

export default function FinancialPlanning({ commitments, goals, planning, month, currentDate, availableCashCents }: {
  commitments: Commitment[]
  goals: Goal[]
  planning: Planning
  month: string
  currentDate: string
  availableCashCents: number
}) {
  const [editingGoal, setEditingGoal] = useState<number | null>(null)
  return (
    <>
      <section style={box}>
        <h2>Upcoming commitments</h2>
        <p>Monthly bills are reminders and projections only. They are <strong>not</strong> posted as expenses automatically.</p>
        <p><strong>Recorded bank/cash balances:</strong> {dollars(availableCashCents)} · <strong>Unpaid future bills this month:</strong> {dollars(planning.upcomingTotalCents)}</p>
        <p><strong>Projected after those bills:</strong> {dollars(planning.cashAfterUpcomingCents)}</p>
        {commitments.length === 0 ? <p>No monthly commitments yet.</p> : (
          <ul style={{ display: 'grid', gap: 9, marginBottom: 18 }}>
            {commitments.map(c => (
              <li key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <span>{c.name} · {dollars(c.amountCents)} · due day {c.dueDay} {c.lastPaidMonth === month ? '· paid this month' : ''}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  {c.lastPaidMonth !== month && <button className="btn btn--secondary btn--sm" type="button" onClick={() => router.post(`/finance/commitments/${c.id}/paid`)}>Mark paid</button>}
                  <button className="btn btn--secondary btn--sm" type="button" onClick={() => {
                    if (window.confirm('Remove this recurring commitment?')) router.delete(`/finance/commitments/${c.id}`)
                  }}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <Form route="finance.commitments.store">
          {({ errors, processing }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, alignItems: 'end' }}>
            <label>Bill name<input name="name" required placeholder="Rent, insurance" style={inputStyle}/></label>
            <label>Amount (S$)<input name="amount" required inputMode="decimal" placeholder="180.00" style={inputStyle}/></label>
            <label>Due day (1–28)<input name="dueDay" type="number" min="1" max="28" step="1" defaultValue="25" required style={inputStyle}/></label>
            <button className="btn btn--primary" type="submit" disabled={processing}>Add monthly bill</button>
            {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
          </div>}
        </Form>
        <small>Marking paid only updates this reminder. Record the actual expense separately so your balances stay accurate.</small>
      </section>

      <section style={box}>
        <h2>Savings goals</h2>
        <p>Track your intentions alongside your budget. Goal progress is a planning figure, <strong>not</strong> an additional asset in net worth.</p>
        {goals.map(g => (
          <div key={g.id} style={{ padding: '12px 0', borderBottom: '1px solid #e1e5e8' }}>
            <strong>{g.name}</strong> · {dollars(g.savedCents)} / {dollars(g.targetCents)} · target {g.targetDate}
            <progress max={100} value={Math.min(100, Math.round(100*g.savedCents/g.targetCents))} style={{display:'block',width:'100%'}}/>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="btn btn--secondary btn--sm" type="button" onClick={() => setEditingGoal(editingGoal === g.id ? null : g.id)}>Edit progress</button>
              <button className="btn btn--secondary btn--sm" type="button" onClick={() => {
                if (window.confirm('Delete this savings goal?')) router.delete(`/finance/goals/${g.id}`)
              }}>Remove</button>
            </div>
            {editingGoal === g.id && <Form action={`/finance/goals/${g.id}`} method="patch">
              {({ errors, processing }) => <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                <label>Goal<input name="name" defaultValue={g.name} required style={inputStyle}/></label>
                <label>Target (S$)<input name="target" defaultValue={(g.targetCents/100).toFixed(2)} required style={inputStyle}/></label>
                <label>Saved so far (S$)<input name="saved" defaultValue={(g.savedCents/100).toFixed(2)} required style={inputStyle}/></label>
                <label>Target date<input name="targetDate" type="date" defaultValue={g.targetDate} required style={inputStyle}/></label>
                {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
                <button className="btn btn--primary btn--sm" type="submit" disabled={processing}>Save goal</button>
              </div>}
            </Form>}
          </div>
        ))}
        <h3 style={{ marginTop: 16 }}>Create a goal</h3>
        <Form route="finance.goals.store">
          {({ errors, processing }) => <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:10,alignItems:'end'}}>
            <label>Goal name<input name="name" placeholder="Emergency fund" required style={inputStyle}/></label>
            <label>Target (S$)<input name="target" placeholder="5000" required inputMode="decimal" style={inputStyle}/></label>
            <label>Saved so far (S$)<input name="saved" defaultValue="0" required inputMode="decimal" style={inputStyle}/></label>
            <label>Target date<input name="targetDate" type="date" defaultValue={currentDate} required style={inputStyle}/></label>
            <button className="btn btn--primary" type="submit" disabled={processing}>Add goal</button>
            {Object.values(errors).map((e, i) => <small key={i} role="alert">{e}</small>)}
          </div>}
        </Form>
      </section>

      <section style={box}>
        <h2>Financial health review</h2>
        <p>Early warnings calculated from your own recorded budgets, upcoming unpaid commitments, and goals. This is a rules-based preview, not AI advice yet.</p>
        {planning.insights.length === 0 ? <p>No early warnings detected from the records supplied. This doesn't guarantee all expenses are covered.</p> : (
          <div style={{display:'grid',gap:12}}>
            {planning.insights.map(i => (
              <div key={i.code} style={{borderLeft: `4px solid ${i.severity === 'warning' ? '#c45c30' : '#cb9950'}`,padding:'10px 15px',background:'var(--surface, transparent)'}}>
                <strong>{i.title}</strong>
                <p style={{marginTop:5}}>{i.detail}</p>
              </div>
            ))}
          </div>
        )}
        <small>Assumptions: recurring bills are considered upcoming until marked paid, and only for their due date in the current month. Bills paid or due earlier in the month are excluded.</small>
      </section>
    </>
  )
}
