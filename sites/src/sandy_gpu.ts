import type {SandyPixels} from './sandy_raster'
/** 16-bit displacement precision without float-texture extensions (including mobile WebGL). */
export function encodeSandyField(field:Float32Array,out:Uint8Array){
 for(let i=0;i<field.length;i++){const v=Math.round(Math.max(0,Math.min(1,field[i]*4+.5))*65535);out[i*2]=v>>>8;out[i*2+1]=v&255}
 return out
}
export function createSandyGpu(canvas:HTMLCanvasElement,fieldSize:number){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,depth:false,stencil:false})
 if(!gl){canvas.dataset.gpuFallback='unavailable';return null}
 let program:WebGLProgram|null=null
 const textures:WebGLTexture[]=[],shaders:WebGLShader[]=[]
 let buffer:WebGLBuffer|null=null
 const dispose=()=>{textures.forEach(t=>gl.deleteTexture(t));shaders.forEach(s=>gl.deleteShader(s));if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program)}
 try{
  const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'Shader unavailable');return s}
  program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=vec2((p.x+1.0)*.5,(1.0-p.y)*.5);gl_Position=vec4(p,0.,1.);}'))
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision highp float;
 varying vec2 uv; uniform sampler2D art; uniform sampler2D motion; uniform float size;
 vec2 offsetAt(vec2 p){vec4 c=texture2D(motion,p);return (vec2(c.r*65280.+c.g*255.,c.b*65280.+c.a*255.)/65535.-.5)*.25;}
 void main(){vec2 f=clamp(uv*size-.5,0.,size-1.),a=floor(f),t=fract(f),b=min(a+1.,size-1.);
 vec2 d=mix(mix(offsetAt((a+.5)/size),offsetAt((vec2(b.x,a.y)+.5)/size),t.x),mix(offsetAt((vec2(a.x,b.y)+.5)/size),offsetAt((b+.5)/size),t.x),t.y);
 vec2 sampleUV=uv+d;if(sampleUV.x<0.||sampleUV.x>1.||sampleUV.y<0.||sampleUV.y>1.){gl_FragColor=vec4(0.);return;}gl_FragColor=texture2D(art,sampleUV);}`))
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link unavailable');gl.useProgram(program)
  buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW)
  const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
  for(let i=0;i<2;i++){gl.activeTexture(gl.TEXTURE0+i);const texture=gl.createTexture()!;textures.push(texture);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,i?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,i?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}
  gl.uniform1i(gl.getUniformLocation(program,'art'),0);gl.uniform1i(gl.getUniformLocation(program,'motion'),1);gl.uniform1f(gl.getUniformLocation(program,'size'),fieldSize)
  const encoded=new Uint8Array(fieldSize*fieldSize*4);let lastSource:SandyPixels|undefined,lastRevision=-1,premultiplied:Uint8Array|undefined
  return {dispose,draw(source:SandyPixels,field:Float32Array,revision:number){
   if(gl.isContextLost())return false
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[0])
   if(source!==lastSource||revision!==lastRevision){premultiplied||=new Uint8Array(source.data.length);for(let i=0;i<source.data.length;i+=4){const a=source.data[i+3]/255;premultiplied[i]=Math.round(source.data[i]*a);premultiplied[i+1]=Math.round(source.data[i+1]*a);premultiplied[i+2]=Math.round(source.data[i+2]*a);premultiplied[i+3]=source.data[i+3]}gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,source.width,source.height,0,gl.RGBA,gl.UNSIGNED_BYTE,premultiplied);lastSource=source;lastRevision=revision}
   gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,textures[1]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,fieldSize,fieldSize,0,gl.RGBA,gl.UNSIGNED_BYTE,encodeSandyField(field,encoded));gl.viewport(0,0,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return true
  }}
 }catch(error){canvas.dataset.gpuFallback=String(error);dispose();return null}
}
