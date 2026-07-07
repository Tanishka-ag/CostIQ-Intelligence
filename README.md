<div align="center">

<img src="https://img.shields.io/badge/CostIQ-v1.0-5340c8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMyAxN2gtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=" alt="CostIQ v1.0">

# 💡 CostIQ
### Real-time Cost Intelligence

> **Estimate and track the cost of every Jira story built with Claude Code**

**Estimate, track, and present the cost of implementing Jira stories with Claude AI — instantly.**

```
Repo name:   costiq
Description: Estimate and track the cost of every Jira story built with Claude Code
```

[![Made with HTML](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-orange?style=flat-square)](https://github.com)
[![No install needed](https://img.shields.io/badge/No%20install-just%20open%20index.html-brightgreen?style=flat-square)](https://github.com)
[![Dark mode](https://img.shields.io/badge/Dark%20mode-supported-5340c8?style=flat-square)](https://github.com)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.6-blue?style=flat-square)](https://anthropic.com)

</div>

---

## What is CostIQ?

CostIQ is a **standalone web application** that helps development teams understand, estimate, and track exactly how much it costs to implement Jira stories using Claude Code (Anthropic's AI coding tool).

No server. No login. No installation. Just open `index.html` in your browser and start calculating.

Built for developers, leads, and anyone who needs to explain AI development costs to a client or manager — in plain English.

---

## Screenshots

| Token Guide | Story Calculator | Sprint Tracker |
|---|---|---|
| Learn tokens first | Estimate any story | Track the full sprint |
| Start here → understand | Enter details → get cost | Add stories → see chart |

---

## Features

### 📖 Token Guide — start here
- Plain-English explanation of what a token is
- Visual input vs output diagram
- The pricing formula explained step by step
- 4 ways to find your exact token count
- Full price reference table for all three Claude models

### 🧮 Story Calculator
- Enter your Jira story ID, pick a model, choose a size preset
- Live cost calculation as you type — no submit button needed
- Breaks down input cost and output cost separately
- Shows savings with **prompt caching** (up to 90% off) and **Batch API** (50% off)
- Sprint context — see what 10 stories at this rate would cost
- One-click "Add to sprint tracker"

### 📋 Sprint Tracker
- Track cost across every story in a sprint
- Add stories from the calculator or enter manually
- Live bar chart comparing full cost vs cost with caching
- Sprint totals: full cost, cached cost, average per story, total saving
- Remove individual stories or clear all

### 🔀 Workflow Cost Breakdown
- Your full 8-step implementation workflow visualised
- Shows clearly that only **Step 4** (building in Claude Code) costs money
- Steps 1, 2, 3, 5, 6, 7, 8 are completely free (Git + GitHub)
- Formula shown inline for Step 4

### ⚡ Claude Code vs GitHub Copilot
- Side-by-side feature comparison
- Context window, benchmark scores, pricing, autonomous execution
- Honest recommendation: use both, not one or the other

### ❓ Client Q&A
- Expandable answers to the most common client and manager questions
- Covers billing, tokens, Claude Code, privacy, and security
- Quick numbers table for fast reference during calls

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

### Option A — Send the folder
Zip the `jira-cost-app` folder and share via email or Teams.
Recipient unzips → double-clicks `index.html` → done. No install needed.

### Option B — GitHub Pages (recommended)
Turn this repo into a live website anyone can open:

```
1. Push this repo to GitHub
2. Go to Settings → Pages
3. Source → Deploy from branch → main → / (root)
4. Save — wait ~60 seconds
5. Share the URL: https://yourusername.github.io/costiq
```

### Option C — Netlify (30 seconds)
```
1. Go to app.netlify.com
2. Drag and drop the jira-cost-app folder onto the page
3. Get a public URL instantly — share it
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

## Tech stack

| Layer | Technology |
|---|---|
| HTML | Plain HTML5 — no framework |
| CSS | Vanilla CSS with custom properties — light + dark mode |
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
├── index.html      ← app structure, all 6 pages
├── style.css       ← all styling, light + dark mode
├── app.js          ← all logic: calculator, sprint tracker, Q&A
└── README.md       ← this file
```

Four files. That's the entire application.

---

## Why CostIQ?

Before CostIQ, answering "how much does it cost to use Claude Code?" meant explaining tokens, pricing tiers, prompt caching, and context windows from scratch — every time.

CostIQ wraps all of that into a single tool:
- The **Token Guide** explains the concepts in 2 minutes
- The **Calculator** gives you a number in 10 seconds
- The **Sprint Tracker** gives leadership a dashboard
- The **Q&A** prepares you for any client question

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT — free to use, modify, and share.

---

<div align="center">

Built with 💡 by the development team &nbsp;|&nbsp; Powered by [Claude AI](https://anthropic.com) &nbsp;|&nbsp; CostIQ v1.0

</div>
