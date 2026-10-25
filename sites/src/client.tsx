import React,{useState,useEffect,useRef,useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import Dashboard from '../../inertia/pages/dashboard'
import Chat from '../../inertia/pages/cfo-chat'
import SandyAvatar from '../../inertia/components/sandy_avatar'
import Layout from './Layout'
import Account from './Account'
import Settings from './Settings'
import WorkspaceStatus from './WorkspaceStatus'
import {loadSession,loadWorkspace,saveWorkspaceAction} from './api'
import {workspaceHref,isPersonal} from './routing'
import {Context,connect,Link} from './bridge'
import {syntheticState,emptyState,derive,applyAction} from './domain'
import {formatSgd} from '../../app/services/finance/money.js'
import {ArrowUpRight,ShieldCheck,Leaf,ArrowRight,Wallet,Target,MessageCircle} from 'lucide-react'
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
 const page={url,props:{preferences:{theme:'light'}},flash:{},session,sessionStatus,refreshSession,expireSession,personalMode,workspaceStatus,workspaceError,reloadWorkspace,saving:saving||workspaceStatus==='refreshing',revision,reset:()=>{if(confirm('Reset all sample changes?'))setDemo(syntheticState())}}
 return <Context.Provider value={page}>{url==='/'?<div className="landing"><header className="landing-nav"><Link href="/" className="landing-brand"><Leaf/>Acorra</Link><div className="landing-account-actions"><Link href="/account" className="btn btn--secondary">My account</Link><Link href="/dashboard" className="btn btn--primary">Explore the demo <ArrowUpRight size={16}/></Link></div></header>
 <main><section className="hero"><div className="hero-copy"><span className="landing-eyebrow">A LITTLE INTENTION. A WEALTH OF POSSIBILITY.</span><h1>Your future.<br/>Growing <em>every day.</em></h1><p>Grow your wealth, one habit at a time. A calmer way to understand your money, build better habits, and plan what comes next.</p><div className="hero-actions"><Link href="/dashboard" className="btn btn--primary btn--lg">Meet your money companion <ArrowRight size={18}/></Link><span>Free public demo · No sign-up needed</span></div><div className="hero-trust"><ShieldCheck size={17}/>Synthetic records only. Your real finances stay yours.</div></div>
 <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-money-card"><span className="landing-eyebrow">SAMPLE FINANCIAL PICTURE</span><div className="hero-card-between"><h2>Small habits.<br/>Stronger foundations.</h2><Leaf size={32}/></div><div className="hero-balance">{formatSgd(derive(syntheticState()).props.financialPosition.netWorthCents)}<span>Estimated sample net worth</span></div><div className="hero-bars"><i/><i/><i/><i/><i/><i/><i/></div><small>Illustration only · not a forecast or return</small></div><div className="sandy-bubble"><SandyAvatar size="lg"/><div><strong>Hi, I’m Sandy.</strong><p>Let’s make sense of your money,<br/>one small win at a time.</p></div></div></div></section>
 <section className="feature-strip">{[[Wallet,'Clarity, down to the cent','See cash flow, balances and estimated net worth.'],[Target,'Progress with purpose','Build budgets, prepare for bills and track savings goals.'],[MessageCircle,'A companion in your corner','Ask Sandy about your records in read-only guided mode.']].map(([Icon,title,detail]:any)=><article key={title}><Icon size={24}/><h2>{title}</h2><p>{detail}</p></article>)}</section>
 <section className="launch-note"><span className="landing-eyebrow">A THOUGHTFUL FIRST STEP</span><h2>Explore with confidence.</h2><p>This public release is an interactive demo with fictional finances. Try recording a sample expense, updating a goal or asking Sandy about the budget. Demo changes and chat history stay in this tab’s memory and disappear on reload.</p><p>Personal accounts and saved financial records remain locked while live authentication and separate-visitor isolation are verified. Guided mode uses deterministic rules; it is not a generative AI model.</p><div className="hero-actions"><Link href="/dashboard" className="btn btn--primary">Explore sample finances <ArrowRight size={16}/></Link><button className="btn btn--secondary" onClick={()=>{setDemo(emptyState());go('/dashboard?view=wealth')}}>Try blank demo onboarding</button></div></section></main><footer className="site-footer">Acorra · Grow your wealth, one habit at a time.<br/><small>SGD only. No payments, trades or automatic bank connections. Not financial advice.</small></footer></div>:<Layout>{settingsPage?<Settings/>:accountPage?<Account/>:personalMode&&(!['ready','refreshing'].includes(workspaceStatus)||!state)?<WorkspaceStatus/>:<>{workspaceError&&personalMode&&<div role="alert" className="workspace-error"><p>{workspaceError}</p><button disabled={saving||workspaceStatus==='refreshing'} className="btn btn--secondary" onClick={reloadWorkspace}>Refresh saved records</button></div>}{url.startsWith('/cfo')?<Chat configured={false} dailyMessageLimit={100} messages={state.messages}/>:<Dashboard {...props as any}/>}</>}</Layout>}</Context.Provider>
}
class Boundary extends React.Component<any,any>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<main style={{padding:40}}><h1>Let’s start fresh.</h1><p>The demo could not display that change. Reload to restore the sample records.</p><button onClick={()=>location.reload()}>Restore demo</button></main>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>)
