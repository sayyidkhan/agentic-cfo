import type {SandyStateId} from './sandy_states'
import type {SandyPixels} from './sandy_raster'
const eyes:Partial<Record<SandyStateId,number[][]>>={
 curious:[[.57,.255,.057,.066],[.724,.321,.057,.063]],
 watchful:[[.573,.258,.057,.066],[.729,.323,.057,.064]],
 concerned:[[.583,.263,.057,.067],[.737,.33,.057,.064]],
 screaming:[[.608,.247,.058,.077],[.749,.287,.058,.075]],
 celebrating:[[.555,.244,.056,.064],[.712,.3,.056,.064]],
}
const reference=[[.575,.27],[.739,.335]]
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
/** A single unhurried blink; no repeated twitch/double-blink pulses. */
export function blinkAmount(seconds:number){const t=((seconds%6.4)+6.4)%6.4;if(t<1.2||t>=1.5)return 0;if(t<1.3)return smooth(1.2,1.3,t);if(t<1.36)return 1;return 1-smooth(1.36,1.5,t)}
export const hasPaintedBlink=(mood:SandyStateId)=>!!eyes[mood]
/** Cached eyelid pixels from Calm Sandy are revealed over the eyes before posing.
 * Only eyelid texture changes: pupils, face geometry and surrounding artwork stay put. */
export function createPaintedBlink(original:SandyPixels,closed:SandyPixels|undefined,mood:SandyStateId){
 if(!closed||!eyes[mood])return {frame:(_amount:number)=>original}
 const output={width:original.width,height:original.height,data:new Uint8ClampedArray(original.data.length)},patches:{index:number,edge:number,vertical:number,r:number,g:number,b:number}[]=[]
 const angle=mood==='screaming'?.15:.28,cos=Math.cos(angle),sin=Math.sin(angle),rc=Math.cos(.28),rs=Math.sin(.28)
 for(const [n,[cx,cy,rx,ry]] of eyes[mood]!.entries()){
  const radius=Math.max(rx,ry)*1.4,w=original.width,h=original.height
  for(let py=Math.max(0,Math.floor((cy-radius)*h));py<Math.min(h,Math.ceil((cy+radius)*h));py++)for(let px=Math.max(0,Math.floor((cx-radius)*w));px<Math.min(w,Math.ceil((cx+radius)*w));px++){
   const x=(px+.5)/w-cx,y=(py+.5)/h-cy,u=x*cos+y*sin,v=-x*sin+y*cos,radius=Math.hypot(u/rx,v/ry),edge=1-smooth(.76,1,radius),index=(py*w+px)*4
   if(edge<=0||original.data[index+3]===0)continue
   const a=u/rx*.054,b=v/ry*.061,sx=(reference[n][0]+a*rc-b*rs)*closed.width-.5,sy=(reference[n][1]+a*rs+b*rc)*closed.height-.5
   const x0=Math.max(0,Math.min(closed.width-2,Math.floor(sx))),y0=Math.max(0,Math.min(closed.height-2,Math.floor(sy))),tx=sx-x0,ty=sy-y0,p=(y0*closed.width+x0)*4
   const sample=(channel:number)=>closed.data[p+channel]*(1-tx)*(1-ty)+closed.data[p+4+channel]*tx*(1-ty)+closed.data[p+closed.width*4+channel]*(1-tx)*ty+closed.data[p+closed.width*4+4+channel]*tx*ty
   patches.push({index,edge,vertical:Math.abs(v)/ry,r:sample(0),g:sample(1),b:sample(2)})
  }
 }
 return {frame(amount:number){if(amount<=.001)return original;output.data.set(original.data);const opening=(1-amount)**2*1.15-.12
  for(const patch of patches){const alpha=patch.edge*smooth(opening-.08,opening+.08,patch.vertical),i=patch.index;output.data[i]=original.data[i]*(1-alpha)+patch.r*alpha;output.data[i+1]=original.data[i+1]*(1-alpha)+patch.g*alpha;output.data[i+2]=original.data[i+2]*(1-alpha)+patch.b*alpha}
  return output
 }}
}

/** Never skip the closed pose when a slow/background webview misses a blink interval. */
export function createBlinkClock(){
 let next=1200,start:number|undefined,closedShown=false,count=0
 return {get count(){return count},sample(milliseconds:number){
  if(start===undefined){if(milliseconds<next)return 0;start=milliseconds;closedShown=false}
  const age=milliseconds-start
  if(age<=0)return 0
  if(age>=100&&!closedShown){closedShown=true;count++;return 1}
  if(age>=300){start=undefined;next=milliseconds+6100;return 0}
  return blinkAmount(1.2+age/1000)
 }}
}
