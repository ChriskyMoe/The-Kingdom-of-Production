import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { House, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const PLAYERS: { name: string; sprite: SpriteName; home: number; color: string }[] = [
  { name: 'Alex', sprite: 'heroKnight', home: 60, color: 'text-accent' },
  { name: 'Ben', sprite: 'viking', home: 250, color: 'text-info' },
  { name: 'Cy', sprite: 'girl', home: 900, color: 'text-accent-2' },
]
const BOARD_X = 560

/** Town square: one shared notice board (the GitHub repo). Push = walk over and pin your commit; pull = read the others. */
export default function Slide08Tavern() {
  const [withHub, setWithHub] = useState(true)
  const [walking, setWalking] = useState<number | null>(null)
  const [notes, setNotes] = useState<{ by: number; n: number }[]>([
    { by: 0, n: 1 },
    { by: 1, n: 1 },
  ])
  const [pulled, setPulled] = useState<Set<string>>(new Set(['1-1']))
  const [pulling, setPulling] = useState<string[] | null>(null)
  const keyOf = (n: { by: number; n: number }) => `${n.by}-${n.n}`
  // Teammates' commits Alex does not have yet
  const missing = notes.filter((n) => n.by !== 0 && !pulled.has(keyOf(n)))

  const push = (p: number) => {
    if (!withHub || walking !== null || pulling) return
    setWalking(p)
  }
  const pull = () => {
    if (!withHub || walking !== null || pulling) return
    if (missing.length === 0) {
      sfx('error')
      fx.text(140 + 30, 330, 'ALREADY UP TO DATE', '#a7f070')
      return
    }
    sfx('whoosh')
    setPulling(missing.map(keyOf))
  }
  const pullLanded = () => {
    if (!pulling) return
    const got = pulling.length
    setPulled((s) => new Set([...s, ...pulling]))
    setPulling(null)
    sfx('save')
    fx.burst(170, 360, 'magic', 30)
    fx.text(170, 300, `PULLED ${got}!`, '#c58cf2')
  }
  const arrive = (p: number) => {
    if (walking !== p) return
    setNotes((ns) => [...ns.slice(-5), { by: p, n: ns.filter((x) => x.by === p).length + 1 }])
    sfx('coin')
    fx.burst(BOARD_X + 110, 330, 'coins', 24)
    fx.text(BOARD_X + 110, 290, 'PUSHED!', '#ffcd75')
    window.setTimeout(() => setWalking(null), 400)
  }

  return (
    <SlideLayout title="GitHub = the multiplayer world" lead="One shared notice board. Everyone pushes and pulls." badge="Push · then pull">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="flex-1" ground={70} sky={withHub ? 'day' : 'dusk'}>
          <House className="absolute bottom-[70px] left-[20px]" size={44} />
          <House className="absolute bottom-[70px] left-[200px]" size={44} roof="gray" />
          <House className="absolute right-[20px] bottom-[70px]" size={44} />
          {withHub ? (
            <div className="absolute bottom-[70px] flex flex-col items-center" style={{ left: BOARD_X }}>
              <div className="rpg w-[220px] px-3 py-2">
                <div className="head text-center text-[8px] text-accent-2">GITHUB REPO · BOARD</div>
                <div className="mt-1 space-y-0.5">
                  <AnimatePresence initial={false}>
                    {notes.slice(-4).map((n) => (
                      <motion.div key={`${n.by}-${n.n}`} className={`mono text-[12px] ${PLAYERS[n.by].color}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        📌 commit by {PLAYERS[n.by].name} #{n.n}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="h-8 w-2 bg-[#8a5a2b]" />
            </div>
          ) : (
            <div className="pixel absolute bottom-[90px] left-[400px] w-[440px] text-center text-[20px] text-text" style={{ textShadow: '2px 2px 0 #0b0c16' }}>
              No shared board. Everyone emails <span className="mono text-accent-2">final_v2_REAL.zip</span>… whose copy is right?
            </div>
          )}
          {/* pull: teammates' commits fly from the board to Alex */}
          <AnimatePresence>
            {pulling &&
              pulling.map((k, i) => (
                <motion.div
                  key={k}
                  className="absolute z-10"
                  initial={{ left: BOARD_X + 90, bottom: 200 }}
                  animate={{ left: [BOARD_X + 90, 380, 150], bottom: [200, 300, 150] }}
                  transition={{ duration: 1.1, delay: i * 0.15, ease: 'easeInOut' }}
                  onAnimationComplete={i === pulling.length - 1 ? pullLanded : undefined}
                  exit={{ opacity: 0 }}
                >
                  <Sprite name="crystal" size={40} style={{ filter: 'hue-rotate(80deg)' }} />
                </motion.div>
              ))}
          </AnimatePresence>
          {withHub && (
            <div className={`head absolute z-10 bg-[#0b0c16]/80 px-1.5 py-0.5 text-[8px] ${missing.length ? 'text-warn' : 'text-accent'}`} style={{ left: 118, bottom: 160 }}>
              {missing.length ? `BEHIND BY ${missing.length}` : '✓ UP TO DATE'}
            </div>
          )}
          {PLAYERS.map((p, i) => (
            <Walker
              key={p.name}
              name={p.sprite}
              x={walking === i ? BOARD_X + (i === 2 ? 170 : 30) : p.home + 80}
              bottom={64}
              size={60}
              onArrive={() => arrive(i)}
            >
              <div className={`head text-center text-[8px] ${p.color}`}>{p.name}</div>
            </Walker>
          ))}
        </Landscape>
        <div className="flex items-center gap-3">
          <div className="flex border-[3px] border-[#0b0c16]" role="group" aria-label="World">
            <button className={`btn !border-0 ${!withHub ? 'btn-red' : ''}`} onClick={() => setWithHub(false)} aria-pressed={!withHub}>
              Without GitHub
            </button>
            <button className={`btn !border-0 ${withHub ? 'btn-primary' : ''}`} onClick={() => setWithHub(true)} aria-pressed={withHub}>
              With GitHub
            </button>
          </div>
          {PLAYERS.map((p, i) => (
            <button key={p.name} className="btn" onClick={() => push(i)} disabled={!withHub || walking !== null || !!pulling}>
              <Sprite name={p.sprite} size={22} /> {p.name} pushes ⬆
            </button>
          ))}
          <button className="btn btn-gold" onClick={pull} disabled={!withHub || walking !== null || !!pulling}>
            <Sprite name="heroKnight" size={22} /> Alex pulls ⬇
          </button>
          <p className="pixel ml-auto text-[16px] leading-tight text-muted">
            <b className="text-text">push</b> = pin your saves
            <br />
            <b className="text-text">pull</b> = bring others’ saves home
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
