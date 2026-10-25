import React from 'react'
import SandyCharacter from './SandyCharacter'
export type SandyMood='neutral'|'thinking'|'celebrating'
export default function SandyAvatar({size='md',mood='neutral',className=''}:{size?:'sm'|'md'|'lg',mood?:SandyMood,className?:string}){
 let motion=true;try{motion=localStorage.getItem('acorra-sandy-motion')!=='off'}catch{}
 return <span className={`sandy-avatar sandy-avatar--${size} sandy-avatar--${mood} ${className}`} role="img" aria-label="Sandy the squirrel" title="Sandy the Squirrel">{size==='lg'?<SandyCharacter mood={mood==='celebrating'?'celebrating':mood==='thinking'?'watchful':'curious'} animated={motion}/>:<img src={`/assets/sandy/v2/${mood==='celebrating'?'celebrating':'curious'}.webp`} alt="" width="80" height="80"/>}</span>
}
