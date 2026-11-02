import {useEffect,useRef,useState} from 'react'
import {COUNT_DURATION} from '../lib/count_up'

/** Count once per value set, only while visible; filters do not restart the clock. */
export default function useCountUp(key:string){
 const ref=useRef<HTMLElement>(null)
 const [clock,setClock]=useState({key,elapsed:0})
 useEffect(()=>{
  const element=ref.current
  if(!element)return
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)')
  let disposed=false,elapsed=0,frame=0,last:number|undefined,visible=!('IntersectionObserver' in window)
  setClock({key,elapsed:0})
  const tick=(now:number)=>{
   frame=0
   if(disposed||!visible||document.hidden||preference.matches)return
   if(last!==undefined)elapsed=Math.min(COUNT_DURATION,elapsed+Math.max(0,now-last))
   last=now;setClock({key,elapsed})
   if(elapsed<COUNT_DURATION)frame=requestAnimationFrame(tick)
  }
  const sync=()=>{
   cancelAnimationFrame(frame);frame=0;last=undefined
   if(preference.matches){elapsed=COUNT_DURATION;setClock({key,elapsed});return}
   if(visible&&!document.hidden&&elapsed<COUNT_DURATION)frame=requestAnimationFrame(tick)
  }
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.2}):null
  observer?.observe(element);document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);sync()
  return()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync)}
 },[key])
 const elapsed=clock.key===key?clock.elapsed:0
 return {ref,elapsed,counting:elapsed<COUNT_DURATION}
}
