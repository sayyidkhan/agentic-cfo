import {countedCents} from '../../inertia/lib/count_up.js'
export {COUNT_DURATION,countedCents} from '../../inertia/lib/count_up.js'
export const typingDuration=(length:number)=>160+length*22
export const typedCount=(length:number,elapsed:number)=>Math.min(length,Math.max(0,Math.floor((elapsed-160)/22)))

/** The displayed bar is derived from the same displayed cents, never a second animation. */
export function countedBudget(spentCents:number,limitCents:number,elapsed:number){
 const cents=countedCents(spentCents,elapsed)
 const percent=limitCents===0?(cents>0?100:0):Math.max(0,Math.min(100,cents*100/limitCents))
 return {cents,percent}
}
