import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { Castle, House, Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const STATIONS: { name: string; icon?: SpriteName; ci: boolean }[] = [
  { name: 'Source', icon: 'chest', ci: true },
  { name: 'Build', icon: 'anvil', ci: true },
  { name: 'Test', icon: 'robotGray', ci: true },
  { name: 'Security', icon: 'shield', ci: true },
  { name: 'Artifact', icon: 'crate', ci: false },
  { name: 'Staging', ci: false },
  { name: 'Approval', icon: 'knight', ci: false },
  { name: 'Production', ci: false },
]
const X = (i: number) => 30 + i * 142
const APPROVAL = 6

/** CI/CD as the kingdom's supply road: a cart carries the build from station to station up to the castle. */
export default function Slide14KingdomRoads() {
  const [auto, setAuto] = useState(false)
  const [at, setAt] = useState(-1)
  const [waiting, setWaiting] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (at < 0 || waiting) return
    if (at >= STATIONS.length - 1) {
      sfx('victory')
      fx.burst(X(7) + 100, 330, 'confetti', 70)
      return
    }
    if (at === APPROVAL - 1 && !auto) {
      timer.current = window.setTimeout(() => {
        setAt(APPROVAL)
        setWaiting(true)
        sfx('latch')
      }, 600)
      return () => window.clearTimeout(timer.current)
    }
    timer.current = window.setTimeout(() => {
      setAt((a) => a + 1)
      sfx('step')
    }, 600)
    return () => window.clearTimeout(timer.current)
  }, [at, waiting, auto])

  const ship = () => {
    window.clearTimeout(timer.current)
    setWaiting(false)
    setAt(0)
    sfx('start')
  }
  const approve = () => {
    setWaiting(false)
    sfx('coin')
    fx.text(X(APPROVAL) + 100, 250, 'APPROVED', '#a7f070')
  }

  return (
    <SlideLayout title="The kingdom road: CI/CD" lead="CI verifies every change. CD delivers it — the same checked road every time." badge="Ship a change">
      <div className="flex h-full flex-col gap-3">
        <div className="flex">
          <Bracket w={142 * 4} color="text-accent" title="CI · CONTINUOUS INTEGRATION" sub="automatically verify" />
          <Bracket w={142 * 4} color="text-accent-2" title="CD · DELIVERY / DEPLOYMENT" sub="automatically deliver" />
        </div>
        <Landscape className="h-[310px] shrink-0" ground={70}>
          <div className="absolute right-0 bottom-[70px] left-0 h-[12px] bg-[#e0a463]" aria-hidden />
          {STATIONS.map((s, i) => {
            const skip = auto && i === APPROVAL
            const reached = at >= i
            return (
              <div key={s.name} className="absolute bottom-[82px] flex w-[120px] flex-col items-center" style={{ left: X(i) }}>
                {s.name === 'Staging' ? (
                  <House size={36} roof="gray" />
                ) : s.name === 'Production' ? (
                  <Castle size={26} width={5} />
                ) : (
                  <Sprite name={s.icon!} size={64} className={skip ? 'opacity-30' : reached ? 'shine' : ''} />
                )}
              </div>
            )
          })}
          {STATIONS.map((s, i) => (
            <span key={s.name} className={`head absolute bottom-[30px] w-[120px] text-center text-[8px] ${auto && i === APPROVAL ? 'text-faint line-through' : at >= i ? (s.ci ? 'text-accent' : 'text-accent-2') : 'text-text'}`} style={{ left: X(i) }}>
              {s.name}
            </span>
          ))}
          {at >= 0 && (
            <motion.div className="absolute bottom-[78px]" initial={{ left: X(0) + 20 }} animate={{ left: X(Math.max(0, at)) + 30 }} transition={{ duration: 0.5 }}>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                <Sprite name="truck" size={64} />
              </motion.div>
            </motion.div>
          )}
          <AnimatePresence>
            {waiting && (
              <motion.div className="absolute top-3 flex flex-col items-center" style={{ left: X(APPROVAL) - 70 }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <div className="rpg pixel px-3 py-2 text-[16px]">
                  <span className="head block text-[8px] text-accent-2">RELEASE GUARD</span>
                  Waiting for a human…
                </div>
                <button className="btn btn-primary mt-2" onClick={approve}>
                  ✓ Approve release
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Landscape>
        <div className="flex items-center gap-3">
          <button className="btn btn-gold" onClick={ship}>
            ▶ Ship a change
          </button>
          <div className="flex border-[3px] border-[#0b0c16]" role="group" aria-label="CD mode">
            <button className={`btn !border-0 ${!auto ? 'btn-primary' : ''}`} onClick={() => setAuto(false)} aria-pressed={!auto}>
              Delivery (human approves)
            </button>
            <button className={`btn !border-0 ${auto ? 'btn-primary' : ''}`} onClick={() => setAuto(true)} aria-pressed={auto}>
              Deployment (automatic)
            </button>
          </div>
        </div>
        <p className="pixel rpg-plain px-4 py-2 text-[18px] text-muted">
          The exact stations <b className="text-text">vary by team</b>. The idea is the same: every change travels the same checked road.
        </p>
      </div>
    </SlideLayout>
  )
}

function Bracket({ w, color, title, sub }: { w: number; color: string; title: string; sub: string }) {
  return (
    <div className="px-3 text-center" style={{ width: w }}>
      <div className={`head text-[11px] ${color}`}>{title}</div>
      <div className="pixel text-[16px] text-muted">{sub}</div>
      <div className={`mt-1 h-3 border-x-[3px] border-t-[3px] ${color === 'text-accent' ? 'border-accent' : 'border-accent-2'}`} aria-hidden />
    </div>
  )
}
