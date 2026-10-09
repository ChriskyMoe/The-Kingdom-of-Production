import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CircleCheck, CircleDashed, CircleMinus, CircleX, LoaderCircle } from 'lucide-react'

export type StageStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped'
export type Stage = { name: string; detail?: string; icon?: React.ReactNode }

const LOOK: Record<StageStatus, { cls: string; label: string }> = {
  pending: { cls: 'border-line text-faint', label: 'pending' },
  running: { cls: 'border-warn text-warn', label: 'running' },
  passed: { cls: 'border-accent text-accent', label: 'passed' },
  failed: { cls: 'border-danger text-danger', label: 'failed' },
  skipped: { cls: 'border-line text-faint', label: 'skipped' },
}

export function StatusIcon({ status, size = 18 }: { status: StageStatus; size?: number }) {
  if (status === 'running') return <LoaderCircle size={size} className="animate-spin" aria-hidden />
  if (status === 'passed') return <CircleCheck size={size} aria-hidden />
  if (status === 'failed') return <CircleX size={size} aria-hidden />
  if (status === 'skipped') return <CircleMinus size={size} aria-hidden />
  return <CircleDashed size={size} aria-hidden />
}

/**
 * Runs stages one by one: pending → running → passed (or failed at `failAt`,
 * after which later stages are skipped). Call `run(failAt)` to start a new run.
 */
export function usePipeline(count: number, ms = 750) {
  const reduce = useReducedMotion()
  const [statuses, setStatuses] = useState<StageStatus[]>(() => Array(count).fill('pending'))
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = useCallback(
    (failAt: number | null) => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      const final = (i: number): StageStatus => (failAt === null || i < failAt ? 'passed' : i === failAt ? 'failed' : 'skipped')
      if (reduce) {
        setStatuses(Array.from({ length: count }, (_, i) => final(i)))
        return
      }
      setStatuses(Array(count).fill('pending'))
      const last = failAt === null ? count - 1 : failAt
      for (let i = 0; i <= last; i++) {
        timers.current.push(
          window.setTimeout(() => setStatuses((s) => s.map((v, j) => (j === i ? 'running' : v))), i * ms + 60),
          window.setTimeout(
            () => setStatuses((s) => s.map((v, j) => (j === i ? final(i) : j > i && i === failAt ? 'skipped' : v))),
            (i + 1) * ms,
          ),
        )
      }
    },
    [count, ms, reduce],
  )

  return { statuses, run }
}

type Props = {
  stages: Stage[]
  statuses: StageStatus[]
  direction?: 'row' | 'column'
  className?: string
  compact?: boolean
}

/** Stage boxes joined by connectors; colours and icons follow each stage's status. */
export function Pipeline({ stages, statuses, direction = 'row', className = '', compact = false }: Props) {
  const row = direction === 'row'
  return (
    <ol className={`flex ${row ? 'flex-row items-stretch' : 'flex-col'} ${className}`} aria-label="Pipeline">
      {stages.map((s, i) => {
        const st = statuses[i] ?? 'pending'
        const look = LOOK[st]
        return (
          <li key={s.name} className={`flex ${row ? 'flex-1 flex-row items-center' : 'flex-col items-stretch'}`}>
            <motion.div
              className={`panel relative flex flex-1 items-center gap-2.5 border-2 ${look.cls} ${compact ? 'px-2.5 py-2' : 'px-3 py-3'} ${st === 'running' ? 'shadow-[0_0_18px_rgb(210_153_34/0.35)]' : ''} ${st === 'failed' ? 'bg-tint-red' : st === 'passed' ? 'bg-tint-green' : ''}`}
              animate={st === 'failed' ? { x: [0, -4, 4, -2, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="shrink-0">{s.icon ?? <StatusIcon status={st} />}</span>
              <div className={`min-w-0 flex-1 ${row ? '' : 'flex items-baseline gap-3'}`}>
                <div className={`head whitespace-nowrap text-text ${compact ? 'text-[14px]' : 'text-[16px]'}`}>{s.name}</div>
                {s.detail && !compact && <div className="mono truncate text-[12px] text-muted">{s.detail}</div>}
                {row && <div className={`mono text-[11px] uppercase ${look.cls.split(' ')[1]}`}>{look.label}</div>}
              </div>
              {!row && <div className={`mono shrink-0 text-[11px] uppercase ${look.cls.split(' ')[1]}`}>{look.label}</div>}
            </motion.div>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={`${row ? 'mx-1 h-0.5 w-4' : 'my-0.5 ml-6 h-3 w-0.5'} shrink-0 ${statuses[i] === 'passed' ? 'bg-accent' : 'bg-line'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
