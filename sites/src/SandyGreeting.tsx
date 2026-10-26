import React,{useEffect,useId,useState} from 'react'
import SandyCharacter from './SandyCharacter'
import {createPaintedBlink} from './sandy_blink'
const greeting='/assets/sandy/v2/greeting.webp'
let closedArtwork:Promise<string>|undefined
function closedEyes(){
 return closedArtwork||=(async()=>{
  const decode=async(src:string)=>{const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height)}
  const [open,calm]=await Promise.all([decode(greeting),decode('/assets/sandy/v2/calm.webp')]);const closed=createPaintedBlink(open,calm,'greeting').frame(1)
  const c=document.createElement('canvas');c.width=closed.width;c.height=closed.height;c.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(closed.data),closed.width,closed.height),0,0)
  // Prepared once, never replaced while the animation runs.
  return c.toDataURL('image/webp',.92)
 })().catch(error=>{closedArtwork=undefined;throw error})
}
/** Real cutout forearm rotation: the raised paw stays rigid, with a covered elbow joint. */
export default function SandyGreeting({animated=true,replay=0}:{animated?:boolean,replay?:number}){
 const id='greeting'+useId().replace(/:/g,''),[closed,setClosed]=useState<string>(),[loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false)
 useEffect(()=>{let active=true;const img=new Image();img.src=greeting;img.decode().then(()=>{if(active)setLoaded(true)}).catch(()=>{if(active)setFailed(true)});closedEyes().then(value=>{if(active)setClosed(value)}).catch(()=>{});return()=>{active=false}},[])
 if(failed)return <SandyCharacter mood="curious" animated={animated} replay={replay}/>
 const arm='M 802 438 Q 772 460 775 505 Q 779 542 814 550 L 1000 620 L 1080 300 L 855 300 L 838 395 Z'
 return <div className={`sandy-character sandy-greeting${animated?' is-playing':''}${loaded?' is-loaded':''}`} role="img" aria-label="Sandy smiling and waving hello">
 <svg viewBox="-90 -95 1180 1180" className="sandy-greeting-scene" aria-hidden="true">
 <defs><clipPath id={id+'arm'}><path d={arm}/></clipPath><clipPath id={id+'body'}><path clipRule="evenodd" d={'M -150 -150 H 1150 V 1150 H -150 Z '+arm}/></clipPath><clipPath id={id+'elbow'}><ellipse cx="797" cy="497" rx="38" ry="48"/></clipPath></defs>
 <g key={replay} className="sandy-greeting-performance">
 <ellipse className="sandy-ground-shadow" cx="590" cy="957" rx="200" ry="18" fill="#38503b" opacity=".12"/>
 <g className="sandy-greeting-body">
 <g className="sandy-greeting-arm" clipPath={'url(#'+id+'arm)'}><image href={greeting} width="1000" height="1000"/></g>
 <g clipPath={'url(#'+id+'body)'}><image href={greeting} width="1000" height="1000"/>{closed&&<image className="sandy-greeting-blink" href={closed} width="1000" height="1000"/>}</g>
 <g clipPath={'url(#'+id+'elbow)'}><image href={greeting} width="1000" height="1000"/></g>
 </g>
 <g className="sandy-hello-sparkles" fill="#b08b3f"><path d="M160 250l6 16 16 6-16 6-6 16-6-16-16-6 16-6Z"/><path d="M925 160l4 12 12 4-12 4-4 12-4-12-12-4 12-4Z"/><circle cx="220" cy="170" r="4"/></g>
 </g>
 </svg>
 </div>
}
