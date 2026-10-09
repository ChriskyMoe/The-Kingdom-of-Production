import type { CSSProperties } from 'react'
import { S, tileUrl, type SpriteName, type SpriteRef } from './sprites'

type Props = {
  name?: SpriteName
  sprite?: SpriteRef
  /** Rendered size in px (16 × scale). */
  size?: number
  flip?: boolean
  className?: string
  style?: CSSProperties
  alt?: string
}

/** One 16×16 Kenney tile drawn crisp at any size. */
export function Sprite({ name, sprite, size = 48, flip, className = '', style, alt = '' }: Props) {
  const ref = sprite ?? S[name!]
  return (
    <img
      src={tileUrl(ref)}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={{ imageRendering: 'pixelated', transform: flip ? 'scaleX(-1)' : undefined, ...style }}
    />
  )
}

/** A rectangle filled with a repeating tile (grass, dirt, water, stone…). */
export function Ground({ name, size = 48, className = '', style }: { name: SpriteName; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ backgroundImage: `url(${tileUrl(S[name])})`, backgroundSize: `${size}px ${size}px`, imageRendering: 'pixelated', ...style }}
    />
  )
}

/** A row of sprites laid edge to edge (roofs, walls, fences). */
export function SpriteRow({ names, size = 48, className = '' }: { names: SpriteName[]; size?: number; className?: string }) {
  return (
    <div className={`flex ${className}`} aria-hidden>
      {names.map((n, i) => (
        <Sprite key={i} name={n} size={size} />
      ))}
    </div>
  )
}

/** A small house built from tiles: roof row over a wall row. */
export function House({ size = 48, roof = 'red', door = true, className = '' }: { size?: number; roof?: 'red' | 'gray'; door?: boolean; className?: string }) {
  const r: SpriteName[] = roof === 'red' ? ['roofRedL', 'roofRed', 'roofRedR'] : ['roofGrayL', 'roofGray', 'roofGrayR']
  const w: SpriteName[] = roof === 'red' ? ['wallWood', door ? 'wallWoodDoor' : 'wallWood', 'wallWood'] : ['wallStone', door ? 'wallStoneDoor' : 'wallStone', 'wallStone']
  return (
    <div className={className} aria-hidden>
      <SpriteRow names={r} size={size} />
      <SpriteRow names={w} size={size} />
    </div>
  )
}

/** Side-view castle: brick body, crenellations, banners, flag towers and a double gate. */
export function Castle({ size = 48, open = false, width = 5, className = '' }: { size?: number; open?: boolean; width?: number; className?: string }) {
  const w = Math.max(4, width)
  const gateAt = Math.floor((w - 2) / 2)
  const crenel = size / 3
  return (
    <div className={className} aria-hidden style={{ width: w * size }}>
      {/* towers with flags */}
      <div className="relative flex justify-between" style={{ height: size * 0.9 }}>
        {[0, 1].map((t) => (
          <div key={t} className="relative flex flex-col items-center" style={{ width: size }}>
            <Sprite name={t ? 'flagRed' : 'flagGold'} size={size * 0.75} className="float" />
          </div>
        ))}
      </div>
      <div className="flex" style={{ height: crenel }}>
        {Array.from({ length: w * 2 }, (_, i) => (
          <div key={i} style={{ width: size / 2, height: crenel, background: i % 2 ? 'transparent' : '#566c86', boxShadow: i % 2 ? undefined : 'inset 0 -3px 0 #333c57' }} />
        ))}
      </div>
      <div className="flex">
        {Array.from({ length: w }, (_, i) => (
          <Sprite key={i} name={i === 1 || i === w - 2 ? 'brickWindow' : 'brick'} size={size} />
        ))}
      </div>
      <div className="flex">
        {Array.from({ length: w }, (_, i) =>
          i === gateAt ? (
            <div key={i} className="relative flex" style={{ width: size * 2, height: size }}>
              {open ? (
                <div className="h-full w-full" style={{ background: '#0b0c16', boxShadow: 'inset 0 0 0 4px #566c86' }} />
              ) : (
                <>
                  <Sprite name="doorL" size={size} />
                  <Sprite name="doorR" size={size} />
                </>
              )}
            </div>
          ) : i === gateAt + 1 ? null : (
            <Sprite key={i} name={i === 0 || i === w - 1 ? 'banner' : 'brick'} size={size} />
          ),
        )}
      </div>
    </div>
  )
}
