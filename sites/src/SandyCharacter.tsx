import React,{useState} from 'react'
import SandyExpression from './SandyExpression'
import type {SandyStateId} from './sandy_states'
/** Rendered character artwork with lightweight motion; no live 3D/GPU dependency. */
export default function SandyCharacter({mood,animated=false,replay=0}:{mood:SandyStateId,animated?:boolean,replay?:number}){
 const [failed,setFailed]=useState(false)
 return <div className={`sandy-character sandy-artwork sandy-artwork--${mood}${animated?' is-animated':''}`} role="img" aria-label={`${mood} Sandy${animated?' with gentle animation':''}`}>
 {failed?<SandyExpression mood={mood}/>:<div className="sandy-artwork-reaction" key={`${mood}-${replay}`}><img className="sandy-artwork-image" src={`/assets/sandy/v2/${mood}.webp`} alt="" width="800" height="800" decoding="async" loading={animated?'eager':'lazy'} draggable={false} onError={()=>setFailed(true)}/></div>}
 </div>
}
