import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { useSteps } from '../hooks/useSteps'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

type Part = 'event' | 'runner' | 'steps' | 'result'

const YAML: { t: string; part?: Part }[] = [
  { t: 'name: CI' },
  { t: '' },
  { t: 'on:', part: 'event' },
  { t: '  pull_request:', part: 'event' },
  { t: '    branches: [main]', part: 'event' },
  { t: '' },
  { t: 'jobs:' },
  { t: '  test:' },
  { t: '    runs-on: ubuntu-latest', part: 'runner' },
  { t: '    steps:', part: 'steps' },
  { t: '      - uses: actions/checkout@v7', part: 'steps' },
  { t: '      - uses: actions/setup-node@v7', part: 'steps' },
  { t: '        with: { node-version: 22 }', part: 'steps' },
  { t: '      - run: npm ci', part: 'steps' },
  { t: '      - run: npm run lint', part: 'steps' },
  { t: '      - run: npm test', part: 'steps' },
  { t: '      - run: npm run build', part: 'steps' },
]

const PARTS: { id: Part; name: string; icon: SpriteName; text: string }[] = [
  { id: 'event', name: 'Event', icon: 'flagGold', text: 'A signal flag goes up: a PR to main is opened or updated.' },
  { id: 'runner', name: 'Runner', icon: 'robotGray', text: 'GitHub summons a fresh Ubuntu machine for the job.' },
  { id: 'steps', name: 'Steps', icon: 'staff', text: 'It casts each step: checkout, setup Node, install, lint, test, build.' },
  { id: 'result', name: 'Result', icon: 'crystal', text: 'A ✓ or ✕ check appears on the Pull Request.' },
]

export default function Slide13RuneCircle() {
  const [hover, setHover] = useState<Part | null>(null)
  const sim = useSteps(PARTS.length, 700, false)
  const lit = hover ?? (sim.running || sim.step > 0 ? PARTS[Math.max(0, sim.step - 1)].id : null)
  useEffect(() => {
    if (sim.step === 0) return
    const y = 190 + (sim.step - 1) * 112
    fx.burst(760, y, 'magic', 26)
    sfx(sim.step === PARTS.length ? 'victory' : 'whoosh')
  }, [sim.step])

  return (
    <SlideLayout title="GitHub Actions: the rune circle" lead="When an event happens, GitHub summons a runner and casts your workflow." badge="Hover the scroll · summon">
      <div className="grid h-full grid-cols-[1.05fr_1fr] gap-6">
        <div className="panel overflow-hidden">
          <div className="head border-b-[3px] border-[#f4f4f4] px-3 py-2 text-[9px] text-accent-2">SCROLL · .github/workflows/ci.yml</div>
          <pre className="mono px-1 py-2 text-[15px] leading-[1.5]">
            {YAML.map((l, i) => (
              <div
                key={i}
                onMouseEnter={() => l.part && setHover(l.part)}
                onMouseLeave={() => setHover(null)}
                className={`px-3 transition-colors ${l.part && lit === l.part ? 'bg-[#5d3d8a] text-text' : l.part ? 'text-text' : 'text-muted'}`}
              >
                {l.t || ' '}
              </div>
            ))}
          </pre>
        </div>
        <div className="flex flex-col gap-2.5">
          {PARTS.map((p, k) => (
            <div key={p.id} className="flex flex-col">
              <motion.button
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.id)}
                onBlur={() => setHover(null)}
                className={`flex items-center gap-4 border-[3px] px-4 py-2 text-left transition-colors ${lit === p.id ? 'border-magic bg-[#3d2f5e]' : 'border-[#0b0c16] bg-[#262b52]'}`}
                animate={lit === p.id ? { x: 6 } : { x: 0 }}
              >
                <motion.span animate={lit === p.id ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }} transition={{ duration: 0.5 }}>
                  <Sprite name={p.icon} size={48} style={{ filter: lit === p.id ? 'drop-shadow(0 0 8px #c58cf2)' : 'grayscale(0.7)' }} />
                </motion.span>
                <span>
                  <span className="head block text-[13px] text-accent-2">{p.name}</span>
                  <span className="pixel mt-1 block text-[18px] text-text">{p.text}</span>
                </span>
              </motion.button>
              {k < PARTS.length - 1 && <span className="head ml-8 text-[10px] leading-none text-magic">↓</span>}
            </div>
          ))}
          <button className="btn btn-primary mt-auto self-start" onClick={sim.replay}>
            ✦ Raise the flag: open a PR
          </button>
        </div>
      </div>
    </SlideLayout>
  )
}
