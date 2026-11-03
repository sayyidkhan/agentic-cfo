import { formatSgd } from '../../app/services/finance/money.js'
import useCountUp from '../hooks/use_count_up'
import {countedCents} from '../lib/count_up'
import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import {ArrowDownLeft,ArrowUpRight,ArrowLeftRight,Landmark,MoreHorizontal,Search} from 'lucide-react'

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

function TransactionAmount({transaction:t,animationKey}:{transaction:FinanceTransaction;animationKey:number}){
  const {ref,elapsed,counting}=useCountUp([t.id,t.kind,t.amountCents,animationKey].join(':'))
  const prefix=t.kind==='expense'?'−':t.kind==='income'?'+':''
  const final=prefix+price(t.amountCents),display=prefix+price(countedCents(t.amountCents,elapsed))
  return <strong className={'record-amount kind-'+t.kind} ref={ref} data-counting={counting}><span className="count-value"><span className="count-sr">{final}</span><span className="count-size" aria-hidden="true">{final}</span><span className="count-live" aria-hidden="true">{display}</span></span></strong>
}

export function TransactionManager({ transactions, accounts, categories, currentDate, animationKey=0 }: {
  transactions: FinanceTransaction[]
  accounts: FinanceAccount[]
  categories: FinanceCategory[]
  currentDate: string
  animationKey?: number
}) {
  const [editing, setEditing] = useState<number | null>(null)
  const [kind, setKind] = useState<FinanceTransaction['kind']>('expense')
  const [query,setQuery]=useState(''),[filter,setFilter]=useState<'all'|FinanceTransaction['kind']>('all')
  const shown=transactions.filter(t=>(filter==='all'||t.kind===filter)&&[t.note,t.bookedOn,t.kind,accounts.find(a=>a.id===t.accountId)?.name,accounts.find(a=>a.id===t.destinationAccountId)?.name,categories.find(c=>c.id===t.categoryId)?.name].join(' ').toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>b.bookedOn.localeCompare(a.bookedOn)||b.id-a.id)
  const dateLabel=(date:string)=>date===currentDate?'Today':new Intl.DateTimeFormat('en-SG',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'))
  const assetAccounts = accounts.filter(a => a.kind === 'asset')
  const beginEdit = (transaction: FinanceTransaction) => {
    setEditing(transaction.id === editing ? null : transaction.id)
    setKind(transaction.kind)
  }
  return <section className="cfo-card record-card spending-ledger" aria-label="Transaction list">
    <div className="cfo-card-header"><h2>Transactions</h2><span className="spending-entry-count" role="status">{shown.length}{shown.length!==transactions.length?' of '+transactions.length:''} {transactions.length===1?'entry':'entries'}</span></div>
    <div className="spending-tools"><label className="spending-search"><Search size={17} aria-hidden="true"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search transactions" aria-label="Search transactions"/></label>
    <div className="spending-filters" role="group" aria-label="Filter transactions">{([{key:'all',label:'All'},{key:'expense',label:'Expenses'},{key:'income',label:'Income'},{key:'transfer',label:'Transfers'}] as const).map(item=><button type="button" key={item.key} aria-pressed={filter===item.key} onClick={()=>setFilter(item.key)}>{item.label}</button>)}</div></div>
    {!shown.length&&<div className="spending-empty"><strong>{transactions.length?'No matching transactions':'Your transactions start here'}</strong><p>{transactions.length?'Try a different search or type.':'Tap Add to record your first income, expense or transfer.'}</p>{transactions.length>0&&<button type="button" onClick={()=>{setQuery('');setFilter('all')}}>Clear filters</button>}</div>}
    {shown.map((t,index) => <div key={t.id} className="record-item">
      {(index===0||shown[index-1].bookedOn!==t.bookedOn)&&<h3 className="spending-date-label">{dateLabel(t.bookedOn)}</h3>}
      <div className="finance-record-row" style={{display:'flex',gap:10,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <span className="record-description"><i className={'activity-icon kind-'+t.kind} aria-hidden="true">{t.kind==='income'?<ArrowDownLeft size={19}/>:t.kind==='transfer'?<ArrowLeftRight size={19}/>:<ArrowUpRight size={19}/>}</i><span><strong title={t.note || categories.find(c=>c.id===t.categoryId)?.name || t.kind}>{t.note || categories.find(c=>c.id === t.categoryId)?.name || t.kind}</strong><small>{t.kind==='transfer'?'Transfer':categories.find(c=>c.id===t.categoryId)?.name||(t.kind==='income'?'Income':'Expense')} · {accounts.find(a=>a.id===t.accountId)?.name || t.kind}{t.kind==='transfer'&&t.destinationAccountId?' → '+(accounts.find(a=>a.id===t.destinationAccountId)?.name||'Destination'):''}</small></span></span>
        <TransactionAmount transaction={t} animationKey={animationKey}/>
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
          <button type="button" className="btn btn--secondary" disabled={processing} onClick={()=>setEditing(null)}>Cancel editing</button>
        </div>}
      </Form>}
    </div>)}
  </section>
}

export function ValuationManager({ valuations, title = 'Other assets & debts', description = 'These must not duplicate any bank/cash or debt accounts already recorded.', emptyText = 'No additional valuations recorded.' }: { valuations: ManualValuation[]; title?: string | null; description?: string | null; emptyText?: string }) {
  const [editing, setEditing] = useState<number|null>(null)
  return <section className="cfo-card record-card">
    <>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</>
    {valuations.length===0 ? <p className="accounts-empty">{emptyText}</p> :
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
