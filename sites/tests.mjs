import {test} from 'node:test'
import assert from 'node:assert/strict'
import {DatabaseSync} from 'node:sqlite'
import {readFileSync} from 'node:fs'
import worker,{createHandler,REAL_DATA_ENABLED} from './dist/server/index.js'
import {emptyState,syntheticState,derive,applyAction} from './dist/domain.mjs'
process.chdir(new URL('.',import.meta.url).pathname)
const date='2026-10-25'
const act=(s,p,d={},m='POST')=>applyAction(s,p,m,d,date)
test('synthetic overview, transfer neutrality, monthly sums and goal exclusion',()=>{
 const s=syntheticState(date),d=derive(s,date).props
 assert.equal(d.availableCashCents,2141000);assert.equal(d.incomeCents,520000);assert.equal(d.expenseCents,219000);assert.equal(d.financialPosition.netWorthCents,4141000)
 const transferred=act(s,'/finance/transactions',{kind:'transfer',amount:'12.34',bookedOn:date,accountId:1,destinationAccountId:2})
 assert.equal(derive(transferred,date).props.financialPosition.netWorthCents,d.financialPosition.netWorthCents)
 const goal=act(s,'/finance/goals/16',{name:'Goal',target:'9999999',saved:'8888888',targetDate:'2027-01-01'},'PATCH')
 assert.equal(derive(goal,date).props.financialPosition.netWorthCents,d.financialPosition.netWorthCents)
})
test('exact SGD cents, create/edit/delete and full-ledger revalidation',()=>{
 const s=syntheticState(date),n=act(s,'/finance/transactions',{kind:'expense',amount:'0.29',bookedOn:date,accountId:1,categoryId:4})
 assert.equal(n.transactions.at(-1).amountCents,29);assert.equal(derive(n,date).props.availableCashCents,2140971)
 const id=n.transactions.at(-1).id,e=act(n,'/finance/transactions/'+id,{kind:'expense',amount:'0.30',bookedOn:date,accountId:1,categoryId:4},'PATCH')
 assert.equal(derive(e,date).props.availableCashCents,2140970)
 assert.deepEqual(act(e,'/finance/transactions/'+id,{},'DELETE'),{...s,nextId:s.nextId+1})
 for(const amount of ['-1','0','0.001','1e3','9999999999999'])assert.throws(()=>act(s,'/finance/transactions',{kind:'expense',amount,bookedOn:date,accountId:1,categoryId:4}))
 assert.throws(()=>act(s,'/finance/transactions',{kind:'expense',amount:'1',bookedOn:'2026-02-30',accountId:1,categoryId:4}))
 assert.throws(()=>act(s,'/finance/transactions',{kind:'transfer',amount:'4000.01',bookedOn:date,accountId:1,destinationAccountId:3}))
 assert.throws(()=>act(s,'/finance/transactions',{kind:'transfer',amount:'1',bookedOn:date,accountId:1,destinationAccountId:1}))
 const paid=act(s,'/finance/transactions',{kind:'transfer',amount:'4000',bookedOn:date,accountId:1,destinationAccountId:3})
 assert.equal(derive(paid,date).props.financialPosition.netWorthCents,4141000)
 assert.equal(derive(paid,date).props.accounts.find(a=>a.id===3).balanceCents,0)
})
test('budgets, bill reminders, overspending and shortfalls are deterministic',()=>{
 let s=syntheticState(date)
 s=act(s,'/finance/budgets',{categoryId:4,month:'2026-10',limit:'400'})
 assert.equal(s.budgets.length,3);assert.ok(derive(s,date).props.planning.insights.some(i=>i.code==='overbudget_Dining'))
 s=act(s,'/finance/commitments',{name:'Big sample bill',amount:'50000',dueDay:27})
 assert.ok(derive(s,date).props.planning.insights.some(i=>i.code==='cash_shortfall'))
 const cash=derive(s,date).props.availableCashCents
 s=act(s,'/finance/commitments/17/paid')
 assert.equal(derive(s,date).props.availableCashCents,cash);assert.equal(s.commitments.find(c=>c.id===17).lastPaidMonth,'2026-10')
 assert.throws(()=>act(s,'/finance/commitments',{name:'Invalid day',amount:'1',dueDay:29}))
})
test('dated valuations reject duplicates, update and remove without double counting',()=>{
 let s=syntheticState(date)
 assert.throws(()=>act(s,'/finance/valuations',{name:' everyday ACCOUNT ',kind:'asset',value:'300',asOf:date}))
 s=act(s,'/finance/valuations/15',{name:'Sample long-term investments',kind:'asset',value:'25000',asOf:date},'PATCH')
 assert.equal(derive(s,date).props.financialPosition.netWorthCents,4241000)
 s=act(s,'/finance/valuations/15',{},'DELETE');assert.equal(derive(s,date).props.financialPosition.netWorthCents,1741000)
})
test('Sandy read-only answers are derived and chat history clears',()=>{
 const s=syntheticState(date),n=act(s,'/cfo/chat',{message:'What is my net worth?'})
 assert.match(n.messages.at(-1).content,/41,410/);assert.deepEqual({...n,messages:[],nextId:s.nextId},s)
 const buy=act(s,'/cfo/chat',{message:'Can I spend S$300?'})
 assert.match(buy.messages.at(-1).content,/20,835/)
 assert.equal(act(n,'/cfo/chat',{},'DELETE').messages.length,0)
})
test('public build rejects anonymous and authenticated real data, even spoofed IDs',async()=>{
 assert.equal(REAL_DATA_ENABLED,false)
 for(const method of ['GET','POST','DELETE']){
  let r=await worker.fetch(new Request('https://acorra.test/api/workspace',{method}),{})
  assert.equal(r.status,401)
  r=await worker.fetch(new Request('https://acorra.test/api/workspace',{method,headers:{'oai-authenticated-user-id':'pretend-user'}}),{})
  assert.equal(r.status,423)
 }
 const html=await worker.fetch(new Request('https://acorra.test/'),{});assert.equal(html.status,200);assert.match(html.headers.get('content-security-policy'),/script-src 'self'/)
 assert.equal((await worker.fetch(new Request('https://acorra.test/missing'),{})).status,404)
})
function dbAdapter(){
 const sqlite=new DatabaseSync(':memory:');for(const migration of ['0000_financial_workspaces.sql','0001_storage_checks.sql'])sqlite.exec(readFileSync('../drizzle/'+migration,'utf8'))
 return {prepare(sql){return {bind(...args){return {async first(){return sqlite.prepare(sql).get(...args)},async run(){const result=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(result.changes)}}}}}}}}
}
test('two identities isolate records; body/query IDs cannot select another workspace',async()=>{
 const fetch=createHandler(true),env={DB:dbAdapter()}
 const request=(user,method='GET',body=null,revision='0',extra={})=>new Request('https://acorra.test/api/workspace?user_id=alice',{method,headers:{'oai-authenticated-user-id':user,'Origin':'https://acorra.test','If-Match':revision,...extra},...(body?{body:JSON.stringify(body)}:{})})
 const add={path:'/finance/accounts',method:'POST',data:{name:'Alice private account',kind:'asset',openingBalance:'123.45'},userId:'bob'}
 let r=await fetch(request('alice','POST',add),env);assert.equal(r.status,200)
 const a=await r.json();assert.equal(a.state.accounts[0].openingBalanceCents,12345)
 const b=await (await fetch(request('bob'),env)).json();assert.deepEqual(b.state,emptyState())
 r=await fetch(request('bob','POST',{path:'/finance/accounts/1',method:'DELETE'}),env);assert.equal(r.status,400)
 assert.equal((await (await fetch(request('alice'),env)).json()).state.accounts.length,1)
 // Optimistic revision check prevents lost updates, even for a legitimate owner.
 assert.equal((await fetch(request('alice','POST',add,'0'),env)).status,409)
 assert.equal((await fetch(request('alice','POST',add,'1',{Origin:'https://evil.test'}),env)).status,403)
 assert.equal((await fetch(request('alice','DELETE',null,'1'),env)).status,200)
 assert.deepEqual((await (await fetch(request('alice'),env)).json()).state,emptyState())
})
test('bundles contain no private records, credentials, external providers or SQLite runtime',()=>{
 const source=readFileSync('dist/server/index.js','utf8')
 for(const pattern of [/sk-proj-[a-zA-Z0-9]{10}/,/api\\.openai\\.com/,/Bearer [A-Za-z0-9]{20}/,/APP_KEY=/])assert.doesNotMatch(source,pattern)
 assert.doesNotMatch(source,/When an AI provider is configured/)
})

test('native session exposes an opaque account scope and safe top-level auth links',async()=>{
 const anonymous=await(await worker.fetch(new Request('https://acorra.test/api/session'),{})).json()
 assert.equal(anonymous.signedIn,false);assert.equal(anonymous.accountKey,null)
 const session=async id=>(await(await worker.fetch(new Request('https://acorra.test/api/session',{headers:{'oai-authenticated-user-id':id}}),{})).json())
 const alice=await session('alice'),same=await session('alice'),bob=await session('bob')
 assert.equal(alice.signedIn,true);assert.equal(alice.accountKey,same.accountKey);assert.notEqual(alice.accountKey,bob.accountKey)
 assert.match(alice.accountKey,/^[a-f0-9]{64}$/);assert.notEqual(alice.accountKey,'alice')
 assert.equal(alice.signInPath,'/signin-with-chatgpt?return_to=%2Faccount')
 assert.equal(alice.signOutPath,'/signout-with-chatgpt?return_to=%2Faccount')
 assert.equal((await worker.fetch(new Request('https://acorra.test/api/session',{method:'POST'}),{})).status,405)
})
test('production synthetic storage check persists per identity without accepting finance input',async()=>{
 const env={DB:dbAdapter()}
 const req=(id,method='GET',body=null,origin='https://acorra.test')=>new Request('https://acorra.test/api/storage-check?userId=alice',{method,headers:{...(id?{'oai-authenticated-user-id':id}:{}),Origin:origin},...(body?{body}:{})})
 assert.equal((await worker.fetch(req(null),env)).status,401)
 assert.deepEqual(await(await worker.fetch(req('bob'),env)).json(),{record:null})
 const a=await(await worker.fetch(req('alice','POST'),env)).json()
 assert.match(a.record.marker,/^Garden /)
 assert.deepEqual(await(await worker.fetch(req('alice'),env)).json(),a)
 assert.deepEqual(await(await worker.fetch(req('alice','POST'),env)).json(),a)
 assert.deepEqual(await(await worker.fetch(req('bob'),env)).json(),{record:null})
 const b=await(await worker.fetch(req('bob','POST'),env)).json();assert.notEqual(a.record.marker,b.record.marker)
 assert.equal((await worker.fetch(req('alice','POST','{"balance":12345}'),env)).status,400)
 assert.equal((await worker.fetch(req('alice','POST',null,'https://evil.test'),env)).status,403)
 assert.equal((await worker.fetch(req('alice','PATCH'),env)).status,405)
 assert.equal((await worker.fetch(req('alice','DELETE'),env)).status,200)
 assert.deepEqual(await(await worker.fetch(req('bob'),env)).json(),b)
 assert.equal((await worker.fetch(new Request('https://acorra.test/api/workspace',{headers:{'oai-authenticated-user-id':'alice'}}),env)).status,423)
})
test('personal API round-trip survives clients and rejects stale writes without changing the ledger',async()=>{
 const {loadWorkspace,saveWorkspaceAction,ApiError}=await import('./dist/api.mjs')
 const fetch=createHandler(true),env={DB:dbAdapter()}
 const fetcher=async(path,options={})=>fetch(new Request('https://acorra.test'+path,{...options,headers:{...options.headers,Origin:'https://acorra.test','oai-authenticated-user-id':'alice'}}),env)
 let loaded=await loadWorkspace(fetcher);assert.equal(loaded.state.accounts.length,0)
 loaded=await saveWorkspaceAction(loaded.revision,'/finance/accounts','POST',{name:'Synthetic own account',kind:'asset',openingBalance:'200.01'},fetcher)
 loaded=await saveWorkspaceAction(loaded.revision,'/finance/categories','POST',{name:'Dining'},fetcher)
 const stale=loaded.revision
 loaded=await saveWorkspaceAction(loaded.revision,'/finance/transactions','POST',{kind:'expense',amount:'1.02',bookedOn:date,accountId:1,categoryId:2,note:'Synthetic API roundtrip'},fetcher)
 assert.equal(derive(loaded.state,date).props.availableCashCents,19899)
 await assert.rejects(saveWorkspaceAction(stale,'/finance/categories','POST',{name:'Outdated draft'},fetcher),e=>e instanceof ApiError&&e.status===409)
 const reloaded=await loadWorkspace(fetcher);assert.deepEqual(reloaded,loaded)
 const chat=await saveWorkspaceAction(loaded.revision,'/cfo/chat','POST',{message:'What is my balance?'},fetcher)
 assert.match(chat.state.messages.at(-1).content,/198.99/)
 assert.deepEqual(chat.state.transactions,loaded.state.transactions)
 for(const raw of ['', ' ', '1.0', '-1','no']){
  const response=await fetch(new Request('https://acorra.test/api/workspace',{method:'POST',headers:{Origin:'https://acorra.test','If-Match':raw,'oai-authenticated-user-id':'alice'},body:JSON.stringify({path:'/finance/categories',method:'POST',data:{name:'bad revision'}})}),env)
  assert.equal(response.status,409)
 }
})
test('client reports failures without inventing a saved state or retrying writes',async()=>{
 const {requestJson,ApiError}=await import('./dist/api.mjs');let calls=0
 await assert.rejects(requestJson('/api/workspace',{},async()=>{calls++;throw Error('offline')}),e=>e instanceof ApiError&&e.status===0&&/not been saved/.test(e.message))
 assert.equal(calls,1)
 await assert.rejects(requestJson('/api/workspace',{},async()=>new Response('upstream failure',{status:502})),e=>e.status===502)
 for(const status of [401,409,423,503])await assert.rejects(requestJson('/api/workspace',{},async()=>Response.json({error:'Readable failure'},{status})),e=>e.status===status&&e.message==='Readable failure')
})
test('personal workspace navigation stays personal and explicit demo links stay demo',async()=>{
 const {workspaceHref,isPersonal}=await import('./dist/routing.mjs')
 assert.equal(workspaceHref('/cfo',true),'/cfo?workspace=personal')
 assert.equal(workspaceHref('/dashboard?view=wealth',true),'/dashboard?view=wealth&workspace=personal')
 assert.equal(workspaceHref('/dashboard?workspace=demo',true),'/dashboard?workspace=demo')
 assert.equal(workspaceHref('/account',true),'/account')
 assert.equal(workspaceHref('/dashboard',false),'/dashboard')
 assert.equal(isPersonal('/cfo?workspace=personal'),true)
 assert.equal(isPersonal('/account'),false)
})

test('Sandy artwork is served intact with safe methods and immutable versioned URLs',async()=>{
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved','greeting']){
  const url='https://acorra.test/assets/sandy/v2/'+mood+'.webp'
  const response=await worker.fetch(new Request(url),{})
  assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp')
  assert.match(response.headers.get('cache-control'),/immutable/)
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),readFileSync('assets/sandy/'+mood+'.webp'))
  const head=await worker.fetch(new Request(url,{method:'HEAD'}),{});assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0)
  assert.equal((await worker.fetch(new Request(url,{method:'POST'}),{})).status,405)
 }
 assert.equal((await worker.fetch(new Request('https://acorra.test/assets/sandy/v2/missing.webp'),{})).status,404)
})

test('Sandy’s motion keeps feet anchored and independently animates face and tail',async()=>{
 const {createMotionRig,sampleSandyPose}=await import('./dist/sandy-motion.mjs')
 const size=100,index=(x,y)=>(Math.floor(y*size)*size+Math.floor(x*size))*2
 const a=index(.4,.96),b=index(.78,.96),tail=index(.2,.25),paw=index(.64,.555)
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved']){
  const rig=createMotionRig(mood,size),first=Float32Array.from(rig.frame(0)),moving=rig.frame(1.25)
  for(const foot of [a,b]){assert.ok(Math.abs(moving[foot])<.00001);assert.ok(Math.abs(moving[foot+1])<.00002,'feet stay planted within each complete frame')}
  assert.notDeepEqual(moving,first);assert.ok(moving.every(Number.isFinite))
  assert.notEqual(moving[tail],first[tail])
 }
 const rig=createMotionRig('curious',size),before=Float32Array.from(rig.frame(0)),moving=rig.frame(5.8)
 assert.notEqual(moving[paw+1],before[paw+1],'gentle torso breathing stays distinct from anchored feet')
})

test('Sandy frames preserve transparent fur without coloured fringes or image reloads',async()=>{
 const {paintSandyFrame}=await import('./dist/sandy-raster.mjs')
 const source={width:2,height:2,data:new Uint8ClampedArray([100,60,30,255,255,0,200,0,100,60,30,255,0,255,0,0])}
 const field=new Float32Array(4*4*2)
 const out={width:4,height:4,data:new Uint8ClampedArray(4*4*4)}
 paintSandyFrame(source,field,4,out)
 let translucent=0
 for(let i=0;i<out.data.length;i+=4){if(out.data[i+3]>0){assert.equal(out.data[i],100);assert.equal(out.data[i+1],60);assert.equal(out.data[i+2],30)}if(out.data[i+3]>0&&out.data[i+3]<255)translucent++}
 assert.ok(translucent>0)
 const component=readFileSync('src/SandyCharacter.tsx','utf8')
 assert.doesNotMatch(component,/toDataURL|feImage|feDisplacementMap|clearRect/)
 assert.match(component,/await image.decode\(\)/)
 assert.ok(component.indexOf('back.putImageData')<component.indexOf('front.drawImage'))
})

test('Sandy preserves eye shapes throughout the former blink cycle',async()=>{
 const {createMotionRig}=await import('./dist/sandy-motion.mjs')
 const size=200,rig=createMotionRig('curious',size)
 function point(field,x,y){const i=(Math.floor(y*size)*size+Math.floor(x*size))*2;return [x*800+field[i]*800,y*800+field[i+1]*800]}
 for(const t of [0,1.12,1.25,1.38,4.75,5.06,7.05]){
  const field=rig.frame(t)
  for(const [x,y] of [[.57,.255],[.724,.321]]){
   for(const [dx,dy] of [[.025,0],[0,.025]]){
    const a=point(field,x-dx,y-dy),b=point(field,x+dx,y+dy),diameter=Math.hypot(b[0]-a[0],b[1]-a[1])
    assert.ok(Math.abs(diameter-40)<1.5,'eye diameter must not squash or twitch')
   }
  }
 }
 assert.doesNotMatch(readFileSync('src/SandyCharacter.tsx','utf8'),/blinkAt|sandyEyes|quadraticCurveTo/)
})

test('Sandy’s authored gestures hold, settle and loop without pose jumps',async()=>{
 const {sampleSandyPose,createMotionRig}=await import('./dist/sandy-motion.mjs')
 const at=sampleSandyPose('curious',1.8),hold=sampleSandyPose('curious',2.6)
 assert.equal(at.head,hold.head)
 assert.equal(sampleSandyPose('curious',8).phase,'rest')
 for(const [mood,duration] of Object.entries({curious:9.6,calm:10.4,watchful:9.2,concerned:11,screaming:10,celebrating:8.8,relieved:12})){
  const rig=createMotionRig(mood,60),begin=Float32Array.from(rig.frame(.0001)),end=rig.frame(duration-.0001)
  for(let i=0;i<begin.length;i++)assert.ok(Math.abs(begin[i]-end[i])<.0001,'loop seam must be smooth')
 }
 assert.ok(sampleSandyPose('celebrating',.85).hop<0)
 assert.equal(sampleSandyPose('celebrating',4).hop,0)
 assert.equal(sampleSandyPose('screaming',5).head,0)
 const code=readFileSync('src/SandyCharacter.tsx','utf8');assert.match(code,/elapsed=playhead.current.elapsed/)
})

test('Painted blinks change eyelid texture only, without warping the face or rapid pulses',async()=>{
 const {createPaintedBlink,blinkAmount,hasPaintedBlink}=await import('./dist/sandy-blink.mjs')
 const make=(r,g,b)=>({width:200,height:200,data:new Uint8ClampedArray(Array.from({length:40000},()=>[r,g,b,255]).flat())})
 const open=make(120,80,40),closed=make(180,140,100),snapshot=Uint8ClampedArray.from(open.data)
 const rig=createPaintedBlink(open,closed,'curious')
 assert.equal(rig.frame(0),open)
 const result=rig.frame(1);let changed=0
 for(let i=0;i<result.data.length;i+=4){assert.equal(result.data[i+3],255);if(result.data[i]!==open.data[i])changed++}
 assert.ok(changed>200&&changed<2400,'only local eyelid patches should change')
 assert.deepEqual(open.data,snapshot);assert.deepEqual(rig.frame(0).data,snapshot)
 const mouth=(Math.floor(.39*200)*200+Math.floor(.65*200))*4;assert.equal(result.data[mouth],open.data[mouth])
 assert.equal(hasPaintedBlink('calm'),false);assert.equal(hasPaintedBlink('relieved'),false)
 assert.equal(blinkAmount(0),0);assert.equal(blinkAmount(1.33),1);assert.equal(blinkAmount(1.6),0);assert.equal(blinkAmount(5.06),0);assert.equal(blinkAmount(7.73),1)
})

test('Sandy’s gestures are visible while head rotation preserves facial proportions',async()=>{
 const {sampleSandyPose}=await import('./dist/sandy-motion.mjs')
 assert.ok(sampleSandyPose('curious',2).head>=.085)
 assert.ok(Math.abs(sampleSandyPose('curious',5.8).body)>=.008)
 assert.ok(Math.abs(sampleSandyPose('celebrating',.85).hop)>=.039)
 const code=readFileSync('src/SandyCharacter.tsx','utf8')
 assert.ok(code.indexOf('eyelids?.frame(blink)')<code.indexOf('back.putImageData'))
})

test('Automatic blinking always presents a closed-eye frame even with dropped frames',async()=>{
 const {createBlinkClock}=await import('./dist/sandy-blink.mjs')
 const slow=createBlinkClock();assert.equal(slow.sample(0),0);assert.equal(slow.sample(1300),0);assert.equal(slow.sample(2300),1);assert.equal(slow.sample(3300),0);assert.equal(slow.count,1)
 const normal=createBlinkClock();let closed=0
 for(let t=0;t<14000;t+=33.33)if(normal.sample(t)>.99)closed++
 assert.ok(normal.count>=2);assert.ok(closed>=normal.count)
})

test('Refined lids close from above and tail/paw movement stays continuous',async()=>{
 const {createPaintedBlink}=await import('./dist/sandy-blink.mjs')
 const {createMotionRig}=await import('./dist/sandy-motion.mjs')
 const make=value=>({width:400,height:400,data:new Uint8ClampedArray(400*400*4).fill(value)})
 const original=make(40),closed=make(180),frame=createPaintedBlink(original,closed,'curious').frame(.5)
 function pixel(v){const x=.57-v*Math.sin(.28),y=.255+v*Math.cos(.28);return frame.data[(Math.floor(y*400)*400+Math.floor(x*400))*4]}
 assert.ok(pixel(-.025)>pixel(.025)+50,'upper lid must lead instead of both lids squeezing symmetrically')
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved']){
  const rig=createMotionRig(mood,40);let last=Float32Array.from(rig.frame(0))
  for(let t=1/60;t<12;t+=1/60){const frame=rig.frame(t);for(let i=0;i<frame.length;i++)assert.ok(Math.abs(frame[i]-last[i])<.012,'no abrupt deformation steps at display cadence');last.set(frame)}
 }
})

test('GPU displacement retains subpixel precision and unsupported contexts fall back safely',async()=>{
 const {encodeSandyField,createSandyGpu}=await import('./dist/sandy-gpu.mjs')
 const {createMotionRig,sampleSandyPose}=await import('./dist/sandy-motion.mjs')
 const input=new Float32Array([-.1,-.000001,0,.000001,.1]),encoded=encodeSandyField(input,new Uint8Array(input.length*2))
 for(let i=0;i<input.length;i++){const decoded=((encoded[i*2]*256+encoded[i*2+1])/65535-.5)*.25;assert.ok(Math.abs(decoded-input[i])*800<.002,'encoding must not introduce visible pixel steps')}
 const canvas={dataset:{},getContext:()=>null};assert.equal(createSandyGpu(canvas,160),null);assert.equal(canvas.dataset.gpuFallback,'unavailable')
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved']){
  const rig=createMotionRig(mood,30);for(let t=0;t<12;t+=.1)assert.ok(rig.frame(t).every(v=>Math.abs(v)<.125),'all gestures must fit the GPU texture range')
 }
 assert.ok(sampleSandyPose('celebrating',.35).stretch<0,'anticipation compresses the body')
 assert.ok(sampleSandyPose('celebrating',.85).stretch>0,'takeoff extends the body')
 assert.ok(sampleSandyPose('celebrating',1.3).stretch<0,'landing absorbs the hop')
})

test('Acorn-holding arms retain their shape instead of stretching with isolated paw motion',async()=>{
 const {createMotionRig}=await import('./dist/sandy-motion.mjs');const size=200,rig=createMotionRig('curious',size)
 const point=(field,x,y)=>{const i=(Math.floor(y*size)*size+Math.floor(x*size))*2;return [(x+field[i])*800,(y+field[i+1])*800]}
 for(const t of [0,1,2,4,5.5,6,7,9]){
  const field=rig.frame(t),elbow=point(field,.54,.56),wrist=point(field,.64,.55)
  assert.ok(Math.abs(Math.hypot(wrist[0]-elbow[0],wrist[1]-elbow[1])-Math.hypot(.1,.01)*800)<.5,'held-acorn forearm length stays stable')
 }
 const {createPaintedBlink,hasPaintedBlink}=await import('./dist/sandy-blink.mjs');assert.equal(hasPaintedBlink('greeting'),true)
})


test('seasonal artwork is complete, versioned and read-only',async()=>{
 for(const name of ['spring','summer','autumn','winter','sandy-carry','sandy-stash','sandy-winter-rest','sandy-winter-gold']){
  const url='https://acorra.test/assets/seasons/v1/'+name+'.webp',response=await worker.fetch(new Request(url),{})
  assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');assert.match(response.headers.get('cache-control'),/immutable/)
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),readFileSync('assets/seasons/'+name+'.webp'))
  assert.equal((await (await worker.fetch(new Request(url,{method:'HEAD'}),{})).arrayBuffer()).byteLength,0)
  assert.equal((await worker.fetch(new Request(url,{method:'POST'}),{})).status,405)
 }
 assert.equal((await worker.fetch(new Request('https://acorra.test/assets/seasons/v1/missing.webp'),{})).status,404)
})

test('season story deposits one acorn after release and preserves the winter stash',async()=>{
 const {sampleSeasonStory}=await import('./dist/season-story.mjs')
 for(let season=0;season<3;season++){
  const before=sampleSeasonStory(season*8+3.3),release=sampleSeasonStory(season*8+4.15),after=sampleSeasonStory(season*8+4.8)
  assert.equal(before.stash,3+season);assert.equal(before.nut,0);assert.ok(before.crouch>.99)
  assert.ok(release.nut>0);assert.equal(release.stash,before.stash,'stash must not grow while the released acorn is still in flight')
  assert.equal(after.stash,before.stash+1);assert.equal(after.nut,0);assert.ok(after.rest>.99)
 }
 for(let t=24;t<32;t+=.125){const s=sampleSeasonStory(t);assert.equal(s.index,3);assert.equal(s.stash,6);assert.equal(s.rest,1);assert.equal(s.nut,0)}
 assert.equal(sampleSeasonStory(32.7).index,sampleSeasonStory(.7).index)
 assert.ok(Math.abs(sampleSeasonStory(32.7).x-sampleSeasonStory(.7).x)<1e-9)
 for(let t=0;t<32;t+=.05){const s=sampleSeasonStory(t);assert.ok(Object.values(s).every(v=>typeof v!=='number'||Number.isFinite(v)));assert.ok(s.opacity>=.45&&s.opacity<=1);assert.ok(Math.abs(s.carry+s.crouch+s.rest-1)<1e-9)}
})


test('winter acting moves the head and tail while preserving the bench and acorn grip',async()=>{
 const {createWinterRig}=await import('./dist/winter-motion.mjs'),rig=createWinterRig(),first=Float32Array.from(rig.frame(0));
 const anchors=[[.24,.29],[.30,.4],[.37,.6],[.45,.77],[.76,.75],[.9,.85],[.535,.46],[.595,.45],[.65,.47]];
 const at=(x,y)=>((Math.round(y*rig.size-.5)*rig.size+Math.round(x*rig.size-.5))*2);
 let movement=0;
 for(let t=0;t<8;t+=.125){const f=rig.frame(t);for(const value of f){assert.ok(Number.isFinite(value));assert.ok(Math.abs(value)<.05)}
  for(const [x,y] of anchors){const k=at(x,y);assert.ok(Math.abs(f[k])<1e-9,'chair and grip anchors must stay still');assert.ok(Math.abs(f[k+1])<1e-9)}
  for(const [x,y] of [[.55,.20],[.12,.30]]){const k=at(x,y);movement=Math.max(movement,Math.hypot(f[k]-first[k],f[k+1]-first[k+1]))}
 }
 assert.ok(movement>.01,'the acting must visibly change the character, not just the background');
 const loop=rig.frame(8);for(let i=0;i<first.length;i++)assert.ok(Math.abs(loop[i]-first[i])<1e-7,'loop must join without a jump');
})
