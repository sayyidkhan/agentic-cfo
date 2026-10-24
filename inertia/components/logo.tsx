import { Link } from '@adonisjs/inertia/react'
import { Leaf } from 'lucide-react'

/** Acorra text mark — deliberately simple until the full identity is designed. */
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link route="home" aria-label="Acorra home" className="acorra-wordmark">
      <span className="acorra-wordmark__icon" style={{width:size+10,height:size+10}}>
        <Leaf size={size*0.63} strokeWidth={2.1} aria-hidden="true" />
      </span>
      <span>Acorra<span className="acorra-wordmark__dot">.</span></span>
    </Link>
  )
}
