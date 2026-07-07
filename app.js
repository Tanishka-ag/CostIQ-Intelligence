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
