import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const ROLES: { name: string; icon: SpriteName; text: string }[] = [
  { name: 'System designer', icon: 'hammer', text: 'Shapes the architecture agents work inside.' },
  { name: 'Goal setter', icon: 'sign', text: 'Writes clear issues and acceptance criteria.' },
  { name: 'Reviewer', icon: 'staff', text: 'Reads every change that matters.' },
  { name: 'Decision maker', icon: 'shield', text: 'Chooses trade-offs; accepts or rejects.' },
  { name: 'Orchestrator', icon: 'robot', text: 'Splits work across people, agents and CI.' },
  { name: 'Responsible owner', icon: 'crystal', text: 'Owns the result in production.' },
]
const STATS: { name: string; before: number; after: number }[] = [
  { name: 'Typing code', before: 90, after: 55 },
  { name: 'System design', before: 35, after: 85 },
  { name: 'Review & judgment', before: 40, after: 90 },
  { name: 'Agent leadership', before: 5, after: 80 },
]

/** RPG job change: from "Coder" to "Agentic Developer". Roles unlock one by one. */
export default function Slide29ClassChange() {
  const [changed, setChanged] = useState(false)
  const [n, setN] = useState(0)
  const change = () => {
    setChanged(true)
    setN(0)
    sfx('levelup')
    fx.burst(250, 360, 'magic', 80)
    fx.shake(5)
  }
  const reveal = () => {
    if (!changed) return change()
    if (n >= ROLES.length) return
    setN(n + 1)
    sfx('coin')
    fx.burst(640 + (n % 3) * 200, 300 + Math.floor(n / 3) * 110, 'sparkle', 20)
    if (n + 1 === ROLES.length) sfx('victory')
  }
  return (
    <SlideLayout title="Class change: agentic developer" lead="“If AI can write the code, what should the developer become?”" badge={changed ? 'Reveal the new skills' : 'Change class'}>
      <div className="grid h-full grid-cols-[360px_1fr] gap-5">
        <div className="rpg flex flex-col items-center px-4 py-3">
          <div className="head text-[9px] text-accent-2">CLASS</div>
          <AnimatePresence mode="wait">
            <motion.div key={String(changed)} className="flex flex-col items-center" initial={{ scale: 0.3, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}>
              <div className="flex items-end">
                <Sprite name="heroKnight" size={120} className="float" style={changed ? { filter: 'drop-shadow(0 0 10px #ffcd75) drop-shadow(0 0 4px #ffcd75)' } : undefined} />
                {changed && <Sprite name="staff" size={64} className="float -ml-4" style={{ filter: 'drop-shadow(0 0 6px #c58cf2)' }} />}
              </div>
              <div className={`head mt-1 text-[13px] ${changed ? 'text-accent' : 'text-muted'}`}>{changed ? 'AGENTIC DEVELOPER' : 'CODER'}</div>
              <p className="pixel mt-2 text-center text-[17px] leading-snug text-text">
                {changed ? '“I design systems, define goals, review changes, manage agents, and control delivery.”' : '“I write code.”'}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto w-full space-y-1.5">
            <div className="head text-right text-[7px] text-faint">STATS ARE ILLUSTRATIVE</div>
            {STATS.map((s) => (
              <div key={s.name}>
                <div className="pixel flex justify-between text-[15px] text-muted">
                  <span>{s.name}</span>
                  <span className="head text-[8px]">{changed ? s.after : s.before}</span>
                </div>
                <div className="h-3 border-2 border-[#0b0c16] bg-[#333c57]">
                  <motion.div className={`h-full ${changed && s.after > s.before ? 'bg-accent' : 'bg-info'}`} animate={{ width: `${changed ? s.after : s.before}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-3">
            {ROLES.map((r, i) => (
              <div key={r.name} className="relative">
                <AnimatePresence>
                  {i < n ? (
                    <motion.div key="on" className="rpg absolute inset-0 flex flex-col px-4 py-3" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}>
                      <Sprite name={r.icon} size={48} />
                      <div className="head mt-2 text-[11px] text-accent">{r.name.toUpperCase()}</div>
                      <p className="pixel mt-1 text-[17px] leading-snug text-text">{r.text}</p>
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center border-[3px] border-dashed border-line">
                      <span className="head text-[22px] text-line">?</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-gold" onClick={reveal} disabled={changed && n >= ROLES.length}>
              {changed ? '★ Reveal next skill' : '✦ Change class'}
            </button>
            {changed && (
              <button
                className="btn"
                onClick={() => {
                  setN(ROLES.length)
                  sfx('victory')
                }}
              >
                Reveal all
              </button>
            )}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
