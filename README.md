# The Git Quest — The Kingdom of Production

Git / GitHub / CI/CD / AI-agents talk, played as a **16-bit RPG**. You are a pixel hero who
must reach the castle (production) safely. On the way you pass these places on the world map:

- **Village:** Git saves
- **Forest:** branches
- **Guild hall and town square:** GitHub
- **Gate:** pull requests
- **Guardians:** code review
- **Automaton forge:** CI
- **Kingdom road:** CD
- **Castle walls:** security

Then you recruit an **AI agent**, give it a tool belt (MCP), and defeat the final boss, the **PRODUCTION BUG**.

- 31 slides, 16:9, fixed 1280×720 stage scaled to any screen
- Every content slide is an animated scene: walking characters, particles, screen shake, typewriter dialogue
- 8-bit sound effects (starts muted, press **S** or **PRESS START**)
- Facts checked against official docs on 2026-10-09: [REFERENCES.md](REFERENCES.md)


## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build and preview (use this to present)

```bash
npm run build
npm run preview    # http://localhost:4173
```

`npm run lint` checks the code.

## Controls

| Key | Action |
|---|---|
| → · Space · PageDown | Next slide |
| ← · PageUp | Previous slide |
| Home / End | First / last slide |
| S | Sound on / off |
| F | Fullscreen |
| N | Presenter notes |
| M | World map: jump to any slide |
| ? or H | Keyboard help |
| Esc | Close an overlay |


## How it's built

```
src/game/        the small game engine
  sprites.ts     names for Kenney tiles (hero, robot, bug, castle parts…)
  Sprite.tsx     Sprite, Ground (tiled), House, Castle builders
  Walker.tsx     a character that walks to x/y with footsteps
  Dialogue.tsx   RPG text box with portrait + typewriter
  Landscape.tsx  sky, drifting clouds and ground strip
  fx.ts / FxLayer.tsx  particles (sparkle, smoke, confetti, hit, coins, magic), floating text, screen shake
  sound.ts       Howler.js sound effects + mute state
src/slides/      one scene per slide + index.ts (order, rank, area, demo markers)
src/notes/       presenter notes
```

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Howler.js, Lucide.
Fonts (Google Fonts): Press Start 2P (titles), Pixelify Sans (text), JetBrains Mono (code).

## Credits

Pixel art and sounds are by **Kenney** (kenney.nl): Tiny Town, Tiny Dungeon, Tiny Battle, RPG Audio,
Interface Sounds and Music Jingles. They're licensed **CC0 1.0** (public domain), so they're free to use and no
credit is required. The license text is in `public/assets/LICENSE-kenney.txt`.

