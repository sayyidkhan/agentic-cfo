import * as T from 'three'
import {softwareRenderer} from './sandy_software'
import type {SandyStateId} from './sandy_states'
let thumbnailRenderer:ReturnType<typeof renderer>|undefined
let supportsWebGL:boolean|undefined
function renderer(){
 if(supportsWebGL===undefined){try{const test=document.createElement('canvas'),gl=test.getContext('webgl2');supportsWebGL=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{supportsWebGL=false}}
 if(!supportsWebGL)return softwareRenderer()
 try{const r=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});r.setClearColor(0,0);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.2;return r}catch{supportsWebGL=false;return softwareRenderer()}
}
/** Small original rig: shared geometry, no models, trackers, remote assets or runtime calls. */
export function mountSandy(host:HTMLElement,mood:SandyStateId,animate:boolean,onFailure:()=>void){
 let r:ReturnType<typeof renderer>, canvas:HTMLCanvasElement
 try{r=animate?renderer():(thumbnailRenderer??=renderer());canvas=animate?r.domElement:document.createElement('canvas')}catch{onFailure();return ()=>{}}
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(28,1,.1,40);camera.position.set(1.65,2.6,8);camera.lookAt(0,1.6,0)
 scene.add(new T.HemisphereLight(0xfff5dc,0x687b64,2.4))
 for(const [c,int,x,y,z] of [[0xffead0,4,-3,5,5],[0xffffff,2,4,3,1],[0xffd198,3,-2,3,-4]]){const l=new T.DirectionalLight(c,int);l.position.set(x,y,z);scene.add(l)}
 const geometry=new T.SphereGeometry(1,32,24),materials:T.Material[]=[],geometries:T.BufferGeometry[]=[geometry]
 function material(color:string,roughness=.62){const m=new T.MeshStandardMaterial({color,roughness,metalness:0});materials.push(m);return m}
 const fur=material('#bb773d'),lightFur=material('#d99750'),cream=material('#ffe3ad'),inner=material('#c88e76'),dark=material('#38291f',.4),white=material('#fff9e8',.28),eye=material('#172b25',.18),pink=material('#ce8074'),cap=material('#6f7042'),gold=material('#d2ad5c',.32)
 function ball(parent:T.Object3D,mat:T.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number){const o=new T.Mesh(geometry,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o}
 function line(parent:T.Object3D,mat:T.Material,pts:number[][],radius=.025){const curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const geo=new T.TubeGeometry(curve,24,radius,8,false);geometries.push(geo);const o=new T.Mesh(geo,mat);o.userData.curve=curve;o.userData.radius=radius;parent.add(o);return o}
 const rig=new T.Group();scene.add(rig)
 const tail=new T.Group();rig.add(tail);tail.position.set(-.55,.8,-.3)
 line(tail,fur,[[0,0,0],[-.65,.25,-.1],[-.95,.95,-.15],[-.85,1.65,-.2],[-.35,1.85,-.2],[0,1.5,-.2],[-.3,1.15,-.1]],.43)
 line(tail,lightFur,[[-.45,.3,.03],[-.72,.85,.15],[-.62,1.5,.1],[-.3,1.65,.1],[-.07,1.48,.1]],.13)
 const body=new T.Group();rig.add(body)
 ball(body,fur,0,1.13,0,.56,.76,.43);ball(body,cream,0,1.14,.355,.37,.57,.13)
 ball(body,fur,-.35,.43,.17,.27,.18,.4);ball(body,fur,.35,.43,.17,.27,.18,.4)
 const head=new T.Group();head.position.set(0,2.14,.02);rig.add(head)
 ball(head,lightFur,0,0,0,.75,.65,.56)
 for(const x of [-.48,.48]){const ear=ball(head,fur,x,.65,-.06,.22,.46,.17);ear.rotation.z=x<0?.26:-.26;const inset=ball(head,inner,x,.68,.075,.12,.3,.06);inset.rotation.z=ear.rotation.z}
 ball(head,lightFur,-.54,-.18,.08,.24,.25,.31);ball(head,lightFur,.54,-.18,.08,.24,.25,.31)
 ball(head,cream,-.21,-.23,.49,.3,.25,.16);ball(head,cream,.21,-.23,.49,.3,.25,.16)
 ball(head,dark,0,-.12,.69,.13,.085,.09);ball(head,white,-.032,-.09,.758,.025,.012,.009)
 const blink:T.Group[]=[],calm=mood==='calm'||mood==='relieved',joy=mood==='celebrating',scream=mood==='screaming',concern=mood==='concerned',watch=mood==='watchful'
 for(const x of [-.285,.285]){
  if(calm||joy){line(head,dark,[[x-.105,.13,.52],[x,.21,.56],[x+.105,.13,.52]],.027)}
  else{const g=new T.Group();g.position.set(x,.12,.47);head.add(g);blink.push(g);ball(g,white,0,0,0,.145,scream?.22:.18,.085);ball(g,eye,watch?.028:0,0,.075,scream?.047:.074,.11,.035);ball(g,white,-.02,.04,.108,.022,.029,.012)}
  const sign=x<0?-1:1,outer=x+sign*.12,inside=x-sign*.1
  line(head,fur,[[outer,concern?.34:watch?.39:.38,.45],[x,concern?.38:.4,.49],[inside,concern?.45:watch?.34:.4,.48]],.038)
 }
 if(scream){ball(head,dark,0,-.38,.58,.145,.23,.065);ball(head,pink,0,-.515,.638,.09,.063,.015);ball(head,white,0,-.23,.653,.08,.05,.012)}
 else if(joy){ball(head,dark,0,-.35,.59,.23,.16,.065);ball(head,pink,0,-.43,.647,.13,.04,.012);ball(head,white,0,-.27,.657,.115,.045,.014)}
 else if(mood==='curious')ball(head,dark,.025,-.35,.625,.06,.075,.025)
 else line(head,dark,concern?[[-.14,-.4,.61],[0,-.34,.64],[.14,-.4,.61]]:watch?[[-.13,-.36,.61],[0,-.37,.64],[.13,-.36,.61]]:[[-.17,-.31,.61],[0,-.42,.64],[.17,-.31,.61]],.024)
 for(const x of [-.48,.48])ball(head,inner,x,-.25,.46,.1,.052,.018)
 const arms:T.Group[]=[]
 for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.44,1.57,.08);rig.add(arm);arms.push(arm);ball(arm,fur,0,-.27,.07,.18,.38,.18);ball(arm,lightFur,0,-.54,.1,.19,.18,.18);arm.rotation.z=scream?side*2.35:joy?side*2.5:side*-.5;arm.rotation.x=scream?-.3:-.25}
 if(!scream&&!joy){ball(rig,lightFur,0,1.02,.61,.2,.27,.16);ball(rig,cap,0,1.21,.61,.24,.1,.19);line(rig,fur,[[0,1.26,.61],[.025,1.37,.6]],.027)}
 const sparkles:T.Mesh[]=[]
 if(joy)for(const [x,y,z] of [[-1,2.8,.3],[1.1,2.4,.1],[-.9,1.5,.4],[.85,3,.1]]){const geo=new T.OctahedronGeometry(.085);geometries.push(geo);const s=new T.Mesh(geo,gold);s.position.set(x,y,z);scene.add(s);sparkles.push(s)}
 const shadowMat=new T.MeshBasicMaterial({color:'#5d4933',transparent:true,opacity:.1});materials.push(shadowMat);const shadow=ball(scene,shadowMat,0,.2,0,.85,.016,.5)
 host.append(canvas);canvas.setAttribute('aria-hidden','true');canvas.className='sandy-three-canvas';canvas.dataset.renderer=r instanceof T.WebGLRenderer?'webgl':'canvas'
 let dead=false,visible=true,frame=0,last=0,start=performance.now(),pointer=0
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
 function pose(time:number){const t=time/1000,breathe=Math.sin(t*2.1),reaction=Math.max(0,1-t/1.4)
 rig.position.y=joy?Math.abs(Math.sin(t*3.4))*.12:breathe*.018;body.scale.y=1+breathe*.012;tail.rotation.z=Math.sin(t*1.5)*.045
 rig.rotation.y=-.08+Math.sin(t*.8)*.045+pointer*.12;head.rotation.z=mood==='curious'?-.1+Math.sin(t*1.3)*.045:concern?Math.sin(t*.8)*.025:0
 if(scream){head.rotation.z=Math.sin(t*40)*.035*reaction;rig.position.x=Math.sin(t*35)*.025*reaction}
 if(mood==='relieved')head.rotation.x=Math.sin(t*1.6)*.035
 if(joy)arms.forEach((a,i)=>a.rotation.z=(i?1:-1)*(2.5+Math.sin(t*4)*.12))
 const phase=t%4.6,blinkScale=phase>4.3&&phase<4.48?.08:1;blink.forEach(g=>g.scale.y=blinkScale)
 sparkles.forEach((s,i)=>{s.rotation.y=t+i;s.scale.setScalar(.7+Math.sin(t*2+i)*.3)});shadow.scale.x=.85-(rig.position.y*.2)
 }
 function draw(){if(dead)return;const rect=host.getBoundingClientRect(),size=Math.max(1,Math.round(rect.width));r.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));r.setSize(size,size,false);if(!animate){canvas.width=r.domElement.width;canvas.height=r.domElement.height}r.render(scene,camera);if(!animate)canvas.getContext('2d')?.drawImage(r.domElement,0,0)}
 function tick(now:number){if(dead)return;frame=requestAnimationFrame(tick);if(!visible||document.hidden||reduced.matches||now-last<(r instanceof T.WebGLRenderer?40:65))return;last=now;pose(now-start);r.render(scene,camera)}
 const resize=new ResizeObserver(draw);resize.observe(host)
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});observer.observe(host)
 const move=(e:PointerEvent)=>{const b=host.getBoundingClientRect();pointer=((e.clientX-b.left)/b.width-.5)*2};const leave=()=>pointer=0
 host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave)
 const contextLost=(event:Event)=>{event.preventDefault();onFailure()};canvas.addEventListener('webglcontextlost',contextLost)
 pose(0);draw();if(animate)frame=requestAnimationFrame(tick)
 return()=>{dead=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.remove();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());if(animate){r.dispose();r.forceContextLoss()}}
}
