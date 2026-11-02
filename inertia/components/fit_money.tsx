import {useEffect,useRef} from 'react'

/** Keep the full exact amount visible in a narrow metric, including large balances. */
export default function FitMoney({children,display}:{children:string;display?:string}){
 const root=useRef<HTMLElement>(null),text=useRef<HTMLSpanElement>(null)
 useEffect(()=>{
  const outer=root.current,inner=text.current;if(!outer||!inner)return
  let disposed=false,lastWidth=-1
  const fit=()=>{
   if(disposed)return
   const width=outer.clientWidth;if(!width)return
   inner.style.fontSize=''
   const size=parseFloat(getComputedStyle(inner).fontSize),needed=inner.getBoundingClientRect().width
   if(needed>width)inner.style.fontSize=(size*width/needed*.98)+'px'
  }
  const observer=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==lastWidth){lastWidth=width;fit()}})
  observer.observe(outer);fit();document.fonts?.ready.then(fit)
  return()=>{disposed=true;observer.disconnect()}
 },[children])
 return <strong className="acorra-money" ref={root}><span ref={text} className={display===undefined?undefined:"count-value"}>{display===undefined?children:<><span className="count-sr">{children}</span><span className="count-size" aria-hidden="true">{children}</span><span className="count-live" aria-hidden="true">{display}</span></>}</span></strong>
}
