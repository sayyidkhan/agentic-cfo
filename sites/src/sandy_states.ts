/** Persistent reference catalogue; automatic financial-state selection is deferred. */
export const sandyStates = [
 {id:'curious',name:'Curious',eyebrow:'LET’S FIND OUR STARTING POINT',trigger:'Financial records are incomplete.',line:'Let’s find out where we’re starting.',action:'Add your first account or fill in missing records.',tone:'Curious and welcoming',color:'#edf0dc',symbol:'?'},
 {id:'calm',name:'Calm',eyebrow:'STEADY DOES IT',trigger:'Recorded spending and known commitments are within plan.',line:'Looking steady. Keep going.',action:'Keep recording spending and reviewing your plan.',tone:'Reassuring',color:'#e5eee4',symbol:'·'},
 {id:'watchful',name:'Watchful',eyebrow:'A LITTLE HEADS-UP',trigger:'A spending category approaches its monthly limit.',line:'Dining is getting close. Shall we check?',action:'Review the category before your next purchase.',tone:'Attentive and helpful',color:'#f1ead4',symbol:'!'},
 {id:'concerned',name:'Concerned',eyebrow:'TIME FOR A SMALL ADJUSTMENT',trigger:'Recorded spending exceeds a category budget.',line:'We’ve gone over. Let’s adjust what’s next.',action:'Review upcoming spending or revise the budget.',tone:'Supportive and practical',color:'#f5e6d7',symbol:'…'},
 {id:'screaming',name:'Screaming',eyebrow:'SANDY, WE HAVE A PROBLEM',trigger:'Recorded cash will not cover known unpaid bills.',line:'We need a plan. Let’s review those bills!',action:'Check balances, payment dates and available options.',tone:'Urgent, with a little humour',color:'#f3ddd5',symbol:'!!'},
 {id:'celebrating',name:'Celebrating',eyebrow:'ANOTHER LITTLE WIN',trigger:'A recorded savings milestone is reached.',line:'Another acorn secured!',action:'Celebrate the progress and set the next small milestone.',tone:'Proud and encouraging',color:'#eee8ce',symbol:'✦'},
 {id:'relieved',name:'Relieved',eyebrow:'A LITTLE BREATHING ROOM',trigger:'A previously flagged cash shortfall is resolved in the records.',line:'Okay. Breathing room.',action:'Review what helped and keep the new plan going.',tone:'Warm and relieved',color:'#e4edeb',symbol:'~'},
] as const
export type SandyStateId = typeof sandyStates[number]['id']
export function sandyState(id:string|null){return sandyStates.find(s=>s.id===id)||sandyStates[0]}
