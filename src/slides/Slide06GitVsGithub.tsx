import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { House, Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const ROOMS: { name: string; icon: SpriteName; info: string }[] = [
  { name: 'Repository', icon: 'chest', info: 'Your Git repo, hosted and shared with the team.' },
  { name: 'Issues', icon: 'sign', info: 'The quest board: bugs, tasks and ideas.' },
  { name: 'Projects', icon: 'target', info: 'Boards and roadmaps to plan the campaign.' },
  { name: 'Pull Requests', icon: 'knight', info: 'Propose a change for others to inspect.' },
  { name: 'Review', icon: 'thumb', info: 'Teammates comment, approve or request changes.' },
  { name: 'Security', icon: 'shield', info: 'Dependabot, secret scanning, code scanning.' },
  { name: 'Actions', icon: 'factory', info: 'Robots that run automation when events happen.' },
  { name: 'CI/CD', icon: 'truck', info: 'Test every change, then deliver it.' },
  { name: 'Deploy', icon: 'flagRed', info: 'Environments with rules and approvals.' },
]

/** Git = your own house and chest (works offline). GitHub = the guild hall around it. A storm cuts the road. */
export default function Slide06GitVsGithub() {
  const [storm, setStorm] = useState(false)
  const [pick, setPick] = useState(3)
  const toggle = () => {
    setStorm((s) => !s)
    sfx(storm ? 'door' : 'glitch')
    if (!storm) fx.shake(8)
  }
  return (
    <SlideLayout title="Git vs GitHub" lead="Git is your own save system. GitHub is the guild hall built around it." badge="Summon a storm">
      <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-5">
        <div className="flex flex-col gap-3">
          <Landscape className="flex-1" ground={64} sky={storm ? 'night' : 'day'} clouds={!storm}>
            <House className="absolute bottom-[64px] left-[30px]" size={52} />
            <Sprite name="chest" size={52} className="absolute bottom-[64px] left-[200px]" />
            <Sprite name="heroKnight" size={60} className="bob absolute bottom-[64px] left-[270px]" />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {['commit', 'branch', 'merge', 'log / diff'].map((t) => (
                <span key={t} className="mono bg-[#0b0c16]/70 px-2 text-[14px] text-accent">
                  ✓ {t}
                </span>
              ))}
            </div>
            {storm && <Rain />}
          </Landscape>
          <div className="rpg px-4 py-3">
            <div className="head text-[11px] text-accent">GIT</div>
            <p className="pixel mt-1 text-[18px] text-text">Version control on your machine. {storm ? <b className="text-accent">Still works offline ✓</b> : 'Works with or without internet.'}</p>
          </div>
        </div>

        <div className="relative flex flex-col gap-3">
          <div className={`rpg relative flex-1 px-4 py-3 transition-[filter] ${storm ? 'grayscale' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="head text-[14px] text-accent-2">GITHUB GUILD HALL</span>
              <button className={`btn ml-auto ${storm ? 'btn-gold' : 'btn-red'}`} onClick={toggle} aria-pressed={storm}>
                {storm ? '☀ Clear the storm' : '⚡ Summon a storm'}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {ROOMS.map((r, i) => (
                <motion.button
                  key={r.name}
                  disabled={storm}
                  onClick={() => {
                    setPick(i)
                    sfx('select')
                  }}
                  aria-pressed={pick === i}
                  whileHover={storm ? {} : { y: -3 }}
                  className={`flex items-center gap-2 border-[3px] px-2 py-1.5 text-left ${pick === i && !storm ? 'border-accent-2 bg-[#3a3a5e]' : 'border-[#0b0c16] bg-[#333c57]'} disabled:cursor-not-allowed`}
                >
                  <Sprite name={r.icon} size={36} />
                  <span className="pixel text-[17px] text-text">{r.name}</span>
                </motion.button>
              ))}
            </div>
            <p className="pixel mt-3 text-[19px] text-text" aria-live="polite">
              {storm ? (
                <span className="text-danger">The road is flooded: no PRs, no Actions, no sharing — but your saves are safe at home.</span>
              ) : (
                <>
                  <b className="text-accent-2">{ROOMS[pick].name}:</b> {ROOMS[pick].info}
                </>
              )}
            </p>
            {storm && <Rain />}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

function Rain() {
  return (
    <AnimatePresence>
      <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <motion.span
            key={i}
            className="absolute h-4 w-0.5 bg-[#73eff7]/70"
            style={{ left: `${(i * 37) % 100}%` }}
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 0.6 + (i % 5) * 0.12, repeat: Infinity, delay: (i % 7) * 0.1, ease: 'linear' }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
