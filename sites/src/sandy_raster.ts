export type SandyPixels={width:number,height:number,data:Uint8ClampedArray}
/** Premultiplied interpolation prevents invisible RGB in transparent fur pixels bleeding. */
export function paintSandyFrame(source:SandyPixels,field:Float32Array,fieldSize:number,out:SandyPixels){
 const {width:sw,height:sh,data:src}=source,{width:w,height:h,data:dst}=out
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=(x+.5)/w,v=(y+.5)/h,fx=Math.max(0,Math.min(fieldSize-1,u*fieldSize-.5)),fy=Math.max(0,Math.min(fieldSize-1,v*fieldSize-.5)),ix=Math.floor(fx),iy=Math.floor(fy),jx=Math.min(ix+1,fieldSize-1),jy=Math.min(iy+1,fieldSize-1),tx=fx-ix,ty=fy-iy
  const f00=(iy*fieldSize+ix)*2,f10=(iy*fieldSize+jx)*2,f01=(jy*fieldSize+ix)*2,f11=(jy*fieldSize+jx)*2,a=(1-tx)*(1-ty),b=tx*(1-ty),c=(1-tx)*ty,d=tx*ty
  const dx=(field[f00]*a+field[f10]*b+field[f01]*c+field[f11]*d),dy=(field[f00+1]*a+field[f10+1]*b+field[f01+1]*c+field[f11+1]*d)
  const sx=(u+dx)*sw-.5,sy=(v+dy)*sh-.5,k=(y*w+x)*4
  if(sx<-.5||sy<-.5||sx>sw-.5||sy>sh-.5){dst[k]=dst[k+1]=dst[k+2]=dst[k+3]=0;continue}
  const cx=Math.max(0,Math.min(sw-1,sx)),cy=Math.max(0,Math.min(sh-1,sy)),x0=Math.floor(cx),y0=Math.floor(cy),x1=Math.min(x0+1,sw-1),y1=Math.min(y0+1,sh-1),wx=cx-x0,wy=cy-y0
  const p00=(y0*sw+x0)*4,p10=(y0*sw+x1)*4,p01=(y1*sw+x0)*4,p11=(y1*sw+x1)*4
  const q00=(1-wx)*(1-wy),q10=wx*(1-wy),q01=(1-wx)*wy,q11=wx*wy
  const a00=src[p00+3]*q00,a10=src[p10+3]*q10,a01=src[p01+3]*q01,a11=src[p11+3]*q11,alpha=a00+a10+a01+a11
  dst[k+3]=alpha
  for(let n=0;n<3;n++)dst[k+n]=alpha>0?(src[p00+n]*a00+src[p10+n]*a10+src[p01+n]*a01+src[p11+n]*a11)/alpha:0
 }
 return out
}
