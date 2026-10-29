import React,{useEffect,useRef,useState} from 'react'
import {UserRound,ShieldCheck,LogOut,RefreshCw,Check} from 'lucide-react'
import {usePage,Head} from './bridge'
import {requestJson} from './api'
const colours=['forest','gold','slate','rose'] as const
export default function Account(){
 const page=usePage(),session=page.session,signed=page.sessionStatus==='ready'&&!!session?.signedIn
 const [name,setName]=useState(''),[avatar,setAvatar]=useState('forest'),[saved,setSaved]=useState({displayName:'',avatar:'forest'}),[revision,setRevision]=useState(0),[loading,setLoading]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[ready,setReady]=useState(false)
 const epoch=useRef(0)
 const load=async()=>{const ticket=++epoch.current;setLoading(true);setReady(false);setError('');setNotice('');try{const r=await requestJson('/api/profile');if(ticket!==epoch.current)return;setName(r.profile.displayName);setAvatar(r.profile.avatar);setSaved(r.profile);setRevision(r.revision);setReady(true)}catch(e:any){if(ticket===epoch.current){setError(e.message);if(e.status===401)page.expireSession()}}finally{if(ticket===epoch.current)setLoading(false)}}
 useEffect(()=>{setName('');setAvatar('forest');setSaved({displayName:'',avatar:'forest'});setReady(false);setSaving(false);setError('');setNotice('');if(signed)void load();return()=>{epoch.current++}},[signed,session?.accountKey])
 const dirty=name!==saved.displayName||avatar!==saved.avatar
 const save=async(e:React.FormEvent)=>{e.preventDefault();if(!ready||saving)return;const ticket=epoch.current;setSaving(true);setError('');setNotice('');try{const r=await requestJson('/api/profile',{method:'POST',headers:{'Content-Type':'application/json','If-Match':String(revision)},body:JSON.stringify({displayName:name,avatar})});if(ticket!==epoch.current)return;setName(r.profile.displayName);setAvatar(r.profile.avatar);setSaved(r.profile);setRevision(r.revision);setNotice('Profile saved.')}catch(e:any){if(ticket===epoch.current){setError(e.message);if(e.status===401)page.expireSession()}}finally{if(ticket===epoch.current)setSaving(false)}}
 const initials=name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>Array.from(x)[0]).join('').toLocaleUpperCase()
 return <div className="cfo-workspace account-page profile-editor"><Head title="Profile"/><header className="cfo-page-intro"><div><h1>Profile</h1><p>Make Acorra feel like you.</p></div></header>
 <section className="cfo-card profile-panel">
 <div className="profile-identity"><span className={'profile-avatar avatar-'+avatar} aria-hidden="true">{initials||<UserRound size={30}/>}</span><div><h2>{name.trim()||'Your profile'}</h2><p className="profile-status">{signed?<><ShieldCheck size={14}/>Connected with ChatGPT</>:page.sessionStatus==='loading'?'Checking sign-in…':'Sign in to save your profile'}</p></div></div>
 <form onSubmit={save} className="profile-details"><fieldset disabled={!signed||loading||saving||!ready}><legend>Personal details</legend><label htmlFor="profile-name">Display name</label><input id="profile-name" value={name} onChange={e=>{setName(e.target.value);setNotice('')}} maxLength={60} autoComplete="nickname" placeholder="What should we call you?"/><p className="profile-help">Choose the name you’d like to use in Acorra.</p><div className="profile-colour-label" id="avatar-colour-label">Avatar colour</div><div className="profile-colours" role="group" aria-labelledby="avatar-colour-label">{colours.map(c=><button key={c} type="button" className={'avatar-'+c} aria-label={c.charAt(0).toUpperCase()+c.slice(1)+' avatar'} aria-pressed={avatar===c} onClick={()=>{setAvatar(c);setNotice('')}}>{avatar===c&&<Check size={19}/>}</button>)}</div></fieldset>
 {loading&&<p role="status" className="profile-help">Loading your saved profile…</p>}
 {error&&<div className="profile-editor-error"><p role="alert">{error}</p>{signed&&<button type="button" className="btn btn--secondary" disabled={loading||saving} onClick={load}><RefreshCw size={14}/>Reload profile</button>}</div>}
 {notice&&<p role="status" className="profile-saved"><Check size={15}/>{notice}</p>}
 <div className="profile-save-row">{signed?<><button className="btn btn--primary" type="submit" disabled={!ready||saving||!dirty}>{saving?'Saving…':'Save changes'}</button><button className="btn btn--secondary" type="button" disabled={!dirty||saving||!ready} onClick={()=>{setName(saved.displayName);setAvatar(saved.avatar);setError('');setNotice('')}}>Cancel</button></>:page.sessionStatus==='error'?<button type="button" className="btn btn--secondary" onClick={page.refreshSession}>Retry sign-in check</button>:<a className="btn btn--primary" href={session?.signInPath||'/signin-with-chatgpt?return_to=%2Faccount'} target="_top">Sign in with ChatGPT</a>}</div>
 </form>
 <div className="profile-connection"><div><h3>Sign-in method</h3><p>ChatGPT manages your sign-in details.</p></div>{signed&&<a className="profile-signout" href={session.signOutPath} target="_top"><LogOut size={15}/>Log out</a>}</div>
 </section></div>
}
