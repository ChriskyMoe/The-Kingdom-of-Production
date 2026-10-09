import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Ground, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

type C = { id: string; lane: 0 | 1; parents: string[] }
const LANE_Y = [140, 330]
const START: C[] = [
  { id: 'A', lane: 0, parents: [] },
  { id: 'B', lane: 0, parents: ['A'] },
  { id: 'C', lane: 0, parents: ['B'] },
  { id: 'D', lane: 1, parents: ['C'] },
  { id: 'E', lane: 1, parents: ['D'] },
]
const IDS = 'FGHIJKLMN'.split('')
const GAP = 82

/** The forest path splits: main road and feature road. Commits are flags; HEAD is the hero. */
export default function Slide05ForestFork() {
  const [commits, setCommits] = useState(START)
  const [head, setHead] = useState('E')
  const [merged, setMerged] = useState(false)
  const pos = (id: string) => {
    const i = commits.findIndex((c) => c.id === id)
    return { x: 70 + i * GAP, y: LANE_Y[commits[i].lane] }
  }
  const tip = (lane: 0 | 1) => [...commits].reverse().find((c) => c.lane === lane)!.id
  const full = commits.length >= 10
  const nextId = IDS[commits.length - START.length]

  const add = (lane: 0 | 1, parents: string[]) => {
    if (full) return
    const c: C = { id: nextId, lane, parents }
    setCommits((cs) => [...cs, c])
    setHead(c.id)
    const x = 70 + commits.length * GAP
    window.setTimeout(() => {
      sfx('save')
      fx.burst(x + 60, LANE_Y[lane] + 190, 'sparkle', 18)
    }, 500)
  }
  const merge = () => {
    if (full) return
    add(0, [tip(0), tip(1)])
    setMerged(true)
    window.setTimeout(() => {
      sfx('victory')
      fx.burst(70 + commits.length * GAP + 60, LANE_Y[0] + 190, 'confetti', 50)
    }, 600)
  }
  const reset = () => {
    setCommits(START)
    setHead('E')
    setMerged(false)
  }
  const h = pos(head)

  return (
    <SlideLayout title="The forest of timelines" lead="“I want to experiment without destroying the current version.”" badge="Build the timelines">
      <div className="grid h-full grid-cols-[1fr_300px] gap-5">
        <div className="relative overflow-hidden border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16]">
          <Ground name="grass" size={48} className="absolute inset-0" />
          {/* forest decoration */}
          <div className="absolute top-0 left-0 flex" aria-hidden>
            {Array.from({ length: 18 }, (_, i) => (
              <Sprite key={i} name={i % 3 ? 'tree' : 'treeTall'} size={48} />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 flex" aria-hidden>
            {Array.from({ length: 18 }, (_, i) => (
              <Sprite key={i} name={i % 4 === 1 ? 'mushroom' : i % 2 ? 'bush' : 'treeRound'} size={48} />
            ))}
          </div>
          {/* roads */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            {commits.map((c) =>
              c.parents.map((p) => {
                const a = pos(p)
                const b = pos(c.id)
                const mx = (a.x + b.x) / 2
                const d = a.y === b.y ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
                return (
                  <g key={p + c.id}>
                    <motion.path d={d} fill="none" strokeWidth={30} strokeLinecap="round" style={{ stroke: '#8a5a2b' }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                    <motion.path d={d} fill="none" strokeWidth={22} strokeLinecap="round" style={{ stroke: '#e0a463' }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                  </g>
                )
              }),
            )}
          </svg>
          <span className="head absolute right-3 bg-[#0b0c16]/70 px-1 text-[9px] text-accent" style={{ top: LANE_Y[0] - 8 }}>
            MAIN ROAD
          </span>
          <span className="head absolute right-3 bg-[#0b0c16]/70 px-1 text-[9px] text-accent-2" style={{ top: LANE_Y[1] + 24 }}>
            FEATURE/PAYMENT
          </span>
          {/* commits as flags */}
          {commits.map((c) => {
            const p = pos(c.id)
            return (
              <motion.div key={c.id} className="absolute flex flex-col items-center" style={{ left: p.x - 18, top: p.y - 46 }} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                <Sprite name={c.parents.length > 1 ? 'flagBlue' : c.lane ? 'flagGold' : 'flagGreen'} size={36} />
                <span className="head bg-[#0b0c16]/75 px-1 text-[8px] text-text">{c.id}</span>
              </motion.div>
            )
          })}
          <Walker name="heroKnight" x={h.x - 24} y={h.y - 70} size={50} speed={360}>
            <div className="head mb-0.5 bg-magic px-1 text-center text-[7px] text-[#0b0c16]">HEAD</div>
          </Walker>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2">
            <button className="btn justify-center" onClick={() => add(0, [tip(0)])} disabled={full}>
              ⚑ Commit on main
            </button>
            <button className="btn justify-center" onClick={() => add(1, [tip(1)])} disabled={full}>
              ⚑ Commit on feature
            </button>
            <button className="btn btn-gold justify-center" onClick={merge} disabled={full}>
              ⇄ Merge feature → main
            </button>
            <button className="btn justify-center" onClick={reset}>
              ↺ Reset
            </button>
          </div>
          <div className="rpg flex-1 px-4 py-3">
            <div className="head text-[10px] text-accent-2">A BRANCH IS…</div>
            <p className="pixel mt-2 text-[19px] leading-snug text-text">an alternate timeline. Main keeps working while you experiment on your own road.</p>
            <p className="pixel mt-3 text-[16px] leading-snug text-muted">
              Technically: a lightweight movable pointer to a commit. <span className="text-magic">HEAD</span> = where you stand.
            </p>
            {merged && <p className="pixel mt-3 text-[17px] text-accent">Merged! The roads join — the experiment is now in main.</p>}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
