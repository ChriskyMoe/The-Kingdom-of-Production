import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Terminal, type TermLine } from '../components/Terminal'
import { Landscape } from '../game/Landscape'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx, stagePoint } from '../game/fx'
import { sfx } from '../game/sound'

const LINES: TermLine[] = [
  { cmd: 'git status', out: ['modified: src/profile.ts'] },
  { cmd: 'git diff', out: ['- level: 1', '+ level: 2'] },
  { cmd: 'git add .', out: [] },
  { cmd: 'git commit -m "Add player profile"', out: ['[main c90e5ab] Add player profile'], tone: 'ok' },
  { cmd: 'git log --oneline', out: ['c90e5ab Add player profile', 'b72d410 Add login page'], tone: 'ok' },
]
const ITEMS: { n: SpriteName; label: string }[] = [
  { n: 'potionGreen', label: 'profile.ts' },
  { n: 'swordBig', label: 'avatar.png' },
  { n: 'key', label: 'styles.css' },
]
const CHEAT = [
  ['git status', 'look at your inventory'],
  ['git diff', 'compare with the last save'],
  ['git add', 'put items in the bag'],
  ['git commit', 'save at the crystal'],
  ['git log', 'read the save history'],
]

const CAPTION = [
  'The save shrine. Press “Next spell” in the spellbook — one press, one spell.',
  'git status — three items in your inventory have changed (glowing).',
  'git diff — compare with the last save: red was removed, green was added.',
  'git add — you choose what goes in the bag. This bag is the STAGING AREA.',
  'git commit — the bag is sealed into the crystal. A new save point exists!',
  'git log — the scroll lists every save point, newest first.',
]

/** Save shrine: each git command changes the scene — glow, diff, bag, crystal, scroll. (push/pull come later, in the Town Square.) */
export default function Slide04SaveShrine() {
  const [step, setStep] = useState(0)
  const crystal = useRef<HTMLDivElement>(null)
  const onProgress = useCallback((d: number) => setStep(d), [])

  useEffect(() => {
    if (step === 1) sfx('latch')
    if (step === 2) sfx('page')
    if (step === 3) sfx('coin')
    if (step === 4) {
      sfx('save')
      const p = stagePoint(crystal.current)
      fx.burst(p.x, p.y, 'sparkle', 50)
      fx.text(p.x, p.y - 50, '+1 SAVE', '#a7f070')
    }
    if (step === 5) sfx('page')
  }, [step])

  return (
    <SlideLayout title="The first save" lead="Five spells: look, compare, pack, save, read." badge="Cast one spell at a time">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[215px] shrink-0" sky="cave" ground={44} groundTile="floor">
          {/* hero with inventory */}
          <Sprite name="heroKnight" size={72} className="bob absolute bottom-[40px] left-[60px]" />
          <div className="absolute bottom-[52px] left-[150px] flex gap-3">
            {ITEMS.map((it) => (
              <AnimatePresence key={it.label}>
                {step < 3 && (
                  <motion.div className="flex flex-col items-center" exit={{ x: 230, y: 10, scale: 0.4, opacity: 0 }} transition={{ duration: 0.6 }}>
                    <Sprite name={it.n} size={44} className={step >= 1 ? 'shine' : ''} />
                    <span className={`mono text-[11px] ${step >= 1 ? 'text-accent' : 'text-muted'}`}>{it.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* git diff: compare window */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div className="rpg absolute top-3 left-[140px] w-[300px] origin-bottom px-3 py-2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                <div className="head text-[8px] text-accent-2">DIFF · src/profile.ts</div>
                <div className="mono mt-1 text-[13px]">
                  <div className="bg-tint-red px-1 text-danger">- level: 1</div>
                  <div className="bg-tint-green px-1 text-accent">+ level: 2</div>
                  <div className="px-1 text-muted">{'  name: "Alex"'}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* bag = staging area */}
          <div className="absolute bottom-[46px] left-[440px] flex flex-col items-center">
            <motion.div animate={step === 3 ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.5 }}>
              <Sprite name="bag" size={64} />
            </motion.div>
            <span className="head mt-1 text-[8px] text-accent-2">STAGING{step === 3 ? ' (3)' : ''}</span>
          </div>
          <motion.span className="head absolute bottom-[86px] left-[540px] text-[22px] text-accent-2" animate={{ opacity: step >= 3 ? 1 : 0.25 }} aria-hidden>
            →
          </motion.span>

          {/* crystal = commit */}
          <div ref={crystal} className="absolute bottom-[40px] left-[600px] flex flex-col items-center">
            <Sprite name={step >= 4 ? 'crystal' : 'crystalOff'} size={84} className={step >= 4 ? 'float' : ''} />
            <span className="head text-[8px] text-accent">{step >= 4 ? 'c90e5ab' : 'SAVE CRYSTAL'}</span>
          </div>

          {/* scroll = log */}
          <AnimatePresence>
            {step >= 5 && (
              <motion.div className="rpg absolute top-3 left-[680px] w-[285px] origin-top px-3 py-2" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}>
                <div className="head text-[8px] text-accent-2">SAVE HISTORY</div>
                <div className="mono mt-1 space-y-0.5 text-[13px]">
                  <div className="text-accent">● c90e5ab Add player profile</div>
                  <div className="text-muted">● b72d410 Add login page</div>
                  <div className="text-muted">● a1f3c9e Create project</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </Landscape>
        <p className="pixel rpg-plain px-4 py-2 text-[19px] text-text" aria-live="polite">
          {CAPTION[Math.min(step, CAPTION.length - 1)]}
        </p>
        <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_1fr] gap-4">
          <Terminal lines={LINES} title="spellbook ~ git-quest-demo" onProgress={onProgress} className="h-full" dense stepMode />
          <div className="rpg px-4 py-2">
            {CHEAT.map(([g, m], i) => (
              <div key={g} className={`flex items-baseline justify-between gap-3 py-0.5 ${i < step ? 'text-accent' : ''}`}>
                <span className="mono text-[14px]">{g}</span>
                <span className={`pixel text-[16px] ${i < step ? 'text-accent' : 'text-muted'}`}>{m}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center justify-between gap-3 border-t-2 border-dashed border-line pt-1.5 text-faint">
              <span className="mono text-[14px]">🔒 git push / pull</span>
              <span className="pixel text-[16px]">unlocked when we reach GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
