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
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved']){
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

test('Sandy’s motion keeps feet anchored and independently animates face, tail and paws',async()=>{
 const {createMotionRig,blinkAt}=await import('./dist/sandy-motion.mjs')
 assert.equal(blinkAt(0),0);assert.equal(blinkAt(1.25),1);assert.equal(blinkAt(2),0)
 const size=100,index=(x,y)=>(Math.floor(y*size)*size+Math.floor(x*size))*4
 const a=index(.4,.96),b=index(.78,.96),tail=index(.2,.25),paw=index(.64,.555),eye=index(.57,.265)
 for(const mood of ['curious','calm','watchful','concerned','screaming','celebrating','relieved']){
  const rig=createMotionRig(mood,size),first=Uint8Array.from(rig.frame(0)),moving=rig.frame(1.25)
  for(const foot of [a,b])for(const channel of [0,1])assert.ok(Math.abs(moving[foot+channel]-128)<=1,'feet must not drift')
  assert.notDeepEqual(moving,first);assert.ok(moving.every(Number.isFinite))
  assert.notEqual(moving[tail],first[tail]);assert.equal(moving[3],255)
 }
 const rig=createMotionRig('curious',size),before=Uint8Array.from(rig.frame(0)),blink=rig.frame(1.25)
 assert.ok(Math.abs(blink[eye+1]-before[eye+1])>15,'blink must affect the eye')
 assert.notEqual(blink[paw+1],before[paw+1],'paw motion must be distinct from still feet')
})
