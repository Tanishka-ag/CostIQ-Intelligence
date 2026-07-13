<div align="center">

<img src="https://img.shields.io/badge/CostIQ-v2.0-5340c8?style=for-the-badge" alt="CostIQ v2.0">

# 💡 CostIQ
### Real-time Cost Intelligence

> **Estimate and track the cost of every Jira story built with Claude Code**

[![Built with HTML](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-orange?style=flat-square)](https://github.com)
[![No install needed](https://img.shields.io/badge/No%20install-just%20open%20index.html-brightgreen?style=flat-square)](https://github.com)
[![Dark mode](https://img.shields.io/badge/Dark%20mode-supported-5340c8?style=flat-square)](https://github.com)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.6-blue?style=flat-square)](https://anthropic.com)
[![Jira](https://img.shields.io/badge/Jira-API%20integrated-0052CC?style=flat-square)](https://atlassian.com)

</div>

---

## What is CostIQ?

CostIQ is a **standalone web application** that helps development teams understand, estimate, track, and optimize the cost of implementing Jira stories using Claude Code (Anthropic's AI coding tool).

No server. No login. No installation. Just open `index.html` in your browser and start calculating.

Built for developers, leads, and anyone who needs to explain AI development costs to a client or manager — in plain English.

---

## What's new in v2.0

- **Jira API integration** — connect your Jira account and fetch any story by ID. Title, description, acceptance criteria and story points auto-filled instantly.
- **Estimated vs Actual comparison** — after implementing a story, enter actual tokens from Claude Code's terminal and compare against the estimate. Variance shown as On target / Slightly over / Over estimate.
- **BRD analyser** — upload a BRD document and get a full pre-calculated cost for implementing the entire project.
- **User stories analyser** — upload a user stories document and get a per-story cost breakdown with a bar chart, before writing a single line of code.
- **Optimization advisor** — a 6-question audit that generates a personalised priority list of what to fix to reduce your token costs, plus a potential saving calculator.

---

## Features

### 📖 Token guide — start here
- Plain-English explanation of what a token is
- Visual input vs output diagram
- The pricing formula explained step by step
- 4 ways to find your exact token count
- Full price reference table for all three Claude models

### 🧮 Story calculator
- Enter your Jira story ID, pick a model, choose a size preset
- Live cost calculation as you type — no submit button needed
- Breaks down input cost and output cost separately
- Shows savings with **prompt caching** (up to 90% off) and **Batch API** (50% off)
- Sprint context — see what 10 stories at this rate would cost
- One-click add to sprint tracker

### 🔗 Jira integration
- Enter your Jira site URL, email, and API token once
- Credentials stored only in your browser — never shared externally
- Type any story ID → fetches title, description, status, story points, assignee, and acceptance criteria directly from Jira
- Cost estimate calculated automatically from real story content
- **Estimated vs Actual** — enter actual tokens post-implementation to compare and track variance
- Story history table showing all previously fetched stories with estimated vs actual cost

### 📄 BRD analyser
- Upload a BRD document (.txt or .md)
- Automatically detects sections using heading patterns
- Estimates how many user stories the BRD will generate
- Pre-calculates total implementation cost for the whole project
- Shows savings with prompt caching and Batch API at project level
- Detected sections list with individual token count and cost share

### 📋 User stories analyser
- Upload a user stories document (.txt or .md)
- Parses each story automatically (detects numbered, headed, and ID-prefixed formats)
- Per-story cost table with tokens in, tokens out, full cost, cached cost
- Bar chart comparing costs across all stories
- One-click send all stories to sprint tracker

### 📊 Sprint tracker
- Track cost across every story in a sprint
- Add stories from the calculator, Jira integration, or manually
- Live bar chart comparing full cost vs cost with caching
- Sprint totals — full cost, cached cost, average per story, total saving

### 🔀 Workflow cost breakdown
- Your 8-step implementation workflow visualised
- Only Step 4 (building in Claude Code) costs money
- Steps 1, 2, 3, 5, 6, 7, 8 are completely free

### 💡 Optimization advisor
- **6-question quick audit** — answer questions about your current setup
- **Personalised priority plan** — ranked Critical / High / Medium / Good with exact actions and estimated savings
- **Optimization score** — colour-coded percentage showing how optimised your current workflow is
- **Potential saving calculator** — enter your monthly spend, see savings per optimization in dollars
- **6 optimization pillars** fully documented:
  - Match model to task (up to 60% saving)
  - Keep CLAUDE.md under 200 lines (up to 30% saving)
  - Add a .claudeignore file (up to 40% saving)
  - Clear and compact context between tasks (up to 35% saving)
  - Plan before implementing (up to 25% saving)
  - Disconnect unused MCP servers (up to 20% saving)
- Ready-to-use `.claudeignore` template you can copy directly
- Model routing table — which model for which task type

### ⚡ Claude Code vs GitHub Copilot
- Side-by-side feature comparison
- Context window, benchmark scores, pricing, autonomous execution
- Honest recommendation — use both, not one or the other

### ❓ Client Q&A
- Expandable answers to the most common client and manager questions
- Covers billing, tokens, Claude Code, privacy, and security
- Quick numbers reference table

---

## How to run locally

**The simplest way — no setup needed:**

```
1. Download or clone this repository
2. Open the jira-cost-app folder
3. Double-click index.html
4. Done — it opens in your browser
```

**VS Code Live Server:**
```bash
# Install the Live Server extension in VS Code
# Right-click index.html → Open with Live Server
```

**Python local server:**
```bash
cd jira-cost-app
python3 -m http.server 8080
# Open: http://localhost:8080
```

**Node.js:**
```bash
cd jira-cost-app
npx serve .
```

---

## How to connect Jira

The Jira integration uses your Atlassian API token — no OAuth redirect needed.

**One-time setup (2 minutes):**

1. Go to `https://id.atlassian.com/manage-profile/security/api-tokens`
2. Click **Create API token** → name it `CostIQ` → click **Create**
3. Copy the token
4. In CostIQ, go to **Jira integration** tab
5. Enter your Jira site URL (e.g. `https://yourcompany.atlassian.net`)
6. Enter your Jira email
7. Paste the API token
8. Click **Connect to Jira**

After connecting, type any story ID and click **Fetch** — the full story loads instantly.

---

## How to share with your team

### Option A — Send the folder
Zip the `jira-cost-app` folder and share via email or Teams.
Recipient unzips → double-clicks `index.html` → done.

### Option B — GitHub Pages (recommended)
```
1. Push this repo to GitHub
2. Go to Settings → Pages → Deploy from branch → main → / (root)
3. Save — wait ~60 seconds
4. Share: https://yourusername.github.io/costiq
```

### Option C — Netlify (30 seconds)
```
1. Go to app.netlify.com
2. Drag and drop the jira-cost-app folder
3. Get a public URL instantly
```

---

## Pricing reference

| Model | Input / 1M tokens | Output / 1M tokens | Best for |
|---|---|---|---|
| Claude Haiku 4.5 | $1.00 | $5.00 | Fast, simple tasks |
| **Claude Sonnet 4.6** | **$3.00** | **$15.00** | **Most stories — recommended** |
| Claude Opus 4.8 | $5.00 | $25.00 | Complex reasoning |

**Savings available:**
- Prompt caching → up to **90% off** repeated input tokens
- Batch API → **50% off** all tokens for non-real-time tasks
- Both combined → maximum saving

> Pricing verified June 2026. Check [platform.anthropic.com/pricing](https://platform.anthropic.com/pricing) for the latest.

---

## Cost formula

```
Total Cost = Input Cost + Output Cost

Input Cost  = (Input tokens  ÷ 1,000,000) × Input price
Output Cost = (Output tokens ÷ 1,000,000) × Output price

Example — medium Jira story on Sonnet 4.6:
Input:  25,000 tokens ÷ 1,000,000 × $3  = $0.075
Output:  8,000 tokens ÷ 1,000,000 × $15 = $0.120
Total                                     = $0.195
```

A 10-story sprint typically costs **$2–$5** in API costs — before caching discounts.

---

## Top 3 optimizations (from the Optimization Advisor)

| Priority | Action | Estimated saving |
|---|---|---|
| 1 | Add `.claudeignore` + keep `CLAUDE.md` under 200 lines | ~40% |
| 2 | Use `/clear` or `/compact` between unrelated tasks | ~35% |
| 3 | Route routine work to Sonnet / Haiku, reserve Opus for architecture | ~60% |

---

## Tech stack

| Layer | Technology |
|---|---|
| HTML | Plain HTML5 — no framework |
| CSS | Vanilla CSS with custom properties — light + dark mode |
| JavaScript | Vanilla JS — no build step, no dependencies |
| Charts | Chart.js 4.4.1 via CDN |
| Icons | Tabler Icons via CDN |
| Jira API | Atlassian REST API v3 via API token |
| Backend | None — runs 100% in the browser |

---

## File structure

```
jira-cost-app/
├── index.html      ← app structure, all 8 pages
├── style.css       ← all styling, light + dark mode
├── app.js          ← all logic: calculator, Jira, BRD, stories, advisor, Q&A
└── README.md       ← this file
```

Four files. That is the entire application.

---

## Why CostIQ?

Before CostIQ, answering "how much does it cost to use Claude Code?" meant explaining tokens, pricing tiers, prompt caching, and context windows from scratch — every time.

CostIQ wraps all of that into a single tool:
- The **Token Guide** explains the concepts in 2 minutes
- The **Calculator** gives you a number in 10 seconds
- The **Jira integration** fetches real story data automatically
- The **BRD and User Stories analysers** pre-calculate costs before implementation starts
- The **Sprint Tracker** gives leadership a full dashboard
- The **Optimization Advisor** tells you exactly where your money is going and how to cut it
- The **Q&A** prepares you for any client question

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## License

MIT — free to use, modify, and share.

---

<div align="center">

Built with 💡 by the development team &nbsp;|&nbsp; Powered by [Claude AI](https://anthropic.com) &nbsp;|&nbsp; CostIQ v2.0

</div>
