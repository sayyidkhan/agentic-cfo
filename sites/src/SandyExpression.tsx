import React,{useId} from 'react'
import type {SandyStateId} from './sandy_states'
/** Original scalable character study. Final Sandy character design remains open. */
export default function SandyExpression({mood}:{mood:SandyStateId}){
 const id=useId().replace(/:/g,''), paint=(n:string)=>`url(#${id+n})`
 const joy=mood==='celebrating', relieved=mood==='relieved', calm=mood==='calm', scream=mood==='screaming', worried=mood==='concerned', watch=mood==='watchful', curious=mood==='curious'
 return <svg className={'sandy-expression sandy-expression--'+mood} viewBox="0 0 320 320" role="img" aria-label={'Sandy expression: '+mood}>
 <defs>
 <linearGradient id={id+'fur'} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#e9b775"/><stop offset=".45" stopColor="#c98b49"/><stop offset="1" stopColor="#9c5b30"/></linearGradient>
 <linearGradient id={id+'tail'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#edbf7e"/><stop offset=".6" stopColor="#bb753c"/><stop offset="1" stopColor="#855030"/></linearGradient>
 <linearGradient id={id+'cream'} x2=".2" y2="1"><stop stopColor="#fff3d8"/><stop offset="1" stopColor="#e6c69a"/></linearGradient>
 <linearGradient id={id+'nose'} x2=".5" y2="1"><stop stopColor="#624332"/><stop offset="1" stopColor="#302c26"/></linearGradient>
 <radialGradient id={id+'blush'}><stop stopColor="#d88168" stopOpacity=".6"/><stop offset="1" stopColor="#d88168" stopOpacity="0"/></radialGradient>
 <filter id={id+'shadow'} x="-.4" y="-.3" width="1.8" height="1.8"><feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#684a29" floodOpacity=".14"/></filter>
 </defs>
 <ellipse cx="161" cy="284" rx="85" ry="10" fill="#665031" opacity=".1"/>
 <g stroke="#774a2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter={paint('shadow')}>
 <path fill={paint('tail')} d="M140 251C82 285 24 248 31 192c3-25 17-43 38-47-23-15-32-46-16-68 19-25 60-19 68 6 9 31-29 40-31 65-1 19 19 26 31 41 15 18 22 39 19 62Z"/>
 <path fill="none" stroke="#f7d59e" strokeWidth="5" opacity=".65" d="M102 80c-32-19-57 16-29 46 23 25-11 36-19 62-12 37 17 64 50 61"/>
 <path fill={paint('fur')} d="M118 258c-6-32-3-79 18-94 20-15 48-12 65 9 17 21 19 58 12 84Z"/>
 <ellipse cx="169" cy="229" rx="28" ry="43" fill={paint('cream')} stroke="none"/>
 <path fill={paint('fur')} d="M120 96C97 67 103 35 115 34c16-2 34 32 34 48m47-1c1-20 19-51 33-47 15 5 12 43-6 64"/>
 <path fill="#c78366" stroke="none" d="M124 77c-10-14-15-29-9-30 5-1 17 20 19 28m73 0c7-16 19-31 21-26 3 7-2 22-10 34"/>
 <path fill={paint('fur')} d="M110 128c-6-31 11-54 39-58l7-11 6 10 13-10 2 11c31 0 57 23 56 54l8 14-8 2 4 13-11-1c-8 31-30 45-60 44-31 0-52-18-58-44l-10-2 6-10-7-2Z"/>
 <path fill={paint('cream')} stroke="none" d="M126 141c0-20 20-24 42-20 24-5 46 2 47 20 2 26-21 44-45 44-25 0-45-17-44-44Z"/>
 <ellipse cx="130" cy="145" rx="18" ry="12" fill={paint('blush')} stroke="none"/><ellipse cx="210" cy="145" rx="18" ry="12" fill={paint('blush')} stroke="none"/>
 <g stroke="#493a2c" strokeWidth="3.5">
 {calm||relieved||joy?<><path fill="none" d={joy?'M135 118q9-14 18 0m37 0q9-14 18 0':'M136 118q8-8 16 0m38 0q8-8 16 0'}/></>:<>{[145,198].map((x,i)=><g key={x}><ellipse cx={x} cy={scream?113:118} rx={scream?12:curious&&i===1?11:10} ry={scream?18:14} fill="#fff9e9" strokeWidth="1.5"/><ellipse cx={x+(watch?3:curious?2:0)} cy={scream?114:119} rx={scream?4:5.5} ry={scream?7:9} fill="#323b2e" stroke="none"/><ellipse cx={x-1} cy={scream?109:115} rx="2" ry="3" fill="white" stroke="none"/></g>)}</>}
 <path fill="none" d={worried?'M132 96q9 1 20-7m36 0q10 7 21 7':scream?'M132 87q9-7 20-3m36 0q10-4 21 3':watch?'M132 96l21 6m35 0 22-6':curious?'M132 96q9-7 20-5m36 7 20 4':'M134 97q8-4 16-3m40 0q8-1 16 3'}/>
 </g>
 <path fill={paint('nose')} stroke="none" d="M160 133q11-7 22 0c0 8-6 12-11 12-5 0-11-4-11-12Z"/><path d="M171 145v5" fill="none" strokeWidth="1.5"/>
 {scream?<><ellipse cx="172" cy="164" rx="16" ry="24" fill="#50322b"/><ellipse cx="172" cy="179" rx="10" ry="7" fill="#d89081" stroke="none"/><path d="M164 142h16l-2 9h-12Z" fill="#fff8df" stroke="none"/></>:joy?<><path d="M151 150q21 11 41-1c-4 29-35 32-41 1Z" fill="#53372b"/><path d="M160 153h22l-3 9h-16Z" fill="#fff8df" stroke="none"/><path d="M163 173q10-7 18-1" stroke="#d3927e" strokeWidth="5"/></>:worried?<path d="M158 164q13-11 26 0" fill="none" strokeWidth="3"/>:watch?<path d="M160 161q11 2 22-1" fill="none" strokeWidth="3"/>:curious?<ellipse cx="173" cy="160" rx="6" ry="7" fill="#53372b"/>:<><path d="M153 152q18 22 37 0" fill="none" strokeWidth="3"/><path d="M168 160h8v8h-8Z" fill="#fff8df" stroke="none"/></>}
 <g fill="none" stroke="#a76f41" strokeWidth="1.4" opacity=".7"><path d="M123 151l-17-3m18 9-15 2m107-8 17-3m-17 9 15 2"/></g>
 <path fill={paint('fur')} d={scream?'M126 192q-22-16-13-37 8-14 14-3l12 36m66 4q23-16 15-37-7-14-14-3l-12 36':joy?'M127 202 101 166q-9-15-17-8-7 8 4 20l27 42m89-18 27-36q9-15 17-8 7 8-4 20l-28 42':'M127 199q-12 15 12 37l14-12-13-22m64-3q14 15-12 37l-13-12 13-22'}/>
 {!scream&&!joy&&<g><path fill="#ac7138" d="M157 225q-3 23 14 30 17-7 14-30Z"/><path fill="#6b5631" d="M152 224q18-18 37 0v6h-37Z"/><path d="M171 213v-6" fill="none"/><path d="m158 223 5 5m7-9 6 7m5-7 5 5" stroke="#d3b875" strokeWidth="1"/></g>}
 <path fill={paint('fur')} d="M125 256q-15 4-15 17c4 9 36 7 43 1l-1-15m34 0-1 15c10 7 40 8 43-1 0-13-18-17-18-17"/>
 <path fill="none" stroke="#f5cd94" strokeWidth="2" d="M121 272h16m62 0h17"/>
 </g>
 {joy&&<g fill="#c6a35c"><path d="m69 110 4 11 11 4-11 4-4 11-4-11-11-4 11-4Zm183-42 4 12 12 4-12 4-4 12-4-12-12-4 12-4Zm9 144 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><circle cx="85" cy="73" r="3"/><circle cx="258" cy="148" r="3"/></g>}
 {scream&&<g fill="none" stroke="#b26e50" strokeWidth="4" strokeLinecap="round"><path d="m83 118-10-6m12 22-14 1m181-17 10-6m-12 22 14 1"/></g>}
 {relieved&&<g fill="none" stroke="#719a91" strokeWidth="3" strokeLinecap="round"><path d="M237 139q20 2 13 13m-8 3q18 3 12 13"/></g>}
 {curious&&<text x="254" y="108" fill="#8a794e" fontSize="34" fontFamily="Georgia,serif" transform="rotate(12 254 108)">?</text>}
 </svg>
}
