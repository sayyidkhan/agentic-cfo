import {useEffect,useRef,type ReactNode} from 'react'
import {Plus,X} from 'lucide-react'
import FitMoney from './fit_money'
import useCountUp from '../hooks/use_count_up'
import {cashFlowCountFrame} from '../lib/count_up'
import {TransactionManager,type FinanceAccount,type FinanceCategory,type FinanceTransaction} from './financial_record_editor'
import {formatSgd} from '../../app/services/finance/money.js'

/** Isolate the clock so animation frames do not rerender the searchable ledger. */
function SpendingTotals({monthLabel,incomeCents,expenseCents,animationKey}:{monthLabel:string;incomeCents:number;expenseCents:number;animationKey:number}){
 const {ref:countRef,elapsed,counting}=useCountUp([monthLabel,incomeCents,expenseCents,animationKey].join(':'))
 const frame=cashFlowCountFrame(incomeCents,expenseCents,elapsed)
 return <section className="spending-totals" ref={countRef} data-counting={counting} aria-label="Monthly cash flow, excluding transfers">
   <div><span>Spent</span><FitMoney display={formatSgd(frame.spent)}>{formatSgd(expenseCents)}</FitMoney></div>
   <div><span>Income</span><FitMoney display={formatSgd(frame.income)}>{formatSgd(incomeCents)}</FitMoney></div>
   <div><span title="Income minus expenses; transfers excluded">Net flow</span><FitMoney display={formatSgd(frame.net)}>{formatSgd(incomeCents-expenseCents)}</FitMoney></div>
  </section>
}

export default function SpendingPage({monthLabel,currentDate,incomeCents,expenseCents,transactions,accounts,categories,refreshAction,createForm,openAdd,animationKey=0}:{monthLabel:string;currentDate:string;incomeCents:number;expenseCents:number;transactions:FinanceTransaction[];accounts:FinanceAccount[];categories:FinanceCategory[];refreshAction:ReactNode;createForm:ReactNode;openAdd:boolean;animationKey?:number}){
 const dialog=useRef<HTMLDialogElement>(null),previousIds=useRef(new Set(transactions.map(t=>t.id)))
 useEffect(()=>{if(openAdd)dialog.current?.showModal()},[openAdd])
 useEffect(()=>{if(transactions.some(t=>!previousIds.current.has(t.id)))dialog.current?.close();previousIds.current=new Set(transactions.map(t=>t.id))},[transactions])
 return <>
  <header className="spending-header">
   <span className="spending-month">{monthLabel}</span>
   <div className="spending-title-line"><h1>Spending</h1><div className="spending-actions">{refreshAction}<button className="spending-add" type="button" onClick={()=>dialog.current?.showModal()} aria-label="Add transaction"><Plus size={17}/>Add<span className="spending-add-long"> transaction</span></button></div></div>
   <p>Your income, expenses and transfers.</p>
  </header>
  <SpendingTotals monthLabel={monthLabel} incomeCents={incomeCents} expenseCents={expenseCents} animationKey={animationKey}/>
  <TransactionManager animationKey={animationKey} transactions={transactions} accounts={accounts} categories={categories} currentDate={currentDate}/>
  <dialog ref={dialog} className="plan-dialog spending-create-dialog" aria-labelledby="spending-add-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
   <div className="plan-dialog-heading"><h2 id="spending-add-title">Add transaction</h2><button type="button" className="plan-close" aria-label="Close transaction form" onClick={()=>dialog.current?.close()}><X size={20}/></button></div>
   <div className="plan-dialog-body">{createForm}</div>
  </dialog>
 </>
}
