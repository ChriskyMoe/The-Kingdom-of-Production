import { ChevronLeft, ChevronRight, Keyboard, List, Maximize, StickyNote, Volume2, VolumeX } from 'lucide-react'
import { RANKS, xpFor } from '../data/levels'
import { Sprite } from '../game/Sprite'
import { toggleMuted, useMuted } from '../game/sound'

type Props = {
  index: number
  count: number
  rank: number
  onPrev: () => void
  onNext: () => void
  onMenu: () => void
  onNotes: () => void
  onHelp: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')

const toggleFullscreen = () => {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void document.documentElement.requestFullscreen?.()
}

/** Bottom HUD: hero portrait, rank, XP bar, gold, slide counter and controls. */
export function GameHUD({ index, count, rank, onPrev, onNext, onMenu, onNotes, onHelp }: Props) {
  const muted = useMuted()
  const xp = xpFor(index)
  const levelProgress = rank / (RANKS.length - 1)
  const iconBtn = 'grid h-7 w-7 place-items-center border-2 border-[#0b0c16] bg-[#4a5486] text-text hover:bg-[#5a66a0] disabled:opacity-40'
  return (
    <footer className="no-print absolute right-0 bottom-0 left-0 flex h-11 items-center justify-between border-t-[3px] border-[#f4f4f4] bg-[#1a1c2c] px-4" style={{ boxShadow: 'inset 0 2px 0 #5d6db8' }}>
      <div className="flex items-center gap-2">
        <Sprite name={index >= 3 ? 'heroKnight' : 'hero'} size={32} />
        <span className="head text-[9px] text-accent-2">THE GIT QUEST II</span>
      </div>
      <div className="flex items-center gap-3" aria-label={`Rank ${rank}: ${RANKS[rank]}, ${xp} XP`}>
        <span className="head text-[9px] text-accent">LV{rank}</span>
        <span className="pixel text-[16px] text-text">{RANKS[rank]}</span>
        <span className="head text-[8px] text-muted">EXP</span>
        <span className="h-3 w-28 border-2 border-[#0b0c16] bg-[#333c57]" aria-hidden>
          <span className="block h-full bg-accent transition-[width] duration-500" style={{ width: `${levelProgress * 100}%` }} />
        </span>
        <span className="flex items-center gap-1">
          <Sprite name="coin" size={20} />
          <span className="head text-[9px] text-accent-2">{xp.toLocaleString('en-US')}</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button className={iconBtn} onClick={toggleMuted} aria-label={muted ? 'Sound off — press S to turn on' : 'Sound on — press S to mute'} title="Sound (S)">
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button className={iconBtn} onClick={onMenu} aria-label="World map / slide menu (M)" title="World map (M)">
          <List size={14} />
        </button>
        <button className={iconBtn} onClick={onNotes} aria-label="Presenter notes (N)" title="Notes (N)">
          <StickyNote size={14} />
        </button>
        <button className={iconBtn} onClick={onHelp} aria-label="Keyboard help (?)" title="Help (?)">
          <Keyboard size={14} />
        </button>
        <button className={iconBtn} onClick={toggleFullscreen} aria-label="Fullscreen (F)" title="Fullscreen (F)">
          <Maximize size={14} />
        </button>
        <button className={iconBtn} onClick={onPrev} aria-label="Previous slide" disabled={index === 0}>
          <ChevronLeft size={15} />
        </button>
        <span className="head w-16 text-center text-[9px] text-muted">
          {pad(index + 1)}/{pad(count)}
        </span>
        <button className={iconBtn} onClick={onNext} aria-label="Next slide" disabled={index === count - 1}>
          <ChevronRight size={15} />
        </button>
      </div>
    </footer>
  )
}
