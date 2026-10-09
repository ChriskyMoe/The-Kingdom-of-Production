import type { ReactNode } from 'react'
import { Ground, Sprite } from './Sprite'
import type { SpriteName } from './sprites'

type Props = {
  /** Height of the grass strip at the bottom, in px. */
  ground?: number
  groundTile?: SpriteName
  sky?: 'day' | 'dusk' | 'night' | 'cave'
  clouds?: boolean
  className?: string
  children?: ReactNode
}

const SKY = {
  day: 'linear-gradient(#3b5dc9, #41a6f6 70%, #73eff7)',
  dusk: 'linear-gradient(#29366f, #5d275d 55%, #ef7d57)',
  night: 'linear-gradient(#0b0c16, #1a1c2c 50%, #29366f)',
  cave: 'linear-gradient(#1a1c2c, #333c57)',
}

/** A side-on game world: sky, drifting clouds and a tiled ground strip. Children are positioned absolutely. */
export function Landscape({ ground = 96, groundTile = 'grass', sky = 'day', clouds = true, className = '', children }: Props) {
  return (
    <div className={`${className.includes('absolute') ? '' : 'relative'} overflow-hidden border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16] ${className}`} style={{ background: SKY[sky] }}>
      {clouds && sky !== 'cave' && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[0, 1, 2].map((i) => (
            <div key={i} className="drift absolute" style={{ top: 18 + i * 34, animationDelay: `${-i * 22}s`, animationDuration: `${55 + i * 15}s` }}>
              <Cloud scale={i === 1 ? 0.7 : 1} />
            </div>
          ))}
        </div>
      )}
      <Ground name={groundTile} size={48} className="absolute right-0 bottom-0 left-0" style={{ height: ground }} />
      <div aria-hidden className="absolute right-0 left-0" style={{ bottom: ground - 4, height: 4, background: 'rgb(0 0 0 / 0.15)' }} />
      {children}
    </div>
  )
}

/** Chunky pixel cloud made of rectangles. */
function Cloud({ scale = 1 }: { scale?: number }) {
  return (
    <svg width={120 * scale} height={40 * scale} viewBox="0 0 30 10" shapeRendering="crispEdges" aria-hidden>
      <rect x="6" y="2" width="14" height="6" fill="#f4f4f4" />
      <rect x="2" y="5" width="26" height="5" fill="#f4f4f4" />
      <rect x="10" y="0" width="8" height="2" fill="#f4f4f4" />
      <rect x="2" y="9" width="26" height="1" fill="#94b0c2" />
    </svg>
  )
}

/** A decorative line of trees/bushes for backgrounds. */
export function TreeLine({ names = ['tree', 'treeRound', 'bush', 'tree', 'treeTall', 'bush'] as SpriteName[], size = 48, className = '' }: { names?: SpriteName[]; size?: number; className?: string }) {
  return (
    <div className={`flex ${className}`} aria-hidden>
      {names.map((n, i) => (
        <Sprite key={i} name={n} size={size} />
      ))}
    </div>
  )
}
