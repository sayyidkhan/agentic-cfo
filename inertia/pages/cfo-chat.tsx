import { Form } from '@adonisjs/inertia/react'
import { Link, router } from '@inertiajs/react'
import { useRef } from 'react'
import { AlertCircle, ArrowLeft, BookOpen, LockKeyhole, MessageCircle, Send, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import AppLayout from '~/layouts/app'
import SandyAvatar from '~/components/sandy_avatar'
import Page from '~/components/page'

interface CfoChatProps {
  configured: boolean
  dailyMessageLimit: number
  messages: { id: number; role: 'user' | 'assistant'; content: string }[]
}
const suggestions = [
  { title: 'Review my spending', prompt: 'How are my category budgets looking this month?' },
  { title: 'Prepare for bills', prompt: 'What unpaid bills should I prepare for this month?' },
  { title: 'Understand my wealth', prompt: 'What is my recorded net worth and how was it calculated?' },
  { title: 'Check my goals', prompt: 'How am I progressing on my savings goals?' },
]

export default function CfoChat({ configured, messages, dailyMessageLimit }: CfoChatProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const insertSuggestion = (prompt: string) => {
    if (!composerRef.current) return
    composerRef.current.value = prompt
    composerRef.current.focus()
  }
  return <Page title="Chat with Sandy" hideTitle>
    <div className="cfo-workspace cfo-chat-page">
      <header className="cfo-page-intro">
        <div>
          <div className="cfo-eyebrow">PERSONAL FINANCIAL GUIDANCE</div>
          <h1>Meet Sandy.</h1>
          <p>Your friendly money companion is here to help you make sense of spending, savings and wealth. Sandy uses read-only financial facts and cannot move money.</p>
        </div>
        <Link href="/dashboard" className="cfo-action cfo-action--quiet"><ArrowLeft size={15}/> Financial overview</Link>
      </header>
      <div className="cfo-grid">
        <div className="cfo-span-8">
          <section className="cfo-card" style={{padding:0,overflow:'hidden'}}>
            <header className="cfo-chat-header">
              <div className="cfo-brand-row">
                <SandyAvatar size="md" />
                <span className="cfo-brand-type"><strong>Sandy the Squirrel</strong><span>Acorra’s friendly financial companion</span></span>
              </div>
              {messages.length > 0 && <button className="btn btn--secondary btn--sm" type="button"
                onClick={() => { if (window.confirm('Delete your CFO conversation history?')) router.delete('/cfo/chat') }}>
                <Trash2 size={14}/> Clear history
              </button>}
            </header>
            <div className="cfo-chat-thread" aria-live="polite">
              {messages.length === 0 ? <div className="cfo-chat-welcome">
                <SandyAvatar size="lg" />
                <h2>Hi, I’m Sandy. 🐿️</h2>
                <p>Let’s grow your money habits, one small win at a time. Ask me about your monthly budget, upcoming bills or savings goals.</p>
                <span className="cfo-pill cfo-pill--good"><ShieldCheck size={13}/> No account changes or payments</span>
              </div> :
                messages.map(message => <div className={'cfo-chat-message ' + (message.role === 'user' ? 'cfo-chat-message--user' : 'cfo-chat-message--agent')} key={message.id}>
                  <div className="cfo-chat-message-name">{message.role === 'user' ? 'You' : <span className="sandy-message-byline"><SandyAvatar size="sm" /> Sandy</span>}</div>
                  <div className="cfo-chat-message-text">{message.content}</div>
                </div>)
              }
            </div>
            <div className="cfo-chat-compose">
              {!configured && <div className="cfo-chat-notice" role="status">
                <AlertCircle size={17}/>
                <div><strong>Guided mode — works without an AI key</strong><p>Your recorded finances are reviewed locally using deterministic rules. No external model or additional subscription setup is required for guided mode.</p></div>
              </div>}
              <Form route="cfo.message.store" resetOnSuccess>
                {({errors, processing}) => <div className="cfo-chat-form">
                  <label htmlFor="cfo-question" className="cfo-eyebrow">YOUR QUESTION</label>
                  <textarea ref={composerRef} id="cfo-question" name="message" rows={3} required minLength={2} maxLength={1500}
                    placeholder="Could I spend S$300 this month and still cover my upcoming bills?"
                    disabled={processing}/>
                  {errors.message && <p className="cfo-field-error" role="alert">{errors.message}</p>}
                  <div className="cfo-between" style={{alignItems:'center',flexWrap:'wrap',gap:10}}>
                    <span className="cfo-subtle">SGD · {dailyMessageLimit} questions/day · {configured ? 'AI mode' : 'Guided mode'} · Not financial advice</span>
                    <button className="cfo-action" type="submit" disabled={processing}>
                      <Send size={15}/>{processing ? 'Reviewing your finances…' : 'Send question'}
                    </button>
                  </div>
                </div>}
              </Form>
            </div>
          </section>
        </div>
        <aside className="cfo-span-4">
          <section className="cfo-card">
            <div className="cfo-card-header"><h2>Try asking…</h2><BookOpen size={19} color="var(--cfo-brand)"/></div>
            <p className="cfo-card-note">A few good starting points. Choose a question to fill the composer.</p>
            <div style={{display:'grid',gap:9}}>
              {suggestions.map(suggestion => <button type="button" key={suggestion.title} className="cfo-suggested-question"
                disabled={false} onClick={() => insertSuggestion(suggestion.prompt)}>
                <span><strong>{suggestion.title}</strong><small>{suggestion.prompt}</small></span>
                <Sparkles size={15}/>
              </button>)}
            </div>
          </section>
          <section className="cfo-card" style={{marginTop:16}}>
            <div className="cfo-card-header"><h2>Your data stays under your control</h2><LockKeyhole size={19} color="var(--cfo-brand)"/></div>
            <p className="cfo-subtle">Conversation history is stored in this app's SQLite database. When an AI provider is configured, your question and relevant financial figures are transmitted to that provider.</p>
            <p className="cfo-subtle" style={{marginTop:12}}>Sandy cannot change budgets or send payments. Valuations may be outdated, and suggestions depend on the records you provide.</p>
          </section>
        </aside>
      </div>
    </div>
  </Page>
}

CfoChat.layout = [AppLayout]
