/** Shared, resolution-independent Acorra identity; the SVG is the source of truth. */
export default function AcorraMark({size=40}:{size?:number}){
 return <img className="acorra-mark" src="/acorra-mark.svg" width={size} height={size} alt="" aria-hidden="true" draggable={false}/>
}
