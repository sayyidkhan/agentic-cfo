import { Squirrel } from 'lucide-react'

/**
 * Sandy's temporary brand avatar.
 *
 * Intentionally uses a neutral squirrel icon instead of a final character
 * illustration. The component is the single replacement point when the
 * original mascot artwork, emotions and animations are ready.
 */
export type SandyMood = 'neutral' | 'thinking' | 'celebrating'

export default function SandyAvatar({
  size = 'md',
  mood = 'neutral',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  mood?: SandyMood
  className?: string
}) {
  return (
    <span
      className={`sandy-avatar sandy-avatar--${size} sandy-avatar--${mood} ${className}`.trim()}
      role="img"
      aria-label="Sandy the squirrel — temporary avatar"
      title="Sandy the Squirrel"
    >
      <Squirrel aria-hidden="true" strokeWidth={1.9} />
    </span>
  )
}
