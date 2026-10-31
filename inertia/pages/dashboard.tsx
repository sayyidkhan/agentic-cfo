import { overviewBudget, overviewInsights } from '../../app/services/finance/overview.js'
import { formatSgd } from '../../app/services/finance/money.js'
import { Form } from '@adonisjs/inertia/react'
import { Link, usePage } from '@inertiajs/react'
import { AlertCircle, ArrowRight, Plus, ShieldCheck, CalendarDays, MessageCircle, ArrowLeft, Landmark, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Page from '~/components/page'
import FitMoney from '~/components/fit_money'
import SandyAvatar from '~/components/sandy_avatar'
import AppLayout from '~/layouts/app'
import FinancialPlanning from '~/components/financial_planning'
import { TransactionManager, ValuationManager } from '~/components/financial_record_editor'

interface DashboardProps {
  accounts: { id: number; name: string; kind: 'asset' | 'liability'; balanceCents: number }[]
  categories: { id: number; name: string }[]
  currentDate: string
  month: string
  incomeCents: number
  expenseCents: number
  financialPosition: { assetsCents: number; liabilitiesCents: number; netWorthCents: number }
  budgetStatus: { id: string; categoryId: string; limitCents: number; spentCents: number; remainingCents: number; percentUsed: number }[]
  valuations: { id: number; name: string; kind: 'asset' | 'liability'; valueCents: number; asOf: string }[]
  recentTransactions: {
    id: number; bookedOn: string; kind: 'income' | 'expense' | 'transfer'
    amountCents: number; accountId: number; destinationAccountId: number | null
    note: string | null; categoryId: number | null
  }[]
  availableCashCents: number
  commitments: { id: number; name: string; amountCents: number; dueDay: number; lastPaidMonth: string | null }[]
  goals: { id: number; name: string; targetCents: number; savedCents: number; targetDate: string }[]
  planning: {
    upcoming: { id: string; name: string; amountCents: number; dueDay: number; dueOn: string; lastPaidMonth?: string | null }[]
    upcomingTotalCents: number
    cashAfterUpcomingCents: number
    insights: { code: string; severity: 'notice' | 'warning'; title: string; detail: string }[]
  }
}

type View = 'overview' | 'transactions' | 'budget' | 'wealth'
const views: View[] = ['overview', 'transactions', 'budget', 'wealth']
export function viewFromUrl(url: string): View {
  const query = url.split('?')[1] || ''
  const selected = new URLSearchParams(query).get('view')
  return views.includes(selected as View) ? selected as View : 'overview'
}
const pageText: Record<View, { eyebrow: string; title: string; detail: string }> = {
  overview: {
    eyebrow: 'YOUR FINANCIAL HOME',
    title: 'Overview',
    detail: 'Your month, at a glance.',
  },
  transactions: {
    eyebrow: 'MONEY IN & OUT',
    title: 'Spending',
    detail: 'Every income, expense and transfer in one place.',
  },
  budget: {
    eyebrow: 'MAKE A PLAN',
    title: 'Plan',
    detail: 'Make room for today. Put something aside for tomorrow.',
  },
  wealth: {
    eyebrow: 'THE BIG PICTURE',
    title: 'Accounts',
    detail: 'Cash, assets and debts, in one place.',
  },
}
const money = formatSgd

function InlineErrors({ errors }: { errors: Record<string, string> }) {
  return <>{Object.entries(errors).map(([key, message]) =>
    <p className="cfo-field-error cfo-wide" key={key} role="alert">{message}</p>)}</>
}

function BudgetBars({ budgets, categories, count }: Pick<DashboardProps, 'categories' | 'budgetStatus'> & { budgets: DashboardProps['budgetStatus']; count?: number }) {
  const items = count === undefined ? budgets : budgets.slice(0, count)
  if (!items.length) return <div className="cfo-empty">
    <strong>No category budgets yet</strong>
    Start with a dining, transport, or shopping limit and build a picture of your spending.
    <Link href="/dashboard?view=budget">Create a budget <ArrowRight size={13}/></Link>
  </div>
  return <div>
    {items.map(b => {
      const name = categories.find(c => String(c.id) === b.categoryId)?.name ?? 'Other'
      const variant = b.remainingCents < 0 ? 'cfo-budget-fill--over' : b.percentUsed >= 80 ? 'cfo-budget-fill--warn' : ''
      return <div className="cfo-budget-row" key={b.id}>
        <div className="cfo-between"><strong>{name}</strong><span>{money(b.spentCents)} / {money(b.limitCents)}</span></div>
        <div className="cfo-budget-track" role="progressbar" aria-label={name + ' budget used'} aria-valuenow={Math.round(Math.min(100, Math.max(0, b.percentUsed)))} aria-valuemin={0} aria-valuemax={100}>
          <div className={'cfo-budget-fill ' + variant} style={{width: Math.min(100, Math.max(0, b.percentUsed)) + '%'}}/>
        </div>
        <div className="cfo-between">
          <span>{b.remainingCents < 0 ? money(-b.remainingCents) + ' over budget' : money(b.remainingCents) + ' remaining'}</span>
          <span>{Math.round(b.percentUsed)}% used</span>
        </div>
      </div>
    })}
  </div>
}

function Insights({ insights, limited = false }: { insights: DashboardProps['planning']['insights']; limited?: boolean }) {
  if (!insights.length) return <div className="cfo-empty">
    <strong>No immediate risks flagged</strong>
    This only covers records you entered. Missing expenses and stale balances can change the picture.
  </div>
  return <div>{(limited ? insights.slice(0, 3) : insights).map(item =>
    <div key={item.code} className={'cfo-alert' + (item.severity === 'warning' ? ' cfo-alert--warning' : '')}>
      <AlertCircle size={17}/>
      <div><strong>{item.title}</strong><p>{item.detail}</p></div>
    </div>)}</div>
}

function TransactionForm({ accounts, categories, currentDate }: Pick<DashboardProps, 'accounts' | 'categories' | 'currentDate'>) {
  const [kind, setKind] = useState<'income' | 'expense' | 'transfer'>('expense')
  const sourceAccounts = accounts.filter(a => a.kind === 'asset')
  return <section className="cfo-card">
    <div className="cfo-card-header"><div><h2>Add a transaction</h2><p className="cfo-card-note">Transfers between your own accounts do not count as expenses.</p></div></div>
    {sourceAccounts.length === 0 ? <div className="cfo-empty">
      <strong>Start with a bank or cash account</strong>
      Add one in Accounts before recording transactions.
      <Link href="/dashboard?view=wealth">Add an account <ArrowRight size={13}/></Link>
    </div> :
    <Form route="finance.transactions.store">
      {({ errors, processing }) => <div className="cfo-form-grid">
        <label>Transaction type<select name="kind" value={kind} onChange={e => setKind(e.target.value as typeof kind)}>
          <option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option>
        </select></label>
        <label>Amount (SGD)<input name="amount" inputMode="decimal" required placeholder="42.50" aria-label="Amount in Singapore dollars"/></label>
        <label>From account<select name="accountId" defaultValue="" required>
          <option value="" disabled>Select account</option>
          {sourceAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select></label>
        <label>Date<input name="bookedOn" type="date" defaultValue={currentDate} required/></label>
        {kind === 'expense' && <label>Category<select name="categoryId" defaultValue="" required>
          <option value="" disabled>Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>}
        {kind === 'transfer' && <label>To account<select name="destinationAccountId" defaultValue="" required>
          <option value="" disabled>Select destination</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select></label>}
        <label className="cfo-wide">Note (optional)<input name="note" maxLength={255} placeholder="Groceries, paycheck or transfer"/></label>
        {kind === 'expense' && categories.length === 0 && <p className="cfo-field-note cfo-wide">
          Add an expense category in Plan before recording expenses.
        </p>}
        <InlineErrors errors={errors}/>
        <button type="submit" className="cfo-action cfo-wide" disabled={processing || (kind === 'expense' && !categories.length)}>
          <Plus size={16}/> {processing ? 'Saving…' : 'Save transaction'}
        </button>
      </div>}
    </Form>}
  </section>
}

function BudgetForms({ categories, month }: Pick<DashboardProps, 'categories' | 'month'>) {
  return <section className="cfo-card">
    <div className="cfo-card-header"><div><h2>Set your limits</h2><p className="cfo-card-note">Create spending categories, then give each a monthly allowance.</p></div></div>
    <Form route="finance.categories.store">
      {({errors, processing}) => <div className="cfo-form-grid">
        <label className="cfo-wide">New category<input name="name" maxLength={80} required placeholder="Dining, transport, shopping"/></label>
        <InlineErrors errors={errors}/>
        <button className="cfo-action cfo-action--quiet cfo-wide" type="submit" disabled={processing}><Plus size={15}/> Add category</button>
      </div>}
    </Form>
    <div style={{borderTop:'1px solid var(--cfo-stroke)', margin:'24px 0'}}/>
    <Form route="finance.budgets.store">
      {({errors, processing}) => <div className="cfo-form-grid">
        <label>Category<select name="categoryId" defaultValue="" required><option value="" disabled>Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>
        <label>Month<input name="month" type="month" defaultValue={month} required/></label>
        <label className="cfo-wide">Monthly limit (SGD)<input name="limit" inputMode="decimal" required placeholder="500.00"/></label>
        <InlineErrors errors={errors}/>
        <button type="submit" className="cfo-action cfo-wide" disabled={processing || !categories.length}>Save monthly budget</button>
      </div>}
    </Form>
  </section>
}

function AccountForm() {
  return <section className="cfo-card">
    <div className="cfo-card-header"><div><h2>Add a financial account</h2><p className="cfo-card-note">Bank and cash balances, or an outstanding loan.</p></div></div>
    <Form route="finance.accounts.store">
      {({errors, processing}) => <div className="cfo-form-grid">
        <label className="cfo-wide">Account name<input name="name" required maxLength={120} placeholder="Everyday bank account"/></label>
        <label>Type<select name="kind"><option value="asset">Cash / bank</option><option value="liability">Debt owed</option></select></label>
        <label>Opening balance (SGD)<input name="openingBalance" inputMode="decimal" required defaultValue="0.00"/></label>
        <InlineErrors errors={errors}/>
        <button type="submit" className="cfo-action cfo-wide" disabled={processing}><Plus size={16}/> Save account</button>
      </div>}
    </Form>
  </section>
}

function ValuationForm({ currentDate }: Pick<DashboardProps, 'currentDate'>) {
  return <section className="cfo-card">
    <div className="cfo-card-header"><div><h2>Value another asset or debt</h2>
      <p className="cfo-card-note">For property and other items not already counted as accounts. Always include the valuation date.</p></div></div>
    <Form route="finance.valuations.store">
      {({ errors, processing }) => <div className="cfo-form-grid">
        <label className="cfo-wide">Name<input name="name" required maxLength={120} placeholder="Property value, CPF"/></label>
        <label>Type<select name="kind"><option value="asset">Asset</option><option value="liability">Debt</option></select></label>
        <label>Value (SGD)<input name="value" inputMode="decimal" required placeholder="50000.00"/></label>
        <label className="cfo-wide">Value as of<input name="asOf" type="date" defaultValue={currentDate} required/></label>
        <InlineErrors errors={errors}/>
        <button type="submit" className="cfo-action cfo-wide" disabled={processing}>Save valuation</button>
      </div>}
    </Form>
  </section>
}

export default function Dashboard(props: DashboardProps) {
  const { url } = usePage()
  const view = viewFromUrl(url)
  const [planTab,setPlanTab] = useState<'spending'|'goals'|'bills'>('spending')
  useEffect(()=>{const section=new URLSearchParams(url.split('?')[1]).get('section');setPlanTab(section==='goals'||section==='bills'?section:'spending')},[url])
  const {
    accounts, categories, currentDate, month, incomeCents, expenseCents,
    financialPosition, budgetStatus, valuations, recentTransactions, availableCashCents,
    commitments, goals, planning,
  } = props
  const pulse=overviewBudget(budgetStatus,expenseCents),signals=overviewInsights(planning.insights),priority=signals[0]
  const monthLabel=new Intl.DateTimeFormat('en-SG',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T00:00:00Z'))
  const shortDate=(value:string)=>new Intl.DateTimeFormat('en-SG',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z'))
  const reviewHref=priority?.code==='cash_shortfall'||priority?.code==='past_due_bills'?'/dashboard?view=budget&section=bills':priority?.code.startsWith('goal_')?'/dashboard?view=budget&section=goals':'/dashboard?view=budget'
  const reviewLabel=priority?.code==='cash_shortfall'||priority?.code==='past_due_bills'?'Review bills':priority?.code.startsWith('goal_')?'Review goals':'Review budgets'
  const descriptor = pageText[view]
  const recorded = accounts.length > 0 || valuations.length > 0
  const assetsTotal = financialPosition.assetsCents
  const debtTotal = financialPosition.liabilitiesCents
  const wealthBase = Math.max(0, assetsTotal) + Math.max(0, debtTotal)
  const share = wealthBase ? Math.min(100, Math.max(0, (Math.max(0, assetsTotal) / wealthBase) * 100)) : 0

  return <Page title={descriptor.title} hideTitle>
    <div className={'cfo-workspace workspace-'+view+(view==='overview'?' clarity-overview':'')}>
      <header className="cfo-page-intro">
        <div>{view==='wealth'&&<Link className="summary-back" href="/dashboard"><ArrowLeft size={14}/>Overview</Link>}<div className="cfo-eyebrow">{monthLabel}</div><h1>{descriptor.title}</h1><p>{descriptor.detail}</p></div>
        {view==='overview'&&<div className="overview-header-actions"><Link href="/dashboard?view=wealth" className="overview-accounts-link"><Landmark size={16}/>Accounts</Link><Link href="/dashboard?view=transactions&add=1" className="overview-add"><Plus size={17}/>Add entry</Link></div>}
      </header>

      {view === 'overview' && <>
        {!recorded && <div className="cfo-card cfo-alert" role="status"><ShieldCheck size={21}/><div><strong>Start with your first account</strong><p>Add a cash or bank balance, then record a transaction and set a monthly budget.</p><Link href="/dashboard?view=wealth" className="cfo-action">Add an account <ArrowRight size={14}/></Link></div></div>}
        <section className="cfo-card overview-month" aria-label="Monthly financial overview">
          <div className="overview-month-heading"><span>THIS MONTH</span><span className="overview-period"><CalendarDays size={13}/>{monthLabel}</span></div>
          <div className="overview-metrics">
            <div className="overview-spent"><span>Spent this month</span><FitMoney>{money(expenseCents)}</FitMoney><Link href="/dashboard?view=transactions">View spending <ArrowRight size={12}/></Link></div>
            <div><span>Recorded cash</span><FitMoney>{money(availableCashCents)}</FitMoney><Link href="/dashboard?view=wealth">Cash &amp; bank accounts <ArrowRight size={12}/></Link></div>
            <div><span>Estimated net worth</span><FitMoney>{recorded?money(financialPosition.netWorthCents):'Not set up'}</FitMoney><Link href="/dashboard?view=wealth">View accounts <ArrowRight size={12}/></Link></div>
          </div>
          <div className="overview-budget-pulse">
            <div className="overview-pulse-label"><strong>Category budgets</strong><span>{budgetStatus.length?Math.round(pulse.percentUsed)+'% used':'No limits set yet'}</span></div>
            <div className={'overview-progress'+(pulse.remainingCents<0?' is-over':'')} role="progressbar" aria-label="Monthly category budgets used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(100,Math.max(0,pulse.percentUsed)))} aria-valuetext={money(pulse.spentCents)+' spent against '+money(pulse.limitCents)+' in category limits'}><span style={{width:Math.min(100,Math.max(0,pulse.percentUsed))+'%'}}/></div>
            <div className="overview-pulse-caption"><span>{budgetStatus.length?<>{money(pulse.spentCents)} of {money(pulse.limitCents)} in category limits</>:<>Create a budget to put your spending in context.</>}</span><strong>{budgetStatus.length?(pulse.remainingCents<0?money(-pulse.remainingCents)+' over budget':money(pulse.remainingCents)+' remaining'):''}</strong></div>
            {pulse.unbudgetedCents>0&&<Link className="overview-coverage" href="/dashboard?view=budget">{money(pulse.unbudgetedCents)} of spending has no category limit <ArrowRight size={12}/></Link>}
          </div>
          <div className="overview-flow"><div><span>Income this month</span><strong>{money(incomeCents)}</strong></div><div><span>Income less spending</span><strong>{money(incomeCents-expenseCents)}</strong></div><Link href="/dashboard?view=budget">Review plan <ArrowRight size={14}/></Link></div>
        </section>
        <section className="cfo-card overview-categories">
          <div className="cfo-card-header"><h2>Where your budget stands</h2><Link href="/dashboard?view=budget">Manage <ArrowRight size={13}/></Link></div>
          <BudgetBars budgets={pulse.highlights} categories={categories} budgetStatus={budgetStatus} count={3}/>
          {budgetStatus.length>3&&<Link className="summary-more" href="/dashboard?view=budget">View all {budgetStatus.length} budgets →</Link>}
        </section>
        <section className="cfo-card overview-sandy" aria-label="Sandy’s check-in">
          <div className="overview-sandy-heading"><SandyAvatar size="md"/><div><h2>Sandy’s check-in</h2><span>{priority?.severity==='warning'?'Needs attention':priority?'Worth a look':'Your next step'}</span></div>{signals.length>0&&<span className="overview-signal-count">{signals.length} signals</span>}</div>
          <h3>{priority?.title||(recorded?'Keep your picture up to date.':'Let’s find your starting point.')}</h3>
          <p>{priority?.detail||(recorded?'No immediate risks flagged in your records. Keep recording expenses and updating balances so the picture stays useful.':'A cash account and a monthly budget are enough to get started. You can add assets and goals as you go.')}</p>
          <div className="overview-sandy-actions"><Link className="overview-review" href={recorded?reviewHref:'/dashboard?view=wealth'}>{recorded?reviewLabel:'Add an account'}<ArrowRight size={14}/></Link><Link href="/cfo">Ask Sandy <MessageCircle size={14}/></Link></div>
          {signals.length>1&&<details className="acorra-details overview-other-signals"><summary>{signals.length-1} more signal{signals.length>2?'s':''}</summary><Insights insights={signals.slice(1)}/></details>}
        </section>
        <section className="cfo-card overview-bills">
          <div className="cfo-card-header"><h2>Bills this month</h2><Link href="/dashboard?view=budget&section=bills">View bills <ArrowRight size={13}/></Link></div>
          <div className="overview-card-total"><strong>{money(planning.upcomingTotalCents)}</strong><span>recorded unpaid</span></div>
          {planning.upcoming.length?<div className="overview-detail-list">{planning.upcoming.slice(0,3).map(b=><Link key={b.id} href="/dashboard?view=budget&section=bills"><span className={'overview-date'+(b.dueOn<currentDate?' is-overdue':'')}><b>{b.dueDay}</b><small>{new Intl.DateTimeFormat('en-SG',{month:'short',timeZone:'UTC'}).format(new Date(b.dueOn+'T00:00:00Z'))}</small></span><span><strong>{b.name}</strong><small>{b.dueOn<currentDate?'Past due · confirm payment':'Due '+shortDate(b.dueOn)}</small></span><strong>{money(b.amountCents)}</strong></Link>)}</div>:<div className="cfo-empty">No unpaid bills recorded this month.</div>}
          <div className="overview-bills-footer"><span>Cash after these bills</span><strong>{money(planning.cashAfterUpcomingCents)}</strong><small>Estimate from recorded bills only</small></div>
        </section>
        <section className="cfo-card overview-goals">
          <div className="cfo-card-header"><h2>Savings goals</h2><Link href="/dashboard?view=budget&section=goals">View goals <ArrowRight size={13}/></Link></div>
          {goals.length?<div className="overview-goal-list">{goals.slice(0,3).map(g=><Link key={g.id} href="/dashboard?view=budget&section=goals"><div><strong>{g.name}</strong><ChevronRight size={15}/></div><div className="overview-goal-amount"><strong>{money(g.savedCents)}</strong><span>of {money(g.targetCents)}</span></div><progress aria-label={g.name+' savings progress'} max={100} value={g.targetCents?Math.min(100,Math.round(100*g.savedCents/g.targetCents)):0} aria-valuetext={money(g.savedCents)+' of '+money(g.targetCents)}/><small>{g.savedCents>=g.targetCents?'Goal reached':money(g.targetCents-g.savedCents)+' to go'} · Target {shortDate(g.targetDate)} {g.targetDate.slice(0,4)}</small></Link>)}</div>:<div className="cfo-empty"><strong>Give your savings a purpose</strong><Link href="/dashboard?view=budget&section=goals">Create your first goal <ArrowRight size={13}/></Link></div>}
          <p className="overview-goal-note">Goal progress is a plan, not an additional asset.</p>
        </section>
      </>}

      {view === 'transactions' && <div className="cfo-grid">
        <div className="cfo-span-12 transaction-entry"><details className="acorra-details cfo-card" open={recentTransactions.length===0||new URLSearchParams(url.split('?')[1]).has('add')}><summary>Add a transaction <Plus size={16}/></summary><TransactionForm accounts={accounts} categories={categories} currentDate={currentDate}/></details></div>
        <div className="cfo-span-12 transaction-records"><TransactionManager transactions={recentTransactions} accounts={accounts} categories={categories}/></div>
      </div>}

      {view === 'budget' && <>
        <div className="acorra-tabs" role="group" aria-label="Plan sections">{(['spending','goals','bills'] as const).map(tab=><button key={tab} aria-pressed={planTab===tab} onClick={()=>setPlanTab(tab)}>{tab==='spending'?'Budgets':tab==='goals'?'Goals':'Bills'}</button>)}</div>
        {planTab==='spending'&&<><section className="cfo-card"><div className="cfo-card-header"><h2>Monthly spending limits</h2><span className="cfo-subtle">{month}</span></div><BudgetBars budgets={budgetStatus} categories={categories} budgetStatus={budgetStatus}/></section><details className="acorra-details cfo-card"><summary>Manage budgets & categories <Plus size={16}/></summary><BudgetForms categories={categories} month={month}/></details></>}
        {planTab!=='spending'&&<FinancialPlanning panel={planTab} commitments={commitments} goals={goals} planning={planning} month={month} currentDate={currentDate} availableCashCents={availableCashCents}/>}
        <details className="acorra-details cfo-card"><summary>Financial health <span>{planning.insights.length} signals</span></summary><Insights insights={planning.insights}/></details>
      </>}

      {view === 'wealth' && <>
        <div className="cfo-grid">
          <section className="cfo-card cfo-hero cfo-span-7">
            <div className="cfo-hero-inner">
              <span className="cfo-eyebrow">ASSETS MINUS DEBTS</span>
              <div className="cfo-hero-number"><FitMoney>{recorded ? money(financialPosition.netWorthCents) : 'No records yet'}</FitMoney></div>
              <p className="cfo-hero-text">The sum of your recorded assets less debts. Update manual valuations periodically.</p>
            </div>
          </section>
          <section className="cfo-card cfo-span-5">
            <div className="cfo-card-header"><h2>Balance composition</h2></div>
            <div className="cfo-wealth-split">
              <div className="cfo-donut" aria-label="Recorded assets compared with liabilities" style={{background: wealthBase ? 'conic-gradient(#497758 0% ' + share + '%, #c3ad78 ' + share + '% 100%)' : 'var(--cfo-stroke)'}}>
                <div className="cfo-donut-hole">SGD</div>
              </div>
              <div>
                <div className="cfo-inline-metric"><div className="cfo-inline-metric-label">Assets</div><strong>{money(assetsTotal)}</strong></div>
                <div className="cfo-inline-metric"><div className="cfo-inline-metric-label">Liabilities</div><strong>{money(debtTotal)}</strong></div>
              </div>
            </div>
          </section>
          <section id="summary-accounts" className="cfo-card cfo-span-7">
            <div className="cfo-card-header"><div><h2>Account balances</h2><p className="cfo-card-note">Opening balances plus posted transactions</p></div></div>
            {!accounts.length ? <div className="cfo-empty"><strong>No accounts recorded</strong>Use the form to add a bank account or loan.</div> :
              <div>{accounts.map(a => <div className="cfo-inline-metric" key={a.id}><div className="cfo-inline-metric-label">{a.name}<small>{a.kind === 'asset' ? 'Cash / bank' : 'Loan / debt'}</small></div><strong>{money(a.balanceCents)}</strong></div>)}</div>}
            <p className="cfo-field-note">Compare these calculated balances with statements to identify differences. Automatic bank reconciliation is not enabled.</p>
            <details className="acorra-details wealth-add" open={!accounts.length}><summary>Add an account <Plus size={16}/></summary><AccountForm/></details>
          </section>
          <div className="cfo-span-5 wealth-other"><ValuationManager valuations={valuations}/><details className="acorra-details cfo-card"><summary>Add an asset or debt <Plus size={16}/></summary><ValuationForm currentDate={currentDate}/></details></div>
        </div>
      </>}
    </div>
  </Page>
}

Dashboard.layout = [AppLayout]
