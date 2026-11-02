import {useRef,useState} from 'react'
import {router} from '@inertiajs/react'
import {RefreshCw} from 'lucide-react'

/** Refresh page data without resetting entries, forms, filters or scroll. */
export default function RefreshButton({label,onRefreshed}:{label:string;onRefreshed:()=>void}){
 const active=useRef(false),[loading,setLoading]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false)
 const finish=()=>{active.current=false;setLoading(false)}
 const refresh=()=>{
  if(active.current)return
  active.current=true;setLoading(true);setMessage('');setFailed(false)
  try{router.reload({preserveScroll:true,onSuccess:()=>{onRefreshed();setMessage(label+' refreshed.')},onError:()=>{setFailed(true);setMessage('Couldn’t refresh. Please try again.')},onCancel:finish,onFinish:finish})}
  catch{setFailed(true);setMessage('Couldn’t refresh. Please try again.');finish()}
 }
 return <div className="workspace-refresh-control">
  <button type="button" className="workspace-refresh" aria-label={'Refresh '+label} title={'Refresh '+label} aria-busy={loading} disabled={loading} onClick={refresh}><RefreshCw size={17} aria-hidden="true"/><span>Refresh</span></button>
  {failed?<span className="workspace-refresh-error" role="alert">{message}</span>:<span className="count-sr" role="status">{message}</span>}
 </div>
}
