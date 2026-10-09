import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprite } from '../game/Sprite'
import { fx, stagePoint } from '../game/fx'
import { sfx } from '../game/sound'
import { SlideLayout } from '../components/SlideLayout'

const RULES = [
  { t: 'Don’t casually work directly on main', a: 'Main Guard' },
  { t: 'Use branches for meaningful changes', a: 'Timeline Keeper' },
  { t: 'Use Pull Requests for reviewable changes', a: 'Checkpoint Master' },
  { t: 'Require appropriate CI checks', a: 'Automation Engineer' },
  { t: 'Review AI-generated code', a: 'NPC Supervisor' },
  { t: 'Give agents the minimum permissions they need', a: 'Least Privilege' },
  { t: 'Never put secrets in source code', a: 'Secret Keeper' },
  { t: 'Protect production', a: 'Castle Defender' },
  { t: 'Prefer small, reviewable PRs', a: 'Small Steps' },
  { t: 'Keep Git history understandable', a: 'Historian' },
]

export default function Slide28Achievements() {
  const [got, setGot] = useState<Set<number>>(new Set())
  const claim = (i: number, el: Element) => {
    if (got.has(i)) return
    setGot((s) => new Set(s).add(i))
    const p = stagePoint(el)
    sfx(got.size === RULES.length - 1 ? 'victory' : 'coin')
    fx.burst(p.x, p.y, got.size === RULES.length - 1 ? 'confetti' : 'coins', got.size === RULES.length - 1 ? 90 : 18)
    fx.text(p.x, p.y - 20, '+100 XP', '#ffcd75')
  }
  return (
    <SlideLayout title="Rules of the game" lead="Ten team rules. Agree on each one to unlock its achievement." badge="Unlock achievements">
      <div className="flex h-full flex-col gap-3">
        <div className="grid flex-1 grid-cols-2 gap-2.5">
          {RULES.map((r, i) => {
            const on = got.has(i)
            return (
              <motion.button
                key={r.t}
                onClick={(e) => claim(i, e.currentTarget)}
                aria-pressed={on}
                className={`flex items-center gap-3 border-[3px] px-3 text-left transition-colors ${on ? 'border-accent-2 bg-[#4a3d24]' : 'border-[#0b0c16] bg-[#262b52] hover:bg-[#30366a]'}`}
                animate={on ? { scale: [1, 1.03, 1] } : {}}
              >
                <span className={`head grid h-9 w-9 shrink-0 place-items-center border-2 text-[11px] ${on ? 'border-accent-2 text-accent-2' : 'border-line text-faint'}`}>{i + 1}</span>
                <span className="flex-1">
                  <span className="pixel block text-[18px] leading-snug text-text">{r.t}</span>
                  <span className={`head mt-0.5 block text-[7px] ${on ? 'text-accent-2' : 'text-faint'}`}>
                    {on ? `★ Achievement: ${r.a}` : 'locked achievement'}
                  </span>
                </span>
                <Sprite name={on ? 'chestOpen' : 'chest'} size={36} style={{ filter: on ? 'drop-shadow(0 0 6px #ffcd75)' : 'grayscale(0.8)' }} />
              </motion.button>
            )
          })}
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 flex-1 overflow-hidden border-[3px] border-[#0b0c16] bg-[#333c57]" aria-hidden>
            <motion.div className="h-full bg-accent-2" animate={{ width: `${(got.size / RULES.length) * 100}%` }} />
          </div>
          <span className="head text-[10px] text-accent-2">
            {got.size} / {RULES.length} · +{got.size * 100} XP
          </span>
          <button className="btn" onClick={() => setGot(new Set(RULES.map((_, i) => i)))}>
            Unlock all
          </button>
        </div>
      </div>
    </SlideLayout>
  )
}
