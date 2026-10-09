import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import type { SkillBranch } from '../data/skillTree'
import { StatusBadge } from './StatusBadge'

/**
 * Skill tree: one column per branch. Nodes start locked; clicking unlocks a node
 * and shows its note. "Unlock all" reveals everything at once.
 */
export function SkillTree({ branches }: { branches: SkillBranch[] }) {
  const all = branches.flatMap((b) => b.nodes.map((n) => `${b.name}/${n.name}`))
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [sel, setSel] = useState<string | null>(null)

  const pick = (key: string) => {
    setOpen((s) => new Set(s).add(key))
    setSel(key)
  }
  const selected = sel
    ? branches.flatMap((b) => b.nodes.map((n) => ({ b, n }))).find(({ b, n }) => `${b.name}/${n.name}` === sel)
    : undefined

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-1 grid-cols-6 gap-2.5">
        {branches.map((b) => (
          <div key={b.name} className="flex flex-col">
            <div className="hud panel mb-2 px-2.5 py-1.5 text-center" style={{ borderColor: b.color }}>
              <span className="pixel text-[17px]" style={{ color: b.color }}>
                {b.name}
              </span>
            </div>
            <div className="relative flex flex-1 flex-col gap-2.5">
              <span className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: b.color, opacity: 0.25 }} aria-hidden />
              {b.nodes.map((n) => {
                const key = `${b.name}/${n.name}`
                const isOpen = open.has(key)
                return (
                  <motion.button
                    key={key}
                    onClick={() => pick(key)}
                    aria-pressed={sel === key}
                    aria-label={`${n.name}${isOpen ? '' : ' (locked)'}`}
                    className={`relative z-10 rounded-md border px-2.5 py-2.5 text-left transition-colors ${
                      isOpen ? 'bg-surface-2' : 'border-dashed border-line bg-bg text-faint'
                    } ${sel === key ? 'ring-2 ring-text/40' : ''}`}
                    style={isOpen ? { borderColor: b.color } : undefined}
                    animate={isOpen ? { scale: [1, 1.06, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="flex items-center gap-1.5 text-[15px] leading-tight font-medium">
                      {isOpen ? null : <Lock size={11} aria-hidden />}
                      <span className={isOpen ? 'text-text' : ''}>{n.name}</span>
                    </span>
                    {isOpen && (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {n.status.map((s) => (
                          <StatusBadge key={s} status={s} />
                        ))}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="panel flex min-h-[58px] items-center gap-4 px-4 py-2">
        <button className="btn shrink-0" onClick={() => setOpen(new Set(all))}>
          <Sparkles size={14} /> Unlock all
        </button>
        <span className="mono shrink-0 text-[13px] text-muted">
          {open.size} / {all.length} unlocked
        </span>
        <p className="text-[15px] leading-snug text-text" aria-live="polite">
          {selected ? (
            <>
              <span className="font-semibold" style={{ color: selected.b.color }}>
                {selected.n.name}:
              </span>{' '}
              {selected.n.note}
            </>
          ) : (
            <span className="text-muted">Click a locked skill to unlock it and see what it does.</span>
          )}
        </p>
      </div>
    </div>
  )
}
