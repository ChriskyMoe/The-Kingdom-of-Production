import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { Castle, Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const DEFENSES = [
  { id: 'rules', name: 'Branch rules', what: 'No direct or force pushes to main.' },
  { id: 'checks', name: 'Required checks', what: 'CI must be green before merge.' },
  { id: 'review', name: 'Required reviews', what: 'At least one approval.' },
  { id: 'owners', name: 'CODEOWNERS', what: 'Experts review their area.' },
  { id: 'secrets', name: 'Push protection', what: 'Leaked keys are blocked.' },
  { id: 'env', name: 'Env protection', what: 'Only main + approval reach prod.' },
  { id: 'least', name: 'Least privilege', what: 'Tokens get only what they need.' },
  { id: 'signed', name: 'Signed commits', what: 'Prove who made a commit.' },
] as const
type DefId = (typeof DEFENSES)[number]['id']

const ATTACKS: { name: string; by: DefId; m: SpriteName }[] = [
  { name: 'Push straight to main', by: 'rules', m: 'ranger' },
  { name: 'Merge with failing tests', by: 'checks', m: 'slime' },
  { name: 'Merge with zero review', by: 'review', m: 'rat' },
  { name: 'Sneaky change to /auth', by: 'owners', m: 'ghost' },
  { name: 'Commit an API key', by: 'secrets', m: 'bat' },
  { name: 'Deploy a random branch', by: 'env', m: 'cyclops' },
  { name: 'Token with write-all', by: 'least', m: 'crab' },
  { name: 'Fake a teammate’s commit', by: 'signed', m: 'mimic' },
]
const WALL_X = 330

/** Monsters charge the castle. Each one is stopped by one specific defense — turn it off and it breaks through. */
export default function Slide16CastleDefense() {
  const [on, setOn] = useState<Set<DefId>>(new Set(DEFENSES.map((d) => d.id)))
  const [wave, setWave] = useState<{ a: number; n: number } | null>(null)
  const [result, setResult] = useState<{ a: number; blocked: boolean } | null>(null)
  const attack = wave ? ATTACKS[wave.a] : null
  const blocked = attack ? on.has(attack.by) : false

  const send = (i: number) => {
    setResult(null)
    setWave((w) => ({ a: i, n: (w?.n ?? 0) + 1 }))
    sfx('whoosh')
  }
  const land = () => {
    if (!attack || !wave) return
    setResult({ a: wave.a, blocked })
    if (blocked) {
      sfx('sword')
      fx.burst(WALL_X + 80, 330, 'hit', 26)
      fx.text(WALL_X + 80, 280, 'BLOCKED!', '#a7f070')
    } else {
      sfx('fail')
      fx.burst(170, 330, 'smoke', 40)
      fx.shake(12)
      fx.text(170, 260, 'BREACH!', '#ff5a6a')
    }
  }
  const toggle = (id: DefId) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      sfx('select')
      return n
    })

  return (
    <SlideLayout title="Castle defense: security" lead="Production is the castle. Every rule is a wall that stops one kind of attack." badge="Send a monster">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[280px] shrink-0" ground={60} sky={result && !result.blocked ? 'dusk' : 'day'}>
          <Castle className="absolute bottom-[60px] left-[20px]" size={46} width={5} />
          <span className="head absolute bottom-[22px] left-[60px] text-[9px] text-text">PRODUCTION</span>
          {/* the defense wall: shows which defenses are up */}
          <div className="absolute bottom-[60px] grid grid-cols-2" style={{ left: WALL_X }}>
            {DEFENSES.map((d) => (
              <div key={d.id} className="relative h-[34px] w-[34px]" title={d.name}>
                {on.has(d.id) && <Sprite name="brick" size={34} style={{ filter: attack?.by === d.id ? 'drop-shadow(0 0 6px #a7f070) brightness(1.4)' : undefined }} />}
              </div>
            ))}
          </div>
          <span className="head absolute bottom-[22px] text-[8px] text-text" style={{ left: WALL_X - 10 }}>
            WALL {on.size}/8
          </span>
          <AnimatePresence>
            {wave && attack && (
              <motion.div
                key={wave.n}
                className="absolute bottom-[60px]"
                initial={{ left: 1100 }}
                animate={{ left: blocked ? [1100, WALL_X + 40, WALL_X + 120] : [1100, 120] }}
                transition={{ duration: blocked ? 1.6 : 1.5, times: blocked ? [0, 0.75, 1] : undefined, ease: 'linear' }}
                onAnimationComplete={land}
                exit={{ opacity: 0 }}
              >
                <Sprite name={attack.m} size={64} className="walk" flip />
                <span className="head absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0b0c16]/80 px-1 text-[7px] whitespace-nowrap text-danger">{attack.name}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {result && (
            <motion.div
              key={wave?.n}
              className={`rpg pixel absolute top-3 right-3 w-[440px] px-3 py-2 text-[17px] ${result.blocked ? '' : '!border-danger'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className={`head block text-[9px] ${result.blocked ? 'text-accent' : 'text-danger'}`}>{result.blocked ? 'ATTACK BLOCKED' : 'BREACH — IT REACHED PRODUCTION'}</span>
              “{ATTACKS[result.a].name}” {result.blocked ? 'was stopped by' : 'needed'} <b className="text-accent-2">{DEFENSES.find((d) => d.id === ATTACKS[result.a].by)!.name}</b>.
            </motion.div>
          )}
        </Landscape>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
          <div className="rpg px-3 py-2">
            <div className="head mb-1.5 text-[9px] text-danger">⚔ SEND AN ATTACK</div>
            <div className="grid grid-cols-2 gap-1.5">
              {ATTACKS.map((a, i) => (
                <button key={a.name} className="pixel flex items-center gap-2 border-2 border-[#0b0c16] bg-[#3a2430] px-2 py-1 text-left text-[15px] text-text hover:bg-[#4d2e3e]" onClick={() => send(i)}>
                  <Sprite name={a.m} size={24} /> {a.name}
                </button>
              ))}
            </div>
          </div>
          <div className="rpg px-3 py-2">
            <div className="head mb-1.5 text-[9px] text-accent">🛡 DEFENSES (CLICK TO TOGGLE)</div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEFENSES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  aria-pressed={on.has(d.id)}
                  title={d.what}
                  className={`pixel flex items-center gap-2 border-2 px-2 py-1 text-left text-[15px] ${on.has(d.id) ? 'border-[#0b0c16] bg-[#24452f] text-text' : 'border-dashed border-line bg-transparent text-faint line-through'}`}
                >
                  <Sprite name="shield" size={22} className={on.has(d.id) ? '' : 'opacity-30'} /> {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
