import { Head, Link } from '@inertiajs/react'
import { ArrowRight, CircleDollarSign, Goal, ShieldCheck, TrendingUp } from 'lucide-react'
import MarketingLayout from '~/layouts/marketing'
import SandyAvatar from '~/components/sandy_avatar'

export default function Home() {
  return (
    <main className="acorra-landing">
      <Head title="Grow your wealth, one habit at a time" />
      <section className="acorra-hero">
        <div className="acorra-hero__inner">
          <div className="acorra-hero__copy">
            <span className="acorra-hero__eyebrow">A BETTER WAY TO BUILD WEALTH</span>
            <h1>Big financial goals begin with <em>small habits.</em></h1>
            <p>Acorra makes it easier to understand where your money goes, plan what comes next, and steadily build the future you want—with Sandy by your side.</p>
            <div className="acorra-hero__actions">
              <Link href="/signup" className="acorra-hero__primary">Start your journey <ArrowRight size={18}/></Link>
              <Link href="/login" className="acorra-hero__secondary">I already have an account</Link>
            </div>
            <span className="acorra-hero__footnote"><ShieldCheck size={15}/> Your records stay under your control. No payments are initiated.</span>
          </div>
          <aside className="acorra-hero__companion">
            <div className="acorra-hero__companion-top">
              <span className="acorra-hero__eyebrow">MEET YOUR MONEY COMPANION</span>
              <SandyAvatar size="lg"/>
            </div>
            <h2>Hi, I'm Sandy.</h2>
            <p>I'll help you make sense of your money, celebrate the little wins, and spot what needs attention.</p>
            <div className="acorra-hero__bubbles">
              <span>Understand your spending</span>
              <span>Plan for your goals</span>
              <span>Grow with confidence</span>
            </div>
            <small>Temporary mascot icon · Sandy's final design is coming later</small>
          </aside>
        </div>
      </section>
      <section className="acorra-value">
        <div className="acorra-value__intro">
          <span className="acorra-hero__eyebrow">THE ACORRA WAY</span>
          <h2>Good habits. Stronger finances.</h2>
          <p>Stay close to what matters without feeling overwhelmed by spreadsheets.</p>
        </div>
        <div className="acorra-value__grid">
          <article><CircleDollarSign size={24}/><h3>Know your money</h3><p>Track income, spending and realistic category budgets.</p></article>
          <article><Goal size={24}/><h3>Build your future</h3><p>Set savings goals and see how far your small steps take you.</p></article>
          <article><TrendingUp size={24}/><h3>See your progress</h3><p>Understand recorded assets, debts and estimated net worth.</p></article>
        </div>
      </section>
    </main>
  )
}

Home.layout = [MarketingLayout]
