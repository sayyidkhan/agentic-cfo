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
