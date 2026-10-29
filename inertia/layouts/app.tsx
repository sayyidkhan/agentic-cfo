import { Form } from '@adonisjs/inertia/react'
import { Link, usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'
import { LayoutDashboard, ReceiptText, Target, MessageCircle, Leaf, LogOut } from 'lucide-react'
import ThemeToggle from '~/components/theme_toggle'
import FlashToasts from '~/components/flash_toasts'
import SandyAvatar from '~/components/sandy_avatar'

const nav = [
  { label: 'Summary', url: '/dashboard', view: 'overview', icon: LayoutDashboard },
  { label: 'Activity', url: '/dashboard?view=transactions', view: 'transactions', icon: ReceiptText },
  { label: 'Budget', url: '/dashboard?view=budget', view: 'budget', icon: Target },
  { label: 'Sandy', url: '/cfo', view: 'chat', icon: MessageCircle },
] as const

export default function AppLayout({ children }: { children: ReactNode }) {
  const { url } = usePage()
  const selected = url.startsWith('/cfo') ? 'chat' :
    (new URLSearchParams(url.split('?')[1] || '').get('view') || 'overview')
  return <div className="cfo-app">
    <header className="header header--bar">
      <div className="header__inner">
        <Link className="cfo-brand-row" href="/dashboard" aria-label="Acorra home">
          <span className="cfo-brand-mark"><Leaf size={21}/></span>
          <span className="cfo-brand-type"><strong>Acorra</strong><span>Grow your wealth, one habit at a time</span></span>
        </Link>
        <div className="cfo-header-side">
          <span className="cfo-header-pill">YOUR WEALTH COMPANION</span>
          <Link href="/cfo" aria-label="Chat with Sandy" className="cfo-header-sandy"><SandyAvatar size="sm" /></Link>
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
          <Link href={href} key={view} aria-current={(selected==='wealth'?'overview':selected) === view ? 'page' : undefined}>
            <Icon size={16}/>{label}
          </Link>)}
      </div>
    </nav>
    <main className="app-main">{children}</main>
    <FlashToasts/>
  </div>
}
