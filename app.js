'use strict';

// ── Pricing ──────────────────────────────────────────────────
const PRICES = {
  haiku:  { in: 1,  out: 5  },
  sonnet: { in: 3,  out: 15 },
  opus:   { in: 5,  out: 25 }
};

const PRESETS = {
  small:  { sys: 1500,  files: 8000,  chat: 1500, code: 3000,  runs: 1 },
  medium: { sys: 2500,  files: 20000, chat: 3000, code: 8000,  runs: 2 },
  large:  { sys: 4000,  files: 55000, chat: 6000, code: 15000, runs: 3 }
};

const SIZE_TOKENS = {
  small:  { in: 11000, out: 3000  },
  medium: { in: 25500, out: 8000  },
  large:  { in: 65000, out: 15000 }
};

// ── State ─────────────────────────────────────────────────────
let sprintStories = [];
let sprintChart = null;

// ── Helpers ───────────────────────────────────────────────────
function fmtCost(n) {
  if (n < 0.0005) return '<$0.001';
  return '$' + n.toFixed(3);
}

function fmtK(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function g(id) { return document.getElementById(id); }
function v(id) { return parseFloat(g(id).value) || 0; }
function vi(id) { return parseInt(g(id).value) || 0; }

// ── Navigation ────────────────────────────────────────────────
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  g('page-' + id).classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');
  }
  if (id === 'sprint') renderSprintChart();
}

// ── Calculator ────────────────────────────────────────────────
function calc() {
  const model = g('model').value;
  const p = PRICES[model];

  const sys   = vi('sys');
  const files = vi('files');
  const chat  = vi('chat');
  const code  = vi('code');
  const runs  = Math.max(1, vi('runs'));
  const jira  = g('jira-id').value.trim();

  const totalIn  = (sys + files + chat) * runs;
  const totalOut = code * runs;

  const inCost  = (totalIn  / 1_000_000) * p.in;
  const outCost = (totalOut / 1_000_000) * p.out;
  const total   = inCost + outCost;

  const cache = ((totalIn * 0.1) / 1_000_000) * p.in + outCost;
  const batch = total * 0.5;
  const both  = ((totalIn * 0.1) / 1_000_000) * p.in * 0.5 + outCost * 0.5;

  // Update DOM
  g('r-in').textContent       = fmtK(totalIn);
  g('r-out').textContent      = fmtK(totalOut);
  g('r-in-cost').textContent  = fmtCost(inCost);
  g('r-out-cost').textContent = fmtCost(outCost);
  g('r-total').textContent    = fmtCost(total);
  g('r-jira-label').textContent = jira ? jira + ' — estimated cost' : 'Estimated cost';
  g('r-cache').textContent    = fmtCost(cache);
  g('r-batch').textContent    = fmtCost(batch);
  g('r-both').textContent     = fmtCost(both);

  g('r-breakdown').innerHTML =
    'Input:&nbsp; <span>' + fmtK(totalIn) + ' ÷ 1,000,000 × $' + p.in + ' = ' + fmtCost(inCost) + '</span><br>' +
    'Output: <span>' + fmtK(totalOut) + ' ÷ 1,000,000 × $' + p.out + ' = ' + fmtCost(outCost) + '</span><br>' +
    'Total:&nbsp; <span>' + fmtCost(inCost) + ' + ' + fmtCost(outCost) + ' = ' + fmtCost(total) + '</span>';

  g('r-sprint10').textContent       = fmtCost(total * 10);
  g('r-sprint10-cache').textContent = fmtCost(cache * 10);

  return { jira, model, totalIn, totalOut, total, cache, size: 'custom' };
}

// ── Presets ───────────────────────────────────────────────────
function loadPreset(size) {
  const p = PRESETS[size];
  g('sys').value   = p.sys;
  g('files').value = p.files;
  g('chat').value  = p.chat;
  g('code').value  = p.code;
  g('runs').value  = p.runs;

  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');

  calc();
}

// ── Sprint tracker ────────────────────────────────────────────
function addToSprint() {
  const d = calc();
  const jira = g('jira-id').value.trim() || ('Story ' + (sprintStories.length + 1));
  sprintStories.push({
    id: jira,
    size: 'custom',
    model: d.model,
    inT: d.totalIn,
    outT: d.totalOut,
    cost: d.total,
    cache: d.cache
  });
  updateNavBadge();
  renderSprint();

  // Switch to sprint page
  showPage('sprint', null);
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-item')[2].classList.add('active');
}

function addManual() {
  const id    = g('sp-id').value.trim() || ('Story ' + (sprintStories.length + 1));
  const size  = g('sp-size').value;
  const model = g('sp-model').value;
  const t     = SIZE_TOKENS[size];
  const p     = PRICES[model];

  const inCost  = (t.in  / 1_000_000) * p.in;
  const outCost = (t.out / 1_000_000) * p.out;
  const cost    = inCost + outCost;
  const cache   = ((t.in * 0.1) / 1_000_000) * p.in + outCost;

  sprintStories.push({ id, size, model, inT: t.in, outT: t.out, cost, cache });
  g('sp-id').value = '';
  updateNavBadge();
  renderSprint();
}

function removeStory(i) {
  sprintStories.splice(i, 1);
  updateNavBadge();
  renderSprint();
}

function clearSprint() {
  if (!sprintStories.length) return;
  if (confirm('Clear all stories from this sprint?')) {
    sprintStories = [];
    updateNavBadge();
    renderSprint();
  }
}

function updateNavBadge() {
  const badge = g('nav-badge');
  if (sprintStories.length > 0) {
    badge.textContent = sprintStories.length;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function renderSprint() {
  const tbody = g('sprint-body');

  if (!sprintStories.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No stories yet. Add one from the Story calculator tab or use the form above.</td></tr>';
    g('sm-count').textContent  = '0';
    g('sm-total').textContent  = '$0.000';
    g('sm-cache').textContent  = '$0.000';
    g('sm-avg').textContent    = '—';
    g('sm-saving').textContent = '$0.000';
    renderSprintChart();
    return;
  }

  let totalCost = 0, totalCache = 0;

  tbody.innerHTML = sprintStories.map((s, i) => {
    totalCost  += s.cost;
    totalCache += s.cache;
    const saving = s.cost - s.cache;

    const sizeLabels = { small: 'S', medium: 'M', large: 'L', custom: 'C' };
    const sizeClasses = { small: 's', medium: 'm', large: 'l', custom: 'c' };
    const sizeTag = `<span class="size-tag ${sizeClasses[s.size]}">${sizeLabels[s.size]}</span>`;

    return `<tr>
      <td style="font-weight:500">${escHtml(s.id)}</td>
      <td>${sizeTag}</td>
      <td class="muted">${s.model}</td>
      <td class="muted">${fmtK(s.inT)}</td>
      <td class="muted">${fmtK(s.outT)}</td>
      <td class="accent">${fmtCost(s.cost)}</td>
      <td class="success">${fmtCost(s.cache)}</td>
      <td class="success" style="font-size:12px">${fmtCost(saving)}</td>
      <td><button class="remove-btn" onclick="removeStory(${i})" aria-label="Remove ${escHtml(s.id)}">Remove</button></td>
    </tr>`;
  }).join('');

  const totalSaving = totalCost - totalCache;
  g('sm-count').textContent  = sprintStories.length;
  g('sm-total').textContent  = fmtCost(totalCost);
  g('sm-cache').textContent  = fmtCost(totalCache);
  g('sm-avg').textContent    = fmtCost(totalCost / sprintStories.length);
  g('sm-saving').textContent = fmtCost(totalSaving);

  renderSprintChart();
}

function renderSprintChart() {
  const canvas = g('sprint-chart');
  if (!canvas) return;

  if (sprintChart) { sprintChart.destroy(); sprintChart = null; }
  if (!sprintStories.length) return;

  sprintChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sprintStories.map(s => s.id),
      datasets: [
        {
          label: 'Full cost',
          data: sprintStories.map(s => parseFloat(s.cost.toFixed(5))),
          backgroundColor: '#2a78d6',
          borderRadius: 4
        },
        {
          label: 'With caching',
          data: sprintStories.map(s => parseFloat(s.cache.toFixed(5))),
          backgroundColor: '#1baf7a',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { font: { size: 11 }, color: '#898781' },
          grid: { display: false }
        },
        y: {
          ticks: {
            callback: v => '$' + v.toFixed(3),
            font: { size: 11 },
            color: '#898781'
          },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
}

// ── Q&A data ──────────────────────────────────────────────────
const QNA_DATA = {
  billing: [
    {
      q: 'What exactly is a token?',
      a: 'Think of it like a word-chunk. Claude reads in small pieces called tokens. One token is roughly one small word or part of a long word. "Hello" = 1 token, "Unbelievable" = 3 tokens, a full paragraph = about 80–100 tokens. You pay based on how many pieces Claude reads and writes.'
    },
    {
      q: 'What is the difference between input and output tokens?',
      a: 'Input tokens = everything you send to Claude (your instructions, the story description, code files). Output tokens = everything Claude writes back (the generated code, tests, explanations). Writing always costs more than reading — output is priced 5× higher than input.'
    },
    {
      q: 'How much does Claude cost?',
      a: 'It depends on the model. Haiku 4.5 is cheapest at $1 input / $5 output per million tokens — good for simple tasks. Sonnet 4.6 is $3 / $15 per million tokens — recommended for most stories. Opus 4.8 is $5 / $25 per million tokens — for the most complex reasoning tasks. To put this in perspective: 1 million tokens is roughly 750,000 words.'
    },
    {
      q: 'Is it a monthly subscription or pay-as-you-go?',
      a: 'Pay-as-you-go, like your electricity bill. You only pay for what you actually use. If there is a quiet month — like during UAT or maintenance — your bill automatically drops. There is no fixed monthly fee just for having API access.'
    },
    {
      q: 'How much does one typical API call cost?',
      a: 'Very little. A typical document upload validation on Sonnet 4.6 costs about 1 to 3 cents. A full medium Jira story implementation costs around 20–40 cents including all runs. You would need tens of thousands of calls a month before the bill becomes significant for a business.'
    },
    {
      q: 'What is prompt caching and how does it save money?',
      a: 'Imagine you hand Claude a 10-page instruction manual before every task. Normally you pay to re-read that manual every single call. Prompt caching means Claude keeps it on the desk and remembers it — you only pay for it once. This saves up to 90% on the repeated parts of your input, which is huge for a project with long fixed system instructions.'
    },
    {
      q: 'What is the Batch API?',
      a: 'If a task does not need an instant answer — like processing 500 loan applications overnight — you can use the Batch API. It is like choosing standard delivery instead of express. Same quality, but 50% cheaper across all models, because Anthropic runs it during off-peak hours.'
    },
    {
      q: 'Can our bill spiral out of control?',
      a: 'Only if there are no guardrails in place — and we put guardrails in. Every API call has a maximum response length set, so Claude cannot write endlessly. Anthropic also lets you set spend alerts in their dashboard, just like a mobile data cap. You get notified before anything gets out of hand.'
    },
    {
      q: 'How much does implementing a full sprint cost?',
      a: 'A 10-story sprint using Sonnet 4.6 with medium complexity per story, and 2 runs per story, costs roughly $3–$5 in API costs for the whole sprint. With prompt caching this can drop to $1–$2. That is an extraordinary return for the developer time saved.'
    }
  ],
  claude: [
    {
      q: 'What is Claude Code in plain English?',
      a: 'It is like hiring a contractor who works in your terminal. You give it a task in plain words — "build this Jira story," "fix this bug," "write tests for this module" — and it reads your codebase, makes a plan, writes the code, runs the tests, fixes any failures, and comes back with the finished work. You do not guide it step by step.'
    },
    {
      q: 'What is the real difference between Claude Code and GitHub Copilot?',
      a: 'Copilot is autocomplete on steroids — it sits in your editor and suggests the next line as you type. Claude Code is a contractor — you give it a whole job, it goes away and does it, and comes back with the work done. Different tools, different jobs. Most teams use both.'
    },
    {
      q: 'Why does Claude Code handle bigger tasks better than Copilot?',
      a: 'Claude Code can hold up to 1 million tokens in a single session — basically your entire codebase at once. It can understand how a change in the document service affects the loan flow component, all in one go. Copilot can only see 32K–128K tokens at a time, so on large projects it frequently loses track of how files connect.'
    },
    {
      q: 'How is Claude Code priced?',
      a: 'Claude Code uses a subscription — Pro at $20/month for moderate use, Max 5× at $100/month for heavy daily use, Max 20× at $200/month for power users. This is separate from your API costs. Anthropic\'s own data shows 90% of Claude Code users stay under $30 per active day.'
    },
    {
      q: 'Do we have to choose Claude Code or Copilot?',
      a: 'No. Most professional teams use both. Copilot handles day-to-day coding in the IDE — fast autocomplete while you type. Claude Code handles the big tasks in the terminal — implementing a full Jira story, large refactors, complex multi-file changes. They do not conflict at all.'
    }
  ],
  privacy: [
    {
      q: 'Does Claude remember our users between sessions?',
      a: 'No. Every API call starts completely fresh. Claude has no memory of previous conversations unless your application specifically passes that history along in the next call. For a banking portal this is actually good — users\' data does not leak between sessions by default.'
    },
    {
      q: 'Does Anthropic use our code or data to train their models?',
      a: 'Not under enterprise agreements. Anthropic offers zero-data-retention (ZDR) contracts where they commit to not storing, logging, or training on your data. This is standard for regulated industries like banking and is confirmed before anything goes live.'
    },
    {
      q: 'Where is our data processed — which country?',
      a: 'By default, Anthropic processes requests on US-based infrastructure. If your project requires data to stay in a specific region (like within the EU or India for regulatory reasons), Anthropic offers data residency options. This is confirmed with Anthropic\'s enterprise team early in the project.'
    },
    {
      q: 'Is Claude Code safe for our banking codebase?',
      a: 'Yes. Claude Code works on your local machine — it reads and writes your files locally. Data sent to Anthropic goes via standard encrypted HTTPS API calls, the same as any other cloud service. For enterprise deployments, zero-data-retention agreements mean Anthropic does not store or train on your code.'
    },
    {
      q: 'What if Claude makes a mistake in the generated code?',
      a: 'Like any tool, Claude can occasionally get things wrong on unusual edge cases. The rule for a banking portal is: Claude assists and accelerates, but your application code validates the output. Claude\'s output goes through your normal code review process (PR review) before merging. Never trust any generated code blindly for anything financial or compliance-related.'
    }
  ]
};

function buildQnA() {
  function makeList(containerId, items) {
    const container = g(containerId);
    container.innerHTML = items.map((item, i) => `
      <div class="qna-item" id="qna-${containerId}-${i}">
        <div class="qna-q" onclick="toggleQnA('${containerId}', ${i})" tabindex="0" role="button" aria-expanded="false">
          <span>${escHtml(item.q)}</span>
          <i class="ti ti-chevron-down" aria-hidden="true"></i>
        </div>
        <div class="qna-a">${escHtml(item.a)}</div>
      </div>
    `).join('');
  }
  makeList('qna-list-billing', QNA_DATA.billing);
  makeList('qna-list-claude',  QNA_DATA.claude);
  makeList('qna-list-privacy', QNA_DATA.privacy);
}

function toggleQnA(listId, index) {
  const item = g(`qna-${listId}-${index}`);
  const isOpen = item.classList.contains('open');
  item.classList.toggle('open', !isOpen);
  item.querySelector('.qna-q').setAttribute('aria-expanded', String(!isOpen));
}

// ── Utility ───────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  calc();
  buildQnA();
});

// ── BRD & User Stories state ──────────────────────────────────
let brdContent = null;
let storiesContent = null;
let storiesChart = null;

// ── File handling ─────────────────────────────────────────────
function handleDrop(e, type) {
  e.preventDefault();
  document.getElementById(type + '-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file, type);
}

function handleFileSelect(e, type) {
  const file = e.target.files[0];
  if (file) processFile(file, type);
}

function processFile(file, type) {
  if (!file.name.match(/\.(txt|md)$/i)) {
    alert('Please upload a .txt or .md file.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    if (type === 'brd') {
      brdContent = content;
      showFileInfo('brd', file.name, file.size, content);
      analyseBRD(content, file.name);
    } else {
      storiesContent = content;
      showFileInfo('stories', file.name, file.size, content);
      analyseStories(content, file.name);
    }
  };
  reader.readAsText(file);
}

function showFileInfo(type, name, size, content) {
  const info = g(type + '-file-info');
  const kb = (size / 1024).toFixed(1);
  const tokens = estimateTokens(content);
  info.style.display = 'flex';
  info.innerHTML = `
    <i class="ti ti-file-check file-info-icon" aria-hidden="true"></i>
    <div>
      <div class="file-info-name">${escHtml(name)}</div>
      <div class="file-info-size">${kb} KB &nbsp;·&nbsp; ~${fmtK(tokens)} tokens detected</div>
    </div>
    <i class="ti ti-x file-info-remove" aria-hidden="true" onclick="clearFile('${type}')" title="Remove file"></i>
  `;
}

function clearFile(type) {
  if (type === 'brd') {
    brdContent = null;
    g('brd-file').value = '';
    g('brd-file-info').style.display = 'none';
    g('brd-results').style.display = 'none';
    g('brd-empty-state').style.display = 'block';
  } else {
    storiesContent = null;
    g('stories-file').value = '';
    g('stories-file-info').style.display = 'none';
    g('stories-results').style.display = 'none';
    g('stories-empty-state').style.display = 'block';
    if (storiesChart) { storiesChart.destroy(); storiesChart = null; }
  }
}

// ── Token estimation ──────────────────────────────────────────
function estimateTokens(text) {
  // ~4 chars per token average
  return Math.round(text.length / 4);
}

// ── BRD Analysis ──────────────────────────────────────────────
function analyseBRD(content, filename) {
  const sections = detectSections(content);
  const model = g('brd-model').value;
  const storiesPerSection = parseInt(g('brd-stories-per-section').value) || 3;
  const runs = parseInt(g('brd-runs').value) || 2;
  renderBRDResults(sections, content, filename, model, storiesPerSection, runs);
}

function recalcBRD() {
  if (!brdContent) return;
  const filename = g('brd-file-info').querySelector('.file-info-name').textContent;
  analyseBRD(brdContent, filename);
}

function detectSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentLines = [];

  const headingRe = /^(#{1,3}|[A-Z][A-Z\s]{2,}:?$|\d+\.\s+[A-Z])/;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (headingRe.test(trimmed) && trimmed.length > 3 && trimmed.length < 100) {
      if (currentSection && currentLines.length > 0) {
        sections.push({ name: currentSection, content: currentLines.join('\n') });
      }
      currentSection = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
      currentLines = [];
    } else if (currentSection) {
      currentLines.push(line);
    } else {
      currentSection = 'Introduction';
      currentLines.push(line);
    }
  });

  if (currentSection && currentLines.length > 0) {
    sections.push({ name: currentSection, content: currentLines.join('\n') });
  }

  // Fallback: if no sections detected, treat whole doc as one section
  if (sections.length === 0) {
    sections.push({ name: 'Full Document', content: content });
  }

  return sections;
}

function renderBRDResults(sections, content, filename, model, storiesPerSection, runs) {
  const p = PRICES[model];
  const docTokens = estimateTokens(content);
  const estStories = sections.length * storiesPerSection;

  // Per story: doc tokens as shared context + story-specific tokens + output
  const avgStoryInput = Math.round(docTokens / sections.length); // per section
  const avgStoryOutput = 6000; // typical medium story output
  const totalInput = (docTokens + avgStoryInput * estStories) * runs;
  const totalOutput = avgStoryOutput * estStories * runs;

  const inCost  = (totalInput  / 1e6) * p.in;
  const outCost = (totalOutput / 1e6) * p.out;
  const total   = inCost + outCost;
  const cache   = ((totalInput * 0.1) / 1e6) * p.in + outCost;
  const batch   = total * 0.5;
  const both    = ((totalInput * 0.1) / 1e6) * p.in * 0.5 + outCost * 0.5;

  g('brd-empty-state').style.display = 'none';
  g('brd-results').style.display = 'block';

  g('brd-doc-name').textContent = filename.replace(/\.(txt|md)$/i, '');
  g('brd-total-cost').textContent = fmtCost(total);
  g('brd-sections').textContent = sections.length;
  g('brd-est-stories').textContent = estStories;
  g('brd-doc-tokens').textContent = fmtK(docTokens);
  g('brd-impl-tokens').textContent = fmtK(totalInput + totalOutput);
  g('brd-cache').textContent = fmtCost(cache);
  g('brd-batch').textContent = fmtCost(batch);
  g('brd-both').textContent = fmtCost(both);

  g('brd-breakdown').innerHTML =
    `BRD document: <span>${fmtK(docTokens)} tokens detected</span><br>` +
    `Estimated stories: <span>${estStories} (${sections.length} sections × ${storiesPerSection} stories)</span><br>` +
    `Input cost: <span>${fmtK(totalInput)} tokens ÷ 1M × $${p.in} = ${fmtCost(inCost)}</span><br>` +
    `Output cost: <span>${fmtK(totalOutput)} tokens ÷ 1M × $${p.out} = ${fmtCost(outCost)}</span><br>` +
    `Total: <span>${fmtCost(inCost)} + ${fmtCost(outCost)} = ${fmtCost(total)}</span>`;

  // Render sections list
  const list = g('brd-sections-list');
  list.innerHTML = sections.map(s => {
    const st = estimateTokens(s.content);
    const sc = ((st * runs / 1e6) * p.in) + ((avgStoryOutput * storiesPerSection * runs / 1e6) * p.out);
    return `<div class="section-item">
      <span class="section-item-name">${escHtml(s.name)}</span>
      <span class="section-item-tokens">${fmtK(st)} tokens</span>
      <span class="section-item-cost">${fmtCost(sc)}</span>
    </div>`;
  }).join('');
}

// ── User Stories Analysis ─────────────────────────────────────
function analyseStories(content, filename) {
  const stories = parseStories(content);
  const model = g('stories-model').value;
  const codebaseTokens = parseInt(g('stories-codebase').value) || 20000;
  const runs = parseInt(g('stories-runs').value) || 2;
  renderStoriesResults(stories, filename, model, codebaseTokens, runs);
}

function recalcStories() {
  if (!storiesContent) return;
  const filename = g('stories-file-info').querySelector('.file-info-name').textContent;
  analyseStories(storiesContent, filename);
}

function parseStories(content) {
  const stories = [];
  // Match common story patterns
  const storyRe = /(?:^|\n)(?:#{1,3}\s*(?:Story|US|User Story)\s*[\d#:-]*[^\n]*|(?:ABTCB|US|ST|STORY)-\d+[^\n]*|\d+\.\s+(?:As a|Story:|User Story:)[^\n]*)/gi;
  const matches = [...content.matchAll(storyRe)];

  if (matches.length > 1) {
    // Multiple stories found — split by match positions
    matches.forEach((match, i) => {
      const start = match.index;
      const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
      const storyContent = content.slice(start, end).trim();
      const title = match[0].trim().replace(/^#+\s*/, '').slice(0, 60);
      stories.push({ title, content: storyContent });
    });
  } else {
    // Try splitting by double newlines + numbered lines
    const chunks = content.split(/\n\s*\n/).filter(c => c.trim().length > 30);
    if (chunks.length > 1) {
      chunks.forEach((chunk, i) => {
        const firstLine = chunk.trim().split('\n')[0].slice(0, 60);
        stories.push({ title: firstLine || `Story ${i + 1}`, content: chunk.trim() });
      });
    } else {
      // Single block — treat as one story
      const firstLine = content.trim().split('\n')[0].slice(0, 60);
      stories.push({ title: firstLine || 'Story 1', content: content.trim() });
    }
  }

  return stories.slice(0, 50); // cap at 50 stories
}

function renderStoriesResults(stories, filename, model, codebaseTokens, runs) {
  const p = PRICES[model];

  const storyData = stories.map(s => {
    const storyTokens = estimateTokens(s.content);
    const inputT = (storyTokens + codebaseTokens + 1500) * runs; // story + codebase + chat
    const outputT = 6000 * runs; // typical output per story
    const cost = ((inputT / 1e6) * p.in) + ((outputT / 1e6) * p.out);
    const cache = ((inputT * 0.1 / 1e6) * p.in) + ((outputT / 1e6) * p.out);
    return { ...s, storyTokens, inputT, outputT, cost, cache };
  });

  const totalCost   = storyData.reduce((a, s) => a + s.cost, 0);
  const totalTokens = storyData.reduce((a, s) => a + s.inputT + s.outputT, 0);
  const totalCache  = storyData.reduce((a, s) => a + s.cache, 0);
  const batch       = totalCost * 0.5;
  const both        = totalCache * 0.5;

  g('stories-empty-state').style.display = 'none';
  g('stories-results').style.display = 'block';

  g('stories-doc-name').textContent = filename.replace(/\.(txt|md)$/i, '');
  g('stories-total-cost').textContent = fmtCost(totalCost);
  g('stories-count').textContent = stories.length;
  g('stories-total-tokens').textContent = fmtK(totalTokens);
  g('stories-avg').textContent = fmtCost(totalCost / stories.length);
  g('stories-cache-total').textContent = fmtCost(totalCache);
  g('stories-cache').textContent = fmtCost(totalCache);
  g('stories-batch').textContent = fmtCost(batch);
  g('stories-both').textContent = fmtCost(both);

  g('stories-breakdown').innerHTML =
    `Stories detected: <span>${stories.length}</span><br>` +
    `Shared codebase: <span>${fmtK(codebaseTokens)} tokens per story</span><br>` +
    `Total input cost: <span>${fmtCost(storyData.reduce((a,s) => a + (s.inputT/1e6)*p.in, 0))}</span><br>` +
    `Total output cost: <span>${fmtCost(storyData.reduce((a,s) => a + (s.outputT/1e6)*p.out, 0))}</span><br>` +
    `Total: <span>${fmtCost(totalCost)}</span>`;

  // Table
  const tbody = g('stories-table-body');
  tbody.innerHTML = storyData.map((s, i) => `
    <tr>
      <td class="muted">${i + 1}</td>
      <td style="font-size:12px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${escHtml(s.title)}">${escHtml(s.title)}</td>
      <td class="muted">${fmtK(s.inputT)}</td>
      <td class="muted">${fmtK(s.outputT)}</td>
      <td class="accent">${fmtCost(s.cost)}</td>
      <td class="success">${fmtCost(s.cache)}</td>
    </tr>
  `).join('');

  // Chart
  const canvas = g('stories-chart');
  if (storiesChart) { storiesChart.destroy(); storiesChart = null; }
  if (storyData.length > 0) {
    storiesChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: storyData.map((s, i) => s.title.slice(0, 18) || `Story ${i+1}`),
        datasets: [
          { label: 'Full cost', data: storyData.map(s => parseFloat(s.cost.toFixed(5))), backgroundColor: '#5340c8', borderRadius: 4 },
          { label: 'With caching', data: storyData.map(s => parseFloat(s.cache.toFixed(5))), backgroundColor: '#3b6d11', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 10 }, color: '#898781', maxRotation: 45 }, grid: { display: false } },
          y: { ticks: { callback: v => '$' + v.toFixed(3), font: { size: 11 }, color: '#898781' }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    });
  }

  // Store for sprint transfer
  window._parsedStories = storyData;
}

function sendStoriesToSprint() {
  if (!window._parsedStories || !window._parsedStories.length) return;
  const model = g('stories-model').value;
  window._parsedStories.forEach((s, i) => {
    sprintStories.push({
      id: s.title.slice(0, 20) || `Story ${i + 1}`,
      size: 'custom',
      model,
      inT: s.inputT,
      outT: s.outputT,
      cost: s.cost,
      cache: s.cache
    });
  });
  updateNavBadge();
  renderSprint();
  showPage('sprint', null);
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  // activate sprint nav item
  document.querySelectorAll('.nav-item')[4].classList.add('active');
}

// ── Jira OAuth Config ─────────────────────────────────────────
const JIRA_CLIENT_ID     = '7bhahgH05sfpcYCYNdSzA9QQxFFCZofT';
const JIRA_REDIRECT_URI  = 'https://tanishka-ag.github.io/CostIQ-Intelligence/';
const JIRA_SCOPE         = 'read:jira-work read:jira-user offline_access';
const JIRA_AUTH_URL      = 'https://auth.atlassian.com/authorize';
const JIRA_TOKEN_URL     = 'https://auth.atlassian.com/oauth/token';
const JIRA_API_BASE      = 'https://api.atlassian.com';

// ── Jira state ────────────────────────────────────────────────
let jiraToken       = null;
let jiraCloudId     = null;
let jiraSiteName    = null;
let currentStoryEst = null;
let jiraHistory     = [];

// ── PKCE helpers ──────────────────────────────────────────────
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => chars[b % chars.length]).join('');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── Connect to Jira ───────────────────────────────────────────
async function connectJira() {
  const verifier  = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  const state     = generateRandomString(16);

  // Store for after redirect
  sessionStorage.setItem('jira_verifier', verifier);
  sessionStorage.setItem('jira_state', state);

  const params = new URLSearchParams({
    audience:              'api.atlassian.com',
    client_id:             JIRA_CLIENT_ID,
    scope:                 JIRA_SCOPE,
    redirect_uri:          JIRA_REDIRECT_URI,
    state:                 state,
    response_type:         'code',
    prompt:                'consent',
    code_challenge:        challenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${JIRA_AUTH_URL}?${params.toString()}`;
}

// ── Handle OAuth callback ─────────────────────────────────────
async function handleOAuthCallback() {
  const params   = new URLSearchParams(window.location.search);
  const code     = params.get('code');
  const state    = params.get('state');
  const error    = params.get('error');

  if (error) {
    alert('Jira authorisation failed: ' + error);
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  if (!code) return;

  const savedState    = sessionStorage.getItem('jira_state');
  const verifier      = sessionStorage.getItem('jira_verifier');

  if (state !== savedState) {
    alert('Security error: state mismatch. Please try connecting again.');
    return;
  }

  // Clean URL
  window.history.replaceState({}, document.title, window.location.pathname);

  try {
    // Exchange code for token
    const tokenRes = await fetch(JIRA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type:    'authorization_code',
        client_id:     JIRA_CLIENT_ID,
        code,
        redirect_uri:  JIRA_REDIRECT_URI,
        code_verifier: verifier
      })
    });

    if (!tokenRes.ok) throw new Error('Token exchange failed');
    const tokenData = await tokenRes.json();
    jiraToken = tokenData.access_token;

    // Store token
    sessionStorage.setItem('jira_access_token', jiraToken);
    sessionStorage.removeItem('jira_verifier');
    sessionStorage.removeItem('jira_state');

    // Get cloud ID
    await loadJiraSites();
    showJiraConnected();

    // Navigate to jira page
    showPage('jira', null);
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-item')[2].classList.add('active');

  } catch (err) {
    alert('Failed to connect to Jira: ' + err.message + '\n\nPlease try again.');
  }
}

async function loadJiraSites() {
  const res  = await fetch(`${JIRA_API_BASE}/oauth/token/accessible-resources`, {
    headers: { 'Authorization': `Bearer ${jiraToken}`, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Could not load Jira sites');
  const sites = await res.json();
  if (!sites.length) throw new Error('No accessible Jira sites found');

  // Use first site
  jiraCloudId  = sites[0].id;
  jiraSiteName = sites[0].name + ' (' + sites[0].url + ')';
  sessionStorage.setItem('jira_cloud_id',  jiraCloudId);
  sessionStorage.setItem('jira_site_name', jiraSiteName);
}

function showJiraConnected() {
  g('jira-connect-section').style.display   = 'none';
  g('jira-connected-section').style.display = 'block';
  g('jira-site-name').textContent = jiraSiteName || 'Connected';
}

function disconnectJira() {
  jiraToken = jiraCloudId = jiraSiteName = null;
  sessionStorage.removeItem('jira_access_token');
  sessionStorage.removeItem('jira_cloud_id');
  sessionStorage.removeItem('jira_site_name');
  g('jira-connect-section').style.display   = 'block';
  g('jira-connected-section').style.display = 'none';
  g('jira-story-card').style.display        = 'none';
  g('jira-estimate-card').style.display     = 'none';
  g('jira-estimate-empty').style.display    = 'block';
}

// ── Restore session ───────────────────────────────────────────
function restoreJiraSession() {
  const token    = sessionStorage.getItem('jira_access_token');
  const cloudId  = sessionStorage.getItem('jira_cloud_id');
  const siteName = sessionStorage.getItem('jira_site_name');
  if (token && cloudId) {
    jiraToken    = token;
    jiraCloudId  = cloudId;
    jiraSiteName = siteName;
    showJiraConnected();
  }
}

// ── Fetch Jira story ──────────────────────────────────────────
async function fetchJiraStory() {
  const storyId = g('jira-story-id').value.trim().toUpperCase();
  if (!storyId) { showJiraError('Please enter a Jira story ID.'); return; }

  g('jira-fetch-error').style.display   = 'none';
  g('jira-fetch-loading').style.display = 'flex';
  g('fetch-btn').disabled = true;

  try {
    const url = `${JIRA_API_BASE}/ex/jira/${jiraCloudId}/rest/api/3/issue/${storyId}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${jiraToken}`, 'Accept': 'application/json' }
    });

    if (res.status === 401) { disconnectJira(); throw new Error('Session expired. Please reconnect to Jira.'); }
    if (res.status === 404) throw new Error(`Story "${storyId}" not found. Check the story ID and try again.`);
    if (!res.ok)            throw new Error(`Failed to fetch story (${res.status}). Please try again.`);

    const data = await res.json();
    displayJiraStory(data);

  } catch (err) {
    showJiraError(err.message);
  } finally {
    g('jira-fetch-loading').style.display = 'none';
    g('fetch-btn').disabled = false;
  }
}

function showJiraError(msg) {
  const el = g('jira-fetch-error');
  el.style.display = 'flex';
  el.innerHTML = `<i class="ti ti-alert-circle" aria-hidden="true"></i> ${escHtml(msg)}`;
}

function extractText(doc) {
  if (!doc) return '—';
  if (typeof doc === 'string') return doc;
  // Atlassian Document Format (ADF) → plain text
  if (doc.content) {
    return doc.content.map(block => {
      if (block.type === 'paragraph' && block.content) {
        return block.content.map(n => n.text || '').join('');
      }
      if (block.type === 'bulletList' && block.content) {
        return block.content.map(li => '• ' + (li.content?.[0]?.content?.map(n => n.text || '').join('') || '')).join('\n');
      }
      if (block.type === 'orderedList' && block.content) {
        return block.content.map((li, i) => `${i+1}. ` + (li.content?.[0]?.content?.map(n => n.text || '').join('') || '')).join('\n');
      }
      if (block.type === 'heading' && block.content) {
        return block.content.map(n => n.text || '').join('');
      }
      return '';
    }).filter(Boolean).join('\n\n');
  }
  return '—';
}

function displayJiraStory(data) {
  const fields = data.fields;
  const id     = data.key;

  const title      = fields.summary || '—';
  const status     = fields.status?.name || '—';
  const points     = fields.story_points || fields.customfield_10016 || fields.customfield_10028 || '—';
  const assignee   = fields.assignee?.displayName || 'Unassigned';
  const descText   = extractText(fields.description);

  // Try to detect acceptance criteria in description
  let acText = '';
  const acMatch = descText.match(/acceptance criteria[:\s]*([\s\S]*?)(?:\n\n|$)/i);
  if (acMatch) acText = acMatch[1].trim();

  g('jira-story-badge').textContent    = id;
  g('jira-story-title').textContent    = title;
  g('jira-story-status').textContent   = status;
  g('jira-story-points').textContent   = points;
  g('jira-story-assignee').textContent = assignee;
  g('jira-story-desc').textContent     = descText || '—';

  if (acText) {
    g('jira-story-ac').textContent    = acText;
    g('jira-ac-field').style.display  = 'flex';
  } else {
    g('jira-ac-field').style.display  = 'none';
  }

  g('jira-story-card').style.display = 'block';

  // Store for estimation
  window._jiraStoryData = { id, title, descText, acText, points };
  estimateJiraCost();
}

function estimateJiraCost() {
  if (!window._jiraStoryData) return;
  const { id, title, descText, acText } = window._jiraStoryData;

  const model = g('jira-model').value;
  const runs  = parseInt(g('jira-runs').value) || 2;
  const p     = PRICES[model];

  const storyText   = title + '\n' + descText + '\n' + acText;
  const storyTokens = estimateTokens(storyText);
  const inputT      = (storyTokens + 20000 + 1500) * runs; // story + codebase + chat
  const outputT     = 6000 * runs;

  const inCost  = (inputT  / 1e6) * p.in;
  const outCost = (outputT / 1e6) * p.out;
  const total   = inCost + outCost;

  currentStoryEst = { id, total, inputT, outputT, model };

  g('jira-est-label').textContent    = id + ' — estimated cost';
  g('jira-est-cost').textContent     = fmtCost(total);
  g('jira-story-tokens').textContent = fmtK(storyTokens);
  g('jira-output-tokens').textContent= fmtK(outputT);
  g('jira-in-cost').textContent      = fmtCost(inCost);
  g('jira-out-cost').textContent     = fmtCost(outCost);
  g('jira-breakdown').innerHTML      =
    `Input: <span>${fmtK(inputT)} tokens ÷ 1M × $${p.in} = ${fmtCost(inCost)}</span><br>` +
    `Output: <span>${fmtK(outputT)} tokens ÷ 1M × $${p.out} = ${fmtCost(outCost)}</span><br>` +
    `Total: <span>${fmtCost(total)}</span>`;

  g('jira-estimate-empty').style.display = 'none';
  g('jira-estimate-card').style.display  = 'block';

  // Reset actual comparison
  g('actual-in').value  = '';
  g('actual-out').value = '';
  g('comparison-result').style.display = 'none';
}

// ── Estimated vs Actual ───────────────────────────────────────
function compareActual() {
  if (!currentStoryEst) return;
  const actualIn  = parseInt(g('actual-in').value)  || 0;
  const actualOut = parseInt(g('actual-out').value) || 0;
  if (!actualIn && !actualOut) { g('comparison-result').style.display = 'none'; return; }

  const model   = g('jira-model').value;
  const p       = PRICES[model];
  const actCost = ((actualIn / 1e6) * p.in) + ((actualOut / 1e6) * p.out);
  const estCost = currentStoryEst.total;
  const diff    = ((actCost - estCost) / estCost) * 100;
  const absDiff = Math.abs(diff).toFixed(1);

  g('comp-est').textContent    = fmtCost(estCost);
  g('comp-actual').textContent = fmtCost(actCost);
  g('variance-value').textContent = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';

  const tag = g('variance-tag');
  const bar = g('variance-bar');
  if (Math.abs(diff) <= 15) {
    tag.textContent = 'On target';
    tag.className = 'variance-tag variance-good';
    bar.style.background = 'var(--green-50)';
    bar.style.borderColor = 'var(--green-100)';
  } else if (Math.abs(diff) <= 35) {
    tag.textContent = diff > 0 ? 'Slightly over' : 'Under estimate';
    tag.className = 'variance-tag variance-warn';
    bar.style.background = 'var(--amber-50)';
    bar.style.borderColor = 'var(--amber-600)';
  } else {
    tag.textContent = diff > 0 ? 'Over estimate' : 'Well under';
    tag.className = 'variance-tag variance-over';
    bar.style.background = 'var(--red-50)';
    bar.style.borderColor = 'var(--red-600)';
  }

  g('comparison-result').style.display = 'block';

  // Add to history
  const existing = jiraHistory.find(h => h.id === currentStoryEst.id);
  if (existing) {
    existing.actual = fmtCost(actCost);
    existing.variance = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
    existing.tag = tag.textContent;
  } else {
    jiraHistory.push({
      id: currentStoryEst.id,
      est: fmtCost(estCost),
      actual: fmtCost(actCost),
      variance: (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%',
      tag: tag.textContent
    });
  }
  renderJiraHistory();
}

function renderJiraHistory() {
  if (!jiraHistory.length) return;
  g('jira-history-card').style.display = 'block';
  g('jira-history-body').innerHTML = jiraHistory.map(h => `
    <tr>
      <td style="font-weight:500">${escHtml(h.id)}</td>
      <td class="muted">${h.est}</td>
      <td class="accent">${h.actual}</td>
      <td><span class="variance-tag ${h.tag === 'On target' ? 'variance-good' : h.tag.includes('over') || h.tag.includes('Over') ? 'variance-over' : 'variance-warn'}">${escHtml(h.variance)} ${escHtml(h.tag)}</span></td>
    </tr>
  `).join('');
}

function sendJiraToCalculator() {
  if (!window._jiraStoryData) return;
  const { id, descText } = window._jiraStoryData;
  g('jira-id').value    = id;
  g('sys').value        = estimateTokens(descText) + 500;
  g('model').value      = g('jira-model').value;
  g('runs').value       = g('jira-runs').value;
  calc();
  showPage('calc', null);
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-item')[1].classList.add('active');
}

// ── Init: check for OAuth callback and restore session ────────
document.addEventListener('DOMContentLoaded', () => {
  calc();
  buildQnA();
  restoreJiraSession();
  handleOAuthCallback();
});
