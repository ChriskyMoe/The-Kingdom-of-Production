/** Player ranks from the game system (prompt §8). Each slide belongs to one rank. */
export const RANKS = [
  'New Game',
  'Git Apprentice',
  'Branch Explorer',
  'GitHub Multiplayer',
  'Pull Request Guardian',
  'CI Engineer',
  'CD Engineer',
  'Security Defender',
  'GitHub Explorer',
  'AI Agent Operator',
  'Agentic Developer',
] as const

/** XP earned for reaching a slide: 100 per slide, rounded to feel like a game. */
export const xpFor = (index: number) => index * 100
