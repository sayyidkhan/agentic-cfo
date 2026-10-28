export const COUNT_DURATION=1250
/** Animation is a display interpolation only; its endpoint is the original integer-cent total. */
export function countedCents(target:number,elapsed:number,duration=COUNT_DURATION){
 const t=Math.max(0,Math.min(1,elapsed/duration))
 if(t===1)return target
 const value=Math.round(target*(1-Math.pow(1-t,3)))
 return value===0?0:value
}
export const typingDuration=(length:number)=>160+length*22
export const typedCount=(length:number,elapsed:number)=>Math.min(length,Math.max(0,Math.floor((elapsed-160)/22)))

/** The displayed bar is derived from the same displayed cents, never a second animation. */
export function countedBudget(spentCents:number,limitCents:number,elapsed:number){
 const cents=countedCents(spentCents,elapsed)
 const percent=limitCents===0?(cents>0?100:0):Math.max(0,Math.min(100,cents*100/limitCents))
 return {cents,percent}
}
