import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape, TreeLine } from '../game/Landscape'
import { Castle, House, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const STOPS = [
  { save: 'SAVE 1', place: 'Started the village', hash: 'a1f3c9e', msg: 'Create project', x: 150 },
  { save: 'SAVE 2', place: 'Beat the forest', hash: 'b72d410', msg: 'Add login page', x: 450 },
  { save: 'SAVE 3', place: 'Found the sword', hash: 'c90e5ab', msg: 'Add player profile', x: 745 },
  { save: 'SAVE 4', place: 'Entered the castle', hash: 'd4417f2', msg: 'Fix profile avatar', x: 1010 },
]
const GROUND_Y = 192 // hero top inside the scene

/** SAVE 1–4: the hero walks village → forest → sword → castle, leaving a save crystal (commit) at each stop. */
export default function Slide03SaveJourney() {
  const [pos, setPos] = useState(-1) // where the hero is (-1 = before the village)
  const [saved, setSaved] = useState(-1) // furthest save made
  const [world, setWorld] = useState(-1) // which save the world (your files) currently shows
  const [msg, setMsg] = useState('Press SAVE 1 to start the journey.')
  const pending = useRef<number | null>(null)

  const press = (i: number) => {
    if (i <= saved) {
      // Loading an older save: teleport back (git switch to an old commit)
      setPos(i)
      setWorld(i)
      sfx('whoosh')
      fx.burst(STOPS[i].x + 40, 320, 'magic', 40)
      setMsg(
        i < saved
          ? `LOADED ${STOPS[i].save}: the world is back to “${STOPS[i].place}” — later changes are gone from your files, but ${STOPS[i + 1].save}${i + 1 < saved ? `–${STOPS[saved].save.slice(5)}` : ''} still exist. Load them any time.`
          : `LOADED ${STOPS[i].save}: you are at the latest save again.`,
      )
      return
    }
    if (i !== saved + 1) {
      sfx('error')
      setMsg(`Make ${STOPS[saved + 1].save} first — saves happen in order along the journey.`)
      return
    }
    pending.current = i
    setPos(i)
    setMsg(`Walking to ${STOPS[i].place.toLowerCase()}…`)
  }

  const arrive = () => {
    const i = pending.current
    if (i === null) return
    pending.current = null
    setSaved(i)
    setWorld(i)
    sfx('save')
    fx.burst(STOPS[i].x + 40, 300, 'sparkle', 36)
    fx.text(STOPS[i].x + 40, 270, 'SAVED!', '#a7f070')
    setMsg(`${STOPS[i].save} created → commit ${STOPS[i].hash} “${STOPS[i].msg}”.`)
  }

  const heroX = pos < 0 ? 20 : STOPS[pos].x + 10
  return (
    <SlideLayout title="Git = the save system" lead="Every commit is a save point you can go back to." badge="Press SAVE 1 → 4">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[300px] shrink-0" ground={60}>
          {/* 1 village */}
          <House className="absolute bottom-[60px] left-[60px]" size={44} />
          <Sprite name="well" size={40} className="absolute bottom-[60px] left-[200px]" />
          {/* 2 forest */}
          <TreeLine className="absolute bottom-[60px] left-[350px]" names={['treeTall', 'tree', 'treeRound', 'tree', 'treeTall']} size={48} />
          <Sprite name="slime" size={40} className={`absolute bottom-[60px] left-[580px] transition-opacity duration-500 ${world >= 1 ? 'opacity-0' : ''}`} />
          {/* 3 sword */}
          <div className="absolute bottom-[60px] left-[700px] flex items-end gap-1">
            <motion.div animate={world >= 2 ? { y: -14, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
              <Sprite name="swordBig" size={48} className="shine" />
            </motion.div>
            <Sprite name="rock" size={40} />
          </div>
          {/* 4 castle */}
          <Castle className="absolute right-[20px] bottom-[60px]" size={48} width={4} open={world >= 3} />

          {/* save crystals (commits) */}
          {STOPS.map((s, i) => (
            <AnimatePresence key={s.hash}>
              {i <= saved && (
                <motion.div
                  className="absolute flex flex-col items-center"
                  style={{ left: s.x + 14, top: 30 }}
                  initial={{ opacity: 0, y: -30, scale: 0.4 }}
                  animate={{ opacity: i > world ? 0.45 : 1, y: 0, scale: 1 }}
                >
                  <Sprite name="crystal" size={44} className={i > world ? '' : 'float'} style={{ filter: i > world ? 'grayscale(0.8)' : undefined }} />
                  <span className={`head mt-1 bg-[#0b0c16]/70 px-1 text-[8px] ${i > world ? 'text-muted' : 'text-accent'}`}>{s.hash}</span>
                  {i > world && <span className="head mt-0.5 bg-[#0b0c16]/70 px-1 text-[7px] text-magic">STILL SAVED</span>}
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          <Walker name={world >= 2 ? 'heroKnight' : 'hero'} x={heroX} y={GROUND_Y - 30} size={64} onArrive={arrive}>
            <div className="head mb-1 bg-magic px-1 text-center text-[8px] text-[#0b0c16]">HEAD</div>
          </Walker>
        </Landscape>

        <div className="grid grid-cols-4 gap-3">
          {STOPS.map((s, i) => {
            const done = i <= saved
            const here = i === pos
            return (
              <button
                key={s.save}
                onClick={() => press(i)}
                aria-pressed={here}
                className={`rpg flex flex-col items-start gap-1 px-4 py-3 text-left transition-transform hover:-translate-y-1 ${here ? '!border-accent' : ''}`}
              >
                <span className="flex w-full items-center justify-between">
                  <span className={`head text-[12px] ${done ? 'text-accent' : 'text-accent-2'}`}>{s.save}</span>
                  <Sprite name={done ? 'crystal' : 'crystalOff'} size={28} />
                </span>
                <span className="pixel text-[18px] text-text">{s.place}</span>
                <span className="mono text-[13px] text-muted">
                  {done ? (
                    <>
                      <span className="text-accent-2">{s.hash}</span> {s.msg}
                    </>
                  ) : (
                    'empty slot'
                  )}
                </span>
                {done && !here && <span className="head mt-1 text-[8px] text-magic">CLICK TO LOAD</span>}
              </button>
            )
          })}
        </div>
        <p className="pixel rpg-plain px-4 py-2 text-[19px] text-text" aria-live="polite">
          {msg}
        </p>
      </div>
    </SlideLayout>
  )
}
