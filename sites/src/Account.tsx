import React from 'react'
import {UserRound,ShieldCheck,LockKeyhole,ArrowRight,Settings,LogOut,RefreshCw} from 'lucide-react'
import {Link,usePage,Head} from './bridge'

export default function Account(){
 const page=usePage(),{session}=page
 const checking=page.sessionStatus==='loading'
 const failed=page.sessionStatus==='error'
 const signedIn=!checking&&!failed&&!!session?.signedIn
 const personalAvailable=!!session?.realDataEnabled
 return <div className="cfo-workspace account-page"><Head title="Profile"/>
  <header className="cfo-page-intro"><div><h1>Profile</h1><p>Your account, in one place.</p></div></header>
  <section className="cfo-card profile-panel" aria-label="Your account">
   <div className="profile-identity"><span className="profile-avatar" aria-hidden="true"><UserRound size={28}/></span><div><h2>{signedIn?'Your Acorra account':'Welcome to Acorra'}</h2><p className="profile-status" role="status">{checking?'Checking sign-in…':failed?'Sign-in unavailable':signedIn?<><ShieldCheck size={14}/>Signed in with ChatGPT</>:'You’re exploring the public demo'}</p></div></div>
   {failed?<div className="profile-session-error"><p role="alert">We couldn’t check your sign-in. Please try again.</p><button className="btn btn--secondary" onClick={page.refreshSession}><RefreshCw size={14}/>Try again</button></div>:!checking&&!signedIn?<div className="profile-signin"><p>Use your ChatGPT account to sign in to Acorra.</p><a className="btn btn--primary" href={session?.signInPath||'/signin-with-chatgpt?return_to=%2Faccount'} target="_top">Sign in with ChatGPT <ArrowRight size={15}/></a></div>:null}
   <div className="profile-row"><span className="profile-row-icon" aria-hidden="true"><LockKeyhole size={19}/></span><div><h3>Financial workspace</h3><p>{checking?'Checking availability…':failed?'Account status couldn’t be verified.':personalAvailable?'Personal records are available after sign-in.':'Demo only for now. Personal financial records aren’t available yet.'}</p></div><span className="cfo-pill">{checking?'Checking':failed?'Unavailable':personalAvailable?'Available':'Demo'}</span></div>
   <Link href="/settings" className="profile-row profile-settings"><span className="profile-row-icon" aria-hidden="true"><Settings size={19}/></span><div><h3>Settings</h3><p>Sandy’s expressions and animation.</p></div><ArrowRight size={17}/></Link>
   <div className="profile-actions"><Link className="btn btn--primary" href={personalAvailable?'/dashboard?workspace=personal':'/dashboard'}>{personalAvailable?'Open my workspace':'Back to Summary'}<ArrowRight size={15}/></Link>{signedIn&&<a className="profile-signout" href={session.signOutPath} target="_top"><LogOut size={15}/>Log out</a>}</div>
  </section>
 </div>
}
