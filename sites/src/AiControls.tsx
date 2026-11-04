import React from 'react'
import {Link,usePage} from './bridge'
import {Sparkles} from 'lucide-react'

export function AiPreferenceSwitch(){
 const page=usePage()
 return <div className="ai-preference"><div><strong id="ai-preference-label">Use AI when connected</strong><p id="ai-preference-help">{page.aiPreferred?'On · Connect a provider to use AI.':'Off · Sandy uses guided mode.'}</p></div><button type="button" role="switch" aria-checked={!!page.aiPreferred} aria-labelledby="ai-preference-label" aria-describedby="ai-preference-help" className="ai-preference-switch" onClick={()=>page.setAiPreferred(!page.aiPreferred)}><span/></button></div>
}

export default function ChatAiControls(){
 return <div className="chat-ai-controls"><div className="chat-ai-connect"><Sparkles size={18}/><div><strong>AI not connected</strong><p>Bring your own eligible subscription.</p></div><Link href="/settings?section=ai&from=chat">Connect AI →</Link></div><AiPreferenceSwitch/><p className="ai-preference-footnote">Guided mode stays active until an AI provider is connected. Subscription connections are not available yet.</p></div>
}
