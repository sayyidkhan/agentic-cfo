import { Link } from '@adonisjs/inertia/react'
import AcorraMark from './acorra_mark'

/** Acorra wordmark with the shared acorn-and-sprout identity. */
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link route="home" aria-label="Acorra home" className="acorra-wordmark">
      <span className="acorra-wordmark__icon" style={{width:size+10,height:size+10}}>
        <AcorraMark size={size+10}/>
      </span>
      <span className="acorra-brand-name">Acorra<span className="acorra-wordmark__dot">.</span></span>
    </Link>
  )
}
