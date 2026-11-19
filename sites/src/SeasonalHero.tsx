import React,{useEffect,useRef,useState,useId} from 'react'
import WinterSandy from './WinterSandy'
import {seasons,sampleSeasonStory} from './season_story'
export function SeasonalAtmosphere(){return <div className="al-seasonal-atmosphere" aria-hidden="true"><div className="al-season-veil"/><div className="al-season-beams"/><div className="al-season-wind">{Array.from({length:10},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div></div>}
/** One cut stick for Sandy's lodge; six stack into a small lodge by winter. */
function Stick({className=''}:{className?:string}){const id='log'+useId().replace(/:/g,'');return <svg className={className} viewBox="0 0 70 85" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b07a45"/><stop offset=".55" stopColor="#7a4a26"/><stop offset="1" stopColor="#4f2f19"/></linearGradient></defs><rect x="3" y="32" width="60" height="22" rx="11" fill={'url(#'+id+')'} stroke="#3f2614" strokeWidth="2"/><ellipse cx="58" cy="43" rx="8" ry="11" fill="#dcae70" stroke="#6b4328" strokeWidth="2"/><ellipse cx="58" cy="43" rx="4" ry="6" fill="none" stroke="#9c6b3a" strokeWidth="1.5"/><path d="M13 38Q30 35 47 38M11 48Q28 51 45 48" stroke="#c99257" strokeWidth="2" fill="none" opacity=".7" strokeLinecap="round"/><path d="M22 32l-4-9" stroke="#5d3a1d" strokeWidth="3" strokeLinecap="round"/><path d="M18 23q-7-6 2-10q5 5-2 10" fill="#6f8f3a"/></svg>}
export default function SeasonalHero(){
 const root=useRef<HTMLDivElement>(null),elapsed=useRef(.65),selectedSeason=useRef<number|null>(null),paintRef=useRef<(time:number)=>void>(()=>{}),[season,setSeason]=useState(0)
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
  const loop=(now:number)=>{frame=0;if(disposed||!visible||document.hidden||preference.matches)return;if(!last||now-last>=32){elapsed.current+=last?Math.min((now-last)/1000,.1):0;last=now;if(selectedSeason.current!==null)elapsed.current=selectedSeason.current*8+((elapsed.current-selectedSeason.current*8)%8);paint(elapsed.current)}frame=requestAnimationFrame(loop)}
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;el.dataset.motion=preference.matches?'reduced':'active';if(preference.matches){elapsed.current=Math.floor(elapsed.current/8)*8+6;paint(elapsed.current)}else if(visible&&!document.hidden)frame=requestAnimationFrame(loop)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.04});observer.observe(el)
  preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);paint(elapsed.current);sync()
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);paintRef.current=()=>{}}
 },[])
 const choose=(index:number)=>{selectedSeason.current=index;elapsed.current=index*8+(matchMedia('(prefers-reduced-motion: reduce)').matches?6:.4);paintRef.current(elapsed.current)}
 return <div className="al-season-story" ref={root} data-season="spring" data-stash="3" role="group" aria-label="Sandy builds her lodge one stick at a time through the year, then relaxes on her lounger in winter">
  <div className="al-season-scene" aria-hidden="true"><div className="al-season-plane">
   {seasons.map(s=><img className={'al-season-world season-'+s.id} key={s.id} src={'/assets/seasons/v1/'+s.id+'.webp'} alt="" fetchPriority={s.id==='spring'?'high':undefined} width="1024" height="1024"/>)}
   <div className="al-scene-weather">{Array.from({length:20},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>
   <div className="al-stash-glow"/><div className="al-acorn-stash">{Array.from({length:6},(_,i)=><Stick key={i} className={'al-stashed-acorn stash-'+i}/>)}</div>
   <div className="al-foraging-sandy"><img className="al-sandy-carry" src="/assets/seasons/v1/sandy-carry.webp" alt="" width="1024" height="1024"/><img className="al-sandy-stash" src="/assets/seasons/v1/sandy-stash.webp" alt="" width="1024" height="1024"/><img className="al-sandy-rest" src="/assets/sandy/v2/relieved.webp" alt="" width="800" height="800"/></div>
   <WinterSandy active={season===3}/>
   <Stick className="al-released-acorn"/><span className="al-stash-spark">✦</span>
   <div className="al-scene-ground-mist"/>
  </div></div>
  <div className="al-season-controls"><div className="al-season-story-caption"><p>{seasons[season].line}</p></div>
  <div className="al-season-selector" role="group" aria-label="Explore Sandy’s seasons">{seasons.map((s,i)=><button key={s.id} type="button" aria-pressed={season===i} onClick={()=>choose(i)}><span>{s.label}</span><i aria-hidden="true"><b/></i></button>)}</div></div>
 </div>
}
