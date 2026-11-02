import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {transformSync} from 'esbuild'

// Test the production navigation adapter without mounting unrelated UI.
function adapter(refresh){
 const module={exports:{}},calls=[]
 const source=transformSync(readFileSync(new URL('./src/bridge.tsx',import.meta.url),'utf8'),{loader:'tsx',format:'cjs'}).code
 runInNewContext(source,{module,exports:module.exports,require:name=>name==='react'?{createContext:()=>({})}:{workspaceHref:path=>path}})
 module.exports.connect(()=>{calls.push('write')},()=>{calls.push('navigate')},refresh)
 return {router:module.exports.router,calls}
}

test('refresh awaits current-view data before reporting success and never writes or navigates',async()=>{
 let release;const events=[]
 const {router,calls}=adapter(()=>new Promise(resolve=>{release=resolve}))
 const result=router.reload({onSuccess:()=>events.push('success'),onError:()=>events.push('error'),onFinish:()=>events.push('finish')})
 assert.deepEqual(events,[])
 release();await result
 assert.deepEqual(events,['success','finish'])
 assert.deepEqual(calls,[])
})

test('failed refresh reports an error, clears loading and never claims success',async()=>{
 const events=[]
 const {router,calls}=adapter(async()=>{throw Error('Offline')})
 await router.reload({onSuccess:()=>events.push('success'),onError:()=>events.push('error'),onFinish:()=>events.push('finish')})
 assert.deepEqual(events,['error','finish'])
 assert.deepEqual(calls,[])
})
