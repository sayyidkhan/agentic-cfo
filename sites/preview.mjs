// Development only: these fixtures are never imported into the deployed Worker.
import http from 'node:http'
import {stat,readFile,mkdir} from 'node:fs/promises'
import {DatabaseSync} from 'node:sqlite'
await mkdir(new URL('./.qa/',import.meta.url),{recursive:true})
const db=new DatabaseSync(new URL('./.qa/preview.sqlite',import.meta.url).pathname)
for(const table of ['financial_workspaces','storage_checks']){
 if(!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)){
  const migration=table==='financial_workspaces'?'0000_financial_workspaces.sql':'0001_storage_checks.sql'
  const migrations=JSON.parse(await readFile(new URL('./dist/preview-migrations.json',import.meta.url),'utf8'))
  db.exec(migrations.find(item=>item.name===migration).sql)
 }
}
const DB={prepare(sql){return{bind(...values){return{async first(){return db.prepare(sql).get(...values)},async run(){const result=db.prepare(sql).run(...values);return{meta:{changes:Number(result.changes)}}}}}}}}
const server=http.createServer(async(req,res)=>{
 try{
  const origin='http://'+req.headers.host,url=new URL(req.url,origin)
  if(url.pathname==='/__qa/mobile'){
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end('<!doctype html><title>Acorra mobile QA — 390px</title><body style="background:#ddd;margin:24px"><iframe title="Mobile preview" src="/account" style="width:390px;height:844px;border:0;background:white"></iframe></body>');return
  }
  if(url.pathname==='/__qa/visitors'){
   if(req.method==='POST'){
    let body='';for await(const chunk of req)body+=chunk
    const chosen=new URLSearchParams(body).get('visitor')
    if(!['alice','bob','anonymous'].includes(chosen)){res.writeHead(400);res.end('Invalid fixture');return}
    res.writeHead(303,{'Location':'/account','Set-Cookie':'acorra_qa_visitor='+chosen+'; HttpOnly; SameSite=Strict; Path=/'});res.end();return
   }
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end('<!doctype html><title>Acorra local QA visitors</title><h1>Local synthetic test visitors</h1><p>Development fixture only. No real account or authentication is simulated in production.</p><form method="post"><button name="visitor" value="alice">Use Alice fixture</button> <button name="visitor" value="bob">Use Bob fixture</button> <button name="visitor" value="anonymous">Use anonymous fixture</button></form>');return
  }
  const modified=(await stat(new URL('./dist/server/index.js',import.meta.url))).mtimeMs
  const {default:worker,createHandler}=await import('./dist/server/index.js?v='+modified)
  const headers=new Headers(req.headers)
  headers.delete('oai-authenticated-user-id')
  const visitor=(req.headers.cookie||'').match(/(?:^|; )acorra_qa_visitor=(alice|bob)(?:;|$)/)?.[1]
  if(visitor)headers.set('oai-authenticated-user-id','local-fixture-'+visitor)
  let body='';if(!['GET','HEAD'].includes(req.method))for await(const chunk of req)body+=chunk
  const request=new Request(origin+req.url,{method:req.method,headers,...(body?{body}:{})})
  // Real-data flag is enabled only for fixture visitors on this local QA server.
  const response=await (visitor?createHandler(true):worker.fetch)(request,{DB})
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))
 }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end('Preview could not complete this request.')}
})
const portIndex=process.argv.indexOf('--port')
server.listen(Number(process.env.PORT||(portIndex>=0?process.argv[portIndex+1]:3000)),'0.0.0.0')
