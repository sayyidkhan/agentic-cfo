import React,{useEffect,useRef} from 'react'
import {UserRound,Settings,LogOut,LogIn,ChevronUp} from 'lucide-react'
import {Link,usePage} from './bridge'

export default function ProfileMenu({expanded=false}:{expanded?:boolean}){
 const page=usePage(),ref=useRef<HTMLDetailsElement>(null)
 useEffect(()=>{ref.current?.removeAttribute('open')},[page.url])
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!ref.current?.contains(event.target))ref.current?.removeAttribute('open')}
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&ref.current?.open){ref.current.removeAttribute('open');ref.current.querySelector('summary')?.focus()}}
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
 },[])
 return <details className="profile-menu" ref={ref}>
  <summary aria-label="Profile menu" title="Profile menu"><UserRound size={21}/>{expanded&&<><span className="profile-menu-copy"><strong>Profile</strong><small>Account &amp; settings</small></span><ChevronUp className="profile-menu-chevron" size={15}/></>}</summary>
  <nav className="profile-menu-panel" aria-label="Account options">
   <Link href="/account"><UserRound size={18}/>Profile</Link>
   <Link href="/settings"><Settings size={18}/>Settings</Link>
   {page.session?.signedIn?<a href={page.session.signOutPath} target="_top"><LogOut size={18}/>Log out</a>:<a href={page.session?.signInPath||'/signin-with-chatgpt?return_to=%2Faccount'} target="_top"><LogIn size={18}/>Sign in</a>}
  </nav>
 </details>
}
