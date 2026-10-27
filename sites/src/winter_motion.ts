const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
const ellipse=(x:number,y:number,cx:number,cy:number,rx:number,ry:number)=>1-smooth(.62,1,Math.hypot((x-cx)/rx,(y-cy)/ry))
/** A quiet eight-second performance. The lounger and the acorn-holding paws are anchors. */
export function sampleWinterPose(seconds:number){const p=seconds*Math.PI/4;return {head:.033*Math.sin(p),tail:.075*Math.sin(p)-.018*Math.sin(p*2),breath:.03*(.5-.5*Math.cos(p*2))}}
export function createWinterRig(size=81){
 const field=new Float32Array(size*size*2),weights=new Float32Array(size*size*3)
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x+.5)/size,v=(y+.5)/size,k=(y*size+x)*3
  // The head rotates as one shape; the blend ends before the scarf and paws.
  weights[k]=ellipse(u,v,.555,.225,.235,.245)*smooth(.38,.41,u)*(1-smooth(.375,.425,v))
  // This sloping boundary follows the wooden backrest, keeping its slats still.
  weights[k+1]=ellipse(u,v,.205,.37,.24,.32)*(1-smooth(Math.min(.145+.29*v,.25)-.03,Math.min(.145+.29*v,.25),u))
  // Only the soft belly expands. Both forearms and the golden acorn stay intact.
  weights[k+2]=ellipse(u,v,.60,.565,.17,.13)*smooth(.515,.54,v)*smooth(.49,.535,u)*(1-smooth(.65,.69,v))
 }
 return {size,frame(seconds:number){const p=sampleWinterPose(seconds),hc=Math.cos(-p.head),hs=Math.sin(-p.head),tc=Math.cos(-p.tail),ts=Math.sin(-p.tail)
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const u=(x+.5)/size,v=(y+.5)/size,k=(y*size+x)*3,j=(y*size+x)*2,h=weights[k],t=weights[k+1],b=weights[k+2],hx=u-.55,hy=v-.405,tx=u-.30,ty=v-.64
   field[j]=h*(hx*hc-hy*hs-hx)+t*(tx*tc-ty*ts-tx)-b*(u-.60)*p.breath
   field[j+1]=h*(hx*hs+hy*hc-hy)+t*(tx*ts+ty*tc-ty)-b*(v-.65)*p.breath
  }return field}}
}
