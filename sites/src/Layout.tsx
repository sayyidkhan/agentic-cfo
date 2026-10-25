import React from 'react'
import {Link,usePage} from './bridge'
import SandyAvatar from '../../inertia/components/sandy_avatar'
import {Leaf,LayoutDashboard,ReceiptText,Target,Landmark,MessageCircle,RotateCcw} from 'lucide-react'
export default function Layout({children}:any){const page=usePage();const selected=page.url.startsWith('/cfo')?'chat':new URLSearchParams(page.url.split('?')[1]).get('view')||'overview'
 const nav=[['Overview','/dashboard','overview',LayoutDashboard],['Transactions','/dashboard?view=transactions','transactions',ReceiptText],['Budgets & goals','/dashboard?view=budget','budget',Target],['Wealth','/dashboard?view=wealth','wealth',Landmark],['Chat with Sandy','/cfo','chat',MessageCircle]] as const
 return <div className="cfo-app"><div className="demo-banner" role="status"><strong>PUBLIC DEMO · SYNTHETIC DATA ONLY</strong><span>Do not enter personal financial information. Changes stay in memory and reset on reload.</span></div>
 <header className="header header--bar"><div className="header__inner"><Link className="cfo-brand-row" href="/"><span className="cfo-brand-mark"><Leaf size={23}/></span><span className="cfo-brand-type"><strong>Acorra</strong><span>Grow your wealth, one habit at a time.</span></span></Link><div className="cfo-header-side"><button className="btn btn--secondary btn--sm" onClick={()=>page.reset()}><RotateCcw size={14}/>Reset demo</button><Link href="/cfo" aria-label="Chat with Sandy"><SandyAvatar/></Link></div></div></header>
 <nav className="cfo-navigation" aria-label="Financial workspace"><div className="cfo-navigation-inner">{nav.map(([label,href,view,Icon])=><Link key={view} href={href} aria-current={view===selected?'page':undefined}><Icon size={16}/>{label}</Link>)}</div></nav>
 <main className="app-main">{children}</main><footer className="site-footer">Acorra · A little intention. A wealth of possibility.<br/><small>SGD only · No bank connections, payments or trades · Guided mode uses rules, not a generative AI model.</small></footer></div>
}
