import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { Castle, House, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const STEPS = [
  { cmd: 'git switch -c feature/login', game: 'Open a new timeline', what: 'Creates the branch feature/login and moves you onto it.' },
  { cmd: 'git status', game: 'Check where you stand', what: 'Shows the current branch and which files changed.' },
  { cmd: 'git add .', game: 'Pack the bag', what: 'Stages your changes for the next save.' },
  { cmd: 'git commit -m "Add login form"', game: 'Save the game', what: 'A save point on feature/login — main is untouched.' },
  { cmd: 'git push -u origin feature/login', game: 'Send it to the castle', what: 'Uploads the branch to GitHub (origin). -u remembers the link.' },
]

/** Hero at home (laptop) vs. the GitHub castle (origin). Push flies the branch to the castle. */
export default function Slide07BranchCommands() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i === 3) {
      sfx('save')
      fx.burst(330, 330, 'sparkle', 24)
    }
    if (i === 4) {
      sfx('whoosh')
      const t = window.setTimeout(() => {
        sfx('coin')
        fx.burst(980, 300, 'confetti', 40)
      }, 1100)
      return () => window.clearTimeout(t)
    }
  }, [i])

  return (
    <SlideLayout title="Branch commands" lead="Five spells from a new idea to GitHub." badge="Step through">
      <div className="grid h-full grid-cols-[480px_1fr] gap-5">
        <div className="flex flex-col gap-2">
          {STEPS.map((s, k) => (
            <button
              key={s.cmd}
              onClick={() => setI(k)}
              aria-pressed={i === k}
              className={`mono flex items-center gap-3 border-[3px] px-3 py-2.5 text-left text-[15px] ${i === k ? 'border-accent bg-[#24452f] text-text' : k < i ? 'border-[#0b0c16] bg-[#262b52] text-muted' : 'border-[#0b0c16] bg-[#262b52] text-faint'}`}
            >
              <span className="head w-5 text-[10px] text-accent-2">{k + 1}</span>
              <span className="text-accent">$</span> {s.cmd}
            </button>
          ))}
          <button className="btn btn-primary mt-1 self-start" onClick={() => setI((v) => (v + 1) % STEPS.length)}>
            {i === STEPS.length - 1 ? '↺ Start over' : 'Next spell ▶'}
          </button>
          <AnimatePresence mode="wait">
            <motion.div key={i} className="rpg mt-auto px-4 py-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="head text-[10px] text-accent-2">{STEPS[i].game.toUpperCase()}</div>
              <p className="pixel mt-2 text-[19px] text-text">{STEPS[i].what}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <Landscape ground={70}>
          <House className="absolute bottom-[70px] left-[30px]" size={52} />
          <span className="head absolute bottom-[20px] left-[40px] text-[9px] text-text">YOUR LAPTOP</span>
          <Castle className="absolute right-[20px] bottom-[70px]" size={48} width={5} />
          <span className="head absolute right-[40px] bottom-[20px] text-[9px] text-text">GITHUB (ORIGIN)</span>
          <Walker name="heroKnight" x={200} bottom={64} size={60} />

          {/* branches as flags */}
          <div className="absolute top-[70px] left-[30px] flex gap-2">
            <Flag name="main" tone="flagGreen" />
            <Flag name="feature/login" tone="flagGold" faded={false} extra={i >= 3 ? '+1 save' : ''} />
          </div>
          <div className="absolute top-[70px] right-[30px] flex gap-2">
            <Flag name="main" tone="flagGreen" />
            <AnimatePresence>{i >= 4 && <Flag key="f" name="feature/login" tone="flagGold" delay={1.1} extra="+1 save" />}</AnimatePresence>
          </div>
          {i < 4 && <span className="pixel absolute top-[150px] right-[40px] text-[15px] text-text/80">castle doesn’t know feature/login yet</span>}

          {/* the push: a bag flies from the house to the castle */}
          <AnimatePresence>
            {i === 4 && (
              <motion.div
                key="bag"
                className="absolute"
                initial={{ left: 120, top: 200, opacity: 1 }}
                animate={{ left: [120, 380, 640], top: [200, 40, 180], opacity: [1, 1, 0] }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              >
                <Sprite name="bag" size={48} />
              </motion.div>
            )}
          </AnimatePresence>
        </Landscape>
      </div>
    </SlideLayout>
  )
}

function Flag({ name, tone, extra, delay = 0, faded }: { name: string; tone: 'flagGreen' | 'flagGold'; extra?: string; delay?: number; faded?: boolean }) {
  return (
    <motion.div className={`flex items-center gap-1 border-2 border-[#0b0c16] bg-[#1a1c2c]/80 px-2 py-1 ${faded ? 'opacity-50' : ''}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Sprite name={tone} size={26} />
      <span className="mono text-[13px] text-text">{name}</span>
      {extra && <span className="head text-[7px] text-accent">{extra}</span>}
    </motion.div>
  )
}
