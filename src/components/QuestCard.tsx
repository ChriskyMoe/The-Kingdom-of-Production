import type { ReactNode } from 'react'
import { CircleCheck, Circle, ScrollText } from 'lucide-react'

type Props = {
  title: ReactNode
  objectives?: { text: string; done?: boolean }[]
  reward?: string
  className?: string
  children?: ReactNode
}

/** RPG-style quest card: title, objective checklist and XP reward. */
export function QuestCard({ title, objectives = [], reward, className = '', children }: Props) {
  return (
    <div className={`hud hud-purple panel border-accent-2/60 p-5 ${className}`}>
      <div className="mono flex items-center gap-2 text-[12px] tracking-[0.2em] text-accent-2 uppercase">
        <ScrollText size={14} aria-hidden /> Quest
      </div>
      <div className="pixel mt-1 text-[24px] leading-snug text-text">{title}</div>
      {objectives.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {objectives.map((o) => (
            <li key={o.text} className={`flex items-center gap-2 text-[16px] ${o.done ? 'text-accent' : 'text-muted'}`}>
              {o.done ? <CircleCheck size={16} aria-label="done" /> : <Circle size={16} aria-label="not done" />}
              {o.text}
            </li>
          ))}
        </ul>
      )}
      {children}
      {reward && <div className="mono mt-3 text-[13px] text-warn">REWARD · {reward}</div>}
    </div>
  )
}
