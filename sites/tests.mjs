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
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('../drizzle/0000_financial_workspaces.sql','utf8'))
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
