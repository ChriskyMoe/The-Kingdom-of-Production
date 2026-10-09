import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Sprite } from './Sprite'
import type { SpriteName } from './sprites'
import { sfx } from './sound'

type Props = {
  speaker?: SpriteName
  name?: string
  text: string
  /** Characters per second. */
  speed?: number
  className?: string
  tone?: 'normal' | 'gold' | 'danger' | 'magic'
}

const NAME_TONE = { normal: 'text-accent-2', gold: 'text-accent-2', danger: 'text-danger', magic: 'text-magic' }

/** Classic RPG text box: portrait, speaker name and typewriter text. Click to show it all. */
export function Dialogue({ speaker, name, text, speed = 55, className = '', tone = 'normal' }: Props) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  const [seen, setSeen] = useState(text)
  if (seen !== text) {
    setSeen(text)
    setN(reduce ? text.length : 0)
  }

  useEffect(() => {
    if (n >= text.length) return
    const t = window.setTimeout(() => {
      setN((v) => Math.min(text.length, v + 2))
      if (n % 8 === 0) sfx('select')
    }, 2000 / speed)
    return () => window.clearTimeout(t)
  }, [n, text, speed])

  const done = n >= text.length
  return (
    <div className={`rpg flex items-start gap-4 px-5 py-4 ${className}`} onClick={() => setN(text.length)} role="status" aria-live="polite">
      {speaker && (
        <div className="shrink-0 border-2 border-line bg-bg p-1">
          <Sprite name={speaker} size={56} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {name && <div className={`head mb-2 text-[11px] ${NAME_TONE[tone]}`}>{name}</div>}
        <p className="pixel text-[21px] leading-snug text-text">
          {text.slice(0, n)}
          <span className="invisible">{text.slice(n)}</span>
        </p>
      </div>
      <span className={`head self-end text-[12px] text-accent-2 ${done ? 'blink' : 'invisible'}`} aria-hidden>
        ▼
      </span>
    </div>
  )
}
