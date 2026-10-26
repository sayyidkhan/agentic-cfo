import type {SandyStateId} from './sandy_states'
type Point=[number,number]
const landmarks:Record<SandyStateId,{paws:Point[],neck:Point}>={
 curious:{paws:[[.635,.555],[.735,.565]],neck:[.62,.445]},
 calm:{paws:[[.65,.61],[.74,.6]],neck:[.63,.45]},
 watchful:{paws:[[.63,.61],[.7,.46]],neck:[.64,.45]},
 concerned:{paws:[[.64,.6],[.77,.435]],neck:[.65,.46]},
 screaming:{paws:[[.532,.38],[.79,.436]],neck:[.65,.45]},
 celebrating:{paws:[[.31,.406],[.9,.275]],neck:[.62,.45]},
 relieved:{paws:[[.6,.55],[.74,.57]],neck:[.64,.45]},
}
const smooth=(lo:number,hi:number,v:number)=>{const t=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));return t*t*(3-2*t)}
/** Inverse deformation field: feet stay still while fur, face and paws move locally. */
export function createMotionRig(mood:SandyStateId,size=160){
 const config=landmarks[mood],weights=new Float32Array(size*size*5),rgba=new Uint8ClampedArray(size*size*4)
 for(let py=0;py<size;py++)for(let px=0;px<size;px++){
  const x=(px+.5)/size,y=(py+.5)/size,i=(py*size+px)*5
  weights[i]=(1-smooth(.38,.5,x))*(1-smooth(.72,.88,y))*smooth(.02,.12,y)
  weights[i+1]=smooth(.39,.49,x)*(1-smooth(.4,.51,y))
  weights[i+2]=Math.exp(-(((x-.64)/.2)**2+((y-.62)/.21)**2)*2)*(1-smooth(.81,.89,y))
  config.paws.forEach(([cx,cy],n)=>weights[i+3+n]=Math.exp(-(((x-cx)/.095)**2+((y-cy)/.11)**2)*2))
  rgba[(py*size+px)*4+2]=128;rgba[(py*size+px)*4+3]=255
 }
 return {size,rgba,frame(seconds:number){
  const headAngle=(Math.sin(seconds*1.25)*.024+Math.sin(seconds*.47)*.012)*(mood==='screaming'?.35:1),tail=Math.sin(seconds*1.7)*.032+Math.sin(seconds*.8)*.008,breath=Math.sin(seconds*2)*.004
  const paw=Math.sin(seconds*(mood==='celebrating'?3.8:1.9))*(mood==='celebrating'?.014:.006),alarm=mood==='screaming'?Math.max(0,1-seconds/1.1)*Math.sin(seconds*40)*.005:0
  for(let py=0;py<size;py++)for(let px=0;px<size;px++){
   const x=(px+.5)/size,y=(py+.5)/size,i=(py*size+px)*5,k=(py*size+px)*4
   let dx=tail*weights[i]*(.9-y)+(y-config.neck[1])*headAngle*weights[i+1]+alarm*weights[i+1]
   let dy=-(x-config.neck[0])*headAngle*weights[i+1]+breath*weights[i+2]+paw*(weights[i+3]+weights[i+4])
   // Displacement scale 128 in an 800-unit artwork: +/-0.08 of image width.
   rgba[k]=Math.max(0,Math.min(255,Math.round(127.5+dx*800/128*255)))
   rgba[k+1]=Math.max(0,Math.min(255,Math.round(127.5+dy*800/128*255)))
  }
  return rgba
 }}
}
