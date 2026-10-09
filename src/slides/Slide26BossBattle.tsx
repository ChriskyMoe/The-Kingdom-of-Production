import { useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

type Choice = 'A' | 'B' | 'C'
const CHOICES: { id: Choice; text: string; verdict: string }[] = [
  { id: 'A', text: 'Investigate everything by hand', verdict: 'Safe, but slow. While you read logs alone, the bug keeps hitting customers.' },
  { id: 'B', text: 'Ask the AI agent to investigate and prepare a fix', verdict: 'Good move: the agent proposes a fix as a PR. Now use your skills to finish the boss.' },
  { id: 'C', text: 'Give the AI agent unrestricted production access', verdict: 'The bug grows stronger! No least privilege, live secrets exposed, no review, no audit trail — one wrong command makes it worse.' },
]
const SKILLS: { name: string; why: string; icon: SpriteName; dmg: number; by: 'hero' | 'robot' }[] = [
  { name: 'Deterministic CI', why: 'tests prove the fix', icon: 'sword', dmg: 20, by: 'robot' },
  { name: 'Security checks', why: 'no vulnerable package, no leaked secret', icon: 'shield', dmg: 15, by: 'robot' },
  { name: 'Human review', why: 'a person checks behaviour and risk', icon: 'staff', dmg: 20, by: 'hero' },
  { name: 'Protected deployment', why: 'staging, approval, then production', icon: 'key', dmg: 15, by: 'hero' },
  { name: 'Rollback + monitoring', why: 'undo fast and see problems', icon: 'potionRed', dmg: 10, by: 'hero' },
]

/** Final boss battle: choose a strategy, then use workflow "skills" to drain the PRODUCTION BUG's HP. */
export default function Slide26BossBattle() {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [used, setUsed] = useState<Set<number>>(new Set())
  const [manualHits, setManualHits] = useState(0)
  const boss = useAnimationControls()
  const hero = useAnimationControls()
  const robot = useAnimationControls()

  const base = choice === 'B' ? 80 : 100
  const hp = choice === 'C' ? 140 : choice === 'A' ? Math.max(0, 100 - manualHits * 5) : Math.max(0, base - [...used].reduce((s, i) => s + SKILLS[i].dmg, 0))
  const won = choice === 'B' && hp === 0
  const slowWin = choice === 'A' && hp === 0

  const hitBoss = (dmg: number) => {
    void boss.start({ x: [0, 14, -10, 6, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'], transition: { duration: 0.4 } })
    fx.burst(960, 300, 'hit', 24)
    fx.text(960, 230, `-${dmg}`, '#ff5a6a')
  }

  const pick = (c: Choice) => {
    setChoice(c)
    setUsed(new Set())
    setManualHits(0)
    if (c === 'C') {
      sfx('boss')
      fx.shake(16)
      fx.burst(960, 300, 'smoke', 50)
    } else if (c === 'B') {
      sfx('levelup')
      fx.burst(950, 300, 'magic', 20)
      hitBoss(20)
    } else sfx('select')
  }

  const castSkill = async (i: number) => {
    if (choice !== 'B' || used.has(i)) return
    const sk = SKILLS[i]
    const actor = sk.by === 'hero' ? hero : robot
    sfx('sword')
    await actor.start({ x: [0, 420, 0], transition: { duration: 0.55, times: [0, 0.5, 1] } })
    hitBoss(sk.dmg)
    sfx('hit')
    const next = new Set(used).add(i)
    setUsed(next)
    const left = base - [...next].reduce((s, k) => s + SKILLS[k].dmg, 0)
    if (left <= 0) {
      window.setTimeout(() => {
        sfx('victory')
        fx.burst(960, 300, 'confetti', 120)
        fx.burst(960, 300, 'coins', 40)
      }, 500)
    }
  }

  const manualAttack = async () => {
    sfx('sword')
    await hero.start({ x: [0, 420, 0], transition: { duration: 0.9 } })
    hitBoss(5)
    setManualHits((n) => n + 1)
    if (manualHits + 1 >= 20) {
      window.setTimeout(() => sfx('levelup'), 400)
      return
    }
    window.setTimeout(() => {
      fx.shake(6)
      fx.text(260, 220, 'customers -100', '#ff5a6a')
      sfx('hit')
    }, 500)
  }

  const reset = () => {
    setChoice(null)
    setUsed(new Set())
    setManualHits(0)
  }

  return (
    <SlideLayout title="FINAL BOSS: production is broken" lead="🚨 Checkout is failing for real customers. Choose your move." badge="Battle!">
      <div className="flex h-full flex-col gap-3">
        {/* arena */}
        <div className="relative h-[280px] shrink-0 overflow-hidden border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16]" style={{ background: choice === 'C' ? 'linear-gradient(#5d275d,#b13e53)' : 'linear-gradient(#1a1c2c,#29366f 60%,#333c57)' }}>
          <div className="absolute right-0 bottom-0 left-0 h-[60px]" style={{ background: 'repeating-linear-gradient(90deg,#333c57 0 48px,#2a3048 48px 96px)' }} />
          {/* party */}
          <motion.div className="absolute bottom-[50px] left-[120px]" animate={hero}>
            <Sprite name="heroKnight" size={84} className="bob" />
          </motion.div>
          <motion.div className="absolute bottom-[50px] left-[230px]" animate={robot}>
            <Sprite name="robot" size={84} className="bob" style={{ filter: choice === 'C' ? 'drop-shadow(0 0 10px #ff5a6a) hue-rotate(-60deg)' : undefined }} />
          </motion.div>
          {/* boss */}
          <AnimatePresence>
            {!won && !slowWin && (
              <motion.div className="absolute right-[140px] bottom-[30px]" exit={{ opacity: 0, rotate: 90, scale: 0.4, transition: { duration: 0.8 } }}>
                <motion.div animate={boss}>
                  <motion.div animate={{ scale: choice === 'C' ? 1.35 : 1 }} transition={{ type: 'spring', stiffness: 120 }} style={{ transformOrigin: 'bottom center' }}>
                    <Sprite name="bug" size={176} className="float" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* boss HP */}
          <div className="rpg absolute top-3 right-3 w-[360px] px-3 py-2">
            <div className="flex items-baseline justify-between">
              <span className="head text-[11px] text-danger">PRODUCTION BUG</span>
              <span className={`head text-[10px] ${hp > 100 ? 'text-danger' : 'text-text'}`}>HP {hp}%</span>
            </div>
            <div className="mt-1 h-4 border-[3px] border-[#0b0c16] bg-[#333c57]" role="meter" aria-label="Boss HP" aria-valuemin={0} aria-valuemax={140} aria-valuenow={hp}>
              <motion.div className="h-full bg-danger" animate={{ width: `${Math.min(100, hp)}%` }} />
            </div>
            {hp > 100 && <div className="head blink mt-1 text-[8px] text-danger">ENRAGED — IT GOT STRONGER</div>}
          </div>
          <div className="rpg absolute top-3 left-3 px-3 py-2">
            <div className="head text-[9px] text-accent">PARTY</div>
            <div className="pixel text-[16px] text-text">You (Lv 10) · AI agent</div>
          </div>
          <AnimatePresence>
            {slowWin && (
              <motion.div className="rpg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 text-center !border-accent-2" initial={{ scale: 0 }} animate={{ scale: [0, 1.1, 1] }}>
                <div className="head text-[20px] text-accent-2" style={{ textShadow: '3px 3px 0 #0b0c16' }}>
                  SLOW VICTORY…
                </div>
                <div className="pixel mt-2 text-[19px] text-text">You won alone — after 20 turns. Customers waited the whole time.</div>
                <div className="head mt-2 text-[9px] text-muted">+100 XP · TRY STRATEGY B</div>
              </motion.div>
            )}
            {won && (
              <motion.div className="rpg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 text-center" initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }}>
                <div className="head text-[26px] text-accent-2" style={{ textShadow: '3px 3px 0 #0b0c16' }}>
                  VICTORY!
                </div>
                <div className="pixel mt-2 text-[19px] text-text">B + CI + security + human review + protected deploy</div>
                <div className="head mt-2 text-[10px] text-accent">+1000 XP</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* command menus */}
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.1fr] gap-4">
          <div className="rpg flex flex-col gap-1.5 px-3 py-2">
            <div className="head text-[9px] text-accent-2">1 · STRATEGY</div>
            {CHOICES.map((c) => (
              <button
                key={c.id}
                onClick={() => pick(c.id)}
                aria-pressed={choice === c.id}
                className={`pixel flex items-center gap-2 border-2 px-2 py-1 text-left text-[16px] ${choice === c.id ? (c.id === 'C' ? 'border-danger bg-[#4d2430]' : c.id === 'B' ? 'border-accent bg-[#24452f]' : 'border-accent-2 bg-[#4a3d24]') : 'border-[#0b0c16] bg-[#333c57] hover:bg-[#3e486a]'}`}
              >
                <span className="head w-5 text-[11px] text-accent-2">{choice === c.id ? '▶' : c.id}</span>
                {c.text}
              </button>
            ))}
            {choice && <p className={`pixel mt-1 text-[15px] leading-snug ${choice === 'C' ? 'text-danger' : choice === 'B' ? 'text-accent' : 'text-accent-2'}`}>{CHOICES.find((c) => c.id === choice)!.verdict}</p>}
          </div>
          <div className="rpg flex flex-col gap-1.5 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="head text-[9px] text-accent-2">2 · SKILLS {choice !== 'B' && <span className="text-faint">(choose B)</span>}</span>
              <button className="btn !px-2 !py-1 !text-[8px]" onClick={reset}>
                ↺ RESET
              </button>
            </div>
            {choice === 'A' ? (
              <button className="btn btn-gold self-start" onClick={manualAttack} disabled={hp === 0}>
                ⚔ Attack alone (−5) · turn {Math.min(manualHits + 1, 20)}/20
              </button>
            ) : (
              SKILLS.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => castSkill(i)}
                  disabled={choice !== 'B' || used.has(i)}
                  className={`pixel flex items-center gap-2 border-2 px-2 py-0.5 text-left text-[15px] disabled:cursor-not-allowed ${used.has(i) ? 'border-accent bg-[#24452f] text-accent' : 'border-[#0b0c16] bg-[#333c57] text-text hover:bg-[#3e486a] disabled:opacity-40'}`}
                >
                  <Sprite name={s.icon} size={24} />
                  <b>{s.name}</b>
                  <span className="text-muted">— {s.why}</span>
                  <span className="head ml-auto text-[9px] text-danger">−{s.dmg}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
