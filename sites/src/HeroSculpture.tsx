import React,{useRef} from 'react'
/** A pre-rendered brand sculpture keeps the same finish on phones and non-WebGL browsers. */
export default function HeroSculpture(){
 const host=useRef<HTMLDivElement>(null)
 const reset=()=>{host.current?.style.setProperty('--art-x','0deg');host.current?.style.setProperty('--art-y','0deg')}
 const move=(event:React.PointerEvent<HTMLDivElement>)=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const box=event.currentTarget.getBoundingClientRect()
  host.current?.style.setProperty('--art-x',`${((event.clientX-box.left)/box.width-.5)*12}deg`)
  host.current?.style.setProperty('--art-y',`${-((event.clientY-box.top)/box.height-.5)*8}deg`)
 }
 return <div className="al-sculpture" ref={host} aria-hidden="true" onPointerMove={move} onPointerLeave={reset}>
  <span className="al-sculpture-aura"/><div className="al-sculpture-art"><img src="/assets/brand/acorra-sculpture-v1.webp" alt="" fetchPriority="high" width="1254" height="1254"/></div><i className="al-sculpture-spark"/><i className="al-sculpture-spark"/><i className="al-sculpture-spark"/>
 </div>
}
