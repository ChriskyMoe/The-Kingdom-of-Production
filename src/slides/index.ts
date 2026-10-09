import type { SlideDef } from './types'
import Slide01Title from './Slide01Title'
import Slide02WorldMap from './Slide02WorldMap'
import Slide03SaveJourney from './Slide03SaveJourney'
import Slide04SaveShrine from './Slide04SaveShrine'
import Slide05ForestFork from './Slide05ForestFork'
import Slide06GitVsGithub from './Slide06GitVsGithub'
import Slide07BranchCommands from './Slide07BranchCommands'
import Slide08Tavern from './Slide08Tavern'
import Slide09TheQuest from './Slide09TheQuest'
import Slide10PullRequestGate from './Slide10PullRequestGate'
import Slide11GuardianBridge from './Slide11GuardianBridge'
import Slide12AutomatonForge from './Slide12AutomatonForge'
import Slide13RuneCircle from './Slide13RuneCircle'
import Slide14KingdomRoads from './Slide14KingdomRoads'
import Slide15ThreeTowns from './Slide15ThreeTowns'
import Slide16CastleDefense from './Slide16CastleDefense'
import Slide17SecurityTree from './Slide17SecurityTree'
import Slide18GithubSkillTree from './Slide18GithubSkillTree'
import Slide19NpcJoins from './Slide19NpcJoins'
import Slide20Evolution from './Slide20Evolution'
import Slide21QuestBoard from './Slide21QuestBoard'
import Slide22ToolBelt from './Slide22ToolBelt'
import Slide23ForgeAlarm from './Slide23ForgeAlarm'
import Slide24GateOfTrust from './Slide24GateOfTrust'
import Slide25LiveQuest from './Slide25LiveQuest'
import Slide26BossBattle from './Slide26BossBattle'
import Slide27GuildRoute from './Slide27GuildRoute'
import Slide28Achievements from './Slide28Achievements'
import Slide29ClassChange from './Slide29ClassChange'
import Slide30Ending from './Slide30Ending'
import Slide31Sources from './Slide31Sources'

/** Slide order. `rank` = player rank (data/levels.ts), `area` = place on the world map. */
export const SLIDES: SlideDef[] = [
  { id: 'title', rank: 0, chapter: 'New Game', area: 'Start', title: 'The Git Quest II', Component: Slide01Title },
  { id: 'world-map', rank: 0, chapter: 'New Game', area: 'World Map', title: 'The world map', Component: Slide02WorldMap },
  { id: 'save-journey', rank: 1, chapter: 'Git', area: 'The Village', title: 'Git = save system', Component: Slide03SaveJourney },
  { id: 'save-shrine', rank: 1, chapter: 'Git', area: 'Save Shrine', title: 'The first save', Component: Slide04SaveShrine },
  { id: 'forest-fork', rank: 2, chapter: 'Branches', area: 'Forest of Timelines', title: 'Forest of timelines', Component: Slide05ForestFork },
  { id: 'git-vs-github', rank: 3, chapter: 'GitHub', area: 'Guild Hall', title: 'Git vs GitHub', Component: Slide06GitVsGithub },
  { id: 'branch-commands', rank: 3, chapter: 'Branches + GitHub', area: 'Road to the Guild', title: 'Branch commands', Component: Slide07BranchCommands },
  { id: 'tavern', rank: 3, chapter: 'GitHub', area: 'Town Square', title: 'Multiplayer world', Component: Slide08Tavern },
  { id: 'the-quest', rank: 4, chapter: 'Pull Requests', area: 'The King’s Road', title: 'The quest', Component: Slide09TheQuest },
  { id: 'pr-gate', rank: 4, chapter: 'Pull Requests', area: 'Checkpoint Gate', title: 'PR = checkpoint', Component: Slide10PullRequestGate },
  { id: 'guardian-bridge', rank: 4, chapter: 'Code Review', area: 'Guardian Bridge', title: 'The guardians', Component: Slide11GuardianBridge },
  { id: 'automaton-forge', rank: 5, chapter: 'CI', area: 'Automaton Forge', title: 'The automaton forge', Component: Slide12AutomatonForge },
  { id: 'rune-circle', rank: 5, chapter: 'GitHub Actions', area: 'Rune Circle', title: 'GitHub Actions', Component: Slide13RuneCircle },
  { id: 'kingdom-roads', rank: 6, chapter: 'CI/CD', area: 'Kingdom Roads', title: 'The kingdom road', Component: Slide14KingdomRoads },
  { id: 'three-towns', rank: 6, chapter: 'CD', area: 'Three Towns', title: 'Environments', Component: Slide15ThreeTowns },
  { id: 'castle-defense', rank: 7, chapter: 'Security', area: 'Castle Walls', title: 'Castle defense', Component: Slide16CastleDefense },
  { id: 'security-tree', rank: 7, chapter: 'Security', area: 'Mage Tower', title: 'Security skill tree', Component: Slide17SecurityTree },
  { id: 'github-skill-tree', rank: 8, chapter: 'GitHub Skill Tree', area: 'Hall of Skills', title: 'Everything GitHub can do', Component: Slide18GithubSkillTree },
  { id: 'npc-joins', rank: 9, chapter: 'AI Enters the Game', area: 'Robot Camp', title: 'A wild AI agent', Component: Slide19NpcJoins },
  { id: 'evolution', rank: 9, chapter: 'AI Agents', area: 'Robot Camp', title: 'Evolution', Component: Slide20Evolution },
  { id: 'quest-board', rank: 9, chapter: 'AI + Pull Requests', area: 'Quest Board', title: 'AI as teammate', Component: Slide21QuestBoard },
  { id: 'tool-belt', rank: 9, chapter: 'MCP', area: 'Armory', title: 'MCP tool belt', Component: Slide22ToolBelt },
  { id: 'forge-alarm', rank: 9, chapter: 'Agentic CI/CD', area: 'Automaton Forge', title: 'When CI fails', Component: Slide23ForgeAlarm },
  { id: 'gate-of-trust', rank: 10, chapter: 'Human in the Loop', area: 'Gate of Trust', title: 'The gate of trust', Component: Slide24GateOfTrust },
  { id: 'live-quest', rank: 10, chapter: 'Agent Quest', area: 'Quest Board', title: 'The agent’s quest', Component: Slide25LiveQuest },
  { id: 'boss-battle', rank: 10, chapter: 'Final Boss', area: 'Bug Lair', title: 'Final boss', Component: Slide26BossBattle },
  { id: 'guild-route', rank: 10, chapter: 'Team Workflow', area: 'Guild Route', title: 'Our team workflow', Component: Slide27GuildRoute },
  { id: 'achievements', rank: 10, chapter: 'Rules of the Game', area: 'Hall of Fame', title: 'Team rules', Component: Slide28Achievements },
  { id: 'class-change', rank: 10, chapter: 'Agentic Development', area: 'Job Shrine', title: 'Class change', Component: Slide29ClassChange },
  { id: 'ending', rank: 10, chapter: 'Final Level', area: 'Throne Room', title: 'Quest complete', Component: Slide30Ending },
  { id: 'sources', rank: 10, chapter: 'References', area: 'Library', title: 'Sources', Component: Slide31Sources },
]
