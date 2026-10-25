export class ApiError extends Error {
  constructor(message:string, public status:number){super(message)}
}
export async function requestJson(path:string, options:RequestInit={},fetcher:typeof fetch=fetch){
 let response:Response
 try{response=await fetcher(path,{...options,signal:options.signal||AbortSignal.timeout(15000),credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json',...options.headers}})}
 catch{throw new ApiError('Could not connect. Your changes have not been saved. Check your connection and try again.',0)}
 let data:any
 try{data=await response.json()}catch{throw new ApiError('The server returned an unexpected response. Your changes have not been confirmed.',response.status)}
 if(!response.ok)throw new ApiError(data.error||'Unable to complete this request.',response.status)
 return data
}
export const loadSession=(fetcher?:typeof fetch)=>requestJson('/api/session',{},fetcher)
export const loadWorkspace=(fetcher?:typeof fetch)=>requestJson('/api/workspace',{},fetcher)
export const saveWorkspaceAction=(revision:number,path:string,method:string,data:any,fetcher?:typeof fetch)=>requestJson('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json','If-Match':String(revision)},body:JSON.stringify({path,method,data})},fetcher)
