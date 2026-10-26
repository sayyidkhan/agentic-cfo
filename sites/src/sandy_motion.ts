import type {SandyStateId} from './sandy_states'
export type SandyPose={body:number,stretch:number,head:number,x:number,y:number,tail:number,hop:number,breath:number,phase:string}
type Key={at:number,pose:Partial<SandyPose>}
const key=(at:number,pose:Partial<SandyPose>={}):Key=>({at,pose})
const neutral:SandyPose={body:0,stretch:0,head:0,x:0,y:0,tail:0,hop:0,breath:0,phase:'rest'}
/** Authored beats: anticipation, gesture, hold, follow-through, then a quiet rest. */
const sequences:Record<SandyStateId,{duration:number,keys:Key[]}>= {
 curious:{duration:9.6,keys:[key(0),key(.6,{head:-.012,phase:'notice'}),key(1.6,{body:.014,head:.09,x:.003,y:0,tail:.04,phase:'listen'}),key(2.8,{body:.014,head:.09,x:.003,y:0,tail:.04,phase:'listen'}),key(3.8,{head:-.012,phase:'settle'}),key(4.6),key(5.5,{body:-.009,head:-.016,phase:'acorn presentation'}),key(6.3,{body:-.009,head:-.016,phase:'acorn presentation'}),key(7.4),key(9.6)]},
 calm:{duration:10.4,keys:[key(0),key(2.2),key(3.1,{head:-.018,y:.004,phase:'gentle nod'}),key(4.1,{head:.009,tail:.012,phase:'settle'}),key(5.2),key(10.4)]},
 watchful:{duration:9.2,keys:[key(0),key(.8,{head:.012,phase:'notice'}),key(1.8,{head:-.068,x:.004,y:-.004,tail:-.018,phase:'consider'}),key(3.2,{head:-.068,x:.004,y:-.004,tail:-.018,phase:'consider'}),key(4.5,{head:.01,tail:.009,phase:'settle'}),key(5.5),key(9.2)]},
 concerned:{duration:11,keys:[key(0),key(1.2),key(2.6,{head:.052,y:.006,phase:'reassure'}),key(4,{head:.052,y:.006,phase:'reassure'}),key(5.7,{head:-.008,tail:.013,phase:'settle'}),key(7),key(11)]},
 screaming:{duration:10,keys:[key(0),key(.18,{y:.003,phase:'anticipate'}),key(.5,{head:-.055,y:-.008,tail:-.03,phase:'startle'}),key(.85,{head:.018,tail:.018,phase:'recover'}),key(1.5,{head:-.006,phase:'settle'}),key(2.4),key(10)]},
 celebrating:{duration:8.8,keys:[key(0),key(.35,{stretch:-.035,body:.008,y:.003,phase:'anticipate'}),key(.85,{stretch:.025,body:-.023,head:-.025,hop:-.04,tail:.028,phase:'celebrate'}),key(1.3,{stretch:-.028,body:.012,head:.012,phase:'land'}),key(1.65,{stretch:.016,body:-.012,head:-.014,hop:-.022,tail:.016,phase:'little hop'}),key(2.3,{head:.008,phase:'settle'}),key(3.2),key(8.8)]},
 relieved:{duration:12,keys:[key(0),key(1.4,{y:-.005,breath:.005,phase:'breathe in'}),key(3.4,{head:.034,y:.007,breath:-.002,phase:'breathe out'}),key(4.6,{head:.034,y:.007,phase:'relax'}),key(6.2,{head:-.005,tail:.015,phase:'settle'}),key(7.7),key(12)]},
}
const smooth=(lo:number,hi:number,v:number)=>{const t=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));return t*t*(3-2*t)}
export function sampleSandyPose(mood:SandyStateId,seconds:number):SandyPose{
 const sequence=sequences[mood],t=((seconds%sequence.duration)+sequence.duration)%sequence.duration,keys=sequence.keys
 let n=0;while(n<keys.length-2&&t>keys[n+1].at)n++
 const a=keys[n],b=keys[n+1],v=(t-a.at)/(b.at-a.at),ease=v*v*v*(v*(v*6-15)+10),out={...neutral,phase:(v<.5?a:b).pose.phase||'rest'}
 for(const name of ['body','stretch','head','x','y','tail','hop','breath'] as const)out[name]=(a.pose[name]||0)+((b.pose[name]||0)-(a.pose[name]||0))*ease
 return out
}
const landmarks:Record<SandyStateId,{neck:[number,number]}>={
 curious:{neck:[.62,.445]},calm:{neck:[.63,.45]},watchful:{neck:[.64,.45]},concerned:{neck:[.65,.46]},screaming:{neck:[.65,.45]},celebrating:{neck:[.62,.45]},relieved:{neck:[.64,.45]},
}
/** Float offsets remove quantisation jitter; exact head rotation preserves eye shape. */
export function createMotionRig(mood:SandyStateId,size=160){
 const config=landmarks[mood],weights=new Float32Array(size*size*4),field=new Float32Array(size*size*2),duration=sequences[mood].duration
 for(let py=0;py<size;py++)for(let px=0;px<size;px++){
  const x=(px+.5)/size,y=(py+.5)/size,i=(py*size+px)*4
  weights[i]=(1-smooth(.38,.5,x))*(1-smooth(.72,.88,y))*smooth(.02,.12,y)
  weights[i+3]=(1-smooth(.25,.73,y))*weights[i]
  weights[i+1]=smooth(.39,.49,x)*(1-smooth(.4,.51,y))
  weights[i+2]=Math.exp(-(((x-.64)/.2)**2+((y-.62)/.21)**2)*2)*(1-smooth(.81,.89,y))
 }
 return {size,frame(seconds:number){
  const pose=sampleSandyPose(mood,seconds),follow=sampleSandyPose(mood,seconds-.22),tipFollow=sampleSandyPose(mood,seconds-.5),cycle=seconds/duration*Math.PI*2
  const head=pose.head+Math.sin(cycle)*.003,rawTail=follow.tail+follow.head*.3+Math.sin(cycle*2)*.012,tail=rawTail<0?-.024*Math.tanh(-rawTail/.024):rawTail,breath=Math.sin(cycle*3)*.003+pose.breath
  const tip=(tipFollow.tail-follow.tail)*.55+(tipFollow.head-follow.head)*.12
  const ch=Math.cos(head)-1,sh=Math.sin(head),ct=Math.cos(tail)-1,st=Math.sin(tail)
  for(let py=0;py<size;py++)for(let px=0;px<size;px++){
   const x=(px+.5)/size,y=(py+.5)/size,i=(py*size+px)*4,k=(py*size+px)*2
   field[k]=((x-.4)*ct+(y-.82)*st)*weights[i]+((x-config.neck[0])*ch+(y-config.neck[1])*sh-pose.x)*weights[i+1]+(y-.6)*tip*weights[i+3]
   field[k+1]=(-(x-.4)*st+(y-.82)*ct)*weights[i]+(-(x-config.neck[0])*sh+(y-config.neck[1])*ch-pose.y)*weights[i+1]+breath*weights[i+2]-(x-.35)*tip*weights[i+3]
  }
  return field
 }}
}
