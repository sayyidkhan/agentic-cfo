export const COUNT_DURATION=1250
/** Animation is a display interpolation only; its endpoint is the original integer-cent total. */
export function countedCents(target:number,elapsed:number,duration=COUNT_DURATION){
 const t=Math.max(0,Math.min(1,elapsed/duration))
 if(t===1)return target
 const value=Math.round(target*(1-Math.pow(1-t,3)))
 return value===0?0:value
}

/** Chart scales use the final category limit while the display counts into place. */
export function budgetCountFrame(limitCents:number,spentCents:number,elapsed:number){
 const spent=countedCents(spentCents,elapsed)
 const percent=limitCents?spent*100/limitCents:spent?100:0
 return {budgeted:countedCents(limitCents,elapsed),spent,remaining:countedCents(limitCents-spentCents,elapsed),percent,bar:Math.max(0,Math.min(100,percent))}
}
