import { useRef, useState, type ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import { Bell, Info, Plus, X, TriangleAlert, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Planning } from './financial_planning'

type Panel='spending'|'goals'|'bills'
interface Props {
 activePanel:Panel; insights:Planning['insights']; budgetForm:ReactNode; goalForm:ReactNode; billForm:ReactNode
 onReview:(panel:Panel)=>void
}
const target=(code:string):Panel=>code==='cash_shortfall'||code==='past_due_bills'?'bills':code.startsWith('goal_')?'goals':'spending'
const reviewLabel=(panel:Panel)=>panel==='bills'?'Review bills':panel==='goals'?'Review goals':'Review budgets'
export default function PlanActions({activePanel,insights,budgetForm,goalForm,billForm,onReview}:Props){
 const manage=useRef<HTMLDialogElement>(null),alerts=useRef<HTMLDialogElement>(null),info=useRef<HTMLDialogElement>(null)
 const [formTab,setFormTab]=useState<Panel>('spending'),[formKey,setFormKey]=useState(0)
 const [filter,setFilter]=useState<'all'|'warning'|'notice'>('all')
 const warnings=insights.filter(i=>i.severity==='warning').length,notices=insights.length-warnings
 const visible=filter==='all'?insights:insights.filter(i=>i.severity===filter)
 const openManage=()=>{setFormTab(activePanel);setFormKey(n=>n+1);manage.current?.showModal()}
 return <div className="plan-actions">
  <button type="button" className="plan-manage-button" onClick={openManage}><Plus size={16}/>Manage</button>
  <button type="button" className={'plan-icon-button plan-alert-button'+(warnings?' has-warning':'')} aria-label={'Financial alerts, '+insights.length+' active'} title="Financial alerts" onClick={()=>{setFilter('all');alerts.current?.showModal()}}><Bell size={19}/><span className={'plan-alert-count'+(!insights.length?' is-empty':'')} aria-hidden="true">{insights.length>99?'99+':insights.length}</span></button>
  <button type="button" className="plan-icon-button" aria-label="About Plan" title="About Plan" onClick={()=>info.current?.showModal()}><Info size={19}/></button>
  <dialog ref={manage} className="plan-dialog" aria-labelledby="plan-manage-title" onClick={e=>{if(e.target===e.currentTarget)manage.current?.close()}}>
   <div className="plan-dialog-heading"><div><span>YOUR PLAN</span><h2 id="plan-manage-title">Manage your plan</h2></div><button type="button" className="plan-close" aria-label="Close Manage" onClick={()=>manage.current?.close()}><X size={20}/></button></div>
   <div className="plan-manage-tabs" role="group" aria-label="Manage plan sections">{(['spending','goals','bills'] as Panel[]).map(tab=><button key={tab} type="button" aria-pressed={formTab===tab} onClick={()=>setFormTab(tab)}>{tab==='spending'?'Budgets':tab==='goals'?'Goals':'Bills'}</button>)}</div>
   <div className="plan-dialog-body" key={formTab+formKey}>{formTab==='spending'?budgetForm:formTab==='goals'?goalForm:billForm}</div>
   <div className="plan-dialog-footer"><button type="button" className="btn btn--secondary" onClick={()=>manage.current?.close()}>Done</button></div>
  </dialog>
  <dialog ref={alerts} className="plan-dialog plan-alert-dialog" aria-labelledby="plan-alerts-title" onClick={e=>{if(e.target===e.currentTarget)alerts.current?.close()}}>
   <div className="plan-dialog-heading"><div><span>{insights.length} ACTIVE</span><h2 id="plan-alerts-title">Financial alerts</h2></div><button type="button" className="plan-close" aria-label="Close alerts" onClick={()=>alerts.current?.close()}><X size={20}/></button></div>
   <div className="plan-alert-filters" role="group" aria-label="Filter financial alerts">{([{key:'all',label:'All',count:insights.length},{key:'warning',label:'Warnings',count:warnings},{key:'notice',label:'Notices',count:notices}] as const).map(item=><button key={item.key} type="button" aria-pressed={filter===item.key} onClick={()=>setFilter(item.key)}>{item.label}<span>{item.count}</span></button>)}</div>
   <div className="plan-dialog-body"><p className="plan-dialog-note">Current signals from your recorded budgets, bills and goals.</p>{visible.length?visible.map(i=><article key={i.code} className={'plan-alert-item is-'+i.severity}><div className="plan-alert-item-title">{i.severity==='warning'?<TriangleAlert size={18}/>:<Info size={18}/>}<div><span>{i.severity==='warning'?'Warning':'Notice'}</span><h3>{i.title}</h3></div></div><p>{i.detail}</p><button type="button" onClick={()=>{alerts.current?.close();onReview(target(i.code))}}>{reviewLabel(target(i.code))}<ArrowRight size={14}/></button></article>):<div className="plan-alert-empty"><CheckCircle2 size={28}/><h3>{filter==='all'?'No active alerts':filter==='warning'?'No warnings':'No notices'}</h3><p>Keep your records up to date. Alerts only cover the information you have recorded.</p></div>}</div>
   <div className="plan-dialog-footer"><Link href="/cfo">Ask Sandy <ArrowRight size={14}/></Link><button type="button" className="btn btn--secondary" onClick={()=>alerts.current?.close()}>Done</button></div>
  </dialog>
  <dialog ref={info} className="plan-dialog plan-info-dialog" aria-labelledby="plan-info-title" onClick={e=>{if(e.target===e.currentTarget)info.current?.close()}}>
   <div className="plan-dialog-heading"><div><span>HOW IT WORKS</span><h2 id="plan-info-title">About your plan</h2></div><button type="button" className="plan-close" aria-label="Close Plan information" onClick={()=>info.current?.close()}><X size={20}/></button></div>
   <div className="plan-dialog-body"><dl className="plan-info-list"><div><dt>Budgets</dt><dd>Set monthly category limits. Recorded expenses count towards the matching category and month. Transfers are excluded.</dd></div><div><dt>Goals</dt><dd>Track a saved amount against a target and date. Updating progress does not change cash or add another asset to net worth.</dd></div><div><dt>Bills</dt><dd>Add monthly reminders with a due day from 1–28. Marking a bill paid updates the reminder; record the expense separately to update balances.</dd></div><div><dt>Cash after bills</dt><dd>Recorded cash minus this month’s known unpaid bills, including overdue reminders. It does not include unrecorded expenses.</dd></div><div><dt>Alerts</dt><dd>The bell counts current warnings and notices. They recalculate when your records change. Reviewing an alert does not remove it; the count changes when the underlying condition changes.</dd></div></dl></div>
   <div className="plan-dialog-footer"><button type="button" className="btn btn--secondary" onClick={()=>info.current?.close()}>Got it</button></div>
  </dialog>
 </div>
}
