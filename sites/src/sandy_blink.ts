import type {SandyStateId} from './sandy_states'
import type {SandyPixels} from './sandy_raster'
// Beaver calibration (fractions of the 800px artwork): [centre x, centre y, radius x, radius y, tilt in radians].
// Celebrating, calm and relieved are painted with closed eyes, so they have no painted blink.
const eyes:Partial<Record<SandyStateId|'greeting',number[][]>>={
 greeting:[[.456,.136,.021,.019,-.17],[.588,.104,.019,.019,-.17]],
 curious:[[.471,.157,.025,.019,-.28],[.588,.108,.017,.018,-.28]],
 watchful:[[.485,.135,.025,.021,-.085],[.615,.119,.021,.021,-.085]],
 concerned:[[.446,.15,.021,.021,-.11],[.575,.129,.023,.019,-.11]],
 screaming:[[.508,.132,.04,.036,-.045],[.648,.123,.03,.034,-.045]],
}
// Closed eyelids sampled from Calm Sandy: [centre x, centre y, radius x, radius y]; tilt below.
const reference=[[.485,.127,.024,.02],[.618,.106,.02,.018]],referenceTilt=-.11
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
/** A single unhurried blink; no repeated twitch/double-blink pulses. */
export function blinkAmount(seconds:number){const t=((seconds%6.4)+6.4)%6.4;if(t<1.2||t>=1.5)return 0;if(t<1.3)return smooth(1.2,1.3,t);if(t<1.36)return 1;return 1-smooth(1.36,1.5,t)}
export const hasPaintedBlink=(mood:SandyStateId|'greeting')=>!!eyes[mood]
/** Cached eyelid pixels from Calm Sandy (beaver artwork) are revealed over the eyes before posing.
 * Only eyelid texture changes: pupils, face geometry and surrounding artwork stay put. */
export function createPaintedBlink(original:SandyPixels,closed:SandyPixels|undefined,mood:SandyStateId|'greeting'){
 if(!closed||!eyes[mood])return {frame:(_amount:number)=>original}
 const output={width:original.width,height:original.height,data:new Uint8ClampedArray(original.data.length)},patches:{index:number,edge:number,vertical:number,r:number,g:number,b:number}[]=[]
 const rc=Math.cos(referenceTilt),rs=Math.sin(referenceTilt)
 for(const [n,[cx,cy,rx,ry,angle]] of eyes[mood]!.entries()){
  const cos=Math.cos(angle),sin=Math.sin(angle)
  const radius=Math.max(rx,ry)*1.4,w=original.width,h=original.height
  for(let py=Math.max(0,Math.floor((cy-radius)*h));py<Math.min(h,Math.ceil((cy+radius)*h));py++)for(let px=Math.max(0,Math.floor((cx-radius)*w));px<Math.min(w,Math.ceil((cx+radius)*w));px++){
   const x=(px+.5)/w-cx,y=(py+.5)/h-cy,u=x*cos+y*sin,v=-x*sin+y*cos,radius=Math.hypot(u/rx,v/ry),edge=1-smooth(.76,1,radius),index=(py*w+px)*4
   if(edge<=0||original.data[index+3]===0)continue
   const a=u/rx*reference[n][2],b=v/ry*reference[n][3],sx=(reference[n][0]+a*rc-b*rs)*closed.width-.5,sy=(reference[n][1]+a*rs+b*rc)*closed.height-.5
   const x0=Math.max(0,Math.min(closed.width-2,Math.floor(sx))),y0=Math.max(0,Math.min(closed.height-2,Math.floor(sy))),tx=sx-x0,ty=sy-y0,p=(y0*closed.width+x0)*4
   const sample=(channel:number)=>closed.data[p+channel]*(1-tx)*(1-ty)+closed.data[p+4+channel]*tx*(1-ty)+closed.data[p+closed.width*4+channel]*(1-tx)*ty+closed.data[p+closed.width*4+4+channel]*tx*ty
   patches.push({index,edge,vertical:v/ry,r:sample(0),g:sample(1),b:sample(2)})
  }
 }
 return {frame(amount:number){if(amount<=.001)return original;output.data.set(original.data);const closure=smooth(0,1,Math.max(0,Math.min(1,amount))),upper=-1.1+1.65*closure,lower=1.1-.75*closure
  for(const patch of patches){const alpha=patch.edge*Math.max(1-smooth(upper-.08,upper+.08,patch.vertical),smooth(lower-.08,lower+.08,patch.vertical)),i=patch.index;output.data[i]=original.data[i]*(1-alpha)+patch.r*alpha;output.data[i+1]=original.data[i+1]*(1-alpha)+patch.g*alpha;output.data[i+2]=original.data[i+2]*(1-alpha)+patch.b*alpha}
  return output
 }}
}

/** Never skip the closed pose when a slow/background webview misses a blink interval. */
export function createBlinkClock(){
 const intervals=[4900,6200,5400,7100]
 let next=1200,start:number|undefined,closedShown=false,count=0
 return {get count(){return count},sample(milliseconds:number){
  if(start===undefined){if(milliseconds<next)return 0;start=milliseconds;closedShown=false}
  const age=milliseconds-start
  if(age<=0)return 0
  if(age>=100&&!closedShown){closedShown=true;count++;return 1}
  if(age>=300){start=undefined;next=milliseconds+intervals[(count-1)%intervals.length];return 0}
  return blinkAmount(1.2+age/1000)
 }}
}
