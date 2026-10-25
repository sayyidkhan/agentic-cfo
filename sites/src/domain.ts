import { accountBalances, monthlyBudgetStatus, netWorth } from '../../app/services/finance/calculations.ts'
import { financialPlan } from '../../app/services/finance/planning.ts'
import { parseSgdAmount } from '../../app/services/finance/money.ts'
import { guidedCfoReply } from '../../app/services/cfo/guided_coach.ts'
export const today = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
export function emptyState(){return {accounts:[],categories:[],transactions:[],budgets:[],valuations:[],commitments:[],goals:[],messages:[],nextId:1}}
export function syntheticState(date=today()){
 const month=date.slice(0,7), d=emptyState() as any
 d.accounts=[{id:1,name:'Everyday account',kind:'asset',openingBalanceCents:640000,currency:'SGD'},{id:2,name:'Rainy day savings',kind:'asset',openingBalanceCents:1200000,currency:'SGD'},{id:3,name:'Education loan',kind:'liability',openingBalanceCents:400000,currency:'SGD'}]
 d.categories=[{id:4,name:'Dining'},{id:5,name:'Transport'},{id:6,name:'Home & essentials'}]
 d.transactions=[{id:7,kind:'income',date:month+'-01',amountCents:520000,accountId:1,note:'Sample salary'},{id:8,kind:'expense',date:month+'-02',amountCents:42000,accountId:1,categoryId:4,note:'Sample dining'},{id:9,kind:'expense',date:month+'-03',amountCents:12000,accountId:1,categoryId:5,note:'Sample transport'},{id:10,kind:'expense',date:month+'-04',amountCents:165000,accountId:1,categoryId:6,note:'Sample home expenses'},{id:11,kind:'transfer',date:month+'-05',amountCents:100000,accountId:1,destinationAccountId:2,note:'Sample savings transfer'}]
 d.budgets=[{id:12,categoryId:4,month,limitCents:50000},{id:13,categoryId:5,month,limitCents:20000},{id:14,categoryId:6,month,limitCents:200000}]
 d.valuations=[{id:15,name:'Sample long-term investments',label:'Sample long-term investments',kind:'asset',valueCents:2400000,asOf:date,currency:'SGD'}]
 d.goals=[{id:16,name:'Six-month safety cushion',targetCents:1800000,savedCents:1300000,targetDate:String(Number(date.slice(0,4))+1)+'-06-01'}]
 d.commitments=[{id:17,name:'Sample insurance',amountCents:18000,dueDay:28,lastPaidMonth:null},{id:18,name:'Sample utilities',amountCents:9500,dueDay:20,lastPaidMonth:null}]
 d.nextId=19; return d
}
const ids=(rows:any[])=>rows.map(r=>({...r,id:String(r.id)}))
export function derive(s:any,date=today()){
 for(const row of [...s.transactions.filter(t=>t.kind==='expense'),...s.budgets])if(!s.categories.some(c=>c.id===row.categoryId))throw Error('Category is still referenced by records')
 const month=date.slice(0,7), accounts=ids(s.accounts), transactions=ids(s.transactions).map(t=>({...t,accountId:String(t.accountId),destinationAccountId:t.destinationAccountId?String(t.destinationAccountId):undefined,categoryId:t.categoryId?String(t.categoryId):undefined})).sort((a,b)=>a.date.localeCompare(b.date)||Number(a.id)-Number(b.id))
 const balances=accountBalances(accounts,transactions), financialPosition=netWorth(accounts,transactions,ids(s.valuations)), budgets=monthlyBudgetStatus(ids(s.budgets).map(b=>({...b,categoryId:String(b.categoryId)})),transactions,month)
 const availableCashCents=accounts.filter(a=>a.kind==='asset').reduce((n,a)=>n+balances[a.id],0)
 const planning=financialPlan({today:date,availableCashCents,commitments:ids(s.commitments),goals:ids(s.goals),budgets:budgets.map(b=>({...b,categoryName:s.categories.find(c=>String(c.id)===b.categoryId)?.name||'Category'}))})
 const sum=(kind:string)=>transactions.filter(t=>t.kind===kind&&t.date.startsWith(month)).reduce((n,t)=>n+t.amountCents,0)
 const incomeCents=sum('income'),expenseCents=sum('expense')
 const props={accounts:s.accounts.map(a=>({...a,balanceCents:balances[a.id]})),categories:s.categories,currentDate:date,month,incomeCents,expenseCents,financialPosition,budgetStatus:budgets,valuations:s.valuations,recentTransactions:[...s.transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).map(t=>({...t,bookedOn:t.date})),availableCashCents,commitments:s.commitments,goals:s.goals,planning}
 const snapshot={date,currency:'SGD' as const,accountsRecorded:accounts.length,availableCashCents,...financialPosition,currentMonth:month,monthlyIncomeCents:incomeCents,monthlyExpenseCents:expenseCents,budgets:budgets.map(b=>({...b,category:s.categories.find(c=>String(c.id)===b.categoryId)?.name||'Category'})),unpaidBills:planning.upcoming.map(b=>({...b,isOverdue:b.dueOn<date})),upcomingBillsCents:planning.upcomingTotalCents,cashAfterBillsCents:planning.cashAfterUpcomingCents,goals:s.goals,valuations:s.valuations,insights:planning.insights}
 return {props,snapshot}
}
const text=(v:any,max=120)=>{if(typeof v!=='string'||!v.trim()||v.trim().length>max)throw Error('Enter text of 1–'+max+' characters');return v.trim()}
const dateValue=(v:any)=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v)throw Error('Enter a valid calendar date');return v}
const amount=(v:any,positive=false)=>{const n=parseSgdAmount(String(v??''));if(positive&&!n)throw Error('Amount must be greater than zero');return n}
const kind=(v:any,options=['asset','liability'])=>{if(!options.includes(v))throw Error('Select a valid type');return v}
export function applyAction(original:any,path:string,method:string,input:any={},date=today()){
 const s=structuredClone(original), parts=path.split('/').filter(Boolean), group=parts[1], id=Number(parts[2]);const next=()=>s.nextId++
 if(path==='/demo/reset')return syntheticState(date)
 if(path==='/demo/empty')return emptyState()
 if(path==='/cfo/chat'&&method==='DELETE'){s.messages=[];return s}
 if(path==='/cfo/chat'&&method==='POST'){
  const question=text(input.message,1500)
  if(s.messages.filter(m=>m.role==='user'&&m.date===date).length>=100)throw Error('Daily limit reached. Try again tomorrow.')
  const reply=guidedCfoReply(question,derive(s,date).snapshot as any)
  s.messages.push({id:next(),role:'user',content:question,date},{id:next(),role:'assistant',content:reply,date});return s
 }
 if(parts[0]!=='finance')throw Error('Unknown action')
 const tables=['accounts','categories','transactions','budgets','valuations','commitments','goals'];if(!tables.includes(group))throw Error('Unknown record type')
 const rows=s[group], existing=rows.find((r:any)=>r.id===id)
 if(['PATCH','DELETE'].includes(method)||parts[3]==='paid'){if(!existing)throw Error('Record not found')}
 if(method==='DELETE'){s[group]=rows.filter((r:any)=>r.id!==id);derive(s,date);return s}
 if(!['POST','PATCH'].includes(method))throw Error('Unsupported method')
 const owned=(table:string,raw:any)=>{const row=s[table].find((r:any)=>r.id===Number(raw));if(!row)throw Error('Select an existing '+table+' record');return row}
 const unique=(name:string)=>{if([...s.accounts,...s.valuations].some((r:any)=>r.id!==id&&r.name.trim().toLowerCase()===name.toLowerCase()))throw Error('Already tracked as an account or valuation; update the existing item instead')}
 let row:any
 if(group==='accounts'){const name=text(input.name);unique(name);row={name,kind:kind(input.kind),openingBalanceCents:amount(input.openingBalance),currency:'SGD'}}
 if(group==='categories'){const name=text(input.name,80);if(rows.some((r:any)=>r.name.toLowerCase()===name.toLowerCase()))throw Error('Category already exists');row={name}}
 if(group==='transactions'){
  const k=kind(input.kind,['income','expense','transfer']),source=owned('accounts',input.accountId)
  if(source.kind!=='asset')throw Error('Transactions must start from a cash / bank account')
  row={kind:k,amountCents:amount(input.amount,true),date:dateValue(input.bookedOn),accountId:source.id,note:input.note?text(input.note,255):''}
  if(k==='expense')row.categoryId=owned('categories',input.categoryId).id
  if(k==='transfer')row.destinationAccountId=owned('accounts',input.destinationAccountId).id
 }
 if(group==='budgets'){
  const category=owned('categories',input.categoryId);if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.month))throw Error('Enter a valid month')
  row={categoryId:category.id,month:input.month,limitCents:amount(input.limit)}
  const duplicate=rows.find((r:any)=>r.categoryId===category.id&&r.month===input.month);if(duplicate){Object.assign(duplicate,row);derive(s,date);return s}
 }
 if(group==='valuations'){const name=text(input.name);unique(name);row={name,label:name,kind:kind(input.kind),valueCents:amount(input.value),asOf:dateValue(input.asOf),currency:'SGD'}}
 if(group==='commitments'){
  if(parts[3]==='paid'){existing.lastPaidMonth=date.slice(0,7);derive(s,date);return s}
  const dueDay=Number(input.dueDay);if(!Number.isInteger(dueDay)||dueDay<1||dueDay>28)throw Error('Due day must be from 1 to 28');row={name:text(input.name),amountCents:amount(input.amount,true),dueDay,lastPaidMonth:null}
 }
 if(group==='goals')row={name:text(input.name),targetCents:amount(input.target,true),savedCents:amount(input.saved),targetDate:dateValue(input.targetDate)}
 if(method==='PATCH')Object.assign(existing,row);else rows.push({...row,id:next()})
 derive(s,date);return s
}
