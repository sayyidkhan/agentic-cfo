import React,{useEffect} from 'react'
import {Head,Link,usePage} from './bridge'
import {sandyStates,sandyState} from './sandy_states'
import SandyExpression from './SandyExpression'
import {BookOpen,Heart,VolumeX} from 'lucide-react'
export default function Settings(){
 const page=usePage(),params=new URLSearchParams(page.url.split('?')[1]),selected=sandyState(params.get('sandy'))
 useEffect(()=>{if(!params.has('sandy'))return;const title=document.getElementById('sandy-state-title');title?.focus({preventScroll:true});document.getElementById('sandy-state-preview')?.scrollIntoView({block:'start'})},[selected.id])
 return <div className="cfo-workspace sandy-settings"><Head title="Settings · Sandy’s states"/>
 <header className="cfo-page-intro"><div><div className="cfo-eyebrow">SETTINGS / SANDY</div><h1>A little squirrel. A whole range of feelings.</h1><p>Explore all seven of Sandy’s states. Come back anytime to revisit what each expression means.</p></div><span className="cfo-pill"><BookOpen size={14}/> Expression library</span></header>
 <section id="sandy-state-preview" className="sandy-preview cfo-card" aria-label="Selected Sandy state">
 <div className="sandy-preview-art" style={{background:selected.color}}><SandyExpression mood={selected.id}/><span className="sandy-sketch-label">TEMPORARY EXPRESSION SKETCH</span></div>
 <div className="sandy-preview-copy"><div className="cfo-eyebrow">{selected.eyebrow}</div><h2 id="sandy-state-title" tabIndex={-1}>{selected.name} Sandy</h2><blockquote>“{selected.line}”</blockquote><dl><dt>When she appears</dt><dd>{selected.trigger}</dd><dt>What she helps you do</dt><dd>{selected.action}</dd><dt>Her tone</dt><dd>{selected.tone}</dd></dl></div>
 </section>
 <section aria-label="All Sandy states"><div className="cfo-card-header"><h2>Meet every mood</h2><span className="cfo-subtle">Choose a state to preview</span></div><div className="sandy-state-grid">{sandyStates.map(s=><Link key={s.id} href={'/settings?sandy='+s.id} className={'sandy-state-card'+(selected.id===s.id?' is-selected':'')} aria-current={selected.id===s.id?'true':undefined} aria-label={'Preview '+s.name+' Sandy'}><div className="sandy-state-art" style={{background:s.color}}><SandyExpression mood={s.id}/><span aria-hidden="true">{s.symbol}</span></div><strong>{s.name}</strong><p>{s.trigger}</p><span className="sandy-preview-link">{selected.id===s.id?'Previewing':'View expression'} →</span></Link>)}</div></section>
 <section className="cfo-card sandy-library-note"><div><Heart size={19}/><h2>On your side, through every season.</h2></div><p>Sandy celebrates progress and recovery. Incomplete records call for curiosity; concerned expressions should always lead to a useful next step. A small savings milestone counts as a win, too.</p><p><VolumeX size={15}/> These previews are silent. Screaming Sandy is an occasional urgent expression, with the screaming marmot as inspiration.</p><small>This library preserves the agreed states, triggers and dialogue. The drawings are temporary mood sketches, and automatic financial-state selection is not enabled yet. Previewing a state does not change your financial records or Sandy’s active behaviour.</small></section>
 </div>
}
