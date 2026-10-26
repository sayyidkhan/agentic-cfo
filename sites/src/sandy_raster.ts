export type SandyPixels={width:number,height:number,data:Uint8ClampedArray}
const grids=new WeakMap<Uint8ClampedArray,{size:number,width:number,height:number,x:Float64Array,y:Float64Array}>()
function rasterGrid(out:SandyPixels,size:number){
 let grid=grids.get(out.data)
 if(!grid||grid.size!==size||grid.width!==out.width||grid.height!==out.height){
  const axis=(length:number)=>{const a=new Float64Array(length*4);for(let n=0;n<length;n++){const u=(n+.5)/length,f=Math.max(0,Math.min(size-1,u*size-.5)),i=Math.floor(f);a[n*4]=u;a[n*4+1]=i;a[n*4+2]=Math.min(i+1,size-1);a[n*4+3]=f-i}return a}
  grid={size,width:out.width,height:out.height,x:axis(out.width),y:axis(out.height)};grids.set(out.data,grid)
 }
 return grid
}
/** Premultiplied interpolation prevents invisible RGB in transparent fur pixels bleeding. */
export function paintSandyFrame(source:SandyPixels,field:Float32Array,fieldSize:number,out:SandyPixels){
 const {width:sw,height:sh,data:src}=source,{width:w,height:h,data:dst}=out
 const grid=rasterGrid(out,fieldSize),xs=grid.x,ys=grid.y
 for(let y=0;y<h;y++){
 const yi=y*4,v=ys[yi],iy=ys[yi+1]*fieldSize,jy=ys[yi+2]*fieldSize,ty=ys[yi+3],nty=1-ty
 for(let x=0;x<w;x++){
  const xi=x*4,u=xs[xi],ix=xs[xi+1],jx=xs[xi+2],tx=xs[xi+3],ntx=1-tx
  const f00=(iy+ix)*2,f10=(iy+jx)*2,f01=(jy+ix)*2,f11=(jy+jx)*2,a=ntx*nty,b=tx*nty,c=ntx*ty,d=tx*ty
  const dx=(field[f00]*a+field[f10]*b+field[f01]*c+field[f11]*d),dy=(field[f00+1]*a+field[f10+1]*b+field[f01+1]*c+field[f11+1]*d)
  const sx=(u+dx)*sw-.5,sy=(v+dy)*sh-.5,k=(y*w+x)*4
  if(sx<-.5||sy<-.5||sx>sw-.5||sy>sh-.5){dst[k]=dst[k+1]=dst[k+2]=dst[k+3]=0;continue}
  const cx=Math.max(0,Math.min(sw-1,sx)),cy=Math.max(0,Math.min(sh-1,sy)),x0=Math.floor(cx),y0=Math.floor(cy),x1=Math.min(x0+1,sw-1),y1=Math.min(y0+1,sh-1),wx=cx-x0,wy=cy-y0
  const p00=(y0*sw+x0)*4,p10=(y0*sw+x1)*4,p01=(y1*sw+x0)*4,p11=(y1*sw+x1)*4
  const q00=(1-wx)*(1-wy),q10=wx*(1-wy),q01=(1-wx)*wy,q11=wx*wy
  const a00=src[p00+3]*q00,a10=src[p10+3]*q10,a01=src[p01+3]*q01,a11=src[p11+3]*q11,alpha=a00+a10+a01+a11
  dst[k+3]=alpha
  if(alpha>0){const inv=1/alpha;dst[k]=(src[p00]*a00+src[p10]*a10+src[p01]*a01+src[p11]*a11)*inv;dst[k+1]=(src[p00+1]*a00+src[p10+1]*a10+src[p01+1]*a01+src[p11+1]*a11)*inv;dst[k+2]=(src[p00+2]*a00+src[p10+2]*a10+src[p01+2]*a01+src[p11+2]*a11)*inv}else dst[k]=dst[k+1]=dst[k+2]=0
 }
 }
 return out
}
