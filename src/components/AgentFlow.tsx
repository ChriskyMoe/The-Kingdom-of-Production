import { motion } from 'framer-motion'
import { Bot, Cog, User } from 'lucide-react'

export type Actor = 'human' | 'ai' | 'ci'
export type FlowStep = { label: string; detail?: string; actor: Actor; bad?: boolean }

export const ACTOR: Record<Actor, { name: string; cls: string; Icon: typeof Bot }> = {
  human: { name: 'Human', cls: 'border-info text-info bg-tint-blue', Icon: User },
  ai: { name: 'AI agent', cls: 'border-magic text-magic bg-tint-purple', Icon: Bot },
  ci: { name: 'Automation', cls: 'border-accent text-accent bg-tint-green', Icon: Cog },
}

type Props = {
  steps: FlowStep[]
  /** How many steps are lit (0..steps.length). */
  progress: number
  direction?: 'row' | 'column'
  onPick?: (i: number) => void
  selected?: number
  className?: string
}

/** Workflow steps colour-coded by who does them (human / AI / automation). */
export function AgentFlow({ steps, progress, direction = 'row', onPick, selected, className = '' }: Props) {
  const row = direction === 'row'
  return (
    <ol className={`flex ${row ? 'flex-row flex-wrap items-center gap-y-3' : 'flex-col'} ${className}`}>
      {steps.map((s, i) => {
        const lit = i < progress
        const a = ACTOR[s.actor]
        return (
          <li key={i} className={`flex ${row ? 'items-center' : 'flex-col'}`}>
            <motion.button
              type="button"
              onClick={onPick ? () => onPick(i) : undefined}
              disabled={!onPick}
              aria-pressed={selected === i}
              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left transition-colors disabled:cursor-default ${
                lit ? (s.bad ? 'border-danger bg-tint-red text-danger' : a.cls) : 'border-line text-faint'
              } ${selected === i ? 'ring-2 ring-text/40' : ''}`}
              animate={{ opacity: lit ? 1 : 0.45, scale: lit && i === progress - 1 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.35 }}
            >
              <a.Icon size={17} aria-hidden />
              <span>
                <span className="pixel block text-[15px] leading-tight text-text">{s.label}</span>
                {s.detail && <span className="mono block text-[11px] leading-tight opacity-90">{s.detail}</span>}
                <span className="sr-only"> — {a.name}</span>
              </span>
            </motion.button>
            {i < steps.length - 1 && (
              <span aria-hidden className={`${row ? 'mx-1.5 text-[16px]' : 'my-0.5 ml-5 text-[13px]'} mono ${i < progress - 1 ? 'text-accent' : 'text-line'}`}>
                {row ? '→' : '↓'}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/** Legend for the three actor colours. */
export function ActorLegend({ actors = ['human', 'ai', 'ci'] as Actor[] }: { actors?: Actor[] }) {
  return (
    <div className="flex gap-2">
      {actors.map((k) => {
        const a = ACTOR[k]
        return (
          <span key={k} className={`chip ${a.cls}`}>
            <a.Icon size={12} aria-hidden /> {a.name}
          </span>
        )
      })}
    </div>
  )
}
