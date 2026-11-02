import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Wallet, CircleCheck, TriangleAlert, ArrowRight } from 'lucide-react'
import { overviewBudget } from '../../app/services/finance/overview.js'
import { formatSgd } from '../../app/services/finance/money.js'
import FitMoney from './fit_money'
import useCountUp from '../hooks/use_count_up'
import { budgetCountFrame } from '../lib/count_up'

type Budget = { id: string; categoryId: string; limitCents: number; spentCents: number; remainingCents: number; percentUsed: number }
type Filter = 'all' | 'attention' | 'track'
const attention = (budget: Budget) => budget.remainingCents < 0 || budget.percentUsed >= 80

function CountValue({final,display}:{final:string;display:string}){
  return <span className="count-value"><span className="count-sr">{final}</span><span className="count-size" aria-hidden="true">{final}</span><span className="count-live" aria-hidden="true">{display}</span></span>
}

function BudgetCategoryCard({budget:b,name}:{budget:Budget;name:string}){
  const {ref,elapsed,counting}=useCountUp(b.id+':'+b.limitCents+':'+b.spentCents)
  const frame=budgetCountFrame(b.limitCents,b.spentCents,elapsed)
  const state=b.remainingCents<0?'over':b.percentUsed>=80?'near':'track'
  const label=state==='over'?'Over budget':state==='near'?(b.remainingCents===0?'At limit':'Near limit'):'On track'
  return <article className={'budget-category-card is-'+state} ref={ref} data-counting={counting}>
    <div className="budget-category-heading"><span className="budget-category-icon"><Wallet size={18}/></span><h3>{name}</h3><span className="budget-category-status">{state==='track'?<CircleCheck size={12}/>:<TriangleAlert size={12}/>} {label}</span></div>
    <div className="budget-category-amount"><strong><CountValue final={formatSgd(b.spentCents)} display={formatSgd(frame.spent)}/></strong><span>of <CountValue final={formatSgd(b.limitCents)} display={formatSgd(frame.budgeted)}/></span></div>
    <div className="budget-category-meter" role="progressbar" aria-label={name+' budget used'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(100,Math.max(0,b.percentUsed)))} aria-valuetext={Math.round(b.percentUsed)+'% used; '+formatSgd(Math.abs(b.remainingCents))+(b.remainingCents<0?' over budget':' remaining')}><span style={{width:frame.bar+'%'}}/></div>
    <div className="budget-category-footer"><strong><CountValue final={formatSgd(Math.abs(b.remainingCents))} display={formatSgd(Math.abs(frame.remaining))}/> {b.remainingCents<0?'over':'left'}</strong><span><CountValue final={Math.round(b.percentUsed)+'% used'} display={Math.round(frame.percent)+'% used'}/></span></div>
  </article>
}

export default function BudgetOverview({ budgets, categories, expenseCents }: {
  budgets: Budget[]
  categories: { id: number; name: string }[]
  expenseCents: number
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const summary = overviewBudget(budgets, expenseCents)
  const riskCount = budgets.filter(attention).length
  const shown = summary.highlights.filter(b => filter === 'all' || (filter === 'attention' ? attention(b) : !attention(b)))
  const {ref:countRef,elapsed,counting}=useCountUp(summary.limitCents+':'+summary.spentCents)
  const frame=budgetCountFrame(summary.limitCents,summary.spentCents,elapsed)
  const percent = Math.round(summary.percentUsed)
  return <div className="budget-dashboard">
    {budgets.length > 0 && <section className={'budget-summary'+(summary.remainingCents < 0 ? ' is-over' : '')} aria-label="Monthly category budget summary" ref={countRef} data-counting={counting}>
      <div className="budget-summary-heading"><span><Wallet size={16}/>MONTHLY BUDGET</span><span className={'budget-summary-status'+(riskCount ? ' needs-attention' : '')}>{riskCount ? <TriangleAlert size={13}/> : <CircleCheck size={13}/>} {riskCount ? riskCount+' '+(riskCount===1?'category needs':'categories need')+' attention' : 'All categories on track'}</span></div>
      <div className="budget-summary-metrics">
        <div><span>Budgeted</span><FitMoney display={formatSgd(frame.budgeted)}>{formatSgd(summary.limitCents)}</FitMoney></div>
        <div><span>Spent in budgets</span><FitMoney display={formatSgd(frame.spent)}>{formatSgd(summary.spentCents)}</FitMoney></div>
        <div className="budget-summary-remaining"><span>{summary.remainingCents < 0 ? 'Over budget' : 'Remaining'}</span><FitMoney display={formatSgd(Math.abs(frame.remaining))}>{formatSgd(Math.abs(summary.remainingCents))}</FitMoney></div>
      </div>
      <div className="budget-summary-meter" role="progressbar" aria-label="Total category budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.max(0, percent))} aria-valuetext={percent+'% used; '+formatSgd(summary.spentCents)+' spent against '+formatSgd(summary.limitCents)}><span style={{width:frame.bar+'%'}}/></div>
      <div className="budget-summary-caption"><strong className="count-value"><span className="count-sr">{percent}% used</span><span className="count-size" aria-hidden="true">{percent}% used</span><span className="count-live" aria-hidden="true">{Math.round(frame.percent)}% used</span></strong><span>Across {budgets.length} {budgets.length===1?'category':'categories'} · this month</span></div>
    </section>}

    {summary.unbudgetedCents > 0 && <div className="budget-coverage"><span className="budget-coverage-icon"><Wallet size={18}/></span><div><strong>{formatSgd(summary.unbudgetedCents)} outside category budgets</strong><p>Recorded expenses without a matching monthly limit.</p></div><Link href="/dashboard?view=transactions" aria-label="Review spending outside category budgets"><ArrowRight size={18}/></Link></div>}

    <section className="budget-categories" aria-labelledby="budget-categories-title">
      <div className="budget-section-heading"><div><h2 id="budget-categories-title">Category budgets <span>{budgets.length}</span></h2><p>See where you have room, and what needs a closer look.</p></div>
        {budgets.length > 0 && <div className="budget-filters" role="group" aria-label="Filter category budgets">{([
          {key:'all',label:'All',count:budgets.length},
          {key:'attention',label:'Needs attention',count:riskCount},
          {key:'track',label:'On track',count:budgets.length-riskCount},
        ] as const).map(item=><button key={item.key} type="button" aria-pressed={filter===item.key} onClick={()=>setFilter(item.key)}>{item.label}<span>{item.count}</span></button>)}</div>}
      </div>
      {!budgets.length ? <div className="budget-page-empty"><Wallet size={30}/><h3>Give your spending a plan</h3><p>Use Manage to choose a category and set your first monthly limit.</p></div> : !shown.length ? <div className="budget-page-empty"><CircleCheck size={28}/><h3>{filter==='attention'?'No categories need attention':'No categories in this view'}</h3><p>{filter==='attention'?'Your recorded category spending is below 80% of each limit.':'Try All to see every category budget.'}</p><button type="button" onClick={()=>setFilter('all')}>Show all budgets</button></div> : <div className="budget-category-grid">{shown.map(b=><BudgetCategoryCard key={filter+':'+b.id} budget={b} name={categories.find(c=>String(c.id)===b.categoryId)?.name || 'Other'}/>)}</div>}
    </section>
  </div>
}
