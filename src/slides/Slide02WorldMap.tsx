import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Ground, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import type { SpriteName } from '../game/sprites'
import { sfx } from '../game/sound'
import { fx } from '../game/fx'

const NODES: { name: string; learn: string; icon: SpriteName; x: number; y: number }[] = [
  { name: 'Village', learn: 'Git: save points (commits)', icon: 'well', x: 70, y: 330 },
  { name: 'Forest of Timelines', learn: 'Branches', icon: 'treeTall', x: 210, y: 200 },
  { name: 'Town Square', learn: 'GitHub: the multiplayer world', icon: 'barrel', x: 360, y: 300 },
  { name: 'Checkpoint Gate', learn: 'Pull Requests + code review', icon: 'knight', x: 500, y: 170 },
  { name: 'Automaton Forge', learn: 'CI + GitHub Actions', icon: 'factory', x: 640, y: 290 },
  { name: 'Kingdom Roads', learn: 'CD + environments', icon: 'truck', x: 770, y: 150 },
  { name: 'Castle Walls', learn: 'Security', icon: 'shield', x: 900, y: 280 },
  { name: 'Robot Camp', learn: 'AI agents + MCP', icon: 'robot', x: 990, y: 130 },
  { name: 'Bug Lair', learn: 'Final boss: production bug', icon: 'bug', x: 1100, y: 300 },
]

/** Overworld map of the talk. "Begin journey" walks the hero through every region. */
export default function Slide02WorldMap() {
  const [at, setAt] = useState(0)
  const [touring, setTouring] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!touring) return
    if (at >= NODES.length - 1) {
      sfx('victory')
      fx.burst(NODES[at].x + 30, NODES[at].y + 150, 'confetti', 60)
      const t = window.setTimeout(() => setTouring(false), 0)
      return () => window.clearTimeout(t)
    }
    timer.current = window.setTimeout(() => setAt((a) => a + 1), 700)
    return () => window.clearTimeout(timer.current)
  }, [touring, at])

  const path = NODES.map((n, i) => `${i ? 'L' : 'M'}${n.x + 30},${n.y + 30}`).join(' ')
  return (
    <SlideLayout title="The world map" lead="Nine regions between you and a safe production release." badge="Click a region · begin">
      <div className="relative h-full overflow-hidden border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16]">
        <Ground name="grass" size={48} className="absolute inset-0" />
        {/* lake, trees and flowers for decoration */}
        <Ground name="water" size={48} className="absolute top-[360px] left-[520px] h-[96px] w-[240px] opacity-90" />
        {[
          [40, 40, 'tree'],
          [120, 420, 'treeRound'],
          [300, 60, 'treeTall'],
          [420, 420, 'flowers'],
          [600, 60, 'bush'],
          [850, 400, 'tree'],
          [1050, 420, 'treeOrange'],
          [1130, 40, 'mushroom'],
          [700, 420, 'flowers'],
          [260, 400, 'mushroom'],
        ].map(([x, y, n], i) => (
          <Sprite key={i} name={n as SpriteName} size={44} className="absolute" style={{ left: x as number, top: y as number }} />
        ))}
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={path} fill="none" strokeWidth={10} style={{ stroke: '#c98d3b' }} strokeLinejoin="round" />
          <path d={path} fill="none" strokeWidth={4} className="march" style={{ stroke: '#ffcd75' }} strokeLinejoin="round" />
        </svg>
        {NODES.map((n, i) => (
          <motion.button
            key={n.name}
            onClick={() => {
              setTouring(false)
              setAt(i)
              sfx('select')
            }}
            className="absolute flex flex-col items-center"
            style={{ left: n.x, top: n.y }}
            whileHover={{ y: -4 }}
            aria-label={`${n.name}: ${n.learn}`}
          >
            <span className={`grid h-[60px] w-[60px] place-items-center border-[3px] ${i <= at ? 'border-accent-2 bg-[#29366f]' : 'border-[#0b0c16] bg-[#333c57]'}`}>
              <Sprite name={n.icon} size={44} />
            </span>
            <span className="head mt-1 bg-[#0b0c16]/80 px-1.5 py-0.5 text-[8px] whitespace-nowrap text-text">{n.name}</span>
          </motion.button>
        ))}
        <Walker name="hero" x={NODES[at].x + 4} y={NODES[at].y - 58} size={52} speed={420} />

        <div className="rpg absolute right-4 bottom-4 w-[380px] px-4 py-3" aria-live="polite">
          <div className="head text-[10px] text-accent-2">
            REGION {at + 1} · {NODES[at].name.toUpperCase()}
          </div>
          <div className="pixel mt-2 text-[20px] text-text">{NODES[at].learn}</div>
        </div>
        <button
          className="btn btn-gold absolute bottom-4 left-4"
          onClick={() => {
            setAt(0)
            setTouring(true)
            sfx('start')
          }}
        >
          ▶ Begin journey
        </button>
      </div>
    </SlideLayout>
  )
}
