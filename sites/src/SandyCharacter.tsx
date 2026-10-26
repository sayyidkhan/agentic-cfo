import React,{useEffect,useRef,useState} from 'react'
import {createSandyGpu} from './sandy_gpu'
import SandyExpression from './SandyExpression'
import {createMotionRig,sampleSandyPose} from './sandy_motion'
import {createPaintedBlink,createBlinkClock,hasPaintedBlink} from './sandy_blink'
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
 const playhead=useRef({mood,replay,elapsed:0})
 const blinkClock=useRef({mood,replay,clock:createBlinkClock()})
 const [failed,setFailed]=useState(false),[readyFor,setReadyFor]=useState<SandyStateId|null>(null),canvasRef=useRef<HTMLCanvasElement>(null),url=`/assets/sandy/v2/${mood}.webp`
 const ready=readyFor===mood
 useEffect(()=>{setReadyFor(null);setFailed(false)},[mood,replay])
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;if(!animated){canvas.dataset.motion='paused';return}
  if(playhead.current.mood!==mood||playhead.current.replay!==replay){playhead.current={mood,replay,elapsed:0};blinkClock.current={mood,replay,clock:createBlinkClock()}}
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let dead=false,frame=0,visible=true,last=0,elapsed=playhead.current.elapsed,count=0,loading=false,presented=false
  let source:SandyPixels|undefined,pixels:ImageData|undefined,buffer:HTMLCanvasElement|undefined,back:CanvasRenderingContext2D|null=null
  let gpu:ReturnType<typeof createSandyGpu>=null
  let eyelids:ReturnType<typeof createPaintedBlink>|undefined
  const front=canvas.getContext('2d');const rig=createMotionRig(mood)
  const render=()=>{const started=performance.now();if(dead||!source||!pixels||!buffer||!front)return
   const blink=hasPaintedBlink(mood)?blinkClock.current.clock.sample(elapsed):0;canvas.dataset.blink=blink.toFixed(2);canvas.dataset.blinks=String(blinkClock.current.clock.count);const art=eyelids?.frame(blink)||source,field=rig.frame(elapsed/1000);if(gpu&&!gpu.draw(art,field,blink)){gpu.dispose();gpu=null;buffer=document.createElement('canvas');buffer.width=pixels.width;buffer.height=pixels.height;back=buffer.getContext('2d')}if(!gpu&&back){paintSandyFrame(art,field,rig.size,pixels);back.putImageData(pixels,0,0)}canvas.dataset.renderer=gpu?'gpu':'cpu'
   // Resizing/clearing the visible canvas is avoided between frames. 'copy' replaces
   // all transparent pixels in one synchronous draw, so there is no blank interval.
   if(canvas.width!==buffer.width||canvas.height!==buffer.height){canvas.width=buffer.width;canvas.height=buffer.height}
   front.globalCompositeOperation='copy';front.drawImage(buffer,0,0);front.globalCompositeOperation='source-over';canvas.dataset.frame=String(++count);const pose=sampleSandyPose(mood,elapsed/1000);canvas.dataset.pose=pose.phase;canvas.style.transformOrigin="50% 92%";canvas.style.transform=`translateY(${pose.hop*canvas.clientWidth}px) rotate(${pose.body}rad) scale(${1-pose.stretch*.55},${1+pose.stretch})`;canvas.dataset.renderMs=(performance.now()-started).toFixed(1);canvas.dataset.time=elapsed.toFixed(0);if(!presented){presented=true;setReadyFor(mood)}
  }
  const tick=(now:number)=>{if(dead)return;frame=requestAnimationFrame(tick);if(!visible||document.hidden){last=0;return}if(!last)last=now;if(now-last<15)return;elapsed+=Math.min(now-last,80);playhead.current.elapsed=elapsed;last=now;render()}
  const start=()=>{cancelAnimationFrame(frame);last=0;if(preference.matches){canvas.dataset.motion='reduced';presented=false;setReadyFor(null);return}canvas.dataset.motion=animated?'running':'paused';if(animated){if(source){render();frame=requestAnimationFrame(tick)}else load()}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0});observer.observe(canvas)
  preference.addEventListener('change',start)
  function load(){if(loading||dead||!front)return;loading=true;Promise.all([decodedArtwork(url),hasPaintedBlink(mood)?decodedArtwork('/assets/sandy/v2/calm.webp').catch(()=>undefined):Promise.resolve(undefined)]).then(([image,closed])=>{if(dead)return;source=image;eyelids=createPaintedBlink(image,closed,mood);buffer=document.createElement('canvas');const width=canvas.parentElement?.getBoundingClientRect().width||370;buffer.width=buffer.height=Math.max(100,Math.min(440,Math.round(width*Math.min(devicePixelRatio||1,1.3))));gpu=createSandyGpu(buffer,rig.size);canvas.dataset.gpuFallback=buffer.dataset.gpuFallback||'';back=gpu?null:buffer.getContext('2d');if(!gpu&&!back){buffer=document.createElement('canvas');buffer.width=buffer.height=Math.min(440,Math.round(width));back=buffer.getContext('2d')}pixels=new ImageData(buffer.width,buffer.height);loading=false;start()}).catch(()=>{loading=false;if(!dead)setReadyFor(null)})}

  start()
  return()=>{dead=true;cancelAnimationFrame(frame);gpu?.dispose();observer.disconnect();preference.removeEventListener('change',start)}
 },[mood,animated,replay,url,failed])
 return <div className={`sandy-character sandy-artwork sandy-artwork--${mood}${animated?' is-animated':''}`} role="img" aria-label={`${mood} Sandy${animated?' animated character':''}`}>
 {failed?<SandyExpression mood={mood}/>:<div className={mood==='relieved'?'sandy-relieved-performance':'sandy-performance'} key={`${mood}-${replay}`} style={mood==='relieved'?{animationPlayState:animated?'running':'paused'}:undefined}><div className="sandy-artwork-reaction">
 <img className={`sandy-artwork-image sandy-stable-image${ready?' is-covered':''}`} src={url} alt="" width="800" height="800" decoding="async" loading={animated?'eager':'lazy'} draggable={false} onError={()=>setFailed(true)}/>
 <canvas ref={canvasRef} className={`sandy-puppet sandy-stable-canvas${ready?' is-ready':''}`} aria-hidden="true"/>
 </div></div>}
 </div>
}
