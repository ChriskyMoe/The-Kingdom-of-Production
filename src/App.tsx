import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useAnimationControls } from 'framer-motion'
import { SLIDES } from './slides'
import { NOTES } from './notes/notes'
import { useDeckNavigation } from './hooks/useDeckNavigation'
import { STAGE_H, STAGE_W, useStageScale } from './hooks/useStageScale'
import { SlideContext } from './components/SlideContext'
import { GameHUD } from './components/GameHUD'
import { LevelUp } from './components/LevelUp'
import { KeyboardHelp } from './components/KeyboardHelp'
import { SectionMenu } from './components/SectionMenu'
import { NotesPanel } from './components/NotesPanel'
import { ProgressBar } from './components/ProgressBar'
import { slideTransition } from './animations/variants'
import { FxLayer } from './game/FxLayer'
import { fx } from './game/fx'
import { sfx, toggleMuted } from './game/sound'

const NOTES_W = 400
const isPrint = new URLSearchParams(window.location.search).has('print')

export default function App() {
  return isPrint ? <PrintDeck /> : <Deck />
}

function Deck() {
  const count = SLIDES.length
  const { index, go, next, prev, overlay, setOverlay, notes, setNotes } = useDeckNavigation(count)
  const scale = useStageScale(notes ? NOTES_W : 0)
  const def = SLIDES[index]

  // Level-up toast when moving forward into a higher rank
  const lastRank = useRef(def.rank)
  const [levelUp, setLevelUp] = useState(false)
  useEffect(() => {
    if (def.rank > lastRank.current && def.rank > 0) {
      setLevelUp(true)
      sfx('levelup')
      fx.burst(640, 300, 'confetti', 80)
      const t = window.setTimeout(() => setLevelUp(false), 2200)
      lastRank.current = def.rank
      return () => window.clearTimeout(t)
    }
    lastRank.current = def.rank
    setLevelUp(false)
  }, [def.rank])

  const shaker = useAnimationControls()
  const onShake = useCallback(
    (p: number) => void shaker.start({ x: [0, -p, p, -p / 2, p / 2, 0], y: [0, p / 2, -p / 2, 0], transition: { duration: 0.35 } }),
    [shaker],
  )

  // S toggles sound; page turns make a soft whoosh
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) toggleMuted()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    sfx('page')
  }, [index])

  useEffect(() => {
    document.title = `${String(index + 1).padStart(2, '0')} · ${def.title} — The Git Quest II`
  }, [index, def.title])

  const left = notes ? (window.innerWidth - NOTES_W - STAGE_W * scale) / 2 : (window.innerWidth - STAGE_W * scale) / 2
  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 bg-bg">
        <main
          data-stage
          className="stage-bg absolute overflow-hidden"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            left: Math.max(0, left),
            top: (window.innerHeight - STAGE_H * scale) / 2,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          aria-roledescription="presentation"
          aria-label="The Git Quest II"
        >
          <ProgressBar value={(index + 1) / count} />
          <motion.div className="absolute inset-0" animate={shaker}>
          <AnimatePresence mode="wait">
            <motion.section
              key={def.id}
              className="absolute inset-0"
              variants={slideTransition}
              initial="enter"
              animate="center"
              exit="exit"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${def.title}`}
            >
              <SlideContext.Provider value={{ def, index, count }}>
                <def.Component />
              </SlideContext.Provider>
            </motion.section>
          </AnimatePresence>
          </motion.div>
          <FxLayer onShake={onShake} />
          <LevelUp rank={def.rank} show={levelUp} />
          {index > 0 && (
            <GameHUD
              index={index}
              count={count}
              rank={def.rank}
              onPrev={prev}
              onNext={next}
              onMenu={() => setOverlay('menu')}
              onNotes={() => setNotes(!notes)}
              onHelp={() => setOverlay('help')}
            />
          )}
          <AnimatePresence>
            {overlay === 'help' && <KeyboardHelp onClose={() => setOverlay('none')} />}
            {overlay === 'menu' && (
              <SectionMenu
                slides={SLIDES}
                index={index}
                onPick={(i) => {
                  go(i)
                  setOverlay('none')
                }}
                onClose={() => setOverlay('none')}
              />
            )}
          </AnimatePresence>
        </main>
        {notes && <NotesPanel notes={NOTES[def.id]} number={index + 1} onClose={() => setNotes(false)} />}
      </div>
    </MotionConfig>
  )
}

/** ?print — every slide stacked at 1280×720 so the browser can print to PDF. */
function PrintDeck() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])
  return (
    <MotionConfig reducedMotion="always">
      {SLIDES.map((def, index) => (
        <div key={def.id} className="print-slide stage-bg relative overflow-hidden" style={{ width: STAGE_W, height: STAGE_H }}>
          <SlideContext.Provider value={{ def, index, count: SLIDES.length }}>
            <def.Component />
          </SlideContext.Provider>
          <div className="mono absolute right-5 bottom-3 text-[12px] text-faint">
            The Git Quest II · {String(index + 1).padStart(2, '0')} / {SLIDES.length}
          </div>
        </div>
      ))}
    </MotionConfig>
  )
}
