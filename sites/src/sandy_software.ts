import * as T from 'three'
/** Small CPU triangle renderer for devices without WebGL. Same mesh, normals and rig. */
export function softwareRenderer(){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;let ratio=1,width=280,buffer:ImageData,zbuffer:Float32Array
 const view=new T.Matrix4(),normal=new T.Matrix3(),point=new T.Vector3(),n=new T.Vector3(),key=new T.Vector3(-.4,.7,.8).normalize(),rim=new T.Vector3(.7,.2,-.5).normalize()
 return {domElement:canvas,setPixelRatio(n:number){ratio=Math.min(n,1.3)},setSize(w:number,_h:number){const size=Math.min(440,Math.round(w*ratio));if(width===size&&buffer)return;width=size;canvas.width=size;canvas.height=size;buffer=ctx.createImageData(width,width);zbuffer=new Float32Array(width*width)},dispose(){},forceContextLoss(){},render(scene:T.Scene,camera:T.Camera){
  if(!buffer)return;buffer.data.fill(0);zbuffer.fill(Infinity);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true)
  scene.traverse(obj=>{const mesh=obj as T.Mesh;if(!mesh.isMesh)return;const mat=mesh.material as T.MeshStandardMaterial;if(!mat.color||mat.opacity<.5)return
   const geo=mesh.geometry,pos=geo.getAttribute('position'),norm=geo.getAttribute('normal'),idx=geo.index;if(!norm)return
   view.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(mesh.matrixWorld);normal.getNormalMatrix(mesh.matrixWorld)
   const base=mat.color.clone().convertLinearToSRGB(),verts=new Float32Array(pos.count*6)
   for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i).applyMatrix4(view);n.fromBufferAttribute(norm,i).applyNormalMatrix(normal);const brightness=.46+Math.max(0,n.dot(key))*.62+Math.max(0,n.dot(rim))*.16,j=i*6;verts[j]=(point.x+1)*width*.5;verts[j+1]=(1-point.y)*width*.5;verts[j+2]=point.z;verts[j+3]=Math.min(255,base.r*255*brightness);verts[j+4]=Math.min(255,base.g*255*brightness);verts[j+5]=Math.min(255,base.b*255*brightness)}
   const count=idx?idx.count:pos.count
   for(let t=0;t<count;t+=3){const a=(idx?idx.getX(t):t)*6,b=(idx?idx.getX(t+1):t+1)*6,c=(idx?idx.getX(t+2):t+2)*6,ax=verts[a],ay=verts[a+1],bx=verts[b],by=verts[b+1],cx=verts[c],cy=verts[c+1],den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(den>=-.001)continue
    const minX=Math.max(0,Math.floor(Math.min(ax,bx,cx))),maxX=Math.min(width-1,Math.ceil(Math.max(ax,bx,cx))),minY=Math.max(0,Math.floor(Math.min(ay,by,cy))),maxY=Math.min(width-1,Math.ceil(Math.max(ay,by,cy)))
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const u=((by-cy)*(x+.5-cx)+(cx-bx)*(y+.5-cy))/den,v=((cy-ay)*(x+.5-cx)+(ax-cx)*(y+.5-cy))/den,w=1-u-v;if(u<0||v<0||w<0)continue;const z=u*verts[a+2]+v*verts[b+2]+w*verts[c+2],p=y*width+x;if(z>=zbuffer[p])continue;zbuffer[p]=z;const k=p*4;buffer.data[k]=u*verts[a+3]+v*verts[b+3]+w*verts[c+3];buffer.data[k+1]=u*verts[a+4]+v*verts[b+4]+w*verts[c+4];buffer.data[k+2]=u*verts[a+5]+v*verts[b+5]+w*verts[c+5];buffer.data[k+3]=255}
   }
  });ctx.putImageData(buffer,0,0);ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#5d493318';ctx.beginPath();point.set(0,.23,0).project(camera);ctx.ellipse((point.x+1)*width*.5,(1-point.y)*width*.5,width*.2,width*.025,0,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over'
 }}
}
