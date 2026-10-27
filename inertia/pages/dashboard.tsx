import { formatSgd } from '../../app/services/finance/money.js'
import { Form } from '@adonisjs/inertia/react'
import { Link, usePage } from '@inertiajs/react'
import { AlertCircle, ArrowRight, Plus, ShieldCheck, CalendarDays, MessageCircle, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { useState } from 'react'
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
    detail: 'See what you have, what is coming up, and which decisions deserve attention.',
  },
  transactions: {
    eyebrow: 'MONEY IN & OUT',
    title: 'Transactions',
    detail: 'Record your income, spending and transfers without losing track of where the money went.',
  },
  budget: {
    eyebrow: 'MAKE A PLAN',
    title: 'Budgets & goals',
    detail: 'Set limits, track goals, and prepare for bills before they become surprises.',
  },
  wealth: {
    eyebrow: 'THE BIG PICTURE',
    title: 'Wealth',
    detail: 'Your recorded assets minus liabilities, with transparent valuation dates.',
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
      Create one in the Wealth view before recording transactions.
      <Link href="/dashboard?view=wealth">Set up an account <ArrowRight size={13}/></Link>
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
          Add an expense category in Budgets before recording expenses.
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
  const {
    accounts, categories, currentDate, month, incomeCents, expenseCents,
    financialPosition, budgetStatus, valuations, recentTransactions, availableCashCents,
    commitments, goals, planning,
  } = props
  const descriptor = pageText[view]
  const recorded = accounts.length > 0 || valuations.length > 0
  const assetsTotal = financialPosition.assetsCents
  const debtTotal = financialPosition.liabilitiesCents
  const wealthBase = Math.max(0, assetsTotal) + Math.max(0, debtTotal)
  const share = wealthBase ? Math.min(100, Math.max(0, (Math.max(0, assetsTotal) / wealthBase) * 100)) : 0
  const categoryName = (id: number | null) => categories.find(c => c.id === id)?.name ?? 'Uncategorised'

  return <Page title={view === 'overview' ? 'Acorra · Overview' : descriptor.title} hideTitle>
    <div className={'cfo-workspace workspace-'+view}>
      <header className="cfo-page-intro">
        <div><div className="cfo-eyebrow">{new Intl.DateTimeFormat('en-SG',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T00:00:00Z'))}</div><h1>{descriptor.title}</h1><p>{descriptor.detail}</p></div>
      </header>

      {view === 'overview' && <>
        {!recorded && <div className="cfo-card cfo-alert" role="status">
          <ShieldCheck size={21}/>
          <div><strong>Welcome to Acorra</strong><p>Start by adding a bank account or a valuation. The dashboard will use your real entries—never sample figures presented as your finances.</p>
            <Link className="cfo-action" href="/dashboard?view=wealth">Get started <ArrowRight size={14}/></Link></div>
        </div>}
        <div className="acorra-snapshot" aria-label="Money snapshot">
          <div><span>Recorded cash</span><FitMoney>{money(availableCashCents)}</FitMoney><small>Cash &amp; accounts</small></div>
          <div><span>Spent this month</span><FitMoney>{money(expenseCents)}</FitMoney><small>Income {money(incomeCents)}</small></div>
          <div><span>Est. net worth</span><FitMoney>{recorded?money(financialPosition.netWorthCents):'Not set up'}</FitMoney><Link href="/dashboard?view=wealth">Assets & debts →</Link></div>
        </div>
        <nav className="acorra-quick-actions" aria-label="Quick actions">
          <Link href="/dashboard?view=transactions&add=1"><span><Plus size={21}/></span>Add entry</Link>
          <Link href="/dashboard?view=budget"><span><CalendarDays size={20}/></span>Plan ahead</Link>
          <Link href="/cfo"><span><MessageCircle size={21}/></span>Ask Sandy</Link>
        </nav>
        <section className="cfo-card acorra-next">
          <div className="cfo-brand-row"><SandyAvatar size="md"/><div><h2>Sandy’s check-in</h2><p className="cfo-card-note">{planning.insights.length?planning.insights[0].title:'No immediate risks flagged in these records.'}</p></div></div>
          {planning.insights.length>0&&<details className="acorra-details"><summary>Review {planning.insights.length} signal{planning.insights.length===1?'':'s'}</summary><Insights insights={planning.insights}/></details>}
          <div className="acorra-bill-line"><span>Unpaid bills this month <strong>{money(planning.upcomingTotalCents)}</strong></span><Link href="/dashboard?view=budget">Review plan →</Link></div>
          <p className="cfo-card-note">Cash after those bills: {money(planning.cashAfterUpcomingCents)}. Estimate from recorded bills only.</p>
        </section>
        <section className="cfo-card acorra-recent">
          <div className="cfo-card-header"><h2>Recent activity</h2><Link href="/dashboard?view=transactions">View all →</Link></div>
          {!recentTransactions.length?<div className="cfo-empty">No transactions yet. Record your first income or expense.</div>:<div className="acorra-activity">{recentTransactions.slice(0,3).map(t=><div key={t.id}><span className="acorra-activity-label"><i className={'activity-icon kind-'+t.kind} aria-hidden="true">{t.kind==='income'?<ArrowDownLeft size={17}/>:t.kind==='transfer'?<ArrowLeftRight size={17}/>:<ArrowUpRight size={17}/>}</i><span><strong>{t.note||categoryName(t.categoryId)}</strong><small>{t.bookedOn} · {t.kind}</small></span></span><strong>{t.kind==='expense'?'−':t.kind==='income'?'+':''}{money(t.amountCents)}</strong></div>)}</div>}
        </section>
        <details className="cfo-card acorra-details"><summary>Budget health <span>{budgetStatus.length} categories</span></summary><BudgetBars budgets={budgetStatus} categories={categories} budgetStatus={budgetStatus}/></details>
      </>}

      {view === 'transactions' && <div className="cfo-grid">
        <section className="cfo-card cfo-span-12 transaction-summary">
          <div className="cfo-card-header"><div><h2>Monthly cash flow</h2><p className="cfo-card-note">Recorded income less expenses, excluding transfers</p></div><span className="cfo-pill">{month}</span></div>
          <div className="cfo-grid">
            <div className="cfo-span-4"><span className="cfo-subtle">Income</span><div className="cfo-stat-value"><FitMoney>{money(incomeCents)}</FitMoney></div></div>
            <div className="cfo-span-4"><span className="cfo-subtle">Expenses</span><div className="cfo-stat-value"><FitMoney>{money(expenseCents)}</FitMoney></div></div>
            <div className="cfo-span-4"><span className="cfo-subtle">Net cash flow</span><div className="cfo-stat-value"><FitMoney>{money(incomeCents-expenseCents)}</FitMoney></div></div>
          </div>
        </section>
        <div className="cfo-span-12 transaction-entry"><details className="acorra-details cfo-card" open={recentTransactions.length===0||new URLSearchParams(url.split('?')[1]).has('add')}><summary>Add a transaction <Plus size={16}/></summary><TransactionForm accounts={accounts} categories={categories} currentDate={currentDate}/></details></div>
        <div className="cfo-span-12 transaction-records"><TransactionManager transactions={recentTransactions} accounts={accounts} categories={categories}/></div>
      </div>}

      {view === 'budget' && <>
        <div className="acorra-tabs" role="group" aria-label="Plan sections">{(['spending','goals','bills'] as const).map(tab=><button key={tab} aria-pressed={planTab===tab} onClick={()=>setPlanTab(tab)}>{tab==='spending'?'Spending':tab==='goals'?'Goals':'Bills'}</button>)}</div>
        {planTab==='spending'&&<><section className="cfo-card"><div className="cfo-card-header"><h2>Monthly spending limits</h2><span className="cfo-subtle">{month}</span></div><BudgetBars budgets={budgetStatus} categories={categories} budgetStatus={budgetStatus}/></section><details className="acorra-details cfo-card"><summary>Manage budgets & categories <Plus size={16}/></summary><BudgetForms categories={categories} month={month}/></details></>}
        {planTab!=='spending'&&<FinancialPlanning panel={planTab} commitments={commitments} goals={goals} planning={planning} month={month} currentDate={currentDate} availableCashCents={availableCashCents}/>}
        <details className="acorra-details cfo-card"><summary>Financial health <span>{planning.insights.length} signals</span></summary><Insights insights={planning.insights}/></details>
      </>}

      {view === 'wealth' && <>
        <div className="cfo-grid">
          <section className="cfo-card cfo-hero cfo-span-7">
            <div className="cfo-hero-inner">
              <span className="cfo-eyebrow">YOUR RECORDED NET WORTH</span>
              <div className="cfo-hero-number">{recorded ? money(financialPosition.netWorthCents) : 'No records yet'}</div>
              <p className="cfo-hero-text">The sum of your recorded assets less debts. Update manual valuations periodically.</p>
            </div>
          </section>
          <section className="cfo-card cfo-span-5">
            <div className="cfo-card-header"><h2>Balance composition</h2></div>
            <div className="cfo-wealth-split">
              <div className="cfo-donut" aria-label="Recorded assets compared with liabilities" style={{background: wealthBase ? 'conic-gradient(#268979 0% ' + share + '%, #c9a27f ' + share + '% 100%)' : 'var(--cfo-stroke)'}}>
                <div className="cfo-donut-hole">SGD</div>
              </div>
              <div>
                <div className="cfo-inline-metric"><div className="cfo-inline-metric-label">Assets</div><strong>{money(assetsTotal)}</strong></div>
                <div className="cfo-inline-metric"><div className="cfo-inline-metric-label">Liabilities</div><strong>{money(debtTotal)}</strong></div>
              </div>
            </div>
          </section>
          <section className="cfo-card cfo-span-7">
            <div className="cfo-card-header"><div><h2>Account balances</h2><p className="cfo-card-note">Opening balances plus posted transactions</p></div></div>
            {!accounts.length ? <div className="cfo-empty"><strong>No accounts recorded</strong>Use the form to add a bank account or loan.</div> :
              <div>{accounts.map(a => <div className="cfo-inline-metric" key={a.id}><div className="cfo-inline-metric-label">{a.name}<small>{a.kind === 'asset' ? 'Cash / bank' : 'Loan / debt'}</small></div><strong>{money(a.balanceCents)}</strong></div>)}</div>}
            <p className="cfo-field-note">Compare these calculated balances with statements to identify differences. Automatic bank reconciliation is not enabled.</p>
          </section>
          <div className="cfo-span-5"><details className="acorra-details cfo-card" open={!accounts.length}><summary>Add an account <Plus size={16}/></summary><AccountForm/></details></div>
          <div className="cfo-span-7"><ValuationManager valuations={valuations}/></div>
          <div className="cfo-span-5"><details className="acorra-details cfo-card"><summary>Add an asset or debt <Plus size={16}/></summary><ValuationForm currentDate={currentDate}/></details></div>
        </div>
      </>}
      <p className="cfo-subtle" style={{paddingBottom:12}}>All figures are in SGD. Financial insights depend on the records you supply and are not professional financial or investment advice. No payments are initiated.</p>
    </div>
  </Page>
}

Dashboard.layout = [AppLayout]
