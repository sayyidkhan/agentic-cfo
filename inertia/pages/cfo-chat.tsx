import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { MessageCircle, LockKeyhole, Send, Trash2 } from 'lucide-react'
import AppLayout from '~/layouts/app'
import Page from '~/components/page'

interface CfoChatProps {
  configured: boolean
  dailyMessageLimit: number
  messages: { id: number; role: 'user' | 'assistant'; content: string }[]
}

const suggestions = [
  'How is my budget looking this month?',
  'What upcoming bills should I prepare for?',
  'What is my recorded net worth?',
  'How am I progressing on my savings goals?',
]

export default function CfoChat({ configured, messages, dailyMessageLimit }: CfoChatProps) {
  return (
    <Page title="Ask your CFO" description="Ask questions about your recorded finances. The agent can read, explain and suggest—but cannot move money or change records.">
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        <div style={{ border: '1px solid #d4d9dd', borderRadius: 14, padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <MessageCircle size={20} />
              <strong>Private financial conversation</strong>
            </div>
            {messages.length > 0 && <button className="btn btn--secondary btn--sm" type="button" onClick={() => {
              if (window.confirm('Delete your entire CFO chat history?')) router.delete('/cfo/chat')
            }}><Trash2 size={14}/> Clear chat</button>}
          </div>
          <p style={{ fontSize: 13, marginBottom: 12 }}>
            <LockKeyhole size={13} style={{ display: 'inline', marginRight: 6 }}/>
            Your messages are stored in this application's SQLite database. When AI is configured, your question and relevant financial facts are sent to your chosen AI provider. Do not enter secrets.
          </p>
          {messages.length === 0 ? <div style={{ padding: '18px 8px' }}>
            <h2>What would you like to understand?</h2>
            <p>Start with a budget, bank balance, or savings goal in your dashboard, then ask a question here.</p>
            <ul style={{ marginTop: 12 }}>
              {suggestions.map(s => <li key={s} style={{ padding: '5px 0' }}>{s}</li>)}
            </ul>
          </div> :
            <div aria-live="polite" style={{ display: 'grid', gap: 12, maxHeight: 550, overflowY: 'auto', padding: '14px 4px' }}>
              {messages.map(m => <div key={m.id} style={{
                background: m.role === 'user' ? 'var(--surface-secondary, #eeeeee)' : 'transparent',
                padding: '12px 14px', borderRadius: 10,
                border: m.role === 'assistant' ? '1px solid #d4d9dd' : 'none',
              }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>{m.role === 'assistant' ? 'Agentic CFO' : 'You'}</strong>
                <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{m.content}</p>
              </div>)}
            </div>
          }
        </div>

        {!configured && <div role="status" style={{ padding: 14, border: '1px solid #b97b50', borderRadius: 8, marginBottom: 15 }}>
          <strong>AI provider not configured.</strong>
          <p>Set the server-side environment variables CFO_AI_API_KEY and CFO_AI_MODEL, and optionally CFO_AI_BASE_URL. The budgeting dashboard remains usable without AI.</p>
        </div>}
        <Form route="cfo.message.store" resetOnSuccess>
          {({ errors, processing }) => <div style={{ display: 'grid', gap: 10 }}>
            <label htmlFor="cfo-question">Your financial question</label>
            <textarea id="cfo-question" name="message" minLength={2} maxLength={1500} required disabled={!configured || processing}
              placeholder="Can I afford a S$300 purchase this month without missing my savings goal?"
              rows={3} style={{ width: '100%', border: '1px solid #aeb8c0', borderRadius: 8, padding: 12, resize: 'vertical' }}/>
            {errors.message && <p role="alert">{errors.message}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <small>Read-only · SGD · Up to {dailyMessageLimit} questions/day · Not professional financial advice</small>
              <button className="btn btn--primary" type="submit" disabled={!configured || processing}>
                <Send size={15}/> {processing ? 'Reviewing…' : 'Ask CFO'}
              </button>
            </div>
          </div>}
        </Form>
      </div>
    </Page>
  )
}

CfoChat.layout = [AppLayout]
