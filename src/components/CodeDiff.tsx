import { motion } from 'framer-motion'

export type DiffLine = { kind: '+' | '-' | ' '; text: string }

/** Unified diff view with green additions and red deletions. */
export function CodeDiff({ file, lines, className = '' }: { file: string; lines: DiffLine[]; className?: string }) {
  const adds = lines.filter((l) => l.kind === '+').length
  const dels = lines.filter((l) => l.kind === '-').length
  return (
    <div className={`panel overflow-hidden ${className}`}>
      <div className="mono flex items-center justify-between border-b border-line bg-surface-2 px-3 py-1.5 text-[13px]">
        <span className="text-text">{file}</span>
        <span>
          <span className="text-accent">+{adds}</span> <span className="text-danger">−{dels}</span>
        </span>
      </div>
      <div className="mono text-[14px] leading-[1.6]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`flex whitespace-pre ${l.kind === '+' ? 'bg-tint-green' : l.kind === '-' ? 'bg-tint-red' : ''}`}
          >
            <span className={`w-7 shrink-0 text-center ${l.kind === '+' ? 'text-accent' : l.kind === '-' ? 'text-danger' : 'text-faint'}`} aria-label={l.kind === '+' ? 'added' : l.kind === '-' ? 'removed' : undefined}>
              {l.kind}
            </span>
            <span className={l.kind === '-' ? 'text-muted line-through decoration-danger/50' : 'text-text'}>{l.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
