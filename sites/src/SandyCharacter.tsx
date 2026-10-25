import React,{useEffect,useId,useRef,useState} from 'react'
import SandyExpression from './SandyExpression'
import {createMotionRig,blinkAt,sandyEyes} from './sandy_motion'
import type {SandyStateId} from './sandy_states'
/** Animate the approved artwork locally; preserve its pixels, fur and face identity. */
export default function SandyCharacter({mood,animated=false,replay=0}:{mood:SandyStateId,animated?:boolean,replay?:number}){
 const [failed,setFailed]=useState(false),id=useId().replace(/:/g,''),svgRef=useRef<SVGSVGElement>(null),mapRef=useRef<SVGFEImageElement>(null),imageRef=useRef<SVGImageElement>(null),blinkRef=useRef<SVGGElement>(null)
 useEffect(()=>{
  const svg=svgRef.current,map=mapRef.current,picture=imageRef.current;if(!svg||!map||!picture)return
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),canvas=document.createElement('canvas'),context=canvas.getContext('2d')
  let frame=0,elapsed=0,last=0,visible=true,dead=false,rendered=0
  const rig=createMotionRig(mood);canvas.width=canvas.height=rig.size
  const pixels=context?.createImageData(rig.size,rig.size)
  const render=()=>{if(!context||!pixels)return;pixels.data.set(rig.frame(elapsed/1000));context.putImageData(pixels,0,0);map.setAttribute('href',canvas.toDataURL('image/png'));picture.setAttribute('filter',`url(#${id}motion)`);blinkRef.current?.setAttribute('opacity',String(blinkAt(elapsed/1000)**3));svg.dataset.frame=String(++rendered)}
  const tick=(now:number)=>{if(dead)return;frame=requestAnimationFrame(tick);if(!visible||document.hidden){last=now;return}if(!last)last=now;if(now-last<50)return;elapsed+=now-last;last=now;render()}
  const sync=()=>{cancelAnimationFrame(frame);last=0;if(preference.matches){picture.removeAttribute('filter');blinkRef.current?.setAttribute('opacity','0');svg.dataset.motion='reduced';return}svg.dataset.motion=animated?'running':'paused';if(animated&&context){render();frame=requestAnimationFrame(tick)}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0});observer.observe(svg)
  preference.addEventListener('change',sync);sync()
  return()=>{dead=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',sync)}
 },[mood,animated,replay,id,failed])
 const url=`/assets/sandy/v2/${mood}.webp`
 return <div className={`sandy-character sandy-artwork sandy-artwork--${mood}${animated?' is-animated':''}`} role="img" aria-label={`${mood} Sandy${animated?' animated character':''}`}>
 {failed?<SandyExpression mood={mood}/>:<div className="sandy-artwork-reaction" key={`${mood}-${replay}`}>
 {animated||replay>0?<svg ref={svgRef} className="sandy-puppet" viewBox="0 0 800 800" aria-hidden="true"><defs><filter id={`${id}motion`} filterUnits="userSpaceOnUse" x="-40" y="-40" width="880" height="880" colorInterpolationFilters="sRGB"><feImage ref={mapRef} x="0" y="0" width="800" height="800" preserveAspectRatio="none" result="pose"/><feFlood floodColor="#808080" result="neutral"/><feComposite in="pose" in2="neutral" operator="over" result="field"/><feDisplacementMap in="SourceGraphic" in2="field" scale="128" xChannelSelector="R" yChannelSelector="G"/></filter></defs><image ref={imageRef} href={url} width="800" height="800" onError={()=>setFailed(true)}/><g ref={blinkRef} opacity="0" fill="none" stroke="#5b392a" strokeWidth="6" strokeLinecap="round">{sandyEyes(mood).map(([x,y],i)=><path key={i} d={`M${x*800-22},${y*800-6} Q${x*800},${y*800+7} ${x*800+22},${y*800+6}`}/>)}</g></svg>:<img className="sandy-artwork-image" src={url} alt="" width="800" height="800" decoding="async" loading="lazy" draggable={false} onError={()=>setFailed(true)}/>}
 </div>}
 </div>
}
