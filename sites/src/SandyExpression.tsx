import React,{useId} from 'react'
import type {SandyStateId} from './sandy_states'
/** Scalable beaver fallback, shown only if the rendered artwork cannot load. Matches the beaver character sheet. */
export default function SandyExpression({mood}:{mood:SandyStateId}){
 const id=useId().replace(/:/g,''), paint=(n:string)=>`url(#${id+n})`
 const joy=mood==='celebrating', relieved=mood==='relieved', calm=mood==='calm', scream=mood==='screaming', worried=mood==='concerned', watch=mood==='watchful', curious=mood==='curious'
 const closed=calm||relieved||joy
 return <svg className={'sandy-expression sandy-expression--'+mood} viewBox="0 0 320 320" role="img" aria-label={'Sandy expression: '+mood}>
 <defs>
 <linearGradient id={id+'fur'} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#b9774a"/><stop offset=".5" stopColor="#8f5432"/><stop offset="1" stopColor="#6a3c22"/></linearGradient>
 <linearGradient id={id+'cream'} x2=".2" y2="1"><stop stopColor="#f2d4a8"/><stop offset="1" stopColor="#d6a873"/></linearGradient>
 <linearGradient id={id+'nose'} x2=".5" y2="1"><stop stopColor="#5a4038"/><stop offset="1" stopColor="#2b211d"/></linearGradient>
 <pattern id={id+'scale'} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0h9M0 0v9" stroke="#5c463c" strokeWidth="1.4"/></pattern>
 <filter id={id+'shadow'} x="-.4" y="-.3" width="1.8" height="1.8"><feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#4a3020" floodOpacity=".16"/></filter>
 </defs>
 <ellipse cx="165" cy="290" rx="95" ry="10" fill="#4a3824" opacity=".1"/>
 <g stroke="#4f2f1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter={paint('shadow')}>
 <g transform="rotate(-24 92 236)"><ellipse cx="72" cy="236" rx="58" ry="30" fill="#463631"/><ellipse cx="72" cy="236" rx="58" ry="30" fill={paint('scale')} opacity=".7"/></g>
 <path fill={paint('fur')} d="M104 270c-14-46-10-98 20-120 26-18 64-18 88 2 28 24 30 76 18 118Z"/>
 <ellipse cx="166" cy="214" rx="40" ry="52" fill={paint('cream')} stroke="none" opacity=".85"/>
 <path fill="#9c6a3c" d="M106 236q60 14 124 0v15q-62 13-124 0Z"/><rect x="157" y="235" width="18" height="17" rx="6" fill="#d39a4f"/>
 <path fill="#3a2a22" d="M120 272q-14 6-16 14h44q-2-10-12-14Zm72 0q-10 4-12 14h44q-2-8-16-14Z"/>
 <circle cx="116" cy="62" r="13" fill="#6a3c22"/><circle cx="214" cy="62" r="13" fill="#6a3c22"/>
 <path fill={paint('fur')} d="M100 112c0-40 30-62 66-62s66 22 66 62c0 34-24 58-66 58s-66-24-66-58Z"/>
 <path fill={paint('cream')} stroke="none" d="M128 128c0-18 18-26 38-26s38 8 38 26c0 22-16 36-38 36s-38-14-38-36Z"/>
 <g stroke="#2e2420" strokeWidth="3.5">
 {closed?<path fill="none" d={joy?'M128 96q9-12 18 0m40 0q9-12 18 0':'M128 98q9 7 18 0m40 0q9 7 18 0'}/>:<>{[137,195].map((x,i)=><g key={x}><ellipse cx={x} cy={scream?92:96} rx={scream?11:8} ry={scream?14:9} fill="#fffaf0" strokeWidth="2"/><circle cx={x+(curious&&i===1?2:0)} cy={scream?93:97} r={scream?3.5:5} fill="#2e2420" stroke="none"/><circle cx={x+2} cy={scream?90:94} r="1.6" fill="#fff" stroke="none"/></g>)}</>}
 <path fill="none" d={worried?'M126 80q9 1 20-6m38 0q10 7 21 6':scream?'M126 72q9-7 20-3m38 0q10-4 21 3':watch?'M126 80l21 5m37 0 22-8':curious?'M126 80q9-7 20-5m38 7 20 4':'M128 82q8-4 16-3m42 0q8-1 16 3'}/>
 </g>
 <path fill={paint('nose')} stroke="none" d="M148 112q18-12 36 0c0 12-9 18-18 18s-18-6-18-18Z"/>
 {scream?<><ellipse cx="166" cy="148" rx="15" ry="20" fill="#4a2a24"/><path d="M158 132h16v12h-16Z" fill="#f5ecd5" stroke="#a08866" strokeWidth="1.5"/></>:<><path fill="none" d={joy?'M146 136q20 16 40 0':worried?'M150 142q16-6 32 0':'M150 136q16 9 32 0'} strokeWidth="2.5"/><path d="M158 137h16v13h-16Z" fill="#f5ecd5" stroke="#a08866" strokeWidth="1.5"/><path d="M166 137v13" stroke="#a08866" strokeWidth="1"/></>}
 <g fill="none" stroke="#c99a6a" strokeWidth="1.3" opacity=".7"><path d="M128 128l-20-4m21 10-18 3m96-9 20-4m-21 10 18 3"/></g>
 {joy?<path fill={paint('fur')} d="M112 176 90 128q-6-14 4-16 9-1 13 12l22 44m94 8 22-48q6-14-4-16-9-1-13 12l-22 44"/>:<path fill={paint('fur')} d="M114 180q-14 26 6 50l14-8-6-34m90-8q14 26-6 50l-14-8 6-34"/>}
 </g>
 </svg>
}
