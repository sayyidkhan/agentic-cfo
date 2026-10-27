import React,{useState,useEffect,useRef,useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import Dashboard from '../../inertia/pages/dashboard'
import Chat from '../../inertia/pages/cfo-chat'
import Layout from './Layout'
import Landing from './Landing'
import Account from './Account'
import Settings from './Settings'
import WorkspaceStatus from './WorkspaceStatus'
import {loadSession,loadWorkspace,saveWorkspaceAction} from './api'
import {workspaceHref,isPersonal} from './routing'
import {Context,connect,Link} from './bridge'
import {syntheticState,emptyState,derive,applyAction} from './domain'
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
 return <Context.Provider value={page}>{url==='/'?<Landing onBlank={()=>{setDemo(emptyState());go('/dashboard?view=wealth')}}/>:<Layout>{settingsPage?<Settings/>:accountPage?<Account/>:personalMode&&(!['ready','refreshing'].includes(workspaceStatus)||!state)?<WorkspaceStatus/>:<>{workspaceError&&personalMode&&<div role="alert" className="workspace-error"><p>{workspaceError}</p><button disabled={saving||workspaceStatus==='refreshing'} className="btn btn--secondary" onClick={reloadWorkspace}>Refresh saved records</button></div>}{url.startsWith('/cfo')?<Chat configured={false} dailyMessageLimit={100} messages={state.messages}/>:<Dashboard {...props as any}/>}</>}</Layout>}</Context.Provider>
}
class Boundary extends React.Component<any,any>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<main style={{padding:40}}><h1>Let’s start fresh.</h1><p>The demo could not display that change. Reload to restore the sample records.</p><button onClick={()=>location.reload()}>Restore demo</button></main>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>)
