import type { FC } from 'react'

export type SlideDef = {
  id: string
  /** Player rank 0–10 (data/levels.ts). */
  rank: number
  /** Chapter label shown in the slide kicker, e.g. "Branches". */
  chapter: string
  /** Place on the world map, e.g. "The Village". */
  area?: string
  /** Short name for the section menu. */
  title: string
  Component: FC
  /** Set when the presenter should switch to a terminal / browser. */
  demo?: string
}
