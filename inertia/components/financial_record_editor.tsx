import { formatSgd } from '../../app/services/finance/money.js'
import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import {ArrowDownLeft,ArrowUpRight,ArrowLeftRight,Landmark,MoreHorizontal} from 'lucide-react'

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

function RecordActions({label,children}:{label:string;children:ReactNode}){
  const ref=useRef<HTMLDetailsElement>(null)
  useEffect(()=>{
    const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!ref.current?.contains(event.target))ref.current?.removeAttribute('open')}
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&ref.current?.open){ref.current.removeAttribute('open');ref.current.querySelector('summary')?.focus()}}
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
  },[])
  return <details className="record-actions" ref={ref}><summary aria-label={label}><MoreHorizontal size={19}/></summary><div onClick={event=>{if((event.target as Element).closest('button')){ref.current?.removeAttribute('open');ref.current?.querySelector('summary')?.focus()}}}>{children}</div></details>
}

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
  return <section className="cfo-card record-card">
    <div className="cfo-card-header"><h2>Transactions</h2><span className="cfo-pill">{transactions.length} entries</span></div>
    {transactions.length === 0 && <p>No transactions recorded yet.</p>}
    {transactions.map(t => <div key={t.id} className="record-item">
      <div className="finance-record-row" style={{display:'flex',gap:10,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <span className="record-description"><i className={'activity-icon kind-'+t.kind} aria-hidden="true">{t.kind==='income'?<ArrowDownLeft size={19}/>:t.kind==='transfer'?<ArrowLeftRight size={19}/>:<ArrowUpRight size={19}/>}</i><span><strong>{t.note || categories.find(c=>c.id === t.categoryId)?.name || t.kind}</strong><small>{t.bookedOn} · {accounts.find(a=>a.id===t.accountId)?.name || t.kind}</small></span></span>
        <strong className={'record-amount kind-'+t.kind}>{t.kind==='expense'?'−':t.kind==='income'?'+':''}{price(t.amountCents)}</strong>
        <RecordActions label={'Actions for '+(t.note||t.kind)}>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>beginEdit(t)}>{editing===t.id?'Close':'Edit'}</button>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>{
            if(window.confirm('Permanently delete this transaction?')) router.delete(`/finance/transactions/${t.id}`)
          }}>Delete</button>
        </RecordActions>
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
  return <section className="cfo-card record-card">
    <h2>Other assets &amp; debts</h2>
    <p>These must not duplicate any bank/cash or debt accounts already recorded.</p>
    {valuations.length===0 ? <p>No additional valuations recorded.</p> :
    valuations.map(v=><div key={v.id} className="record-item">
      <div className="finance-record-row" style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <span className="record-description"><i className="activity-icon" aria-hidden="true"><Landmark size={18}/></i><span><strong>{v.name}</strong><small>{v.kind} · Valued {v.asOf}</small></span></span><strong className="record-amount">{price(v.valueCents)}</strong>
        <RecordActions label={'Actions for '+v.name}>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>setEditing(editing===v.id?null:v.id)}>{editing===v.id?'Close':'Update'}</button>
          <button className="btn btn--secondary btn--sm" type="button" onClick={()=>{
            if(window.confirm('Permanently delete this valuation?')) router.delete(`/finance/valuations/${v.id}`)
          }}>Delete</button>
        </RecordActions>
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
