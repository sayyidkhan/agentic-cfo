import React,{createContext,useContext,useState,useEffect} from 'react'
import {workspaceHref} from './routing'
export const Context=createContext<any>(null)
let action:any, navigate:any
export function connect(a:any,n:any){action=a;navigate=n}
export const router={delete:(p:string)=>action(p,'DELETE').catch(e=>alert(e.message)),post:(p:string,d={})=>action(p,'POST',d).catch(e=>alert(e.message)),on:()=>()=>{}}
export function usePage(){return useContext(Context)}
export function Head({title}:any){useEffect(()=>{document.title=title+' · Acorra'},[title]);return null}
export function Link({href,children,...props}:any){const page=usePage();href=workspaceHref(href,!!page?.personalMode);return <a href={href} {...props} onClick={e=>{if(!e.ctrlKey&&!e.metaKey&&(!props.target||props.target!=='_top')){e.preventDefault();navigate(href)}}}>{children}</a>}
const routes:any={'finance.accounts.store':'/finance/accounts','finance.categories.store':'/finance/categories','finance.transactions.store':'/finance/transactions','finance.budgets.store':'/finance/budgets','finance.valuations.store':'/finance/valuations','finance.commitments.store':'/finance/commitments','finance.goals.store':'/finance/goals','cfo.message.store':'/cfo/chat'}
export function Form({route,action:target,method='post',children,resetOnSuccess,...props}:any){
 const page=usePage()
 const [errors,setErrors]=useState<any>({}),[processing,setProcessing]=useState(false),[success,setSuccess]=useState(false)
 return <form {...props} onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;setErrors({});setSuccess(false);setProcessing(true);try{await action(target||routes[route],method.toUpperCase(),Object.fromEntries(new FormData(form)));setSuccess(true);if(resetOnSuccess||(route?.startsWith('finance.')&&route?.endsWith('.store')))form.reset()}catch(err:any){setErrors({message:err.message})}finally{setProcessing(false)}}}>
 <fieldset disabled={processing||page?.saving} className="finance-form-fields">{typeof children==='function'?children({errors,processing:processing||page?.saving}):children}</fieldset>
 {success&&<p role="status" className="demo-success">{target==='/cfo/chat'||route==='cfo.message.store'?'Sandy’s reply is above.':page?.personalMode?'Saved to your private workspace.':'Saved in this demo tab. Reloading resets sample changes.'}</p>}
 {typeof children!=='function'&&Object.keys(errors).length>0&&<p role="alert" className="cfo-field-error">{errors.message}</p>}
 </form>
}
