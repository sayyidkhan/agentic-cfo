import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import { ArrowRight, ChevronDown, Landmark, Plus, WalletCards, X } from 'lucide-react'
import { formatSgd } from '../../app/services/finance/money.js'
import FitMoney from './fit_money'
import { ValuationManager, type ManualValuation, type FinanceTransaction } from './financial_record_editor'

type Account = { id:number; name:string; kind:'asset'|'liability'; balanceCents:number }
interface Props {
 accounts:Account[]; valuations:ManualValuation[]; transactions:FinanceTransaction[]
 position:{ assetsCents:number; liabilitiesCents:number; netWorthCents:number }
 cashCents:number; currentDate:string; accountForm:ReactNode; valuationForm:ReactNode
}
const money=formatSgd
const dateLabel=(d:string)=>new Intl.DateTimeFormat('en-SG',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'))

function AccountRow({account,transactions}:{account:Account;transactions:FinanceTransaction[]}){
 const activity=transactions.filter(t=>t.accountId===account.id||t.destinationAccountId===account.id).sort((a,b)=>b.bookedOn.localeCompare(a.bookedOn)||b.id-a.id).slice(0,3)
 return <details className={'account-entry'+(account.kind==='liability'?' is-debt':'')}>
  <summary><span className="account-entry-icon" aria-hidden="true">{account.kind==='liability'?<WalletCards size={19}/>:<Landmark size={19}/>}</span><span className="account-entry-name"><strong>{account.name}</strong><small>{activity.length?'Activity '+dateLabel(activity[0].bookedOn):account.kind==='liability'?'Outstanding balance':'Cash / bank account'}</small></span><span className="account-entry-balance"><strong>{money(account.balanceCents)}</strong>{account.kind==='liability'&&<small>owed</small>}</span><ChevronDown className="account-entry-chevron" size={16}/></summary>
  <div className="account-entry-detail"><p>{account.kind==='liability'?'Outstanding principal after recorded repayments.':'Balance includes the opening amount and recorded transactions.'}</p>{activity.length>0&&<><h4>Recent recorded activity</h4><ul>{activity.map(t=><li key={t.id}><span><strong>{t.note||t.kind}</strong><small>{dateLabel(t.bookedOn)} · {t.kind}</small></span><strong>{t.kind==='expense'?'−':t.kind==='income'?'+':''}{money(t.amountCents)}</strong></li>)}</ul></>}<Link href="/dashboard?view=transactions">Open Spending <ArrowRight size={13}/></Link></div>
 </details>
}

export default function AccountsPanel({accounts,valuations,transactions,position,cashCents,currentDate,accountForm,valuationForm}:Props){
 const [addMode,setAddMode]=useState<'account'|'valuation'>('account')
 const [formKey,setFormKey]=useState(0)
 const dialog=useRef<HTMLDialogElement>(null)
 const openAdd=(mode:'account'|'valuation'='account')=>{setAddMode(mode);setFormKey(n=>n+1);dialog.current?.showModal()}
 useEffect(()=>{dialog.current?.close()},[accounts.length,valuations.length])
 const cash=accounts.filter(a=>a.kind==='asset'),debts=accounts.filter(a=>a.kind==='liability')
 const otherAssets=valuations.filter(v=>v.kind==='asset'),otherDebts=valuations.filter(v=>v.kind==='liability')
 const otherCents=position.assetsCents-cashCents
 const showAllocation=position.assetsCents>0&&cashCents>=0&&otherCents>=0
 const cashShare=showAllocation?cashCents/position.assetsCents*100:0
 const count=accounts.length+valuations.length
 return <section className="cfo-card accounts-panel" aria-label="My accounts">
  <div className="accounts-panel-heading"><h2>My accounts <span>{count}</span></h2><button type="button" className="accounts-add" onClick={()=>openAdd()}><Plus size={15}/>Account</button></div>
  <div className="accounts-net-worth"><span>Net worth <small>what you own minus what you owe</small></span><FitMoney>{money(position.netWorthCents)}</FitMoney><small>Recorded position · {dateLabel(currentDate)}</small></div>
  <div className="accounts-totals"><a href="#accounts-cash"><span>Bank and cash</span><FitMoney>{money(cashCents)}</FitMoney><small>{cash.length} account{cash.length===1?'':'s'}</small></a><a href="#accounts-other"><span>Other assets</span><FitMoney>{money(otherCents)}</FitMoney><small>{otherAssets.length} dated valuation{otherAssets.length===1?'':'s'}</small></a><a href="#accounts-debts" className="accounts-owed"><span>Owed</span><FitMoney>{money(position.liabilitiesCents)}</FitMoney><small>{debts.length+otherDebts.length} debt{debts.length+otherDebts.length===1?'':'s'}</small></a></div>
  {showAllocation&&<div className="accounts-allocation"><h3>Where your assets are</h3><div className="accounts-allocation-track" role="img" aria-label={'Recorded assets: bank and cash '+money(cashCents)+', other assets '+money(otherCents)}><span style={{width:cashShare+'%'}}/><span style={{width:(100-cashShare)+'%'}}/></div><div className="accounts-allocation-key"><span><i/>Bank and cash <b>{Math.round(cashShare)}%</b></span><span><i/>Other assets <b>{Math.round(100-cashShare)}%</b></span><strong>Total assets {money(position.assetsCents)}</strong></div></div>}
  <div id="accounts-cash" className="accounts-group"><header><h3>Bank and cash</h3><strong>{money(cashCents)}</strong></header>{cash.length?cash.map(a=><AccountRow key={a.id} account={a} transactions={transactions}/>):<div className="accounts-empty"><span>No bank or cash accounts yet.</span><button type="button" onClick={()=>openAdd()}>Add an account <Plus size={13}/></button></div>}</div>
  <div id="accounts-other" className="accounts-group"><header><h3>Other assets</h3><strong>{money(otherCents)}</strong></header><ValuationManager valuations={otherAssets} title={null} description={null} emptyText="No other assets recorded. Add a dated value for investments, CPF, property or another asset."/></div>
  <div id="accounts-debts" className="accounts-group accounts-debt-group"><header><h3>Cards and loans</h3><strong>{money(position.liabilitiesCents)} owed</strong></header>{debts.map(a=><AccountRow key={a.id} account={a} transactions={transactions}/>)}{otherDebts.length>0&&<ValuationManager valuations={otherDebts} title={null} description={null}/>} {!debts.length&&!otherDebts.length&&<p className="accounts-empty">No debts recorded.</p>}</div>
  <p className="accounts-footnote">Cash accounts follow your recorded transactions. Other assets use dated manual values. Track each asset or debt once.</p>
  <dialog className="accounts-dialog" ref={dialog} aria-labelledby="accounts-add-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><div className="accounts-dialog-heading"><h2 id="accounts-add-title">Add to your accounts</h2><button type="button" aria-label="Close add account" onClick={()=>dialog.current?.close()}><X size={20}/></button></div><div className="accounts-add-tabs" role="group" aria-label="Record type"><button type="button" aria-pressed={addMode==='account'} onClick={()=>setAddMode('account')}>Cash or loan account</button><button type="button" aria-pressed={addMode==='valuation'} onClick={()=>setAddMode('valuation')}>Other asset or debt</button></div><div className="accounts-dialog-body" key={addMode+formKey}>{addMode==='account'?accountForm:valuationForm}</div></dialog>
 </section>
}
