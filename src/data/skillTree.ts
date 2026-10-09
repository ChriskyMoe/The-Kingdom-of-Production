import type { Availability } from '../components/StatusBadge'

export type SkillNode = { name: string; status: Availability[]; note: string }
export type SkillBranch = { name: string; color: string; nodes: SkillNode[] }

/**
 * GitHub feature map with availability, checked against official docs on 2026-10-09
 * (see REFERENCES.md). "plan" = depends on your GitHub plan for private repos.
 */
export const GITHUB_TREE: SkillBranch[] = [
  {
    name: 'Code',
    color: 'var(--accent)',
    nodes: [
      { name: 'Repositories', status: ['ga'], note: 'The basic unit of GitHub: code plus the full history of every file.' },
      { name: 'Commits & branches', status: ['ga'], note: 'Git history, shown and shared on GitHub.' },
      { name: 'Tags & releases', status: ['ga'], note: 'Releases package a tagged version for people to download.' },
      { name: 'Pull requests', status: ['ga'], note: 'A proposal to merge changes. The control center of a change.' },
      { name: 'Code review', status: ['ga'], note: 'Comment, Approve or Request changes on a PR.' },
      { name: 'Code search', status: ['ga'], note: 'Search code across GitHub. Needs sign-in, even for public repos.' },
    ],
  },
  {
    name: 'Planning',
    color: 'var(--info)',
    nodes: [
      { name: 'Issues', status: ['ga'], note: 'Track bugs, tasks and ideas. A quest log for the team.' },
      { name: 'Projects', status: ['ga'], note: 'Boards, tables and roadmaps built from issues and PRs.' },
      { name: 'Milestones', status: ['ga'], note: 'Group issues and PRs to track progress toward a goal.' },
      { name: 'Discussions', status: ['ga'], note: 'A forum inside the repository for questions and ideas.' },
    ],
  },
  {
    name: 'Automation',
    color: 'var(--warn)',
    nodes: [
      { name: 'GitHub Actions', status: ['ga', 'plan'], note: 'CI/CD on GitHub. Free on public repos; private repos get a monthly minutes quota per plan.' },
      { name: 'REST & GraphQL APIs', status: ['ga'], note: 'Everything you click on GitHub can also be done by code.' },
      { name: 'Webhooks', status: ['ga', 'infra'], note: 'GitHub calls your server when something happens. You host the receiver.' },
      { name: 'GitHub Packages', status: ['ga', 'plan'], note: 'Host npm, container and other packages next to your code.' },
      { name: 'Marketplace', status: ['ga'], note: 'Ready-made actions and apps from the community and partners.' },
    ],
  },
  {
    name: 'Security',
    color: 'var(--danger)',
    nodes: [
      { name: 'Dependabot', status: ['ga'], note: 'Alerts and update PRs for vulnerable dependencies. Free on all plans.' },
      { name: 'Secret scanning', status: ['free-public', 'paid'], note: 'Finds leaked keys and tokens. Private repos need GitHub Secret Protection (paid add-on, Team/Enterprise).' },
      { name: 'Code scanning + CodeQL', status: ['free-public', 'paid'], note: 'Static analysis alerts on PRs. Private repos need GitHub Code Security (paid add-on).' },
      { name: 'Dependency review', status: ['free-public', 'paid'], note: 'Blocks PRs that add vulnerable packages. Private repos need GitHub Code Security.' },
      { name: 'Security advisories', status: ['ga'], note: 'Privately fix and publish a vulnerability in a public repo.' },
    ],
  },
  {
    name: 'Develop',
    color: 'var(--muted)',
    nodes: [
      { name: 'Codespaces', status: ['ga', 'plan'], note: 'A full dev environment in the cloud. Monthly free quota for personal accounts, then billed.' },
      { name: 'GitHub CLI', status: ['ga'], note: 'gh: issues, PRs, Actions and more from the terminal.' },
      { name: 'GitHub Desktop', status: ['ga'], note: 'A visual app for Git and GitHub.' },
    ],
  },
  {
    name: 'AI',
    color: 'var(--accent-2)',
    nodes: [
      { name: 'Copilot', status: ['copilot'], note: 'AI pair programmer. Plans from Free to Enterprise; features differ by plan.' },
      { name: 'Copilot code review', status: ['ga', 'copilot'], note: 'AI review on PRs. Paid Copilot plans. Does not count as a required approval by default.' },
      { name: 'Copilot cloud agent', status: ['ga', 'copilot'], note: 'Formerly “coding agent”. Assign an issue, it works in Actions and opens a PR. Not in Copilot Free.' },
      { name: 'GitHub MCP Server', status: ['ga'], note: 'Gives AI tools structured access to repos, issues, PRs and Actions. Remote server is GA.' },
      { name: 'Claude & Codex agents', status: ['preview', 'copilot'], note: 'Third-party agents you can assign work to on GitHub. Public preview.' },
      { name: 'Agentic Workflows', status: ['preview'], note: 'gh aw: agent automations written in Markdown that run in Actions. Public preview.' },
    ],
  },
]

export const SECURITY_TREE: SkillNode[] = [
  { name: 'Dependabot', status: ['ga'], note: 'Alerts + automatic update PRs for vulnerable dependencies. Free on all plans, public and private.' },
  { name: 'Dependency review', status: ['free-public', 'paid'], note: 'Shows what a PR changes in your dependencies and can fail the check. Private: GitHub Code Security.' },
  { name: 'Secret scanning', status: ['free-public', 'paid'], note: 'Detects leaked credentials in history. Push protection blocks the push before it lands. Private: GitHub Secret Protection.' },
  { name: 'Code scanning', status: ['free-public', 'paid'], note: 'Static-analysis results as alerts on the repo and on PRs. Private: GitHub Code Security.' },
  { name: 'CodeQL', status: ['free-public', 'paid'], note: 'GitHub’s engine that queries “code as data” to find bug patterns. One-click default setup.' },
  { name: 'Security advisories', status: ['ga'], note: 'Discuss and fix a vulnerability privately, then publish it (and request a CVE).' },
]
