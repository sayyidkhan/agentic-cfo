import React,{useEffect,useRef,useState} from 'react'
import SandyExpression from './SandyExpression'
import {createMotionRig,blinkAt,sandyEyes} from './sandy_motion'
import {paintSandyFrame,type SandyPixels} from './sandy_raster'
import type {SandyStateId} from './sandy_states'
const artworkCache=new Map<string,Promise<SandyPixels>>()
function decodedArtwork(url:string){
 let cached=artworkCache.get(url)
 if(!cached){cached=(async()=>{const image=new Image();image.src=url;await image.decode();const buffer=document.createElement('canvas');buffer.width=image.naturalWidth;buffer.height=image.naturalHeight;const context=buffer.getContext('2d',{willReadFrequently:true});if(!context)throw Error('Canvas unavailable');context.drawImage(image,0,0);return context.getImageData(0,0,buffer.width,buffer.height)})();artworkCache.set(url,cached);cached.catch(()=>artworkCache.delete(url))}
 return cached
}
/** A stable bitmap is presented only after its complete frame has been painted. */
export default function SandyCharacter({mood,animated=false,replay=0}:{mood:SandyStateId,animated?:boolean,replay?:number}){
 const [failed,setFailed]=useState(false),[ready,setReady]=useState(false),canvasRef=useRef<HTMLCanvasElement>(null),url=`/assets/sandy/v2/${mood}.webp`
 useEffect(()=>{setReady(false);setFailed(false)},[mood])
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;if(!animated){canvas.dataset.motion='paused';return}
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let dead=false,frame=0,visible=true,last=0,elapsed=0,count=0,loading=false,presented=false
  let source:SandyPixels|undefined,pixels:ImageData|undefined,buffer:HTMLCanvasElement|undefined,back:CanvasRenderingContext2D|null=null
  const front=canvas.getContext('2d');const rig=createMotionRig(mood)
  const render=()=>{if(dead||!source||!pixels||!back||!buffer||!front)return
   paintSandyFrame(source,rig.frame(elapsed/1000),rig.size,pixels);back.putImageData(pixels,0,0)
   const blink=blinkAt(elapsed/1000)**3
   if(blink>0){const scale=buffer.width/800;back.save();back.scale(scale,scale);back.globalAlpha=blink;back.strokeStyle='#5b392a';back.lineWidth=6;back.lineCap='round';for(const [x,y] of sandyEyes(mood)){back.beginPath();back.moveTo(x*800-22,y*800-6);back.quadraticCurveTo(x*800,y*800+7,x*800+22,y*800+6);back.stroke()}back.restore()}
   // Resizing/clearing the visible canvas is avoided between frames. 'copy' replaces
   // all transparent pixels in one synchronous draw, so there is no blank interval.
   if(canvas.width!==buffer.width||canvas.height!==buffer.height){canvas.width=buffer.width;canvas.height=buffer.height}
   front.globalCompositeOperation='copy';front.drawImage(buffer,0,0);front.globalCompositeOperation='source-over';canvas.dataset.frame=String(++count);if(!presented){presented=true;setReady(true)}
  }
  const tick=(now:number)=>{if(dead)return;frame=requestAnimationFrame(tick);if(!visible||document.hidden){last=0;return}if(!last)last=now;if(now-last<50)return;elapsed+=now-last;last=now;render()}
  const start=()=>{cancelAnimationFrame(frame);last=0;if(preference.matches){canvas.dataset.motion='reduced';presented=false;setReady(false);return}canvas.dataset.motion=animated?'running':'paused';if(animated){if(source){render();frame=requestAnimationFrame(tick)}else load()}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0});observer.observe(canvas)
  preference.addEventListener('change',start)
  function load(){if(loading||dead||!front)return;loading=true;decodedArtwork(url).then(image=>{if(dead)return;source=image;buffer=document.createElement('canvas');const width=canvas.parentElement?.getBoundingClientRect().width||370;buffer.width=buffer.height=Math.max(100,Math.min(440,Math.round(width*Math.min(devicePixelRatio||1,1.3))));back=buffer.getContext('2d');pixels=back?.createImageData(buffer.width,buffer.height);loading=false;start()}).catch(()=>{loading=false;if(!dead)setReady(false)})}

  start()
  return()=>{dead=true;cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener('change',start)}
 },[mood,animated,replay,url,failed])
 return <div className={`sandy-character sandy-artwork sandy-artwork--${mood}${animated?' is-animated':''}`} role="img" aria-label={`${mood} Sandy${animated?' animated character':''}`}>
 {failed?<SandyExpression mood={mood}/>:<div className="sandy-artwork-reaction" key={mood}>
 <img className={`sandy-artwork-image sandy-stable-image${ready?' is-covered':''}`} src={url} alt="" width="800" height="800" decoding="async" loading={animated?'eager':'lazy'} draggable={false} onError={()=>setFailed(true)}/>
 <canvas ref={canvasRef} className={`sandy-puppet sandy-stable-canvas${ready?' is-ready':''}`} aria-hidden="true"/>
 </div>}
 </div>
}
