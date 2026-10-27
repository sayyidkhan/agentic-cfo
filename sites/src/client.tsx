import React,{useState,useEffect,useRef,useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import Dashboard from '../../inertia/pages/dashboard'
import Chat from '../../inertia/pages/cfo-chat'
import SandyAvatar from '../../inertia/components/sandy_avatar'
import Layout from './Layout'
import AcorraMark from '../../inertia/components/acorra_mark'
import Account from './Account'
import Settings from './Settings'
import WorkspaceStatus from './WorkspaceStatus'
import {loadSession,loadWorkspace,saveWorkspaceAction} from './api'
import {workspaceHref,isPersonal} from './routing'
import {Context,connect,Link} from './bridge'
import {syntheticState,emptyState,derive,applyAction} from './domain'
import {formatSgd} from '../../app/services/finance/money.js'
import {ArrowUpRight,ShieldCheck,ArrowRight,Wallet,Target,MessageCircle} from 'lucide-react'
function App(){
 const [demo,setDemo]=useState<any>(()=>syntheticState()),[personal,setPersonal]=useState<any>(null),[revision,setRevision]=useState(0)
 const [url,setUrl]=useState(location.pathname+location.search),[session,setSession]=useState<any>(null),[sessionStatus,setSessionStatus]=useState('loading')
 const [workspaceStatus,setWorkspaceStatus]=useState('loading'),[workspaceError,setWorkspaceError]=useState(''),[saving,setSaving]=useState(false)
 const identity=useRef<string|null>(null),epoch=useRef(0),sessionGeneration=useRef(0),busy=useRef(false),mounted=useRef(true),personalRef=useRef<any>(null)
 personalRef.current=personal
 const personalMode=isPersonal(url),accountPage=url.split('?')[0]==='/account',settingsPage=url.split('?')[0]==='/settings'
 const go=(href:string)=>{href=workspaceHref(href,personalMode);history.pushState(null,'',href);setUrl(href);window.scrollTo(0,0)}
 const expireSession=useCallback(()=>{epoch.current++;sessionGeneration.current++;identity.current=null;setPersonal(null);setRevision(0);setSession({signedIn:false,realDataEnabled:false});setWorkspaceStatus('signin')},[])
 const refreshSession=useCallback(async()=>{
  const sessionTicket=++sessionGeneration.current
  try{
   if(!identity.current)setSessionStatus('loading');
   const result=await loadSession();if(!mounted.current||sessionTicket!==sessionGeneration.current)return
   if(result.accountKey!==identity.current){epoch.current++;identity.current=result.accountKey;setPersonal(null);setRevision(0);setWorkspaceStatus('loading')}
   setSession(result);setSessionStatus('ready')
   if(!result.signedIn){setPersonal(null);setWorkspaceStatus('signin')}
  }catch{if(!mounted.current||sessionTicket!==sessionGeneration.current)return;epoch.current++;setSession(null);setSessionStatus('error');setPersonal(null);setWorkspaceStatus('error');setWorkspaceError('We couldn’t verify your sign-in. Please check your connection and try again.')}
 },[])
 const reloadWorkspace=useCallback(async()=>{
  const ticket=++epoch.current,refreshing=!!personalRef.current
  setWorkspaceStatus(refreshing?'refreshing':'loading');setWorkspaceError('')
  try{const result=await loadWorkspace();if(!mounted.current||ticket!==epoch.current)return;derive(result.state);setPersonal(result.state);setRevision(result.revision);setWorkspaceStatus('ready')}
  catch(e:any){if(!mounted.current||ticket!==epoch.current)return;setWorkspaceError(e.message);if(e.status===401||e.status===423){setPersonal(null);setWorkspaceStatus(e.status===401?'signin':'locked')}else setWorkspaceStatus(refreshing?'ready':'error');if(e.status===401)expireSession()}
 },[expireSession])
 useEffect(()=>{void refreshSession();const pop=()=>setUrl(location.pathname+location.search);const focus=()=>void refreshSession();window.addEventListener('popstate',pop);window.addEventListener('focus',focus);return()=>{mounted.current=false;window.removeEventListener('popstate',pop);window.removeEventListener('focus',focus)}},[refreshSession])
 useEffect(()=>{
  if(!personalMode||accountPage||settingsPage)return
  if(sessionStatus==='error'){setWorkspaceStatus('error');return}
  if(sessionStatus!=='ready'){setWorkspaceStatus('loading');return}
  if(!session?.signedIn){setWorkspaceStatus('signin');return}
  if(!session.realDataEnabled){setWorkspaceStatus('locked');return}
  void reloadWorkspace()
 },[personalMode,accountPage,settingsPage,session?.accountKey,session?.realDataEnabled,sessionStatus,reloadWorkspace])
 const act=async(path:string,method:string,data={})=>{
  if(!personalMode){const next=applyAction(demo,path,method,data);setDemo(next);return}
  if(busy.current)throw Error('A save is already in progress. Please wait.')
  if(workspaceStatus!=='ready')throw Error('Your saved records are not ready. Refresh your workspace before saving.')
  const ticket=++epoch.current;busy.current=true;setSaving(true)
  try{
   const result=await saveWorkspaceAction(revision,path,method,data)
   if(ticket!==epoch.current)throw Error('Your sign-in changed. Refresh your account before continuing.')
   derive(result.state);setPersonal(result.state);setRevision(result.revision);setWorkspaceError('')
  }catch(e:any){
   if(e.status===401)expireSession()
   if(e.status===423){setPersonal(null);setWorkspaceStatus('locked')}
   setWorkspaceError(e.message);throw e
  }finally{busy.current=false;setSaving(false)}
 }
 connect(act,go)
 const state=personalMode?personal:demo
 const props=state?derive(state).props:null
 const page={url,props:{preferences:{theme:'light'}},flash:{},session,sessionStatus,refreshSession,expireSession,personalMode,workspaceStatus,workspaceError,reloadWorkspace,saving:saving||workspaceStatus==='refreshing',revision,reset:()=>{if(!confirm('Reset all demo transactions, budgets, goals and chat to the original samples?'))return false;setDemo(syntheticState());return true}}
 return <Context.Provider value={page}>{url==='/'?<div className="landing landing-v2"><div className="landing-dark"><header className="landing-nav"><Link href="/" className="landing-brand"><AcorraMark size={40}/><span className="acorra-brand-name">Acorra</span></Link><div className="landing-account-actions"><Link href="/account" className="landing-signin">My account</Link><Link href="/dashboard" className="landing-nav-cta">Explore the demo <ArrowUpRight size={16}/></Link></div></header>
 <main><section className="hero"><div className="hero-copy"><span className="landing-eyebrow">A FINANCIAL COMPANION FOR THE WAY FORWARD <span aria-hidden="true">✦</span></span><h1>Make money<br/><em>feel possible.</em></h1><p>Meet the companion who makes every money move feel a little more human. Build your future, one habit at a time.</p><div className="hero-actions"><Link href="/dashboard" className="landing-main-cta">Explore Acorra <ArrowUpRight size={19}/></Link><span>Free interactive demo · No sign-up needed</span></div></div>
 <div className="landing-scene" aria-label="Sandy the Squirrel welcoming you"><div className="landing-scene-orbit landing-scene-orbit-one"/><div className="landing-scene-orbit landing-scene-orbit-two"/><div className="landing-scene-star star-one" aria-hidden="true">✦</div><div className="landing-scene-star star-two" aria-hidden="true">✧</div><img className="landing-sandy" src="/assets/sandy/v2/greeting.webp" alt="Sandy the Squirrel waving with an acorn"/><div className="landing-sandy-note"><span>HELLO, I’M SANDY</span><strong>Small steps. Big possibilities.</strong></div></div></section></main></div>
 <section className="landing-showcase" aria-label="Acorra demo preview"><div className="showcase-header"><span>THE MONEY PICTURE, MADE CLEAR</span><span>01 / 03</span></div><div className="showcase-body"><div className="showcase-heading"><span className="landing-eyebrow">THE ACORRA EXPERIENCE</span><h2>Everything in its<br/><em>right place.</em></h2><p>Your balances, habits and next steps together in one calm view.</p><Link href="/dashboard">Step inside the demo <ArrowUpRight size={17}/></Link></div><div className="showcase-screen"><div className="showcase-screen-top"><AcorraMark size={31}/><span>Overview</span><span aria-hidden="true">•••</span></div><div className="showcase-screen-eyebrow">YOUR FINANCIAL HOME</div><div className="showcase-screen-title">Good morning. Let’s see where you stand.</div><div className="showcase-screen-metrics"><div><small>Estimated sample net worth</small><strong>{formatSgd(derive(syntheticState()).props.financialPosition.netWorthCents)}</strong><span>Cash, assets &amp; debts</span></div><div><small>Recorded cash</small><strong>{formatSgd(derive(syntheticState()).props.availableCashCents)}</strong><span>From fictional accounts</span></div></div><div className="showcase-screen-bottom"><span><SandyAvatar size="sm"/> Sandy’s here when you need a thought partner.</span><span aria-hidden="true">↗</span></div></div></div></section>
 <section className="landing-after"><div className="landing-section-head"><span className="landing-eyebrow">A LITTLE INTENTION. A WEALTH OF POSSIBILITY.</span><h2>Money feels lighter<br/><em>when it makes sense.</em></h2><p>Everything you need to see the whole picture, without the noise.</p></div><div className="landing-ways">{[[Wallet,'01','Know where you stand','See cash flow, balances and estimated net worth at a glance.'],[Target,'02','Build a habit that sticks','Keep budgets, goals and upcoming bills in view.'],[MessageCircle,'03','Talk it through with Sandy','Get grounded guidance based on the demo records.']].map(([Icon,number,title,detail]:any)=><article key={title}><div className="landing-way-top"><span>{number} / 03</span><Icon size={22}/></div><h3>{title}</h3><p>{detail}</p></article>)}</div></section>
 <section className="landing-invite"><div><span className="landing-eyebrow">TAKE A LOOK AROUND</span><h2>A good place to begin.</h2><p>Explore with fictional finances, or start with a blank demo. Changes stay in this tab and disappear on reload.</p><div className="landing-invite-actions"><Link href="/dashboard" className="landing-main-cta">Explore sample finances <ArrowUpRight size={18}/></Link><button className="landing-blank-cta" onClick={()=>{setDemo(emptyState());go('/dashboard?view=wealth')}}>Start with a blank demo <ArrowRight size={17}/></button></div></div><div className="landing-invite-seal"><AcorraMark size={72}/><span>Grow your wealth,<br/>one habit at a time.</span></div></section><footer className="site-footer landing-footer"><span>Acorra © {new Date().getFullYear()}</span><span>Public demo · Synthetic financial records only</span></footer></div>:<Layout>{settingsPage?<Settings/>:accountPage?<Account/>:personalMode&&(!['ready','refreshing'].includes(workspaceStatus)||!state)?<WorkspaceStatus/>:<>{workspaceError&&personalMode&&<div role="alert" className="workspace-error"><p>{workspaceError}</p><button disabled={saving||workspaceStatus==='refreshing'} className="btn btn--secondary" onClick={reloadWorkspace}>Refresh saved records</button></div>}{url.startsWith('/cfo')?<Chat configured={false} dailyMessageLimit={100} messages={state.messages}/>:<Dashboard {...props as any}/>}</>}</Layout>}</Context.Provider>
}
class Boundary extends React.Component<any,any>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<main style={{padding:40}}><h1>Let’s start fresh.</h1><p>The demo could not display that change. Reload to restore the sample records.</p><button onClick={()=>location.reload()}>Restore demo</button></main>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>)
