const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
const ellipse=(x:number,y:number,cx:number,cy:number,rx:number,ry:number)=>1-smooth(.62,1,Math.hypot((x-cx)/rx,(y-cy)/ry))
/** A quiet eight-second performance. The lounger and the paws holding the gold acorn are anchors. */
export function sampleWinterPose(seconds:number){const p=seconds*Math.PI/4;return {head:.033*Math.sin(p),tail:.075*Math.sin(p)-.018*Math.sin(p*2),breath:.03*(.5-.5*Math.cos(p*2))}}
export function createWinterRig(size=81){
 const field=new Float32Array(size*size*2),weights=new Float32Array(size*size*3)
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x+.5)/size,v=(y+.5)/size,k=(y*size+x)*3
  // The head rotates as one shape; the blend ends above the paws and before the backrest.
  weights[k]=ellipse(u,v,.63,.19,.22,.22)*smooth(.42,.46,u)*(1-smooth(.29,.32,v))*(1-smooth(.8,.84,u))
  // The paddle tail hangs over the front of the seat; the blend stops short of the seat legs.
  weights[k+1]=ellipse(u,v,.68,.85,.15,.15)*smooth(.72,.76,v)*smooth(.53,.57,u)
  // Only the soft belly expands. Both forearms and the golden acorn stay intact.
  weights[k+2]=ellipse(u,v,.40,.45,.13,.08)*smooth(.4,.425,v)*(1-smooth(.47,.5,v))*(1-smooth(.46,.49,u))
 }
 return {size,frame(seconds:number){const p=sampleWinterPose(seconds),hc=Math.cos(-p.head),hs=Math.sin(-p.head),tc=Math.cos(-p.tail),ts=Math.sin(-p.tail)
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const u=(x+.5)/size,v=(y+.5)/size,k=(y*size+x)*3,j=(y*size+x)*2,h=weights[k],t=weights[k+1],b=weights[k+2],hx=u-.6,hy=v-.33,tx=u-.62,ty=v-.72
   field[j]=h*(hx*hc-hy*hs-hx)+t*(tx*tc-ty*ts-tx)-b*(u-.40)*p.breath
   field[j+1]=h*(hx*hs+hy*hc-hy)+t*(tx*ts+ty*tc-ty)-b*(v-.48)*p.breath
  }return field}}
}
