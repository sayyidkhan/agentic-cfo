import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {transformSync} from 'esbuild'
import {COUNT_DURATION} from './dist/count-up.mjs'

// Exercise the actual hook effect with controlled browser lifecycle signals.
const source=transformSync(readFileSync(new URL('../inertia/hooks/use_count_up.ts',import.meta.url),'utf8'),{loader:'ts',format:'cjs'}).code
function setup({covered=true,reduced=false}={}){
 let state,cleanup,nextFrame=0
 const frames=new Map(),mutations=[],listeners={},mediaListeners={}
 const route={parentElement:null},element={parentElement:route,closest:()=>covered?route:null}
 const preference={matches:reduced,addEventListener:(name,fn)=>{mediaListeners[name]=fn},removeEventListener:(name)=>{delete mediaListeners[name]}}
 const document={hidden:false,addEventListener:(name,fn)=>{listeners[name]=fn},removeEventListener:(name)=>{delete listeners[name]}}
 let intersection
 const module={exports:{}}
 runInNewContext(source,{module,exports:module.exports,require:(name)=>name==='react'?{useRef:()=>({current:element}),useState:(value)=>{state=value;return[value,next=>{state=next}]},useEffect:(effect)=>{cleanup=effect()}}:{COUNT_DURATION},window:{matchMedia:()=>preference,IntersectionObserver:true},document,IntersectionObserver:class{constructor(callback){intersection=callback}observe(){intersection([{isIntersecting:true}])}disconnect(){}},MutationObserver:class{constructor(callback){mutations.push(callback)}observe(){}disconnect(){}},requestAnimationFrame:(callback)=>{const id=++nextFrame;frames.set(id,callback);return id},cancelAnimationFrame:(id)=>{frames.delete(id)}})
 module.exports.default('month:totals')
 return {get elapsed(){return state.elapsed},get pending(){return frames.size},frame:(timestamp)=>{const batch=[...frames.values()];frames.clear();batch.forEach(callback=>callback(timestamp))},uncover:()=>{covered=false;mutations.forEach(callback=>callback())},cover:()=>{covered=true;mutations.forEach(callback=>callback())},hide:()=>{document.hidden=true;listeners.visibilitychange()},show:()=>{document.hidden=false;listeners.visibilitychange()},cleanup:()=>cleanup()}
}

test('entry overlay holds counters at zero until the route is revealed',()=>{
 const clock=setup()
 assert.equal(clock.pending,0)
 clock.frame(5000)
 assert.equal(clock.elapsed,0)
 clock.uncover()
 assert.equal(clock.pending,1)
 clock.frame(6000)
 assert.equal(clock.elapsed,0)
 clock.frame(6625)
 assert.equal(clock.elapsed,625)
 clock.frame(7250)
 assert.equal(clock.elapsed,COUNT_DURATION)
 assert.equal(clock.pending,0)
 clock.cleanup()
})

test('covered or hidden time does not advance a running counter',()=>{
 const clock=setup({covered:false})
 clock.frame(0);clock.frame(400)
 clock.cover();clock.frame(5000)
 assert.equal(clock.elapsed,400)
 clock.uncover();clock.frame(6000);clock.frame(6200)
 assert.equal(clock.elapsed,600)
 clock.hide();clock.frame(10000)
 assert.equal(clock.elapsed,600)
 clock.show();clock.frame(12000);clock.frame(12650)
 assert.equal(clock.elapsed,COUNT_DURATION)
 clock.cleanup()
 assert.equal(clock.pending,0)
})

test('reduced motion presents the exact endpoint without waiting for the cover',()=>{
 const clock=setup({reduced:true})
 assert.equal(clock.elapsed,COUNT_DURATION)
 assert.equal(clock.pending,0)
 clock.uncover()
 assert.equal(clock.pending,0)
 clock.cleanup()
})
