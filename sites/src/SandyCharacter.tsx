import React,{useEffect,useRef,useState} from 'react'
import SandyExpression from './SandyExpression'
import type {SandyStateId} from './sandy_states'
export default function SandyCharacter({mood,animated=false,replay=0}:{mood:SandyStateId,animated?:boolean,replay?:number}){
 const ref=useRef<HTMLDivElement>(null),[ready,setReady]=useState(false)
 useEffect(()=>{let cancelled=false,cleanup:(()=>void)|undefined;setReady(false);const host=ref.current;if(!host)return
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;observer.disconnect();import('./sandy3d').then(({mountSandy})=>{if(cancelled)return;try{cleanup=mountSandy(host,mood,animated,()=>setReady(false));setReady(!!host.querySelector('canvas'))}catch{setReady(false)}}).catch(()=>setReady(false))});observer.observe(host)
 return()=>{cancelled=true;observer.disconnect();cleanup?.()}
 },[mood,animated,replay])
 return <div className={'sandy-character'+(ready?' is-3d':'')} role="img" aria-label={`${mood} Sandy${animated?' animated 3D character':''}`}><div className="sandy-character-fallback" aria-hidden="true"><SandyExpression mood={mood}/></div><div className="sandy-character-render" ref={ref}/></div>
}
