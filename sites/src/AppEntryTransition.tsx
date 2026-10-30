import React,{useEffect,useRef,useState} from 'react'
import AcorraMark from '../../inertia/components/acorra_mark'

/** Covers the route swap, then reveals the rendered destination. No fake progress. */
export default function AppEntryTransition({ready,onCovered,onDone}:{ready:boolean,onCovered:()=>void,onDone:()=>void}){
 const [phase,setPhase]=useState('cover'),started=useRef(performance.now())
 const callbacks=useRef({onCovered,onDone});callbacks.current={onCovered,onDone}
 useEffect(()=>{
  const previous=document.body.style.overflow;document.body.style.overflow='hidden'
  const cover=window.setTimeout(()=>{callbacks.current.onCovered();setPhase('loading')},170)
  // A slow connection must never leave navigation trapped behind the curtain.
  const fallback=window.setTimeout(()=>setPhase('reveal'),8000)
  return()=>{clearTimeout(cover);clearTimeout(fallback);document.body.style.overflow=previous}
 },[])
 useEffect(()=>{
  if(phase!=='loading'||!ready)return
  const timer=window.setTimeout(()=>setPhase('reveal'),Math.max(0,620-(performance.now()-started.current)))
  return()=>clearTimeout(timer)
 },[phase,ready])
 useEffect(()=>{
  if(phase!=='reveal')return
  const timer=window.setTimeout(()=>callbacks.current.onDone(),320)
  return()=>clearTimeout(timer)
 },[phase])
 return <div className={'acorra-entry acorra-entry--'+phase} role="status" aria-live="polite" aria-label="Opening Acorra" data-phase={phase}>
  <div className="acorra-entry-atmosphere" aria-hidden="true"><i/><i/><i/></div>
  <div className="acorra-entry-content">
   <div className="acorra-entry-emblem" aria-hidden="true"><span className="acorra-entry-orbit"/><span className="acorra-entry-orbit acorra-entry-orbit--inner"/><AcorraMark size={70}/></div>
   <span className="acorra-entry-wordmark" aria-hidden="true">Acorra</span>
   <span className="acorra-entry-caption">Opening Acorra<span aria-hidden="true">…</span></span>
   <span className="acorra-entry-track" aria-hidden="true"><i/></span>
  </div>
 </div>
}
