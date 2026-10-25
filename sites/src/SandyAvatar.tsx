import React from 'react'
export type SandyMood='neutral'|'thinking'|'celebrating'
export default function SandyAvatar({size='md',mood='neutral',className=''}:{size?:'sm'|'md'|'lg',mood?:SandyMood,className?:string}){
 return <span className={`sandy-avatar sandy-avatar--${size} sandy-avatar--${mood} ${className}`} role="img" aria-label="Sandy the squirrel" title="Sandy the Squirrel"><img src={`/assets/sandy/v2/${mood==='celebrating'?'celebrating':'curious'}.webp`} alt="" width="80" height="80"/></span>
}
