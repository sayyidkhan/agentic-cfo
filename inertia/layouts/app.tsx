import { Form } from '@adonisjs/inertia/react'
import { Link, usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'
import { LayoutDashboard, ReceiptText, Target, Landmark, MessageCircle, Wallet, LogOut } from 'lucide-react'
import ThemeToggle from '~/components/theme_toggle'
import FlashToasts from '~/components/flash_toasts'

const nav = [
  { label: 'Overview', url: '/dashboard', view: 'overview', icon: LayoutDashboard },
  { label: 'Transactions', url: '/dashboard?view=transactions', view: 'transactions', icon: ReceiptText },
  { label: 'Budgets & goals', url: '/dashboard?view=budget', view: 'budget', icon: Target },
  { label: 'Wealth', url: '/dashboard?view=wealth', view: 'wealth', icon: Landmark },
  { label: 'Ask CFO', url: '/cfo', view: 'chat', icon: MessageCircle },
] as const

export default function AppLayout({ children }: { children: ReactNode }) {
  const { url } = usePage()
  const selected = url.startsWith('/cfo') ? 'chat' :
    (new URLSearchParams(url.split('?')[1] || '').get('view') || 'overview')
  return <div className="cfo-app">
    <header className="header header--bar">
      <div className="header__inner">
        <Link className="cfo-brand-row" href="/dashboard" aria-label="Agentic CFO home">
          <span className="cfo-brand-mark"><Wallet size={21}/></span>
          <span className="cfo-brand-type"><strong>Agentic CFO</strong><span>Make better money decisions</span></span>
        </Link>
        <div className="cfo-header-side">
          <span className="cfo-header-pill">PERSONAL FINANCE</span>
          <ThemeToggle/>
          <Form route="session.destroy">
            <button className="btn btn--secondary btn--sm" type="submit"><LogOut size={15}/> <span>Log out</span></button>
          </Form>
        </div>
      </div>
    </header>
    <nav className="cfo-navigation" aria-label="Financial workspace">
      <div className="cfo-navigation-inner">
        {nav.map(({ label, url: href, view, icon: Icon }) =>
          <Link href={href} key={view} aria-current={selected === view ? 'page' : undefined}>
            <Icon size={16}/>{label}
          </Link>)}
      </div>
    </nav>
    <main className="app-main">{children}</main>
    <FlashToasts/>
  </div>
}
