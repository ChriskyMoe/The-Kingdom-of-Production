import { motion } from 'framer-motion'

export type Commit = {
  id: string
  lane: number
  parents: string[]
  label?: string
}

export type Lane = { name: string; color: string }

type Props = {
  commits: Commit[]
  lanes: Lane[]
  /** Commit id that HEAD points at. */
  head?: string
  gapX?: number
  gapY?: number
  /** Left margin reserved for lane names. */
  labelW?: number
  /** Show commit labels under the dots. */
  showLabels?: boolean
  className?: string
}

/**
 * Horizontal git graph. Commits are laid out left→right in array order,
 * one row per lane. New commits animate in (draw the edge, then pop the dot).
 */
export function GitGraph({ commits, lanes, head, gapX = 92, gapY = 86, labelW = 170, showLabels = true, className = '' }: Props) {
  const top = head ? 62 : 36
  const pos = new Map(commits.map((c, i) => [c.id, { x: labelW + 30 + i * gapX, y: top + c.lane * gapY }]))
  const width = labelW + 60 + Math.max(commits.length - 1, 0) * gapX + 60
  const height = top + (lanes.length - 1) * gapY + 52
  const headPos = head ? pos.get(head) : undefined

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
      role="img"
      aria-label={`Git graph: ${commits.map((c) => `${c.label ?? c.id} on ${lanes[c.lane].name}`).join(', ')}`}
    >
      {lanes.map((l, i) => (
        <g key={l.name}>
          <line x1={labelW} x2={width - 20} y1={top + i * gapY} y2={top + i * gapY} style={{ stroke: 'var(--line)' }} strokeDasharray="3 6" />
          <text x={8} y={top + i * gapY + 5} className="mono" fontSize={15} style={{ fill: l.color }}>
            {l.name}
          </text>
        </g>
      ))}

      {commits.map((c) =>
        c.parents.map((p) => {
          const a = pos.get(p)
          const b = pos.get(c.id)
          if (!a || !b) return null
          const mx = (a.x + b.x) / 2
          const d = a.y === b.y ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
          const color = lanes[a.y === b.y ? c.lane : Math.max(commits.find((x) => x.id === p)!.lane, c.lane)].color
          return (
            <motion.path
              key={`${p}-${c.id}`}
              d={d}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ stroke: color }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45 }}
            />
          )
        }),
      )}

      {commits.map((c) => {
        const p = pos.get(c.id)!
        const color = lanes[c.lane].color
        const merge = c.parents.length > 1
        return (
          <motion.g key={c.id} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.3 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
            <circle cx={p.x} cy={p.y} r={merge ? 13 : 11} style={{ fill: 'var(--bg)', stroke: color }} strokeWidth={3} />
            <circle cx={p.x} cy={p.y} r={merge ? 6 : 5} style={{ fill: color }} />
            {showLabels && c.label && (
              <text x={p.x} y={p.y + 32} textAnchor="middle" className="mono" fontSize={13} style={{ fill: 'var(--muted)' }}>
                {c.label}
              </text>
            )}
          </motion.g>
        )
      })}

      {headPos && (
        <motion.g animate={{ x: headPos.x, y: headPos.y }} initial={false} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
          <rect x={-26} y={-44} width={52} height={20} rx={4} style={{ fill: 'var(--accent-2)' }} />
          <text x={0} y={-29.5} textAnchor="middle" className="mono" fontSize={12} fontWeight={700} style={{ fill: 'var(--bg)' }}>
            HEAD
          </text>
          <path d="M-5,-24 L5,-24 L0,-16 Z" style={{ fill: 'var(--accent-2)' }} />
        </motion.g>
      )}
    </svg>
  )
}
