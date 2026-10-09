# THE GIT QUEST — References and fact check

Researched 2026-10-09 from official sources only (git-scm.com, docs.github.com, github.com, github.blog changelog, modelcontextprotocol.io). Every URL below was opened or returned by an official-domain search during research.

**Status key:** GA = generally available · Public preview · Plan-dependent (which plans) · GHSP = GitHub Secret Protection (paid add-on) · GHCS = GitHub Code Security (paid add-on) · Copilot-plan-dependent · External infra = you must supply infrastructure.

> GHSP and GHCS can be bought only on **GitHub Team or GitHub Enterprise** plans. Several of their features are free on **public** repos.

---

## 1. Git (git-scm.com)

| Feature | Plain-English definition | Status | URL |
|---|---|---|---|
| Git itself | Free, open-source version control system. Latest release shown: **2.56.0 (2026-09-28)** | GA (open source, free) | https://git-scm.com/ |
| Commit | A commit object stores a pointer to a **snapshot** of staged content, plus author, message, and pointer(s) to its **parent** commit(s). Git stores snapshots, not diffs | GA | https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell |
| `git commit` | "Record changes to the repository": makes a new commit from the index (staging area) plus a message | GA | https://git-scm.com/docs/git-commit |
| Branch | "A lightweight movable pointer" to a commit. HEAD points to the branch you are on | GA | https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell |
| `git switch` | "Switch branches". `git switch -c <name>` creates a branch and switches to it | GA (no experimental label in current docs) | https://git-scm.com/docs/git-switch |
| `git status` | Shows which files are untracked, modified, or staged | GA | https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository |
| `git add` | "Add precisely this content to the next commit" (stages changes) | GA | https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository |
| `git diff` | Working directory vs staging area. `git diff --staged` = staged vs last commit | GA | https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository |
| `git log` | Lists commits, newest first. `git log --oneline --graph --all` draws history | GA | https://git-scm.com/docs/git-log |
| `git push` | "Update remote refs along with associated objects" (uploads your commits). Rejected if the remote moved since you last fetched | GA | https://git-scm.com/docs/git-push · https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes |
| `git pull` | "Fetch from and integrate with another repository": roughly `git fetch` plus merge (or rebase) | GA | https://git-scm.com/docs/git-pull · https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes |

## 2. GitHub collaboration

| Feature | Definition | Status | URL |
|---|---|---|---|
| Repository | "The most basic element of GitHub": holds code, files, and each file's revision history | GA, all plans | https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories |
| Pull request | "Proposals to merge code changes into a project" | GA, all plans | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests |
| PR reviews: Comment / Approve / Request changes | Comment = feedback without a verdict. Approve = "ready to merge". Request changes = feedback that must be addressed before merging | GA | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews |
| CODEOWNERS | A file (in `.github/`, root, or `docs/`) naming the people or teams responsible for code. They get auto-requested for review | GA. *Required* code-owner review needs a protected branch or ruleset (see §5), and for private repos that means Pro/Team/Enterprise | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners |
| Issues | "Plan, discuss, and track work" (bugs, tasks, ideas) | GA, all plans | https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues |
| Projects | "An adaptable, flexible tool for planning and tracking work on GitHub" (tables, boards, roadmaps) | GA | https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects |
| Discussions | A built-in forum where a project's community can "engage in conversations" | GA | https://docs.github.com/en/discussions/collaborating-with-your-community-using-discussions/about-discussions |
| Releases and tags | Releases are "deployable software iterations" you package for download, built on Git tags | GA | https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases |
| Milestones | "Track progress on groups of issues or pull requests in a repository" | GA | https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones |
| Code search | Search and navigate code across GitHub (regex, boolean, symbols). **Requires sign-in, even for public repos** | GA | https://docs.github.com/en/search-github/github-code-search/about-github-code-search |

## 3. GitHub Actions

| Feature | Definition | Status | URL |
|---|---|---|---|
| GitHub Actions | "A continuous integration and continuous delivery (CI/CD) platform". Event → workflow → jobs → steps → actions/scripts, run on runners | GA, all plans (minutes quota for private repos: Free 2,000, Pro/Team 3,000, Enterprise Cloud 50,000 per month) | https://docs.github.com/en/actions/get-started/understand-github-actions · https://docs.github.com/en/get-started/learning-about-github/githubs-plans |
| Workflow syntax | YAML files in `.github/workflows/` (`.yml`/`.yaml`). Keys: `on`, `permissions`, `jobs`, `runs-on`, `steps`, `uses`, `run` | GA | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax |
| `pull_request` event | By default runs on `opened`, `synchronize`, `reopened`. On PRs **from forks**, secrets (other than GITHUB_TOKEN) are not passed and GITHUB_TOKEN is read-only | GA | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows |
| GitHub-hosted runners (`ubuntu-latest`) | `ubuntu-latest` = **Ubuntu 24.04** image. Standard runner: 4 CPU/16 GB on public repos, 2 CPU/8 GB on private. "Use of the standard GitHub-hosted runners is free and unlimited on public repositories." | GA | https://docs.github.com/en/actions/reference/runners/github-hosted-runners |
| `actions/checkout` | Checks out your repo onto the runner. **Latest major: v7** (v7.0.1 marked Latest) → `actions/checkout@v7` | GA | https://github.com/actions/checkout/releases |
| `actions/setup-node` | Installs Node.js on the runner. **Latest major: v7** (v7.1.0 Latest, 08 Oct; v7.0.0 on 14 Jul) → `actions/setup-node@v7` | GA | https://github.com/actions/setup-node/releases |
| GitHub Marketplace (Actions) | "Tools from the community and partners to simplify tasks and automate processes" | GA | https://github.com/marketplace?type=actions |
| Self-hosted runners | Your own machines that run jobs | GA, External infra | (see runners docs above) |

## 4. Deployment environments

All quotes are from https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments (concept page: https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)

| Feature | Definition | Status (plan) |
|---|---|---|
| Environment | Named deploy target (e.g. `production`, `staging`) that a job references. Rules must pass before the job reaches a runner | GA. Enterprise plan: "Deployment protection rules with GitHub Actions for private or internal repositories" |
| Environment secrets | Secrets only jobs targeting that environment can read (after rules pass) | Free: public repos only. Private/internal: Pro, Team, Enterprise |
| Required reviewers | Up to **6** users/teams must approve the deployment job | Free/Pro/Team: **public repos only**. Private: Enterprise |
| Wait timer | Delay of 1 to 43,200 minutes (30 days) before the job runs | Free/Pro/Team: **public repos only**. Private: Enterprise |
| Deployment branches and tags | Restrict which branches/tags can deploy to the environment | All public repos. Private: Pro, Team (and Enterprise) |
| Custom deployment protection rules | GitHub App-based gates (max 6 per environment) | Free/Pro/Team: public repos only |

## 5. Protected branches and rulesets

| Feature | Definition | Status | URL |
|---|---|---|---|
| Protected branches | Rules on a branch: require PR reviews (incl. code owners, dismiss stale approvals), required status checks, conversation resolution, **signed commits**, linear history, merge queue, required deployments, lock branch, restrict pushes, block force-push/deletion | Plan-dependent: GitHub's plans page lists "Protected branches", "Code owners", "Required pull request reviewers" as Pro/Team features **"in private repositories"** (so Free = public repos) | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches · https://docs.github.com/en/get-started/learning-about-github/githubs-plans |
| Rulesets | "A named list of rules" for branches or tags. Several can stack, the strictest wins, and they can be turned off without deleting them. Rules include Require a pull request before merging, Require status checks to pass, Require signed commits, Block force pushes, Require code scanning results, Restrict file paths/size, and more | Plan-dependent. Multi-repo/org-level rulesets: Enterprise. Push rulesets: private/internal repos. Treat private-repo availability as the same as protected branches (Pro/Team/Enterprise) | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets · https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets |

## 6. Security (supply chain, secrets, code)

Overview table: https://docs.github.com/en/code-security/getting-started/github-security-features · Product split: https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security

| Feature | Definition | Status | URL |
|---|---|---|---|
| Dependency graph | Inventory of the packages your repo depends on | Free, all plans, public and private | (overview above) |
| Dependabot alerts | Warns when a dependency has a known vulnerability | Free, all plans, public and private | https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts |
| Dependabot security updates | Auto-PRs that bump vulnerable dependencies to a fixed version | Free, all plans (needs dependency graph and alerts on) | https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates |
| Dependabot version updates | Auto-PRs that keep dependencies current, configured via `dependabot.yml` | Free, all plans | https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates |
| Dependency review / `actions/dependency-review-action` | Shows the dependency changes in a PR. The action fails the check if a PR adds vulnerable or disallowed-license packages. Latest major **v5** | Free for public repos. Private: **GHCS** (README says "GitHub Advanced Security license") | https://github.com/actions/dependency-review-action |
| Secret scanning | "Automatically detects credential leaks" (tokens, keys) in repo history | Free and automatic on public repos. Private org repos: **GHSP** (Team/Enterprise) | https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning |
| Push protection | Blocks a `git push` that contains a secret **before** it lands | Push protection for users: on by default for public repos. Repo-level push protection on private repos: **GHSP** | https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection |
| Code scanning | Shows static-analysis results as alerts on the repo and PRs | Free for public repos. Private: **GHCS** | https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql |
| CodeQL | GitHub's analysis engine ("code as data"). Languages: C/C++, C#, Go, Java/Kotlin, JS/TS, Python, Ruby, Rust, Swift, Actions workflows. Default setup (one click) or advanced setup (workflow file) | Free for public repos. Private: **GHCS** | same as above |
| Copilot Autofix | AI-suggested fixes for code scanning alerts | Free for public repos. Private: **GHCS** | https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security |
| Repository security advisories | Privately discuss, fix, and publish a vulnerability in your **public** repo. Can request a CVE | Free (public repos) | https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/about-repository-security-advisories |
| Security policy (SECURITY.md) | Tells people how to report vulnerabilities | Free, all plans | (overview above) |

## 7. GitHub Copilot and AI agents

Plans and feature matrix: https://docs.github.com/en/copilot/get-started/plans

| Feature | Definition | Status | URL |
|---|---|---|---|
| Copilot plans | **Free** (limited), **Student** (free, verified students), **Pro** $10/mo, **Pro+** $39/mo, **Max** $100/mo, **Business** $19/seat/mo, **Enterprise** $39/seat/mo. Usage is metered in **GitHub AI Credits** | GA | https://docs.github.com/en/copilot/get-started/plans |
| Agent mode (IDE) | Copilot plans and makes multi-file edits, runs terminal commands (you approve them), and iterates in your local editor (VS Code, Visual Studio, JetBrains, Xcode, Eclipse) | GA. All plans incl. Free | https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode |
| **Copilot code review** | Reviews PRs, flags issues, and suggests fixes you can apply in a couple of clicks | **GA**. Student/Pro/Pro+/Max/Business/Enterprise. Free plan: only "Review selection" in VS Code. Org members without a license can use it on GitHub.com if admins enable it (Business/Enterprise). By default its reviews **do not count toward required approvals**. "Copilot approvals" is in **public preview** | https://docs.github.com/en/copilot/concepts/agents/code-review |
| **Copilot cloud agent** (formerly **Copilot coding agent**) | Background agent: assign it an issue or prompt and it researches, plans, codes, and tests in an ephemeral GitHub Actions-powered environment, then opens a PR for your review. Max 59 minutes per session, one repo, one PR per task | **GA** (coding agent GA 2025-09-25, renamed "cloud agent" around Apr 2026). Student/Pro/Pro+/Max/Business/Enterprise, **not Free**. Business/Enterprise admins must enable it by policy | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent · https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/ · https://github.blog/changelog/2026-04-10-copilot-usage-metrics-now-aggregate-copilot-cloud-agent-active-user-counts/ |
| Copilot CLI | Agentic Copilot in the terminal | **GA** (2026-02-25). Pro, Pro+, Business, Enterprise (Business/Enterprise admin enables it). The plans page lists the CLI for individual plans. Newer bits (e.g. dynamic workflows, Oct 2026) are public preview | https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/ · https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/ |
| Third-party agents (Anthropic **Claude**, OpenAI **Codex**) | Assign an issue or prompt to Claude or Codex on GitHub and they open a PR, alongside Copilot cloud agent | **Public preview**. Pro, Pro+, Max, Business, Enterprise (policy must allow it) | https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents · https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/ |
| Security validation for third-party agents | CodeQL, Advisory Database dependency checks, and secret scanning run on the agents' code | GA (2026-06-09), on by default | https://github.blog/changelog/2026-06-09-security-validation-for-third-party-coding-agents/ |
| **GitHub Agentic Workflows** (`gh aw`) | Automations written in natural-language **Markdown** that compile to Actions YAML and run coding agents inside GitHub Actions (triage, CI-failure analysis, docs) | **Public preview** (since 2026-06-11. Technical preview was 2026-02-13). No GA announcement found | https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/ · https://github.com/github/gh-aw · https://github.github.com/gh-aw/ |

## 8. MCP (Model Context Protocol)

| Feature | Definition | Status | URL |
|---|---|---|---|
| MCP | "An open-source standard for connecting AI applications to external systems". "Think of MCP like a USB-C port for AI applications." Current docs are versioned **2026-07-28** | Open standard | https://modelcontextprotocol.io/docs/getting-started/intro |
| GitHub MCP Server | Lets AI tools read repos and code, manage issues and PRs, and work with Actions and security alerts through natural language. **Remote** (hosted at `https://api.githubcopilot.com/mcp/`, OAuth or PAT) or **local** (Docker `ghcr.io/github/github-mcp-server`). Toolsets are configurable, and read-only mode is available | Open source. **Remote server GA (2025-09-04)**. "Insiders" mode = early-access features | https://github.com/github/github-mcp-server · https://github.blog/changelog/2025-09-04-remote-github-mcp-server-is-now-generally-available/ |
| MCP in Copilot | Copilot (agent mode, cloud agent, code review) can call MCP servers | GA. Listed for all individual plans incl. Free. Business/Enterprise governed by the "MCP servers in Copilot" policy. MCP in code review GA 2026-07-29 | https://docs.github.com/en/copilot/get-started/plans · https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/ |

## 9. Tools and platform

| Feature | Definition | Status | URL |
|---|---|---|---|
| Codespaces | "A development environment that's hosted in the cloud" | GA. Free/Pro personal accounts get a monthly free quota (Free: 120 core-hours and 15 GB. Pro: 180 core-hours and 20 GB). Orgs pay | https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces |
| GitHub CLI (`gh`) | "Take GitHub to the command line": PRs, issues, Actions from the terminal. Latest shown v2.102.0 | GA, free | https://cli.github.com/ |
| GitHub Desktop | Free, open-source GUI app for Git and GitHub. Windows and macOS | GA, free | https://docs.github.com/en/desktop/overview/about-github-desktop |
| GitHub Packages | Package hosting (npm, Maven/Gradle, NuGet, RubyGems, Container registry) | GA. Free for public packages. Private: plan-based storage (Free 500 MB, Pro/Team 2 GB, Enterprise Cloud 50 GB) | https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages |
| REST API | Build scripts and apps that "automate processes, integrate with GitHub, and extend GitHub" | GA | https://docs.github.com/en/rest/about-the-rest-api/about-the-rest-api |
| GraphQL API | Query exactly the data you need in one request | GA | https://docs.github.com/en/graphql/overview/about-the-graphql-api |
| Webhooks | HTTP notifications sent to your server when events happen on GitHub | GA. **Requires external infrastructure** (a server to receive them) | https://docs.github.com/en/webhooks/about-webhooks |

## 10. Actions security guidance

| Topic | Guidance | URL |
|---|---|---|
| GITHUB_TOKEN | Auto-created per job, scoped to the repo, **expires when the job finishes**. Set defaults to read-only and grant extra `permissions:` per job only where needed (least privilege) | https://docs.github.com/en/actions/concepts/security/github_token · https://docs.github.com/en/actions/reference/security/secure-use |
| Secrets | Stored at org, repo, or environment level. Auto-redacted in logs, but redaction is "not guaranteed". Don't put JSON/YAML blobs in one secret. Register derived values. Rotate | https://docs.github.com/en/actions/concepts/security/secrets |
| Pin actions | "Pinning an action to a full-length commit SHA is currently the only way to use an action as an immutable release" | https://docs.github.com/en/actions/reference/security/secure-use |
| Script injection | Never put `${{ github.event.pull_request.title }}` directly in `run:`. Pass it via `env:` | same |
| `pull_request_target` | Avoid it unless necessary. Never check out untrusted fork code under privileged triggers | same |
| OIDC | Use OpenID Connect to get short-lived cloud credentials instead of long-lived secrets | same |

---

## Key facts for slides (safe to state)

1. A Git commit is a **snapshot** with a pointer to its parent(s), not a diff.
2. A branch is "a lightweight movable pointer" to a commit. HEAD marks the branch you're on.
3. `git switch -c feature` creates and switches to a new branch.
4. Core loop: `git status` → `git add` → `git commit` → `git push`. `git pull` = fetch + integrate.
5. Latest Git release: 2.56.0 (2026-09-28).
6. A pull request is a "proposal to merge code changes into a project".
7. Reviewers can **Comment**, **Approve**, or **Request changes**.
8. CODEOWNERS lives in `.github/`, the repo root, or `docs/` and auto-requests reviewers.
9. GitHub code search requires sign-in, even for public repos.
10. Actions = GitHub's CI/CD. Workflows are YAML in `.github/workflows/`.
11. `pull_request` runs by default on opened, synchronize, reopened.
12. `ubuntu-latest` = Ubuntu 24.04. Standard hosted runners are free and unlimited on public repos.
13. Use `actions/checkout@v7` and `actions/setup-node@v7` (current majors).
14. Fork PRs get no repo secrets and a read-only GITHUB_TOKEN.
15. GITHUB_TOKEN expires when the job finishes. Set least-privilege `permissions:`.
16. Pinning to a full commit SHA is the only immutable way to use an action.
17. Environments gate deployments with required reviewers (up to 6), wait timers (up to 30 days), and branch rules.
18. Dependabot alerts, security updates, and version updates are free on all plans.
19. Secret scanning, push protection, code scanning/CodeQL, and dependency review are **free for public repos**. Private repos need **GitHub Secret Protection** or **GitHub Code Security** (Team/Enterprise add-ons).
20. Copilot plans: Free, Student, Pro ($10), Pro+ ($39), Max ($100), Business ($19/seat), Enterprise ($39/seat).
21. **Copilot cloud agent** (formerly Copilot coding agent) is GA on paid plans: assign an issue and it opens a PR. Works in a GitHub Actions-powered environment.
22. **Copilot code review** is GA. Its reviews don't count as required approvals by default.
23. **Copilot CLI** is GA (Feb 2026).
24. Claude and Codex can be assigned GitHub work as **third-party agents (public preview)**.
25. **GitHub Agentic Workflows** = Markdown-defined agent automations in Actions, **public preview**.
26. MCP is "like a USB-C port for AI applications". GitHub's **remote MCP server is GA**.

## Do NOT claim

- Don't say "Copilot coding agent" as the current name. It is now **Copilot cloud agent** (you can say "formerly coding agent").
- Don't say Copilot cloud agent or code review on PRs is in **Copilot Free**. Free gets agent mode, but not the cloud agent, and code review only via "Review selection" in VS Code.
- Don't call Claude/Codex agents on GitHub, GitHub Agentic Workflows, Copilot approvals, or Copilot CLI dynamic workflows **GA**. All are public preview.
- Don't say Copilot reviews satisfy required approvals by default. They don't, unless "Copilot approvals" (preview) is enabled.
- Don't say secret scanning, push protection, code scanning, CodeQL, or dependency review are free for **private** repos. They need GHSP or GHCS (Team/Enterprise only).
- Don't say environment required reviewers or wait timers work on **private repos** for Free/Pro/Team. That's Enterprise only.
- Don't say protected branches, required reviews, or CODEOWNERS enforcement are available on private repos for **GitHub Free**.
- Don't say Actions minutes are unlimited for private repos. Only standard runners on **public** repos are free and unlimited.
- Don't use `actions/checkout@v4` or `setup-node@v4` in examples as "latest". Current majors are v7.
- Don't present the "premium requests" model as current. Plans now describe **GitHub AI Credits**.
- Don't claim git push/pull need GitHub. Git is independent. GitHub is a host.
- Don't claim AI agents merge on their own. The cloud agent opens a PR that a human reviews (one repo, one PR per task, 59-minute session cap).
- Don't promise exact third-party model names (they change often. Access to one Claude model was suspended on 2026-06-12).
- Webhooks and self-hosted runners need your own infrastructure.
