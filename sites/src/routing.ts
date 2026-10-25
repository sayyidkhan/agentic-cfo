/** Workspace choice belongs in URLs, not financial/browser storage. */
export function workspaceHref(href:string,personal:boolean){
 if(!href.startsWith('/')||href.startsWith('//'))return href
 const url=new URL(href,'https://acorra.local')
 if(personal&&['/dashboard','/cfo'].includes(url.pathname)&&!url.searchParams.has('workspace'))url.searchParams.set('workspace','personal')
 return url.pathname+url.search+url.hash
}
export function isPersonal(url:string){return new URL(url,'https://acorra.local').searchParams.get('workspace')==='personal'}
