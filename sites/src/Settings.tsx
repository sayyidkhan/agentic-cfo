import React,{useEffect,useState} from 'react'
import {Head,Link,usePage} from './bridge'
import {sandyStates,sandyState} from './sandy_states'
import SandyCharacter from './SandyCharacter'
import SandyStage from './SandyStage'
import {BookOpen,Pause,Play,RotateCcw} from 'lucide-react'
export default function Settings(){
 const [motion,setMotion]=useState(()=>{try{return localStorage.getItem('acorra-sandy-motion')!=='off'}catch{return true}}),[replay,setReplay]=useState(0)
 const toggleMotion=()=>setMotion(value=>{try{localStorage.setItem('acorra-sandy-motion',value?'off':'on')}catch{}return !value})
 const page=usePage(),params=new URLSearchParams(page.url.split('?')[1]),selected=sandyState(params.get('sandy'))
 const [resetNotice,setResetNotice]=useState(false)
 const [greeting,setGreeting]=useState(selected.id==='curious')
 useEffect(()=>{setGreeting(selected.id==='curious')},[selected.id])
 const hello=()=>{setMotion(true);setGreeting(true);setReplay(n=>n+1)}
 useEffect(()=>{if(!params.has('sandy'))return;const title=document.getElementById('sandy-state-title');title?.focus({preventScroll:true});document.getElementById('sandy-state-preview')?.scrollIntoView({block:'start'})},[selected.id])
 return <div className="cfo-workspace sandy-settings"><Head title="Settings · Sandy’s states"/>
 <header className="cfo-page-intro"><div><div className="cfo-eyebrow">SETTINGS / SANDY</div><h1>A little squirrel. A whole range of feelings.</h1><p>Explore all seven of Sandy’s states. Come back anytime to revisit what each expression means.</p></div><span className="cfo-pill"><BookOpen size={14}/> Expression library</span></header>
 <section id="sandy-state-preview" className="sandy-preview cfo-card" aria-label="Selected Sandy state">
 <div className="sandy-preview-art" style={{background:selected.color}}><SandyStage mood={selected.id} animated={motion} replay={replay} greeting={greeting} onHello={hello}/><span className="sandy-sketch-label">SANDY · YOUR LITTLE WEALTH COMPANION</span></div>
 <div className="sandy-preview-copy"><div className="sandy-animation-controls"><button type="button" onClick={toggleMotion} aria-pressed={motion}>{motion?<Pause size={13}/>:<Play size={13}/>} {motion?'Pause animation':'Play animation'}</button><button type="button" onClick={()=>{setMotion(true);setReplay(n=>n+1)}}><RotateCcw size={13}/> Replay reaction</button></div><div className="sandy-performance-options"><button onClick={hello} aria-pressed={greeting}>👋 Wave hello</button><button onClick={()=>{setGreeting(false);setMotion(true);setReplay(n=>n+1)}} aria-pressed={!greeting}>✦ Mood reaction</button></div><div className="cfo-eyebrow">{selected.eyebrow}</div><h2 id="sandy-state-title" tabIndex={-1}>{selected.name} Sandy</h2><blockquote>“{selected.line}”</blockquote><dl><dt>When she appears</dt><dd>{selected.trigger}</dd><dt>What she helps you do</dt><dd>{selected.action}</dd><dt>Her tone</dt><dd>{selected.tone}</dd></dl></div>
 </section>
 <section aria-label="All Sandy states"><div className="cfo-card-header"><h2>Meet every mood</h2><span className="cfo-subtle">Choose a state to preview</span></div><div className="sandy-state-grid">{sandyStates.map(s=><Link key={s.id} href={'/settings?sandy='+s.id} className={'sandy-state-card'+(selected.id===s.id?' is-selected':'')} aria-current={selected.id===s.id?'true':undefined} aria-label={'Preview '+s.name+' Sandy'}><div className="sandy-state-art" style={{background:s.color}}><SandyCharacter mood={s.id}/><span aria-hidden="true">{s.symbol}</span></div><strong>{s.name}</strong><p>{s.trigger}</p><span className="sandy-preview-link">{selected.id===s.id?'Previewing':'View expression'} →</span></Link>)}</div></section>

 <section className="cfo-card settings-reset"><div><h2>Reset demo</h2><p className="cfo-card-note">Restore the original sample finances and clear this tab’s demo chat. Saved accounts are not affected.</p></div><button type="button" className="btn btn--secondary" onClick={()=>{if(page.reset())setResetNotice(true)}}><RotateCcw size={16}/>Reset demo</button>{resetNotice&&<p role="status">Demo restored to its original samples.</p>}</section>
 </div>
}
