import { formatSgd } from '../../app/services/finance/money.js'
import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useState } from 'react'

export interface FinanceAccount { id: number; name: string; kind: 'asset' | 'liability' }
export interface FinanceCategory { id: number; name: string }
export interface FinanceTransaction {
  id: number
  bookedOn: string
  kind: 'income' | 'expense' | 'transfer'
  amountCents: number
  accountId: number
  destinationAccountId: number | null
  note: string | null
  categoryId: number | null
}
export interface ManualValuation {
  id: number
  name: string
  kind: 'asset' | 'liability'
  valueCents: number
  asOf: string
}
const price = formatSgd
const inputStyle = { padding: '8px', border: '1px solid #aeb8c0', borderRadius: 6, width: '100%' }
const section = { border: '1px solid #d4d9dd', padding: 20, borderRadius: 12, marginBottom: 18 }

export function TransactionManager({ transactions, accounts, categories }: {
  transactions: FinanceTransaction[]
  accounts: FinanceAccount[]
  categories: FinanceCategory[]
}) {
  const [editing, setEditing] = useState<number | null>(null)
  const [kind, setKind] = useState<FinanceTransaction['kind']>('expense')
  const assetAccounts = accounts.filter(a => a.kind === 'asset')
  const beginEdit = (transaction: FinanceTransaction) => {
    setEditing(transaction.id === editing ? null : transaction.id)
    setKind(transaction.kind)
  }
  return <section style={section}>
    <h2>Recent transactions</h2>
    <p>Changes are validated against your full account ledger to protect net-worth accuracy.</p>
    {transactions.length === 0 && <p>No transactions recorded yet.</p>}
    {transactions.map(t => <div key={t.id} style={{padding:'12px 0',borderBottom:'1px solid #d4d9dd'}}>
      <div className="finance-record-row" style={{display:'flex',gap:10,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <span>{t.bookedOn} · {t.note || categories.find(c=>c.id === t.categoryId)?.name || t.kind} ({t.kind})</span>
        <strong>{price(t.amountCents)}</strong>
        <span style={{display:'flex',gap:6}}>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>beginEdit(t)}>{editing===t.id?'Close':'Edit'}</button>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>{
            if(window.confirm('Permanently delete this transaction?')) router.delete(`/finance/transactions/${t.id}`)
          }}>Delete</button>
        </span>
      </div>
      {editing===t.id && <Form action={`/finance/transactions/${t.id}`} method="patch">
        {({errors,processing}) => <div className="finance-edit-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:10,marginTop:12}}>
          <label>Type<select name="kind" value={kind} onChange={e=>setKind(e.target.value as FinanceTransaction['kind'])} style={inputStyle}><option value="income">Income</option><option value="expense">Expense</option><option value="transfer">Transfer</option></select></label>
          <label>Amount (S$)<input name="amount" inputMode="decimal" defaultValue={(t.amountCents/100).toFixed(2)} required style={inputStyle}/></label>
          <label>Date<input type="date" name="bookedOn" defaultValue={t.bookedOn} required style={inputStyle}/></label>
          <label>From account<select name="accountId" defaultValue={t.accountId} style={inputStyle}>{assetAccounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
          {kind==='expense' && <label>Category<select name="categoryId" defaultValue={t.categoryId ?? ''} required style={inputStyle}><option value="" disabled>Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
          {kind==='transfer' && <label>Destination<select name="destinationAccountId" defaultValue={t.destinationAccountId ?? ''} required style={inputStyle}><option value="" disabled>Destination account</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>}
          <label>Note<input name="note" defaultValue={t.note ?? ''} style={inputStyle}/></label>
          {Object.values(errors).map((e,i)=><small key={i} role="alert">{e}</small>)}
          <button type="submit" className="btn btn--primary" disabled={processing}>Save changes</button>
        </div>}
      </Form>}
    </div>)}
  </section>
}

export function ValuationManager({ valuations }: { valuations: ManualValuation[] }) {
  const [editing, setEditing] = useState<number|null>(null)
  return <section style={section}>
    <h2>Manual asset and debt valuations</h2>
    <p>These must not duplicate any bank/cash or debt accounts already recorded.</p>
    {valuations.length===0 ? <p>No additional valuations recorded.</p> :
    valuations.map(v=><div key={v.id} style={{padding:'10px 0',borderBottom:'1px solid #d4d9dd'}}>
      <div className="finance-record-row" style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <span>{v.name} · {v.kind} · as of {v.asOf}</span><strong>{price(v.valueCents)}</strong>
        <span style={{display:'flex',gap:8}}>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>setEditing(editing===v.id?null:v.id)}>{editing===v.id?'Close':'Update'}</button>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>{
            if(window.confirm('Permanently delete this valuation?')) router.delete(`/finance/valuations/${v.id}`)
          }}>Delete</button>
        </span>
      </div>
      {editing===v.id && <Form action={`/finance/valuations/${v.id}`} method="patch">
        {({errors,processing}) => <div className="finance-edit-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginTop:10}}>
          <label>Name<input name="name" defaultValue={v.name} required style={inputStyle}/></label>
          <label>Type<select name="kind" defaultValue={v.kind} style={inputStyle}><option value="asset">Asset</option><option value="liability">Liability</option></select></label>
          <label>Value (S$)<input name="value" inputMode="decimal" defaultValue={(v.valueCents/100).toFixed(2)} required style={inputStyle}/></label>
          <label>As-of date<input type="date" name="asOf" defaultValue={v.asOf} required style={inputStyle}/></label>
          {Object.values(errors).map((e,i)=><small key={i} role="alert">{e}</small>)}
          <button className="btn btn--primary" type="submit" disabled={processing}>Save valuation</button>
        </div>}
      </Form>}
    </div>)}
  </section>
}
