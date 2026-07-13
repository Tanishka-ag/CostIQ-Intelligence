<div align="center">

<img src="https://img.shields.io/badge/CostIQ-v2.0-5340c8?style=for-the-badge" alt="CostIQ v2.0">

# 💡 CostIQ
### Real-time Cost Intelligence

> **Estimate and track the cost of every Jira story built with Claude Code**

[![Built with HTML](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-orange?style=flat-square)](https://github.com)
[![No install needed](https://img.shields.io/badge/No%20install-just%20open%20index.html-brightgreen?style=flat-square)](https://github.com)
[![Dark mode](https://img.shields.io/badge/Dark%20mode-supported-5340c8?style=flat-square)](https://github.com)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.6-blue?style=flat-square)](https://anthropic.com)

</div>

---

## What is CostIQ?

CostIQ is a **standalone web application** that helps development teams understand, estimate, track, and optimize the cost of implementing Jira stories using Claude Code (Anthropic's AI coding tool).

No server. No login. No installation. Just open `index.html` in your browser and start calculating.

Built for developers, leads, and anyone who needs to explain AI development costs to a client or manager — in plain English.

---

## What's new in v2.0

- **BRD analyser** — upload a BRD document and get a full pre-calculated cost for implementing the entire project before a single story is written.
- **User stories analyser** — upload a user stories document and get a per-story cost breakdown with a bar chart, before writing a single line of code.
- **Optimization advisor** — a 6-question audit that generates a personalised priority list of what to fix to reduce your token costs, plus a potential saving calculator showing real dollar savings per month.

---

## Features

### 📖 Token guide — start here
- Plain-English explanation of what a token is
- Visual input vs output diagram
- The pricing formula explained step by step
- 4 ways to find your exact token count
- Full price reference table for all three Claude models

### 🧮 Story calculator
- Enter your Jira story ID, pick a model, choose a size preset (Small / Medium / Large)
- Live cost calculation as you type — no submit button needed
- Breaks down input cost and output cost separately
- Shows savings with **prompt caching** (up to 90% off) and **Batch API** (50% off)
- Sprint context — see what 10 stories at this rate would cost
- One-click add to sprint tracker

### 📄 BRD analyser
- Upload a BRD document (.txt or .md)
- Automatically detects sections using heading patterns
- Estimates how many user stories the BRD will generate
- Pre-calculates total implementation cost for the whole project
- Shows savings with prompt caching and Batch API at project level
- Detected sections list with individual token count and cost share per section

### 📋 User stories analyser
- Upload a user stories document (.txt or .md)
- Parses each story automatically — detects numbered, headed, and ID-prefixed formats (e.g. ABTCB-131, US-01, ## Story 1)
- Per-story cost table with tokens in, tokens out, full cost, and cached cost
- Bar chart comparing costs across all stories side by side
- One-click send all stories to sprint tracker

### 📊 Sprint tracker
- Track cost across every story in a sprint
- Add stories from the calculator, user stories analyser, or manually
- Live bar chart comparing full cost vs cost with caching
- Sprint totals — full cost, cached cost, average per story, total saving
- Remove individual stories or clear all

### 🔀 Workflow cost breakdown
- Your 8-step implementation workflow visualised (VS Code → git pull → Claude Code → build → checkout → push → PR → merge)
- Only Step 4 (building in Claude Code) costs money — Steps 1, 2, 3, 5, 6, 7, 8 are completely free
- Formula shown inline for Step 4

### 💡 Optimization advisor
- **6-question quick audit** — answer questions about your CLAUDE.md length, MCP servers, context clearing habits, model selection, ignore file, and plan mode usage
- **Personalised priority plan** — items ranked Critical / High / Medium / Good with exact actions and estimated savings per item
- **Optimization score** — colour-coded percentage showing how optimised your current workflow is
- **Potential saving calculator** — enter your monthly API spend, see how much each optimization saves you in dollars per month
- **6 optimization pillars** fully documented with dos and don'ts, real Claude Code commands, and a ready-to-copy `.claudeignore` template:
  - Match model to task — up to 60% saving
  - Keep CLAUDE.md under 200 lines — up to 30% saving
  - Add a .claudeignore file — up to 40% saving
  - Clear and compact context between tasks — up to 35% saving
  - Plan before implementing — up to 25% saving
  - Disconnect unused MCP servers — up to 20% saving

### ⚡ Claude Code vs GitHub Copilot
- Side-by-side feature comparison covering context window, benchmark scores, autonomous execution, and pricing
- Model routing table — which model for which task type
- Honest recommendation — use both, not one or the other
- Pricing comparison table for all plans

### ❓ Client Q&A
- Expandable answers to the most common client and manager questions
- Covers billing, tokens, Claude Code, privacy, and security
- Quick numbers reference table for use during calls

---

## How to run locally

**The simplest way — no setup needed:**

```
1. Download or clone this repository
2. Open the jira-cost-app folder
3. Double-click index.html
4. Done — it opens in your browser
```

**VS Code Live Server (recommended for development):**
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

## How to share with your team

### Option A — Send the folder (simplest)
Zip the `jira-cost-app` folder and share via email or Teams.
Recipient unzips → double-clicks `index.html` → done. No install needed.

### Option B — GitHub Pages (recommended)
Turn this repo into a live website anyone can open:
```
1. Push this repo to GitHub
2. Go to Settings → Pages → Deploy from branch → main → / (root)
3. Save — wait ~60 seconds
4. Share the URL: https://yourusername.github.io/costiq
```

### Option C — Netlify (30 seconds)
```
1. Go to app.netlify.com
2. Drag and drop the jira-cost-app folder onto the page
3. Get a public URL instantly — share it
```

---

## How to format documents for the analysers

### BRD analyser
Upload any `.txt` or `.md` file. CostIQ detects sections automatically using:
- Markdown headings (`## Section Name`)
- Numbered headings (`1. Introduction`)
- ALL CAPS section titles (`OVERVIEW`, `REQUIREMENTS:`)

### User stories analyser
Upload any `.txt` or `.md` file. CostIQ detects stories using:
- Jira-style IDs (`ABTCB-131`, `US-01`, `ST-05`)
- Markdown headings (`## Story 1: Upload document`)
- Numbered items (`1. As a user I want to...`)

Example format that works well:
```
## Story 1: Upload document
As a user I want to upload documents so that...
Acceptance Criteria:
- Upload tile renders with drag and drop zone
- PDF format enforced with inline error for other formats
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

A 10-story sprint typically costs **$2–$5** — before caching discounts.

---

## Top 3 optimizations

Based on the built-in Optimization Advisor — if you only do three things:

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
| CSS | Vanilla CSS with custom properties — light + dark mode auto-supported |
| JavaScript | Vanilla JS — no build step, no dependencies |
| Charts | Chart.js 4.4.1 via CDN |
| Icons | Tabler Icons via CDN |
| Backend | None — runs 100% in the browser |

> **Internet connection required** for Chart.js and Tabler Icons to load from CDN.
> For a fully offline version, download these files and update the `src` paths in `index.html`.

---

## File structure

```
jira-cost-app/
├── index.html      ← app structure, all 9 tabs
├── style.css       ← all styling, light + dark mode
├── app.js          ← all logic: calculator, BRD, stories, sprint, advisor, Q&A
└── README.md       ← this file
```

Four files. That is the entire application.

---

## Why CostIQ?

Before CostIQ, answering "how much does it cost to use Claude Code?" meant explaining tokens, pricing tiers, prompt caching, and context windows from scratch — every time.

CostIQ wraps all of that into a single tool:
- The **Token Guide** explains the concepts in 2 minutes
- The **Calculator** gives you a cost estimate in 10 seconds
- The **BRD and User Stories analysers** pre-calculate costs before implementation starts
- The **Sprint Tracker** gives leadership a full dashboard view
- The **Optimization Advisor** tells you exactly where your money is going and how to cut it
- The **Q&A** prepares you for any client or manager question

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
