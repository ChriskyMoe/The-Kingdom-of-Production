import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { sfx } from '../game/sound'
import { SlideLayout } from '../components/SlideLayout'

const TASKS = [
  { icon: 'sign' as SpriteName, name: 'Explain a repository', back: 'Read-only. Great first task for a new teammate.', risk: 1 },
  { icon: 'staff' as SpriteName, name: 'Investigate a bug', back: 'Reads code + logs, suggests a likely cause.', risk: 1 },
  { icon: 'swordBig' as SpriteName, name: 'Implement a feature', back: 'Works on a branch, opens a PR for review.', risk: 3 },
  { icon: 'hammer' as SpriteName, name: 'Refactor code', back: 'Tests must prove behaviour did not change.', risk: 3 },
  { icon: 'potionGreen' as SpriteName, name: 'Add tests', back: 'Check the tests test the right thing.', risk: 2 },
  { icon: 'knight' as SpriteName, name: 'Review code', back: 'A helper reviewer — not a replacement for a human.', risk: 1 },
  { icon: 'bag' as SpriteName, name: 'Respond to review', back: 'Pushes new commits to the same PR.', risk: 2 },
  { icon: 'bug' as SpriteName, name: 'Investigate CI failures', back: 'Reads the failing log, proposes a fix.', risk: 2 },
  { icon: 'crystal' as SpriteName, name: 'Update a Pull Request', back: 'Rebases, fixes conflicts, re-runs checks.', risk: 2 },
  { icon: 'chest' as SpriteName, name: 'Prepare documentation', back: 'Drafts README, changelog, comments.', risk: 1 },
]
const RISK = ['', 'low risk', 'medium risk', 'review carefully']
const RISK_CLS = ['', 'text-accent', 'text-warn', 'text-danger']

export default function Slide21QuestBoard() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const flip = (i: number) => {
    sfx('page')
    setFlipped((s) => {
      const n = new Set(s)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  }
  return (
    <SlideLayout title="AI as a teammate" lead="Quests you can hand to an agent — every one ends in human review." badge="Flip the cards">
      <div className="flex h-full flex-col gap-3">
        <div className="grid flex-1 grid-cols-5 gap-3" style={{ perspective: 1000 }}>
          {TASKS.map((t, i) => {
            const f = flipped.has(i)
            return (
              <button key={t.name} onClick={() => flip(i)} className="relative h-full" aria-pressed={f} aria-label={`${t.name}: ${t.back}`}>
                <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: f ? 180 : 0 }} transition={{ duration: 0.45 }}>
                  <div className="panel absolute inset-0 flex flex-col items-start justify-between p-4 text-left" style={{ backfaceVisibility: 'hidden' }}>
                    <Sprite name={t.icon} size={56} className="float" />
                    <span className="pixel text-[19px] leading-tight text-text">{t.name}</span>
                  </div>
                  <div
                    className="absolute inset-0 flex flex-col justify-between rounded-[10px] border border-accent-2 bg-tint-purple p-4 text-left"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="text-[15px] leading-snug text-text">{t.back}</span>
                    <span className={`mono text-[12px] ${RISK_CLS[t.risk]}`}>● {RISK[t.risk]}</span>
                  </div>
                </motion.div>
              </button>
            )
          })}
        </div>
        <p className="mono text-[12px] text-faint">
          Which agent features you have depends on your tools and plan (e.g. Copilot cloud agent needs a paid Copilot plan; Claude and Codex agents on GitHub are in public preview).
        </p>
      </div>
    </SlideLayout>
  )
}
