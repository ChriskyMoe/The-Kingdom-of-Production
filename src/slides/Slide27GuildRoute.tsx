import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { ACTOR, ActorLegend, type Actor } from '../components/AgentFlow'

type Node = { id: string; label: string; actor: Actor; steps: number[] }

const ROWS: Node[][] = [
  [{ id: 'issue', label: 'Issue', actor: 'human', steps: [1, 2] }],
  [{ id: 'plan', label: 'Human / AI plan', actor: 'human', steps: [2] }],
  [{ id: 'branch', label: 'Branch', actor: 'human', steps: [3] }],
  [{ id: 'code', label: 'Human + AI code', actor: 'ai', steps: [4, 5, 6] }],
  [{ id: 'pr', label: 'Pull Request', actor: 'human', steps: [7] }],
  [
    { id: 'ci', label: 'CI checks', actor: 'ci', steps: [8, 9] },
    { id: 'aireview', label: 'AI review', actor: 'ai', steps: [10] },
  ],
  [{ id: 'review', label: 'Human review', actor: 'human', steps: [11] }],
  [{ id: 'merge', label: 'Merge → Staging', actor: 'ci', steps: [12, 13, 14] }],
  [{ id: 'approve', label: 'Human approval', actor: 'human', steps: [15] }],
  [{ id: 'prod', label: 'Production', actor: 'ci', steps: [16, 17, 18] }],
]

const STEPS = [
  'Create Issue',
  'Define acceptance criteria',
  'Create feature branch',
  'Developer or AI agent implements',
  'Commit changes',
  'Push branch',
  'Open Pull Request',
  'Run CI',
  'Run security checks',
  'AI-assisted review where appropriate',
  'Human review',
  'Merge',
  'Deploy to staging',
  'Verify',
  'Approve production',
  'Deploy',
  'Monitor',
  'Roll back if necessary',
]

export default function Slide27GuildRoute() {
  const [sel, setSel] = useState<Node>(ROWS[3][0])
  return (
    <SlideLayout title="Our new team workflow" lead="Humans and AI share the work. Checks and approvals guard the path." badge="Click a stage">
      <div className="grid h-full min-h-0 grid-cols-[1.25fr_1fr] gap-6">
        <div className="relative grid min-h-0 grid-cols-2 gap-x-8">
          {[ROWS.slice(0, 5), ROWS.slice(5)].map((col, ci) => (
            <div key={ci} className="flex flex-col justify-between">
              {col.map((row, ri) => (
                <div key={ri} className="flex flex-col items-center">
                  <div className="flex w-full gap-2">
                    {row.map((n) => {
                      const a = ACTOR[n.actor]
                      return (
                        <button
                          key={n.id}
                          onClick={() => setSel(n)}
                          aria-pressed={sel.id === n.id}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-[16px] transition-colors ${a.cls} ${sel.id === n.id ? 'ring-2 ring-text/50' : ''}`}
                        >
                          <a.Icon size={16} aria-hidden />
                          <span className="text-text">{n.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {!(ci === 1 && ri === col.length - 1) && <span className="mono text-[14px] leading-tight text-faint">{ci === 0 && ri === col.length - 1 ? '↓ continue →' : '↓'}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <ActorLegend />
          <div className="hud panel min-h-0 flex-1 px-5 py-4">
            <AnimatePresence mode="wait">
              <motion.div key={sel.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="pixel text-[26px] text-text">{sel.label}</div>
                <div className="mono text-[13px] text-muted">owner: {ACTOR[sel.actor].name}</div>
                <ol className="mt-2 columns-2 gap-4">
                  {STEPS.map((s, i) => {
                    const on = sel.steps.includes(i + 1)
                    return (
                      <li key={s} className={`flex gap-1.5 py-0.5 text-[14px] leading-snug ${on ? 'font-semibold text-accent' : 'text-faint'}`}>
                        <span className="mono w-5 shrink-0 text-right">{i + 1}.</span> {s}
                      </li>
                    )
                  })}
                </ol>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
