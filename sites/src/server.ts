import script from './generated-client.js.txt'
import css from './generated-style.css.txt'
import sandyArtSource from './generated-sandy-assets.txt'
const sandyArt:Record<string,string>=JSON.parse(sandyArtSource)
import {applyAction,emptyState} from './domain'
// Fail closed. Turn on only in a reviewed source revision after live two-visitor QA.
export const REAL_DATA_ENABLED = false
const security={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"}
const json=(v:any,status=200)=>new Response(JSON.stringify(v),{status,headers:{...security,'Content-Type':'application/json'}})
const html='<!doctype html><html lang="en-SG"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Acorra — Grow your wealth, one habit at a time. Explore Sandy and your financial picture in a synthetic-data public demo."><meta name="theme-color" content="#174c3c"><title>Acorra — Grow your wealth, one habit at a time.</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><noscript>Acorra’s interactive demo requires JavaScript. All demonstration finances are fictional.</noscript><script src="/app.js" defer></script></body></html>'
export function createHandler(realDataEnabled=false){return async function(request:Request,env:any){
 const url=new URL(request.url),path=url.pathname
 if(path==='/api/health')return json({ok:true,mode:realDataEnabled?'personal':'synthetic-demo',realDataEnabled})
 if(path==='/api/session'){
  if(request.method!=='GET')return json({error:'Method not allowed'},405)
  const userId=request.headers.get('oai-authenticated-user-id')
  const digest=userId?await crypto.subtle.digest('SHA-256',new TextEncoder().encode(userId)):null
  const accountKey=digest?Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join(''):null
  return json({signedIn:!!userId,accountKey,realDataEnabled,signInPath:'/signin-with-chatgpt?return_to=%2Faccount',signOutPath:'/signout-with-chatgpt?return_to=%2Faccount'})
 }
 if(path==='/api/storage-check'){
  const userId=request.headers.get('oai-authenticated-user-id')
  if(!userId)return json({error:'Sign in with ChatGPT to check saved progress'},401)
  if(!['GET','POST','DELETE'].includes(request.method))return json({error:'Method not allowed'},405)
  if(request.method!=='GET'&&request.headers.get('Origin')!==url.origin)return json({error:'Same-origin request required'},403)
  if(!env.DB)return json({error:'Saved progress is temporarily unavailable. Try again later.'},503)
  try{
   // This endpoint accepts NO financial data, names, identifiers or chat text.
   if(request.method==='POST'||request.method==='DELETE'){
    if((await request.text()).length)return json({error:'The test accepts no input. Only a generated sample marker can be saved.'},400)
   }
   if(request.method==='POST')await env.DB.prepare('INSERT OR IGNORE INTO storage_checks (owner_id, marker, created_at) VALUES (?, ?, ?)').bind(userId,'Garden '+crypto.randomUUID(),new Date().toISOString()).run()
   if(request.method==='DELETE'){await env.DB.prepare('DELETE FROM storage_checks WHERE owner_id = ?').bind(userId).run();return json({record:null})}
   const record=await env.DB.prepare('SELECT marker, created_at FROM storage_checks WHERE owner_id = ?').bind(userId).first()
   return json({record:record?{marker:record.marker,createdAt:record.created_at}:null})
  }catch{return json({error:'Saved progress is temporarily unavailable. Try again later.'},503)}
 }
 if(path.startsWith('/api/')){
  const userId=request.headers.get('oai-authenticated-user-id')
  if(!userId)return json({error:'Sign in with ChatGPT to access personal records'},401)
  if(!realDataEnabled)return json({error:'Personal financial storage is locked pending live authentication and separate-visitor isolation verification. Use synthetic demo records only.'},423)
  if(path!=='/api/workspace')return json({error:'Not found'},404)
  if(!env.DB)return json({error:'Persistent storage is unavailable'},503)
  try{
   if(!['GET','POST','DELETE'].includes(request.method))return json({error:'Method not allowed'},405)
   // Public identity is supplied only by Sites dispatch. No body/query tenant selectors.
   if(request.method!=='GET'&&request.headers.get('Origin')!==url.origin)return json({error:'Same-origin request required'},403)
   const stored=await env.DB.prepare('SELECT payload, revision FROM financial_workspaces WHERE owner_id = ?').bind(userId).first()
   if(request.method==='GET')return json({state:stored?JSON.parse(stored.payload):emptyState(),revision:stored?.revision||0})
   const expectedHeader=request.headers.get('If-Match')
   const expected=expectedHeader&&/^\d+$/.test(expectedHeader)?Number(expectedHeader):NaN
   if(!request.headers.has('If-Match')||!Number.isSafeInteger(expected)||expected<0||expected!==(stored?.revision||0))return json({error:'Records changed. Refresh before trying again.'},409)
   if(request.method==='DELETE'){
    if(stored){const deleted=await env.DB.prepare('DELETE FROM financial_workspaces WHERE owner_id = ? AND revision = ?').bind(userId,expected).run();if(!deleted.meta.changes)return json({error:'Records changed. Refresh and retry.'},409)}
    return json({deleted:true})
   }
   if(Number(request.headers.get('Content-Length')||0)>12000)return json({error:'Request too large'},413)
   const body=await request.text();if(body.length>12000)return json({error:'Request too large'},413)
   const input=JSON.parse(body)
   if(typeof input.path!=='string'||!/^\/(finance\/(accounts|categories|transactions|budgets|valuations|commitments|goals)(\/\d+)?(\/paid)?|cfo\/chat)$/.test(input.path))return json({error:'Invalid action'},400)
   const next=applyAction(stored?JSON.parse(stored.payload):emptyState(),input.path,input.method,input.data)
   const payload=JSON.stringify(next);if(payload.length>1500000)return json({error:'Workspace size limit reached'},413)
   let result
   if(stored)result=await env.DB.prepare('UPDATE financial_workspaces SET payload = ?, revision = revision + 1, updated_at = ? WHERE owner_id = ? AND revision = ?').bind(payload,new Date().toISOString(),userId,expected).run()
   else result=await env.DB.prepare('INSERT OR IGNORE INTO financial_workspaces (owner_id, payload, revision, updated_at) VALUES (?, ?, 1, ?)').bind(userId,payload,new Date().toISOString()).run()
   if(!result.meta.changes)return json({error:'Records changed. Refresh and retry.'},409)
   return json({state:next,revision:expected+1})
  }catch(e:any){return json({error:e instanceof SyntaxError?'Invalid request data':e.message||'Unable to process request'},400)}
 }
 if(!['GET','HEAD'].includes(request.method))return json({error:'Method not allowed'},405)
 const artworkMatch=path.match(/^\/assets\/sandy\/v2\/([a-z]+)\.webp$/)
 if(artworkMatch&&Object.hasOwn(sandyArt,artworkMatch[1]))return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(sandyArt[artworkMatch[1]]),c=>c.charCodeAt(0)),{headers:{...security,'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable'}})
 const assets:any={'/app.js':[script,'text/javascript; charset=utf-8'],'/style.css':[css,'text/css; charset=utf-8'],'/favicon.svg':['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#174c3c"/><path d="M12 29C9 13 20 9 30 9c0 12-5 20-18 20m0 0 12-13" fill="none" stroke="#e4d1a8" stroke-width="2.5"/></svg>','image/svg+xml']}
 if(assets[path])return new Response(request.method==='HEAD'?null:assets[path][0],{headers:{...security,'Content-Type':assets[path][1]}})
 if(!['/','/dashboard','/cfo','/account','/settings'].includes(path))return new Response('Not found',{status:404,headers:security})
 return new Response(request.method==='HEAD'?null:html,{headers:{...security,'Content-Type':'text/html; charset=utf-8'}})
}}
export default {fetch:createHandler(REAL_DATA_ENABLED)}
