import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import SandyAvatar from '~/components/sandy_avatar'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="auth">
        <div className="auth__form-col">
          <Logo size={28} />
          <div className="auth__form-wrap">{children}</div>
          <div style={{ height: 20 }} />
        </div>

        <aside className="auth__aside">
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <p className="auth__quote">
            Grow your wealth, one habit at a time.
          </p>

          <div style={{display:'grid',gap:12,justifyItems:'start'}}>
            <SandyAvatar size="lg" />
            <div className="pitch__t">Meet Sandy the Squirrel</div>
            <p className="pitch__p">Your friendly companion for smarter money habits. Start small, stay consistent, and watch your progress grow.</p>
          </div>
        </aside>
      </div>
      <FlashToasts />
    </>
  )
}
