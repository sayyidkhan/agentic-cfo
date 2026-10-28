import {useEffect,useRef,useState,type Ref} from 'react'
import {formatSgd} from '../../app/services/finance/money.js'
import {COUNT_DURATION,countedCents,countedBudget,typingDuration,typedCount} from './preview_motion'
type MotionProps={enabled:boolean;active:boolean}
/** A visible-time clock: pauses offscreen/in a hidden tab and never loops by itself. */
function useVisibleClock(duration:number,key:string,enabled:boolean,active:boolean){
 const elapsed=useRef(0),[time,setTime]=useState(0)
 useEffect(()=>{elapsed.current=0;setTime(0)},[key,duration])
 useEffect(()=>{
  if(!enabled||!active||elapsed.current>=duration)return
  let frame=0,last:number|undefined
  const tick=(now:number)=>{if(last!==undefined)elapsed.current=Math.min(duration,elapsed.current+Math.min(now-last,64));last=now;setTime(elapsed.current);if(elapsed.current<duration)frame=requestAnimationFrame(tick)}
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)
 },[enabled,active,duration,key])
 return time
}
function useInView<T extends HTMLElement>(){
 const ref=useRef<T>(null),[visible,setVisible]=useState(false)
 useEffect(()=>{const el=ref.current;if(!el)return;if(!('IntersectionObserver' in window)){setVisible(true);return}
  const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.2});observer.observe(el);return()=>observer.disconnect()
 },[])
 return {ref,visible}
}
function MoneyValue({cents,value,counting,elementRef}:{cents:number;value:number;counting:boolean;elementRef?:Ref<HTMLSpanElement>}){
 const final=formatSgd(cents)
 return <span className="al-count-number" ref={elementRef} data-counting={counting}><span className="al-motion-sr">{final}</span><span className="al-count-width" aria-hidden="true">{final}</span><span className="al-count-live" aria-hidden="true">{formatSgd(value)}</span></span>
}
export function CountUpMoney({cents,enabled,active}:MotionProps&{cents:number}){
 const {ref,visible}=useInView<HTMLSpanElement>()
 const time=useVisibleClock(COUNT_DURATION,String(cents),enabled,active&&visible)
 return <MoneyValue cents={cents} value={enabled?countedCents(cents,time):cents} counting={enabled&&time<COUNT_DURATION} elementRef={ref}/>
}
type PreviewBudget={id:string|number;label:string;spentCents:number;limitCents:number}
export function SpendingPreview({expenseCents,incomeCents,budgets,enabled,active}:MotionProps&{expenseCents:number;incomeCents:number;budgets:PreviewBudget[]}){
 const {ref,visible}=useInView<HTMLDivElement>()
 const key=JSON.stringify([expenseCents,...budgets.map(b=>[b.id,b.spentCents,b.limitCents])])
 const time=useVisibleClock(COUNT_DURATION,key,enabled,active&&visible),elapsed=enabled?time:COUNT_DURATION,counting=enabled&&time<COUNT_DURATION
 return <div className="al-spending-preview" ref={ref} data-counting={counting}>
  <div className="al-number-heading"><span>Spent this month</span><strong><MoneyValue cents={expenseCents} value={countedCents(expenseCents,elapsed)} counting={counting}/></strong><small>of {formatSgd(incomeCents)} recorded income</small></div>
  <div className="al-budget-list">{budgets.map((b,i)=>{
   const frame=countedBudget(b.spentCents,b.limitCents,elapsed),final=countedBudget(b.spentCents,b.limitCents,COUNT_DURATION)
   return <div key={b.id}><span><b>{b.label}</b><small><MoneyValue cents={b.spentCents} value={frame.cents} counting={counting}/> <span>/ {formatSgd(b.limitCents)}</span></small></span><div className={'al-animated-bar tone-'+i} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={final.percent} aria-label={`${b.label} budget used`}><span aria-hidden="true" style={{width:`${frame.percent}%`}}/></div></div>
  })}</div>
 </div>
}
export function TypedCheckIn({text,enabled,active}:MotionProps&{text:string}){
 const {ref,visible}=useInView<HTMLParagraphElement>()
 const characters=Array.from(text),duration=typingDuration(characters.length),time=useVisibleClock(duration,text,enabled,active&&visible),count=enabled?typedCount(characters.length,time):characters.length
 return <p className="al-insight-copy al-typed-response" ref={ref} data-complete={count===characters.length}><span className="al-motion-sr">{text}</span><span className="al-typed-layout" aria-hidden="true">{text}</span><span className="al-typed-live" aria-hidden="true">{characters.slice(0,count).join('')}<i className="al-typing-caret"/></span></p>
}
