import { useState } from 'react'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { Dialogue } from '../game/Dialogue'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const STATIONS: { name: string; icon: SpriteName; show: string; say: string }[] = [
  { name: 'Issue', icon: 'sign', show: '#42 Add user authentication', say: 'The king posts quest #42 on the board: “Add user authentication.” Everyone can see it.' },
  { name: 'Branch', icon: 'treeTall', show: '$ git switch -c feature/42-auth', say: 'You open a safe side road for this quest: feature/42-auth.' },
  { name: 'Code', icon: 'anvil', show: '+ export async function login(email, password) {…}', say: 'At the anvil you forge the login code.' },
  { name: 'Commit', icon: 'crystal', show: '$ git commit -m "Add login endpoint (#42)"', say: 'Save points along the way, each with a clear message.' },
  { name: 'Push', icon: 'bag', show: '$ git push -u origin feature/42-auth', say: 'You carry the branch up to GitHub.' },
  { name: 'Pull Request', icon: 'knight', show: 'PR #43 · Add user authentication · Closes #42', say: 'A Pull Request: a proposed change that others inspect before it enters the main branch.' },
]
const X0 = 60
const GAP = 172

/** The king gives a quest; the hero walks Issue → Branch → Code → Commit → Push → Pull Request. */
export default function Slide09TheQuest() {
  const [i, setI] = useState(0)
  const next = () => setI((v) => (v + 1) % STATIONS.length)
  return (
    <SlideLayout title="The quest: add user authentication" lead="Every change walks the same road to a Pull Request." badge="Walk the road">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[270px] shrink-0" ground={60}>
          <Sprite name="wizard" size={64} className="bob absolute bottom-[60px] left-[6px]" />
          <div className="absolute right-0 bottom-[60px] left-0 h-[10px] bg-[#e0a463]" aria-hidden />
          {STATIONS.map((s, k) => (
            <div key={s.name} className="absolute bottom-[70px] flex flex-col items-center" style={{ left: X0 + 70 + k * GAP }}>
              <Sprite name={s.icon} size={52} className={k === i ? 'shine' : ''} />
              <span className={`head mt-1 px-1 text-[8px] ${k <= i ? 'bg-[#0b0c16]/80 text-accent' : 'bg-[#0b0c16]/60 text-muted'}`}>
                {k < i ? '✓ ' : ''}
                {s.name}
              </span>
            </div>
          ))}
          <Walker
            name="heroKnight"
            x={X0 + 20 + i * GAP}
            y={150}
            size={60}
            onArrive={() => {
              sfx(i === STATIONS.length - 1 ? 'victory' : 'coin')
              fx.text(X0 + 160 + i * GAP, 230, i === STATIONS.length - 1 ? 'PR OPENED!' : '+100 XP', '#ffcd75')
            }}
          />
          <div className="mono absolute top-3 right-3 left-3 border-2 border-[#0b0c16] bg-[#0b0c16]/80 px-3 py-2 text-[16px] text-accent">{STATIONS[i].show}</div>
        </Landscape>
        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          <Dialogue speaker={i === 0 ? 'wizard' : i === 5 ? 'knight' : 'heroKnight'} name={i === 0 ? 'THE KING' : i === 5 ? 'GATEKEEPER' : 'YOU'} text={STATIONS[i].say} className="flex-1" tone={i === 5 ? 'gold' : 'normal'} />
          <div className="rpg flex w-[300px] flex-col px-4 py-3">
            <div className="head text-[10px] text-accent-2">QUEST LOG</div>
            <ul className="mt-2 space-y-1">
              {STATIONS.map((s, k) => (
                <li key={s.name} className={`pixel text-[17px] ${k <= i ? 'text-accent' : 'text-muted'}`}>
                  {k <= i ? '☑' : '☐'} {s.name}
                </li>
              ))}
            </ul>
            <button className="btn btn-primary mt-auto self-end" onClick={next}>
              {i === STATIONS.length - 1 ? '↺ Again' : 'Next ▶'}
            </button>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
