/** Read-only presentation totals derived from the existing monthly budget results. */
interface BudgetLine { categoryId:string; limitCents:number; spentCents:number; remainingCents:number; percentUsed:number }
interface Insight { code:string; severity:'notice'|'warning'; title:string; detail:string }
export function overviewBudget<T extends BudgetLine>(budgets:T[],expenseCents:number){
 const cents=(n:number)=>{if(!Number.isSafeInteger(n)||n<0)throw Error('Overview requires non-negative safe integer cents');return n}
 cents(expenseCents)
 const categories=new Set<string>();let limitCents=0,spentCents=0
 for(const b of budgets){if(categories.has(b.categoryId))throw Error('Duplicate category budget in overview');categories.add(b.categoryId);limitCents=cents(limitCents+cents(b.limitCents));spentCents=cents(spentCents+cents(b.spentCents))}
 if(spentCents>expenseCents)throw Error('Budget spending exceeds monthly expenses')
 return {limitCents,spentCents,remainingCents:limitCents-spentCents,unbudgetedCents:expenseCents-spentCents,percentUsed:limitCents?spentCents*100/limitCents:spentCents?100:0,overCount:budgets.filter(b=>b.remainingCents<0).length,highlights:[...budgets].sort((a,b)=>Number(b.remainingCents<0)-Number(a.remainingCents<0)||b.percentUsed-a.percentUsed)}
}
export function overviewInsights<T extends Insight>(insights:T[]):T[]{
 const rank=(i:Insight)=>i.code==='cash_shortfall'?0:i.code.startsWith('overbudget_')?1:i.code==='past_due_bills'?2:i.severity==='warning'?3:i.code.startsWith('budget_')?4:5
 return [...insights].sort((a,b)=>rank(a)-rank(b))
}
