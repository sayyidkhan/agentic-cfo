import {useEffect,useRef,useState} from 'react'
import {createSandyGpu} from './sandy_gpu'
import {paintSandyFrame,type SandyPixels} from './sandy_raster'
import {createWinterRig} from './winter_motion'
const url='/assets/seasons/v1/sandy-winter-gold.webp'
let decoded:Promise<SandyPixels>|undefined
function artwork(){return decoded??= (async()=>{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas unavailable');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height)})().catch(e=>{decoded=undefined;throw e})}
/** Present complete frames over a permanent image fallback; never move the whole chair. */
export default function WinterSandy({active}:{active:boolean}){
 const root=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),[ready,setReady]=useState(false),elapsed=useRef(0)
 useEffect(()=>{
  const el=root.current,frontCanvas=canvas.current;if(!el||!frontCanvas)return
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let dead=false,visible=true,loading=false,raf=0,last=0,frames=0
  let source:SandyPixels|undefined,gpu:ReturnType<typeof createSandyGpu>=null,back:HTMLCanvasElement|undefined,pixels:ImageData|undefined,ctx:CanvasRenderingContext2D|null=null
  const rig=createWinterRig(),front=frontCanvas.getContext('2d'),fallbackSize=Math.max(280,Math.min(420,Math.round(el.clientWidth*Math.min(devicePixelRatio||1,1.3))))
  const render=()=>{
   if(!source||!front||!back)return
   const start=performance.now(),field=rig.frame(elapsed.current)
   if(gpu&&!gpu.draw(source,field,0)){gpu.dispose();gpu=null;back=document.createElement('canvas');back.width=back.height=fallbackSize;ctx=back.getContext('2d');pixels=new ImageData(fallbackSize,fallbackSize)}
   if(!gpu&&ctx&&pixels){paintSandyFrame(source,field,rig.size,pixels);ctx.putImageData(pixels,0,0)}
   if(frontCanvas.width!==back.width||frontCanvas.height!==back.height){frontCanvas.width=back.width;frontCanvas.height=back.height}
   front.globalCompositeOperation='copy';front.drawImage(back,0,0);front.globalCompositeOperation='source-over'
   frontCanvas.dataset.frame=String(++frames);frontCanvas.dataset.time=elapsed.current.toFixed(2);frontCanvas.dataset.renderer=gpu?'gpu':'cpu';frontCanvas.dataset.renderMs=(performance.now()-start).toFixed(1)
   if(frames===1)setReady(true)
  }
  const tick=(now:number)=>{raf=0;if(dead||!active||!visible||document.hidden||reduced.matches)return
   if(!last||now-last>=32){elapsed.current+=last?Math.min((now-last)/1000,.08):0;last=now;render()}raf=requestAnimationFrame(tick)
  }
  const sync=()=>{cancelAnimationFrame(raf);raf=0;last=0;const play=active&&visible&&!document.hidden&&!reduced.matches;el.dataset.motion=play?'running':'paused';if(reduced.matches)setReady(false);else if(play){if(source)raf=requestAnimationFrame(tick);else load()}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05});observer.observe(el)
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync()
  function load(){if(loading||dead||!front)return;loading=true;artwork().then(art=>{if(dead)return;source=art;back=document.createElement('canvas');back.width=back.height=Math.max(280,Math.min(640,Math.round(el.clientWidth*Math.min(devicePixelRatio||1,1.5))));gpu=createSandyGpu(back,rig.size)
   if(!gpu){back=document.createElement('canvas');back.width=back.height=fallbackSize;ctx=back.getContext('2d');pixels=new ImageData(fallbackSize,fallbackSize);if(!ctx)return}loading=false;sync()
  }).catch(()=>{loading=false;if(!dead){setReady(false);el.dataset.motion='fallback'}})}
  return()=>{dead=true;cancelAnimationFrame(raf);gpu?.dispose();observer.disconnect();reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)}
 },[active])
 return <div ref={root} className={'al-winter-retreat'+(ready?' winter-ready':'')} data-motion="paused"><img src={url} alt="" width="1254" height="1254"/><canvas ref={canvas} aria-hidden="true"/><svg className="al-gold-glint" viewBox="0 0 20 20" aria-hidden="true"><path d="m10 0 2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5Z" fill="#fff5d2"/></svg></div>
}
