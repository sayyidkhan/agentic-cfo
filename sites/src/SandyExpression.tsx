import React from 'react'
import type {SandyStateId} from './sandy_states'
/** Original vector mood sketches only; Sandy’s final illustration remains deferred. */
export default function SandyExpression({mood}:{mood:SandyStateId}){
 const happy=mood==='celebrating',relaxed=mood==='calm'||mood==='relieved',shocked=mood==='screaming',worried=mood==='concerned'
 return <svg className="sandy-expression" viewBox="0 0 200 200" role="img" aria-label={'Temporary Sandy expression: '+mood}>
 <g fill="none" stroke="#29523e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
 <path fill="#d7ba82" d="M78 153C22 160 15 126 26 100c9-23 39-24 44-8 8 22-18 20-17 36 1 13 13 15 25 12"/>
 <path fill="#bc965f" d="M72 158c-5-31 2-61 28-61 27 0 40 31 34 61"/>
 <ellipse cx="104" cy="146" rx="19" ry="27" fill="#f3e6c8"/>
 <path fill="#d7ba82" d="M71 75C55 43 69 28 84 56M120 55c17-32 32-16 21 18"/>
 <path fill="#e2c896" d="M65 88c0-26 17-41 40-41 28 0 43 18 43 42 0 27-16 42-42 42-25 0-41-17-41-43Z"/>
 <path fill="#f8edda" stroke="none" d="M77 99c0-12 13-19 29-19s29 7 29 19c0 17-13 26-29 26s-29-10-29-26"/>
 {relaxed||happy?<><path d="M82 82q6-7 12 0M118 82q6-7 12 0"/>{mood==='relieved'&&<path stroke="#7d9f9a" d="M149 96q12 4 7 12m-6-2q13 5 8 12"/>}</>:<><ellipse cx="88" cy={shocked?79:83} rx={shocked?6:3} ry={shocked?9:5} fill={shocked?'#fffaf0':'#29523e'}/><ellipse cx="124" cy={shocked?79:83} rx={shocked?6:3} ry={shocked?9:5} fill={shocked?'#fffaf0':'#29523e'}/>{shocked&&<><circle cx="88" cy="80" r="2" fill="#29523e"/><circle cx="124" cy="80" r="2" fill="#29523e"/></>}</>}
 <path d={shocked?'M81 63l12-2m25 0 12 2':worried?'M81 72l12-4m25 0 12 4':mood==='watchful'?'M80 69l13 3m25 0 13-3':mood==='curious'?'M80 70l13-3m25 5 13 3':'M81 68l12-1m25 0 12 1'}/>
 <path fill="#29523e" d="m102 91 8 0-4 5Z"/>
 {shocked?<ellipse cx="106" cy="109" rx="9" ry="14" fill="#704a3b"/>:happy?<path fill="#704a3b" d="M95 101q11 5 22 0-11 25-22 0Z"/>:worried?<path d="M97 108q9-8 18 0"/>:mood==='watchful'?<path d="M98 107h16"/>:mood==='curious'?<ellipse cx="106" cy="107" rx="4" ry="5"/>:<path d="M97 103q9 11 18 0"/>}
 <path d="M74 133l11 16m48-17-10 17"/><path fill="#d7ba82" d="M67 167q13-12 27 0m21 0q16-12 28 0"/>
 {happy&&<path stroke="#aa8547" d="m48 51 3 8 8 3-8 3-3 8-3-8-8-3 8-3Zm107 71 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/>}
 {shocked&&<path stroke="#aa694b" d="m46 72-7-6m7 19-10-1m119-12 8-6m-8 19 10-1"/>}
 </g></svg>
}
