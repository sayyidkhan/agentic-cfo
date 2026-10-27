import React,{useEffect,useRef,useState,useId} from 'react'
import {seasons,sampleSeasonStory} from './season_story'
export function SeasonalAtmosphere(){return <div className="al-seasonal-atmosphere" aria-hidden="true"><div className="al-season-veil"/><div className="al-season-beams"/><div className="al-season-wind">{Array.from({length:10},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div></div>}
function Acorn({className=''}:{className?:string}){const id='nut'+useId().replace(/:/g,'');return <svg className={className} viewBox="0 0 70 85" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e9b766"/><stop offset=".5" stopColor="#b97738"/><stop offset="1" stopColor="#704326"/></linearGradient></defs><path d="M12 33Q8 62 35 81Q61 61 58 33Z" fill={'url(#'+id+')'} stroke="#6b4328" strokeWidth="2"/><path d="M8 35C6 3 62 2 63 35Q36 46 8 35" fill="#815936" stroke="#543c28" strokeWidth="2"/><path d="M29 12Q27 2 39 3" stroke="#644b2b" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="m15 22 8 8 9-9 9 9 9-8M18 35l10-8 10 9 10-9 8 6" stroke="#bd965b" strokeWidth="2" fill="none" opacity=".8"/><path d="M18 47Q20 65 31 72" stroke="#f1cc85" strokeWidth="3" opacity=".7" fill="none" strokeLinecap="round"/></svg>}
export default function SeasonalHero(){
 const root=useRef<HTMLDivElement>(null),elapsed=useRef(.65),paintRef=useRef<(time:number)=>void>(()=>{}),[season,setSeason]=useState(0)
 useEffect(()=>{
  const el=root.current;if(!el)return
  let frame=0,last=0,visible=true,disposed=false,current=-1
  const preference=matchMedia('(prefers-reduced-motion: reduce)')
  const paint=(time:number)=>{
   const s=sampleSeasonStory(time);el.style.setProperty('--sandy-x',s.x+'%');el.style.setProperty('--sandy-y',s.y+'%');el.style.setProperty('--sandy-angle',s.angle+'deg');el.style.setProperty('--sandy-mobile-x',(36+s.x*.35)+'%')
   for(const [key,value] of Object.entries({carry:s.carry,crouch:s.crouch,rest:s.rest,visibility:s.opacity,nut:s.nut,'nut-x':s.nutX+'%','nut-y':s.nutY+'%','season-progress':s.progress}))el.style.setProperty('--'+key,String(value))
   el.dataset.stash=String(s.stash);el.dataset.deposit=String(s.deposit);el.dataset.action=s.index===3?'resting':s.t<2.8?'gathering':s.t<4.65?'stashing':'settling'
   if(current!==s.index){current=s.index;setSeason(current);el.dataset.season=seasons[current].id;el.closest<HTMLElement>('.acorra-landing')!.dataset.season=seasons[current].id}
  };paintRef.current=paint
  const loop=(now:number)=>{frame=0;if(disposed||!visible||document.hidden||preference.matches)return;if(!last||now-last>=32){elapsed.current+=last?Math.min((now-last)/1000,.1):0;last=now;paint(elapsed.current)}frame=requestAnimationFrame(loop)}
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;el.dataset.motion=preference.matches?'reduced':'active';if(preference.matches){elapsed.current=Math.floor(elapsed.current/8)*8+6;paint(elapsed.current)}else if(visible&&!document.hidden)frame=requestAnimationFrame(loop)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.04});observer.observe(el)
  preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);paint(elapsed.current);sync()
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);paintRef.current=()=>{}}
 },[])
 const choose=(index:number)=>{elapsed.current=index*8+(matchMedia('(prefers-reduced-motion: reduce)').matches?6:.4);paintRef.current(elapsed.current)}
 return <div className="al-season-story" ref={root} data-season="spring" data-stash="3" role="group" aria-label="Sandy gathers and stores acorns through the seasons">
  <div className="al-season-scene" aria-hidden="true"><div className="al-season-plane">
   {seasons.map(s=><img className={'al-season-world season-'+s.id} key={s.id} src={'/assets/seasons/v1/'+s.id+'.webp'} alt="" fetchPriority={s.id==='spring'?'high':undefined} width="1024" height="1024"/>)}
   <div className="al-scene-weather">{Array.from({length:20},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>
   <div className="al-stash-glow"/><div className="al-acorn-stash">{Array.from({length:6},(_,i)=><Acorn key={i} className={'al-stashed-acorn stash-'+i}/>)}</div>
   <div className="al-foraging-sandy"><img className="al-sandy-carry" src="/assets/seasons/v1/sandy-carry.webp" alt="" width="1024" height="1024"/><img className="al-sandy-stash" src="/assets/seasons/v1/sandy-stash.webp" alt="" width="1024" height="1024"/><img className="al-sandy-rest" src="/assets/sandy/v2/relieved.webp" alt="" width="800" height="800"/></div>
   <Acorn className="al-released-acorn"/><span className="al-stash-spark">✦</span>
   <div className="al-scene-ground-mist"/>
  </div></div>
  <div className="al-season-story-caption"><p>{seasons[season].line}</p></div>
  <div className="al-season-selector" role="group" aria-label="Explore Sandy’s seasons">{seasons.map((s,i)=><button key={s.id} type="button" aria-pressed={season===i} onClick={()=>choose(i)}><span>{s.label}</span><i aria-hidden="true"><b/></i></button>)}</div>
 </div>
}
