/** Official sources used in the deck (full list with statuses in REFERENCES.md). Checked 2026-10-09. */
export const REFERENCES: { topic: string; items: { name: string; url: string }[] }[] = [
  {
    topic: 'Git',
    items: [
      { name: 'Git — Branches in a nutshell', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell' },
      { name: 'Git — Recording changes', url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository' },
      { name: 'git switch', url: 'https://git-scm.com/docs/git-switch' },
    ],
  },
  {
    topic: 'GitHub',
    items: [
      { name: 'About pull requests', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests' },
      { name: 'About pull request reviews', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews' },
      { name: 'About code owners', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners' },
      { name: 'GitHub plans', url: 'https://docs.github.com/en/get-started/learning-about-github/githubs-plans' },
    ],
  },
  {
    topic: 'Actions & CD',
    items: [
      { name: 'Understanding GitHub Actions', url: 'https://docs.github.com/en/actions/get-started/understand-github-actions' },
      { name: 'Workflow syntax', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax' },
      { name: 'Deployments and environments', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments' },
      { name: 'actions/checkout releases', url: 'https://github.com/actions/checkout/releases' },
    ],
  },
  {
    topic: 'Protection & security',
    items: [
      { name: 'About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
      { name: 'About rulesets', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets' },
      { name: 'GitHub security features', url: 'https://docs.github.com/en/code-security/getting-started/github-security-features' },
      { name: 'About GitHub Advanced Security', url: 'https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security' },
    ],
  },
  {
    topic: 'AI & MCP',
    items: [
      { name: 'Copilot plans', url: 'https://docs.github.com/en/copilot/get-started/plans' },
      { name: 'About Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent' },
      { name: 'Copilot code review', url: 'https://docs.github.com/en/copilot/concepts/agents/code-review' },
      { name: 'Third-party agents (preview)', url: 'https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents' },
      { name: 'Agentic Workflows (preview)', url: 'https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/' },
      { name: 'What is MCP?', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
      { name: 'GitHub MCP Server', url: 'https://github.com/github/github-mcp-server' },
    ],
  },
]
