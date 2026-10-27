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
 return <Context.Provider value={page}>{url==='/'?<div className="landing landing-v3">
 <header className="v3-nav"><Link href="/" className="v3-brand"><AcorraMark size={42}/><span className="acorra-brand-name">Acorra</span></Link><nav aria-label="Landing navigation"><a href="#how-it-works">How it works</a><Link href="/account">My account</Link><Link href="/dashboard" className="v3-nav-action">Try the demo <ArrowUpRight size={17}/></Link></nav></header>
 <main><section className="v3-hero"><div className="v3-hero-copy"><span className="v3-eyebrow"><span className="v3-dot"/> YOUR PERSONAL FINANCIAL COMPANION</span><h1>Stay ahead of<br/><em>your money.</em></h1><p>Acorra brings your spending, bills, goals and wealth together. Sandy spots what needs attention and helps you decide what to do next.</p><div className="v3-hero-actions"><Link href="/dashboard" className="v3-button">Explore the interactive demo <ArrowUpRight size={19}/></Link><span>Free to explore · Fictional finances</span></div><div className="v3-hero-steps"><span>01 <b>Know</b></span><i/><span>02 <b>Anticipate</b></span><i/><span>03 <b>Act</b></span></div></div>
 <div className="v3-hero-visual"><div className="v3-orbit"/><div className="v3-sandy"><img src="/assets/sandy/v2/greeting.webp" alt="Sandy the Squirrel waving"/></div><div className="v3-insight"><span className="v3-insight-label"><span className="v3-pulse"/> SANDY’S CHECK-IN · DEMO</span><h2>Before you spend,<br/>take a look ahead.</h2><p>You have <strong>{formatSgd(derive(syntheticState()).props.planning.upcomingTotalCents)}</strong> in recorded bills still to review this month.</p><div className="v3-insight-foot"><span>Based on fictional records</span><ArrowUpRight size={17}/></div></div></div></section>
 <div className="v3-ticker" aria-label="What Acorra brings together"><span>SPENDING</span><span>✦</span><span>BILLS</span><span>✦</span><span>GOALS</span><span>✦</span><span>WEALTH</span><span>✦</span><span>WHAT COMES NEXT</span></div>
 <section id="how-it-works" className="v3-process"><div className="v3-section-heading"><span className="v3-kicker">THE ACORRA APPROACH</span><h2>A picture of your money.<br/><em>And a way forward.</em></h2><p>A budget tracker tells you what happened. Acorra helps you understand what your records mean for the decisions ahead.</p></div><div className="v3-process-grid"><article><span>01 / SEE CLEARLY</span><Wallet size={26}/><h3>Bring the whole picture together.</h3><p>Record income, spending, accounts, assets and debts. Know your available cash and estimated net worth without piecing it together yourself.</p></article><article><span>02 / GET THE HEADS-UP</span><Target size={26}/><h3>Notice what needs attention.</h3><p>Keep budgets and known bills in view. See overspending signals and possible shortfalls while you still have choices.</p></article><article><span>03 / MAKE A MOVE</span><MessageCircle size={26}/><h3>Talk through the next step.</h3><p>Ask Sandy about your own records and get a clear, practical suggestion. She explains the figures; you decide what to do.</p></article></div></section>
 <section className="v3-proof"><div className="v3-proof-copy"><span className="v3-kicker">A SAMPLE CHECK-IN</span><h2>Useful guidance<br/>starts with <em>real context.</em></h2><p>In the public demo, Sandy can connect known bills to your recorded cash and point you to the next thing worth checking.</p><Link href="/dashboard?view=budget">See the sample plan <ArrowUpRight size={18}/></Link></div><div className="v3-proof-ui"><div className="v3-proof-top"><AcorraMark size={31}/><span>Monthly plan · sample records</span></div><div className="v3-proof-metrics"><div><small>Recorded cash</small><strong>{formatSgd(derive(syntheticState()).props.availableCashCents)}</strong></div><div><small>Known unpaid bills</small><strong>{formatSgd(derive(syntheticState()).props.planning.upcomingTotalCents)}</strong></div></div><div className="v3-proof-line"><span>Estimated cash after those bills</span><strong>{formatSgd(derive(syntheticState()).props.planning.cashAfterUpcomingCents)}</strong></div><div className="v3-proof-sandy"><SandyAvatar size="sm"/><p><strong>Sandy’s next step</strong><br/>Review what’s due before deciding what to spend next.</p></div><small>Illustrative figures calculated from fictional demo records.</small></div></section>
 <section className="v3-invite"><div><span className="v3-kicker">GROW YOUR WEALTH, ONE HABIT AT A TIME.</span><h2>Start with a clearer<br/><em>next step.</em></h2><p>Try Acorra with fictional records. Your changes and Sandy chat stay in this tab until you reload.</p><div className="v3-invite-actions"><Link href="/dashboard" className="v3-button">Explore sample finances <ArrowUpRight size={18}/></Link><button onClick={()=>{setDemo(emptyState());go('/dashboard?view=wealth')}}>Start with a blank demo <ArrowRight size={18}/></button></div></div><img src="/assets/sandy/v2/greeting.webp" alt="" aria-hidden="true"/></section></main>
 <footer className="v3-footer"><span>Acorra © {new Date().getFullYear()}</span></footer></div>:<Layout>{settingsPage?<Settings/>:accountPage?<Account/>:personalMode&&(!['ready','refreshing'].includes(workspaceStatus)||!state)?<WorkspaceStatus/>:<>{workspaceError&&personalMode&&<div role="alert" className="workspace-error"><p>{workspaceError}</p><button disabled={saving||workspaceStatus==='refreshing'} className="btn btn--secondary" onClick={reloadWorkspace}>Refresh saved records</button></div>}{url.startsWith('/cfo')?<Chat configured={false} dailyMessageLimit={100} messages={state.messages}/>:<Dashboard {...props as any}/>}</>}</Layout>}</Context.Provider>
}
class Boundary extends React.Component<any,any>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<main style={{padding:40}}><h1>Let’s start fresh.</h1><p>The demo could not display that change. Reload to restore the sample records.</p><button onClick={()=>location.reload()}>Restore demo</button></main>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>)
