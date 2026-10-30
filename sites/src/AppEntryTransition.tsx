import React,{useEffect,useRef,useState} from 'react'
import AcorraMark from '../../inertia/components/acorra_mark'

/** Covers the route swap, then reveals the rendered destination. No fake progress. */
export default function AppEntryTransition({ready,onCovered,onDone}:{ready:boolean,onCovered:()=>void,onDone:()=>void}){
 const [phase,setPhase]=useState('cover'),started=useRef(performance.now())
 const callbacks=useRef({onCovered,onDone});callbacks.current={onCovered,onDone}
 useEffect(()=>{
  const previous=document.body.style.overflow;document.body.style.overflow='hidden'
  let cover=0,secondFrame=0,covered=false,clockStarted=false
  const coverRoute=()=>{if(covered)return;covered=true;callbacks.current.onCovered();setPhase('loading')}
  // Start the presentation clock after a painted frame, not during click work.
  const startClock=()=>{if(clockStarted)return;clockStarted=true;started.current=performance.now();cover=window.setTimeout(coverRoute,320)}
  const firstFrame=requestAnimationFrame(()=>{secondFrame=requestAnimationFrame(startClock)})
  const paintFallback=window.setTimeout(startClock,120)
  // Background tabs and slow connections must never trap navigation.
  const fallback=window.setTimeout(()=>{coverRoute();setPhase('reveal')},8000)
  return()=>{cancelAnimationFrame(firstFrame);cancelAnimationFrame(secondFrame);clearTimeout(cover);clearTimeout(paintFallback);clearTimeout(fallback);document.body.style.overflow=previous}
 },[])
 useEffect(()=>{
  if(phase!=='loading'||!ready)return
  const timer=window.setTimeout(()=>setPhase('reveal'),Math.max(0,1900-(performance.now()-started.current)))
  return()=>clearTimeout(timer)
 },[phase,ready])
 useEffect(()=>{
  if(phase!=='reveal')return
  const timer=window.setTimeout(()=>callbacks.current.onDone(),650)
  return()=>clearTimeout(timer)
 },[phase])
 return <div className={'acorra-entry acorra-entry--'+phase} role="status" aria-live="polite" aria-label="Opening Acorra" data-phase={phase}>
  <div className="acorra-entry-atmosphere" aria-hidden="true"><i/><i/><i/></div>
  <div className="acorra-entry-sparks" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{'--angle':(i*30)+'deg','--delay':(i%4)*.09+'s'} as React.CSSProperties}/>)}</div>
  <div className="acorra-entry-content">
   <div className="acorra-entry-emblem" aria-hidden="true"><span className="acorra-entry-halo"/><span className="acorra-entry-orbit"/><span className="acorra-entry-orbit acorra-entry-orbit--inner"/><span className="acorra-entry-logo"><AcorraMark size={92}/></span></div>
   <span className="acorra-entry-wordmark" aria-hidden="true">{Array.from('Acorra').map((letter,i)=><span key={i} style={{'--letter':i} as React.CSSProperties}>{letter}</span>)}</span>
   <span className="acorra-entry-caption">Opening Acorra<span aria-hidden="true">…</span></span>
   <span className="acorra-entry-track" aria-hidden="true"><i/></span>
  </div>
 </div>
}
