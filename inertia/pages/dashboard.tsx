import { overviewBudget, overviewInsights } from '../../app/services/finance/overview.js'
import { formatSgd } from '../../app/services/finance/money.js'
import { Form } from '@adonisjs/inertia/react'
import { Link, usePage } from '@inertiajs/react'
import { AlertCircle, ArrowRight, Plus, ShieldCheck, CalendarDays, MessageCircle, ArrowLeft, Landmark, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Page from '~/components/page'
import FitMoney from '~/components/fit_money'
import useCountUp from '~/hooks/use_count_up'
import { budgetCountFrame, countedCents } from '~/lib/count_up'
import SandyAvatar from '~/components/sandy_avatar'
import AppLayout from '~/layouts/app'
import FinancialPlanning, { CreateBillForm, CreateGoalForm } from '~/components/financial_planning'
import PlanActions from '~/components/plan_actions'
import BudgetOverview from '~/components/budget_overview'
import RefreshButton from '~/components/refresh_button'
import SpendingPage from '~/components/spending_page'
import AccountsPanel from '~/components/accounts_panel'

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
    detail: 'Set budgets, build savings and stay ahead of bills.',
  },
  wealth: {
    eyebrow: 'THE BIG PICTURE',
    title: 'Accounts',
    detail: 'Everything you own and owe.',
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
  const [categoryId, setCategoryId] = useState('')
  const [addingCategory, setAddingCategory] = useState(!categories.length)
  const knownIds = useRef(categories.map(c => c.id))
  useEffect(() => {
    const added = categories.find(c => !knownIds.current.includes(c.id))
    knownIds.current = categories.map(c => c.id)
    if (added) { setCategoryId(String(added.id)); setAddingCategory(false) }
  }, [categories])
  return <section className="plan-budget-form">
    <p className="plan-form-intro">Choose a category and set its monthly limit.</p>
    <Form route="finance.budgets.store">
      {({errors, processing}) => <div className="cfo-form-grid plan-budget-grid">
        <label className="cfo-wide">Category<select name="categoryId" value={categoryId} onChange={e=>setCategoryId(e.target.value)} required><option value="" disabled>Choose a category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>
        <label>Month<input name="month" type="month" defaultValue={month} required/></label>
        <label>Monthly limit (S$)<input name="limit" inputMode="decimal" required placeholder="500.00"/></label>
        <InlineErrors errors={errors}/>
        <button type="submit" className="cfo-action cfo-wide plan-submit" disabled={processing || !categories.length}>{processing?'Saving…':'Save budget'}</button>
      </div>}
    </Form>
    <details className="plan-new-category" open={addingCategory} onToggle={e=>setAddingCategory(e.currentTarget.open)}>
      <summary><Plus size={15}/>Add a category</summary>
      <Form route="finance.categories.store">
        {({errors, processing}) => <div className="plan-category-fields">
          <label>Category name<input name="name" maxLength={80} required placeholder="e.g. Shopping"/></label>
          <button className="cfo-action cfo-action--quiet" type="submit" disabled={processing}>{processing?'Adding…':'Add category'}</button>
          <InlineErrors errors={errors}/>
        </div>}
      </Form>
    </details>
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

function OverviewCount({final,display}:{final:string;display:string}) {
  return <span className="count-value"><span className="count-sr">{final}</span><span className="count-size" aria-hidden="true">{final}</span><span className="count-live" aria-hidden="true">{display}</span></span>
}

/** One visible-time clock keeps the entire monthly card and its bar in sync. */
function OverviewMonth({month,monthLabel,expenseCents,availableCashCents,financialPosition,incomeCents,recorded,hasBudgets,pulse}: Pick<DashboardProps,'month'|'expenseCents'|'availableCashCents'|'financialPosition'|'incomeCents'> & {monthLabel:string;recorded:boolean;hasBudgets:boolean;pulse:ReturnType<typeof overviewBudget>}) {
  const {ref,elapsed,counting}=useCountUp([month,expenseCents,availableCashCents,financialPosition.netWorthCents,incomeCents,pulse.limitCents,pulse.spentCents].join(':'))
  const frame=budgetCountFrame(pulse.limitCents,pulse.spentCents,elapsed)
  return <section className="cfo-card overview-month" aria-label="Monthly financial overview" ref={ref} data-counting={counting}>
          <div className="overview-month-heading"><span>THIS MONTH</span><span className="overview-period"><CalendarDays size={13}/>{monthLabel}</span></div>
          <div className="overview-metrics">
            <div className="overview-spent"><span>Spent this month</span><FitMoney display={money(countedCents(expenseCents,elapsed))}>{money(expenseCents)}</FitMoney><Link href="/dashboard?view=transactions">View spending <ArrowRight size={12}/></Link></div>
            <div><span>Recorded cash</span><FitMoney display={money(countedCents(availableCashCents,elapsed))}>{money(availableCashCents)}</FitMoney><Link href="/dashboard?view=wealth">Cash &amp; bank accounts <ArrowRight size={12}/></Link></div>
            <div><span>Estimated net worth</span><FitMoney display={recorded?money(countedCents(financialPosition.netWorthCents,elapsed)):undefined}>{recorded?money(financialPosition.netWorthCents):'Not set up'}</FitMoney><Link href="/dashboard?view=wealth">View accounts <ArrowRight size={12}/></Link></div>
          </div>
          <div className="overview-budget-pulse">
            <div className="overview-pulse-label"><strong>Category budgets</strong><span>{hasBudgets?<OverviewCount final={Math.round(pulse.percentUsed)+'% used'} display={Math.round(frame.percent)+'% used'}/>:'No limits set yet'}</span></div>
            <div className={'overview-progress'+(pulse.remainingCents<0?' is-over':'')} role="progressbar" aria-label="Monthly category budgets used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(100,Math.max(0,pulse.percentUsed)))} aria-valuetext={money(pulse.spentCents)+' spent against '+money(pulse.limitCents)+' in category limits'}><span style={{width:frame.bar+'%'}}/></div>
            <div className="overview-pulse-caption"><span>{hasBudgets?<><OverviewCount final={money(pulse.spentCents)} display={money(frame.spent)}/> of <OverviewCount final={money(pulse.limitCents)} display={money(frame.budgeted)}/> in category limits</>:<>Create a budget to put your spending in context.</>}</span><strong>{hasBudgets?<><OverviewCount final={money(Math.abs(pulse.remainingCents))} display={money(Math.abs(frame.remaining))}/> {pulse.remainingCents<0?'over budget':'remaining'}</>:''}</strong></div>
            {pulse.unbudgetedCents>0&&<Link className="overview-coverage" href="/dashboard?view=budget"><OverviewCount final={money(pulse.unbudgetedCents)} display={money(countedCents(pulse.unbudgetedCents,elapsed))}/> of spending has no category limit <ArrowRight size={12}/></Link>}
          </div>
          <div className="overview-flow"><div><span>Income this month</span><strong><OverviewCount final={money(incomeCents)} display={money(countedCents(incomeCents,elapsed))}/></strong></div><div><span>Income less spending</span><strong><OverviewCount final={money(incomeCents-expenseCents)} display={money(countedCents(incomeCents-expenseCents,elapsed))}/></strong></div><Link href="/dashboard?view=budget">Review plan <ArrowRight size={14}/></Link></div>
        </section>
}

export default function Dashboard(props: DashboardProps) {
  const { url } = usePage()
  const view = viewFromUrl(url)
  const [refreshVersion,setRefreshVersion]=useState(0)
  const refreshAction=<RefreshButton key={view} label={pageText[view].title} onRefreshed={()=>setRefreshVersion(n=>n+1)}/>
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

  return <Page title={descriptor.title} hideTitle>
    <div className={'cfo-workspace workspace-'+view+(view==='overview'?' clarity-overview':'')}>
      {view!=='transactions'&&<header className="cfo-page-intro">
        {view==='budget'?<><div className="cfo-eyebrow">{monthLabel}</div><div className="plan-heading-line"><h1>{descriptor.title}</h1><PlanActions refreshAction={refreshAction} activePanel={planTab} insights={signals} onReview={setPlanTab} budgetForm={<BudgetForms categories={categories} month={month}/>} goalForm={<CreateGoalForm currentDate={currentDate}/>} billForm={<CreateBillForm/>}/></div><p>{descriptor.detail}</p></>:<><div>{view==='wealth'&&<Link className="summary-back" href="/dashboard"><ArrowLeft size={14}/>Overview</Link>}<div className="cfo-eyebrow">{monthLabel}</div><h1>{descriptor.title}</h1><p>{descriptor.detail}</p></div>
        {view==='overview'&&<div className="overview-header-actions">{refreshAction}<Link href="/dashboard?view=wealth" className="overview-accounts-link"><Landmark size={16}/>Accounts</Link><Link href="/dashboard?view=transactions&add=1" className="overview-add"><Plus size={17}/>Add entry</Link></div>}</>}
      </header>}

      {view === 'overview' && <>
        {!recorded && <div className="cfo-card cfo-alert" role="status"><ShieldCheck size={21}/><div><strong>Start with your first account</strong><p>Add a cash or bank balance, then record a transaction and set a monthly budget.</p><Link href="/dashboard?view=wealth" className="cfo-action">Add an account <ArrowRight size={14}/></Link></div></div>}
        <OverviewMonth key={refreshVersion} month={month} monthLabel={monthLabel} expenseCents={expenseCents} availableCashCents={availableCashCents} financialPosition={financialPosition} incomeCents={incomeCents} recorded={recorded} hasBudgets={budgetStatus.length>0} pulse={pulse}/>
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

      {view==='transactions'&&<SpendingPage monthLabel={monthLabel} currentDate={currentDate} incomeCents={incomeCents} expenseCents={expenseCents} transactions={recentTransactions} accounts={accounts} categories={categories} refreshAction={refreshAction} createForm={<TransactionForm accounts={accounts} categories={categories} currentDate={currentDate}/>} openAdd={new URLSearchParams(url.split('?')[1]).has('add')}/>}

      {view === 'budget' && <>
        <div className="acorra-tabs" role="group" aria-label="Plan sections">{(['spending','goals','bills'] as const).map(tab=><button key={tab} aria-pressed={planTab===tab} onClick={()=>setPlanTab(tab)}>{tab==='spending'?'Budgets':tab==='goals'?'Goals':'Bills'}<span className="plan-section-count">{tab==='spending'?budgetStatus.length:tab==='goals'?goals.length:commitments.length}</span></button>)}</div>
        {planTab==='spending'&&<BudgetOverview animationKey={refreshVersion} budgets={budgetStatus} categories={categories} expenseCents={expenseCents}/>}
        {planTab!=='spending'&&<FinancialPlanning showCreate={false} showGuidance={false} panel={planTab} commitments={commitments} goals={goals} planning={planning} month={month} currentDate={currentDate} availableCashCents={availableCashCents}/>}
      </>}

      {view === 'wealth' && <AccountsPanel accounts={accounts} valuations={valuations} transactions={recentTransactions} position={financialPosition} cashCents={availableCashCents} currentDate={currentDate} accountForm={<AccountForm/>} valuationForm={<ValuationForm currentDate={currentDate}/>}/>}

    </div>
  </Page>
}

Dashboard.layout = [AppLayout]
