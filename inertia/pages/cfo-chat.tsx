import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useRef } from 'react'
import { BookOpen, LockKeyhole, Send, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
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
          <div className="cfo-eyebrow">Your money companion</div>
          <h1>Sandy</h1>
          <p>Your friendly money companion is here to help you make sense of spending, savings and wealth. Sandy uses read-only financial facts and cannot move money.</p>
        </div>
        
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
                <p>Budgets, bills or a goal—what’s on your mind?</p>
                <span className="cfo-pill cfo-pill--good"><ShieldCheck size={13}/> No account changes or payments</span>
              </div> :
                messages.map(message => <div className={'cfo-chat-message ' + (message.role === 'user' ? 'cfo-chat-message--user' : 'cfo-chat-message--agent')} key={message.id}>
                  <div className="cfo-chat-message-name">{message.role === 'user' ? 'You' : <span className="sandy-message-byline"><SandyAvatar size="sm" /> Sandy</span>}</div>
                  <div className="cfo-chat-message-text">{message.content}</div>
                </div>)
              }
            </div>
            <div className="cfo-chat-compose">
              {!configured && <details className="cfo-chat-mode"><summary>Guided mode <span>About Sandy</span></summary><p>Uses rules and your recorded financial calculations, not a generative AI model. Sandy can explain the numbers but cannot change your records.</p></details>}
              <Form route="cfo.message.store" resetOnSuccess>
                {({errors, processing}) => <div className="cfo-chat-form">
                  <label htmlFor="cfo-question" className="cfo-eyebrow">YOUR QUESTION</label>
                  <textarea ref={composerRef} id="cfo-question" name="message" rows={2} required minLength={2} maxLength={1500}
                    placeholder="Ask Sandy about your money…"
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
          <details className="cfo-card acorra-chat-privacy" style={{marginTop:16}}>
            <summary>Your data &amp; privacy <LockKeyhole size={16}/></summary>
            <p className="cfo-subtle">Conversation history is stored in this app's SQLite database. When an AI provider is configured, your question and relevant financial figures are transmitted to that provider.</p>
            <p className="cfo-subtle" style={{marginTop:12}}>Sandy cannot change budgets or send payments. Valuations may be outdated, and suggestions depend on the records you provide.</p>
          </details>
        </aside>
      </div>
    </div>
  </Page>
}

CfoChat.layout = [AppLayout]
