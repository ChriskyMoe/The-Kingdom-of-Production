/**
 * Presenter notes for every slide (press N; also exported to the speaker script).
 * Written in simple, spoken English. V2 tells the talk as one game story.
 */
export type SlideNotes = {
  say: string[]
  understand: string
  question?: string
  demo?: string
  click?: string
  next: string
}

export const NOTES: Record<string, SlideNotes> = {
  title: {
    say: [
      'Welcome to The Git Quest, part two: the Kingdom of Production. Today you are the player.',
      'Your mission: ship a new feature to production without breaking the kingdom. You start as a New Developer with zero XP.',
    ],
    understand: 'This talk is one game. Every tool we meet makes shipping safer or faster.',
    question: 'What happens if you change the production code and something goes wrong?',
    click: 'Press PRESS START (this also turns the sound on). Read the elder’s question, take two or three answers, then press Answer.',
    next: 'Before we start walking, let’s look at the map.',
  },
  'world-map': {
    say: [
      'This is our journey. Nine regions. In the village we learn Git. In the forest, branches. Then GitHub, pull requests, CI, CD, security, AI agents — and at the end, the final boss.',
      'Every time we reach a new region, you level up.',
    ],
    understand: 'The whole talk on one map — so people always know where we are.',
    click: 'Press Begin journey and let the hero walk the whole route. Click any region to show what we learn there.',
    next: 'First stop: the village, where we learn about saving.',
  },
  'save-journey': {
    say: [
      'In a game, you save before something dangerous. If you die, you load the save. Git does the same for code.',
      'Watch: SAVE 1 in the village, SAVE 2 after the forest, SAVE 3 when we find the sword, SAVE 4 at the castle. Each save crystal is a commit — a snapshot of the whole project with a message.',
      'Now I click SAVE 2 again. The hero teleports back, loses the helmet, the sword is back in the stone and the castle is closed: the files look exactly like SAVE 2. But look — SAVE 3 and 4 are still there, faded. Going back does not delete newer commits.',
    ],
    understand: 'Game: save point. Technical: a commit is a snapshot in project history. You can always go back.',
    click: 'Press SAVE 1, 2, 3, 4 in order and wait for each walk. Then press SAVE 2 to load an old save.',
    next: 'So how do you actually make a save? At the save shrine.',
  },
  'save-shrine': {
    say: [
      'Five spells. git status: look at what changed — the items glow. git diff: compare with the last save — red was removed, green was added.',
      'git add: put the items in your bag. That bag is called the staging area. git commit: the bag is sealed into the crystal — a new save point. git log: the scroll shows your save history, newest first.',
      'Notice the locked spells: push and pull. We unlock them soon, when we start talking to GitHub.',
    ],
    understand: 'status → diff → add → commit is the save loop, all on your own computer. log shows the history.',
    click: 'Press “Next spell” once per command (5 presses). Explain each scene change, then press again. After the last spell the button says Restart.',
    next: 'What if you want to try something risky without touching the working version? Into the forest.',
  },
  'forest-fork': {
    say: [
      'The road splits. The main road keeps going. Your experiment walks its own road — that is a branch, an alternate timeline.',
      'If the experiment works, you merge: the two roads join. If it fails, you leave the road behind. Main never saw it.',
      'Technically, a branch is a tiny movable pointer to a commit. That is why Git branches are cheap.',
    ],
    understand: 'Branches let you experiment safely. Merging brings the work back.',
    click: 'Commit on feature twice, Commit on main once, then Merge. Watch HEAD (the hero) move to each new flag.',
    next: 'Our branch lives on our laptop. To share it, we need GitHub — so what is GitHub?',
  },
  'branch-commands': {
    say: [
      'git switch -c makes a new branch and moves you onto it. Then the normal save loop: status, add, commit.',
      'Finally git push -u origin sends the branch to GitHub. Look at the castle: before the push it doesn’t know your branch exists. After the push, the flag appears. The guild hall we just visited now knows our branch.',
    ],
    understand: 'Branches start on your laptop. Push puts them on GitHub so others can see them.',
    click: 'Press Next spell five times. On the last one, watch the bag fly to the castle.',
    next: 'The guild hall is where the whole team meets. Let’s go to the town square.',
  },
  'git-vs-github': {
    say: [
      'Git is your own house and your own chest of saves. It works on your machine, even with no internet.',
      'GitHub is the guild hall built around Git: pull requests, review, Actions, issues, projects, security.',
      'Watch what happens in a storm: the guild hall is cut off, but your saves at home are safe.',
    ],
    understand: 'Git = version control. GitHub = collaboration, automation and security around Git.',
    question: 'Who has used Git without GitHub?',
    click: 'Click a few rooms in the guild hall. Then Summon a storm, and Clear the storm.',
    next: 'Now let’s send our branch to the guild hall.',
  },
  tavern: {
    say: [
      'Without a shared board, everyone keeps their own copy and emails zip files. Nobody knows which one is right.',
      'With GitHub there is one shared board. git push = walk over and pin your saves. Watch Ben and Cy push.',
      'Now look at Alex: “behind by 2”. She doesn’t have their work yet. git pull brings everyone else’s saves home — now she is up to date.',
    ],
    understand: 'GitHub is the shared world. push uploads your saves; pull downloads your teammates’ saves.',
    click: 'Click Without GitHub, then With GitHub. Press Ben pushes and Cy pushes — Alex’s badge says BEHIND. Then press Alex pulls.',
    next: 'Now we are online together. The king has a quest for us.',
  },
  'the-quest': {
    say: [
      'The king posts quest #42: add user authentication. That is an issue — a written task.',
      'We open a branch, forge the code, save with commits, push… and arrive at the gate: a Pull Request.',
      'A Pull Request is a proposed change. Others can inspect it before it enters the main branch.',
    ],
    understand: 'Issue → Branch → Code → Commit → Push → Pull Request. Every change walks this road.',
    click: 'Press Next until the hero reaches the Pull Request gate.',
    next: 'Let’s meet the gatekeeper.',
  },
  'pr-gate': {
    say: [
      'The PR is the checkpoint. The gatekeeper asks: what does this change do? Show me every item in your bag. Did the automatons test it?',
      'On the right is what a real PR looks like: the description, the files changed, the checks, the reviewers, the linked issue, and a merge button that stays blocked until the rules are happy.',
      'Some teams also use AI review here, like Copilot code review. It needs a paid Copilot plan, and by default it does not count as a real approval.',
    ],
    understand: 'The PR is the control center for a change: code, discussion, checks and approvals in one place.',
    click: 'Click the three tabs. The gatekeeper says something different for each.',
    next: 'Who decides if the change is good enough? The guardians.',
  },
  'guardian-bridge': {
    say: [
      'Code review is a second pair of eyes. A reviewer can Comment, Approve, or Request changes.',
      'CODEOWNERS says who guards which area. Touch /src/auth, and the security team must review.',
      'The bridge to main only comes down when the rules are met. For private repos those rules need a paid GitHub plan.',
    ],
    understand: 'Reviews and CODEOWNERS make sure the right people check the right code before merge.',
    question: 'What do you look for when you review someone else’s code?',
    click: 'Approve with alice — still up. Approve with @team/security — the bridge comes down and the hero crosses. Try Request changes to raise it again.',
    next: 'Humans check the logic. But who runs the tests every single time?',
  },
  'automaton-forge': {
    say: [
      'Be honest: who has forgotten to run the tests before pushing? Me too.',
      'Continuous Integration is a forge full of automatons. Every push and every PR rides the belt: install, lint, type check, tests, build, security.',
      'If one robot finds a problem, the forge smokes, the PR gets a red X, and it cannot merge.',
    ],
    understand: 'CI = automatic, repeatable checks on every change. Nobody needs to remember.',
    question: 'What if nobody remembers to run the tests?',
    click: 'Run CI — all green. Then Break a test and run again — the unit-test robot fails and the rest are skipped.',
    next: 'What controls the forge? GitHub Actions — the rune circle.',
  },
  'rune-circle': {
    say: [
      'GitHub Actions runs a workflow when an event happens. The workflow is this scroll: a YAML file in .github/workflows.',
      'Don’t read every line. See four parts: the Event raises a signal flag, GitHub summons a Runner, the runner casts the Steps, and you get a Result on the PR.',
    ],
    understand: 'Event → Runner → Steps → Result. That is GitHub Actions.',
    click: 'Hover the scroll lines and the four boxes. Then press Raise the flag.',
    next: 'Testing is half the story. Now the build must travel to the castle.',
  },
  'kingdom-roads': {
    say: [
      'This is the kingdom road. The first half is CI: source, build, test, security — verify the change.',
      'The second half is CD: package it, deliver to staging, and on to production.',
      'Continuous Delivery: a human guard approves the last step. Continuous Deployment: the cart goes all the way automatically. Every team’s road looks a bit different.',
    ],
    understand: 'CI = automatically verify. CD = automatically deliver or deploy.',
    click: 'Press Ship a change. The cart stops at the release guard — press Approve release. Then switch to Deployment and ship again: no stop.',
    next: 'Let’s look at those towns on the road.',
  },
  'three-towns': {
    say: [
      'Development, staging and production are environments: the same code in three different towns.',
      'Each town has its own keys — the production database password only exists for production.',
      'The castle has the strongest gate: only main can deploy, and a named reviewer must approve.',
    ],
    understand: 'Environments separate secrets and add gates like approvals and branch rules.',
    click: 'Deploy Development, then Staging, then Production — it waits; press Approve. Reset, switch to feature/x and try Staging — blocked.',
    next: 'All these rules together are how we defend the castle.',
  },
  'castle-defense': {
    say: [
      'Production is our castle. Monsters are mistakes and attacks. Each rule is a brick in the wall that stops one kind of monster.',
      'Branch rules stop direct pushes. Required checks stop red builds. Reviews and CODEOWNERS stop unreviewed code. Push protection stops leaked keys. Environment rules stop random deploys. Least privilege limits damage.',
    ],
    understand: 'Security is layers. Each GitHub rule blocks one specific kind of mistake or attack.',
    click: 'Send “Commit an API key” — blocked. Turn off Push protection and send it again — breach! Turn it back on.',
    next: 'GitHub also has guards that watch your code all the time — the mage tower.',
  },
  'security-tree': {
    say: [
      'Dependabot watches your dependencies and opens update PRs. Free for everyone.',
      'Secret scanning finds leaked keys. Code scanning with CodeQL finds bug patterns. Dependency review blocks PRs that add vulnerable packages.',
      'On public repos many of these are free. On private repos, secret scanning needs GitHub Secret Protection and code scanning needs GitHub Code Security — paid add-ons.',
    ],
    understand: 'GitHub has strong automatic security — check which parts your plan includes.',
    click: 'Click Unlock all, then switch Public repo / Private repo and watch the labels change.',
    next: 'Let’s see every skill GitHub has, in one hall.',
  },
  'github-skill-tree': {
    say: [
      'Everything in one skill tree: Code, Planning, Automation, Security, Develop, and AI.',
      'Read the badges. GA means generally available. Preview means it can still change. Some skills depend on your plan.',
    ],
    understand: 'GitHub is much more than hosting code — but not every feature is free or finished.',
    click: 'Click a few skills in each column, especially AI. Then Unlock all.',
    next: 'That AI column is new. And look — someone is coming.',
  },
  'npc-joins': {
    say: [
      'Until now, the hero did every step alone.',
      'A wild AI agent appeared! It can research, plan, code, test and open a PR. Let’s recruit it.',
      'Now race: solo versus party. Notice the human is still at both ends — starting the quest and reviewing the result.',
    ],
    understand: 'Agents can do the middle of the workflow. Humans still start and finish it.',
    click: 'Press Something approaches, then Recruit to party. The race starts by itself; press Replay race to run it again.',
    next: 'But “AI” means many things. Let’s watch it evolve.',
  },
  evolution: {
    say: [
      'Form 1, autocomplete: finishes your line. Form 2, chat: answers your question. Form 3, agent: works toward a goal with tools in a loop.',
      'Form 4, agentic workflow: agents are wired into issues, CI and review.',
      'Each evolution has more power — and needs more permissions, checks and review.',
    ],
    understand: 'An agent acts toward a goal with tools. More autonomy means we need more checks.',
    question: 'Which form are you using today?',
    click: 'Press Evolve! three times. The flash and the new form show each step.',
    next: 'So what quests can we give our new party member?',
  },
  'quest-board': {
    say: [
      'Here is the quest board for our AI teammate: explain a repo, investigate a bug, add tests, fix CI, write docs…',
      'Flip a card to see the risk. Reading is low risk. Changing behaviour needs careful review.',
      'Which tools you have depends on your plan. Copilot cloud agent — the old name was coding agent — needs a paid Copilot plan. Claude and Codex agents on GitHub are in public preview.',
    ],
    understand: 'Agents are useful for many quests — every quest still ends in human review.',
    click: 'Flip Explain a repository, Implement a feature, and Investigate CI failures.',
    next: 'To do these quests, the agent needs tools. Welcome to the armory.',
  },
  'tool-belt': {
    say: [
      'MCP, the Model Context Protocol, is a standard way to plug tools into an AI app. The official site calls it a USB-C port for AI.',
      'Equip the agent with GitHub, a database, a browser, cloud, docs, monitoring. Power goes up — and so does risk.',
      'Safety rule: agents may touch code, terminals, package managers, cloud and GitHub APIs. Use least privilege, separate test credentials, test environments and approval gates. Never expose secrets. Agents are not safe by default.',
    ],
    understand: 'MCP gives agents tools. More tools = more power AND more risk. Start read-only.',
    click: 'Click Database twice (write) and Cloud twice (write). Watch the RISK bar turn red.',
    next: 'Let’s see the agent use its tools when the forge alarm rings.',
  },
  'forge-alarm': {
    say: [
      'Traditional: CI fails and a human reads two thousand log lines.',
      'Agent-assisted: the agent reads the log, finds the likely cause, prepares a fix, runs the tests, and updates the PR. Then the human reviews.',
      'Green is automation: same input, same result. Purple is AI: fast but can be wrong. Blue is the human: owns the decision. The agent never deploys its own fix to production.',
    ],
    understand: 'CI detects. AI investigates and proposes. Humans approve.',
    click: 'Watch the agent mode run. Then switch to Traditional, then back.',
    next: 'Now the most important scene of the story.',
  },
  'gate-of-trust': {
    say: [
      'The agent made a fix and the tests pass. It asks: may I open the gate to production?',
      'You are the leader. If you say “go straight in”, watch what follows it in.',
      'If you review first — goal, behaviour, security, risk — the gate opens safely. AI can accelerate execution. Humans remain responsible for important decisions.',
    ],
    understand: 'AI does not mean blind trust. The human leader reviews and decides.',
    question: 'Which answer would you give the agent?',
    click: 'Let the room choose. Show “Sure, go straight in” first (the bug sneaks in), then Try again and choose “Show me first”.',
    next: 'Enough story. Let’s give a real agent a real quest.',
  },
  'live-quest': {
    say: [
      'Our quest: add a loading state to the login button and create a test.',
      'Watch our AI party member take it: research the repo, plan, edit, test, run CI, open a Pull Request — and then a human reviews it like any other PR.',
    ],
    understand: 'An agent run follows the same road as any change: branch, tests, CI, PR, human review.',
    click: 'Press Start the quest and talk through each step as the robot walks and the log fills in.',
    next: 'You are ready. The final boss is waiting.',
  },
  'boss-battle': {
    say: [
      'Production checkout is failing. Real customers cannot pay. Choose your move.',
      'A: fight alone — safe but slow; every turn the bug hits customers. B: ask the agent to investigate and prepare a fix. C: give the agent full production access.',
      'C makes the boss stronger: no least privilege, live secrets, no review, no audit trail.',
      'The winning combo is B plus CI, security checks, human review, protected deployment, and rollback with monitoring.',
    ],
    understand: 'Speed comes from the agent. Safety comes from the system around it.',
    question: 'Vote with your hands: A, B or C?',
    click: 'Let the room vote. Click C first (the boss grows). Then B and use each skill until VICTORY.',
    next: 'So how does our team play this game on Monday?',
  },
  'guild-route': {
    say: [
      'Here is my proposal for our guild. Issue first, with acceptance criteria. Branch. Humans and AI code together.',
      'The PR gets CI checks and AI review at the same time, then a human review. Merge, staging, verify, human approval, production. Monitor, and roll back if needed.',
    ],
    understand: 'One clear team workflow: AI helps, humans control the gates.',
    click: 'Click Human + AI code, CI checks and Production to show the matching steps.',
    next: 'And to make it stick: ten rules, ten achievements.',
  },
  achievements: {
    say: ['Ten rules. Let’s agree on them one by one. Each one we agree on unlocks an achievement chest.'],
    understand: 'These rules turn the workflow into a team habit.',
    question: 'Is there any rule here you disagree with?',
    click: 'Read each rule, ask for agreement, then click it to open the chest.',
    next: 'One last question about our own class.',
  },
  'class-change': {
    say: [
      'The old class was Coder: “I write code.”',
      'The new class is Agentic Developer: “I design systems, define goals, review changes, manage agents, and control delivery.”',
      'Look at the stats: typing goes down, design, judgment and leadership go up.',
    ],
    understand: 'Our value moves from typing code to designing, judging and owning.',
    question: 'If AI can write the code, what should the developer become?',
    click: 'Ask the question first. Then Change class, and Reveal next skill six times.',
    next: 'You made it to the throne room.',
  },
  ending: {
    say: [
      'Git is your save system. GitHub is your multiplayer world. CI/CD is your automation engine. Security is your defense system. AI agents are your teammates. And humans are still the players.',
      'Git gives us history. GitHub gives us collaboration. CI/CD gives us automation. Security gives us control. AI agents give us leverage. Humans provide judgment. Together, a modern software delivery system.',
    ],
    understand: 'The whole system in six lines.',
    question: 'If an AI agent can write the code, what should the human developer become?',
    click: 'Ask the question, take answers, then press Claim the final reward.',
    next: 'Thank you for playing. Questions? Sources are on the last slide.',
  },
  sources: {
    say: ['All facts come from official Git and GitHub documentation, checked on 9 October 2026. GitHub changes quickly — please check again before you rely on a feature.'],
    understand: 'Where to learn more, and that availability can change.',
    click: 'Use the topic chips if someone asks about one area.',
    next: 'End of the talk.',
  },
}
