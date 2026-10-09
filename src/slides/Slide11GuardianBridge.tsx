import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Ground, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

type Verdict = 'none' | 'comment' | 'changes' | 'approve'
const BUBBLE: Record<Verdict, string> = { none: '…', comment: '💬', changes: '✕', approve: '✓' }
const LABEL: Record<Verdict, string> = { none: 'waiting', comment: 'commented', changes: 'changes requested', approve: 'approved' }

/** A river and a drawbridge. Two guardians review; the bridge only lowers when the merge rules are met. */
export default function Slide11GuardianBridge() {
  const [alice, setAlice] = useState<Verdict>('none')
  const [owner, setOwner] = useState<Verdict>('none')
  const [needOwner, setNeedOwner] = useState(true)

  const problems: string[] = []
  if (alice === 'changes' || owner === 'changes') problems.push('changes requested')
  if (alice !== 'approve' && owner !== 'approve') problems.push('needs 1 approval')
  if (needOwner && owner !== 'approve') problems.push('needs code-owner review')
  const ok = problems.length === 0

  useEffect(() => {
    if (ok) {
      sfx('door')
      const t = window.setTimeout(() => {
        sfx('victory')
        fx.burst(900, 380, 'confetti', 50)
      }, 1400)
      return () => window.clearTimeout(t)
    }
  }, [ok])

  const set = (who: 'alice' | 'owner', v: Verdict) => {
    ;(who === 'alice' ? setAlice : setOwner)(v)
    sfx(v === 'approve' ? 'coin' : v === 'changes' ? 'error' : 'select')
    if (v === 'changes') fx.shake(5)
  }

  return (
    <SlideLayout title="The guardians: code review" lead="Two guardians must agree before the bridge to main comes down." badge="Play the guardians">
      <div className="flex h-full flex-col gap-3">
        <div className="relative h-[250px] shrink-0 overflow-hidden border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16]" style={{ background: 'linear-gradient(#3b5dc9,#41a6f6)' }}>
          <Ground name="grass" className="absolute bottom-0 left-0 h-[70px] w-[440px]" />
          <Ground name="water" className="absolute bottom-0 left-[440px] h-[70px] w-[300px]" />
          <Ground name="grass" className="absolute right-0 bottom-0 left-[740px] h-[70px]" />
          {/* drawbridge */}
          <motion.div
            className="absolute bottom-[60px] left-[440px] h-[14px] w-[300px] origin-left border-2 border-[#0b0c16] bg-[#8a5a2b]"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg,#8a5a2b 0 28px,#5c3a1c 28px 30px)' }}
            initial={false}
            animate={{ rotate: ok ? 0 : -75 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            aria-label={ok ? 'Bridge is down' : 'Bridge is up'}
          />
          <Guardian x={790} name="alice" sprite="knight" v={alice} />
          <Guardian x={1000} name="@team/security" sprite="heroKnight" v={owner} />
          <Walker name="heroKnight" x={ok ? 870 : 330} y={120} size={60} speed={240}>
            <div className="head text-center text-[7px] text-accent-2">PR #43</div>
          </Walker>
          <AnimatePresence>
            {ok && (
              <motion.div className="head absolute top-4 left-1/2 -translate-x-1/2 bg-[#0b0c16]/80 px-3 py-2 text-[14px] text-accent" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                MERGED INTO MAIN!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr_1fr] gap-4">
          <Panel name="alice" role="teammate" v={alice} onSet={(v) => set('alice', v)} />
          <Panel name="@team/security" role="code owner for /src/auth" v={owner} onSet={(v) => set('owner', v)} />
          <div className="flex flex-col gap-3">
            <div className="rpg px-4 py-3">
              <div className="head text-[9px] text-accent-2">.GITHUB/CODEOWNERS</div>
              <pre className="mono mt-1 text-[14px] text-text">/src/auth/  @team/security</pre>
              <label className="pixel mt-2 flex cursor-pointer items-center gap-2 text-[16px] text-muted">
                <input type="checkbox" checked={needOwner} onChange={(e) => setNeedOwner(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
                Require code-owner review
              </label>
            </div>
            <div className={`rpg flex-1 px-4 py-3 ${ok ? '!border-accent' : '!border-danger'}`}>
              <div className={`head text-[12px] ${ok ? 'text-accent' : 'text-danger'}`}>{ok ? 'BRIDGE DOWN' : 'BRIDGE UP'}</div>
              <p className="pixel mt-1 text-[16px] text-text">{ok ? 'Ready to merge.' : problems.join(' · ')}</p>
              <p className="pixel mt-1 text-[13px] text-faint">Rules come from branch protection / rulesets (private repos: Pro, Team or Enterprise).</p>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

function Guardian({ x, name, sprite, v }: { x: number; name: string; sprite: SpriteName; v: Verdict }) {
  return (
    <div className="absolute bottom-[70px] flex flex-col items-center" style={{ left: x }}>
      <motion.div
        key={v}
        className={`head mb-1 grid h-9 w-9 place-items-center border-[3px] border-[#0b0c16] text-[14px] ${v === 'approve' ? 'bg-accent text-[#0b0c16]' : v === 'changes' ? 'bg-danger text-text' : 'bg-text text-[#0b0c16]'}`}
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
      >
        {BUBBLE[v]}
      </motion.div>
      <Sprite name={sprite} size={60} className="bob" flip />
      <span className="head mt-0.5 bg-[#0b0c16]/80 px-1 text-[7px] text-text">{name}</span>
    </div>
  )
}

function Panel({ name, role, v, onSet }: { name: string; role: string; v: Verdict; onSet: (v: Verdict) => void }) {
  return (
    <div className="rpg flex flex-col px-4 py-3">
      <div className="head text-[11px] text-text">{name}</div>
      <div className="pixel text-[16px] text-muted">
        {role} · <span className={v === 'approve' ? 'text-accent' : v === 'changes' ? 'text-danger' : 'text-faint'}>{LABEL[v]}</span>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-1.5 pt-2">
        <button className="btn justify-center !px-1" onClick={() => onSet('comment')} aria-pressed={v === 'comment'}>
          💬
        </button>
        <button className="btn btn-red justify-center !px-1" onClick={() => onSet('changes')} aria-pressed={v === 'changes'} aria-label="Request changes">
          ✕
        </button>
        <button className="btn btn-primary justify-center !px-1" onClick={() => onSet('approve')} aria-pressed={v === 'approve'} aria-label="Approve">
          ✓
        </button>
      </div>
      <div className="pixel mt-1 grid grid-cols-3 text-center text-[12px] text-faint">
        <span>Comment</span>
        <span>Request changes</span>
        <span>Approve</span>
      </div>
    </div>
  )
}
