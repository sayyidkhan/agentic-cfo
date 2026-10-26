import React from 'react'
import SandyCharacter from './SandyCharacter'
import SandyGreeting from './SandyGreeting'
import type {SandyStateId} from './sandy_states'
export default function SandyStage({mood,animated,replay,greeting,onHello}:{mood:SandyStateId,animated:boolean,replay:number,greeting:boolean,onHello:()=>void}){
 return <div className={`sandy-live-stage${animated?' is-playing':''}${greeting?' is-greeting':''}`}>
 <div className="sandy-stage-halo" aria-hidden="true"/>
 {greeting?<SandyGreeting animated={animated} replay={replay}/>:<SandyCharacter mood={mood} animated={animated} replay={replay}/>}
 <button className="sandy-stage-hit" onClick={onHello} aria-label="Say hello to Sandy" title="Tap Sandy to say hello"/>
 <span className="sandy-stage-invite" aria-hidden="true">{greeting?'Hello, you. 👋':'Tap Sandy to say hello'}</span>
 </div>
}
