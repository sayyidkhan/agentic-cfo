export const SEASON_SECONDS=8
export const seasons=[
 {id:'spring',label:'Spring',line:'Start with one small habit.'},
 {id:'summer',label:'Summer',line:'Keep a little for tomorrow.'},
 {id:'autumn',label:'Autumn',line:'Small steps build a buffer.'},
 {id:'winter',label:'Winter',line:'A little prepared. A little more at ease.'},
] as const
const clamp=(n:number)=>Math.max(0,Math.min(1,n))
const ease=(n:number)=>{n=clamp(n);return n*n*(3-2*n)}
/** A single clock synchronises character poses, the released acorn and the visible stash. */
export function sampleSeasonStory(seconds:number){
 const total=((seconds%32)+32)%32,index=Math.floor(total/SEASON_SECONDS),t=total-index*SEASON_SECONDS
 const opacity=Math.max(.45,Math.min(ease(t/.35),1-ease((t-7.5)/.5)))
 if(index===3)return {index,t,opacity,progress:t/8,x:55,y:0,angle:0,carry:0,crouch:0,rest:1,nut:0,nutX:84,nutY:64,stash:6,deposit:false}
 const approach=ease(t/2.7),bend=ease((t-2.8)/.45),drop=ease((t-3.65)/.9)
 const release=ease((t-3.65)/.45),carry=1-bend,crouch=bend*(1-release),rest=release
 const x=24+31*approach,y=t<2.7?-Math.abs(Math.sin(t*Math.PI*2.3))*1.6:Math.sin(Math.PI*bend)*-.5
 return {index,t,opacity,progress:t/8,x,y,angle:t<2.7?Math.sin(t*7)*2:0,carry,crouch,rest,nut:t>=3.65&&t<4.65?release:0,nutX:81+3*drop,nutY:61+3*drop-Math.sin(Math.PI*drop)*1.5,stash:3+index+(t>=4.65?1:0),deposit:t>=4.65&&t<5.5}
}
