const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const DATA = path.join(__dirname, '..', 'app', 'data');

const result = JSON.parse(fs.readFileSync(OUT, 'utf8')).result;
const newQ = result.questions;

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function readExisting(cat) {
  const file = path.join(DATA, `${cat}.ts`);
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, 'utf8');
  const start = txt.indexOf('= [');
  const end = txt.lastIndexOf('];');
  const body = txt.slice(start + 3, end);
  // Evaluate the array literal (our own trusted data).
  return Function(`"use strict"; return [${body}]`)();
}

function valid(q) {
  return (
    q &&
    typeof q.question === 'string' &&
    q.question.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((o) => typeof o === 'string' && o.length > 0) &&
    Number.isInteger(q.correct) &&
    q.correct >= 0 &&
    q.correct <= 3 &&
    ['easy', 'medium', 'hard'].includes(q.difficulty)
  );
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function serialize(cat, exportName, list) {
  const lines = list.map(
    (q) =>
      `{ id: ${q.id}, question: "${esc(q.question)}", options: [${q.options
        .map((o) => `"${esc(o)}"`)
        .join(', ')}], correct: ${q.correct}, category: "${esc(q.category || 'General')}", difficulty: "${q.difficulty}" },`
  );
  return `import { Question } from '@/app/types';\n\nexport const ${exportName}: Question[] = [\n${lines.join('\n')}\n];\n`;
}

// rebalance: if any correct index > 35%, permute some options to flatten
function rebalance(list) {
  const counts = [0, 0, 0, 0];
  list.forEach((q) => counts[q.correct]++);
  const n = list.length;
  const over = counts.findIndex((c) => c / n > 0.35);
  if (over === -1) return list;
  // For overrepresented index, move correct option to a random different slot for ~half of them
  let toggle = 0;
  return list.map((q) => {
    if (q.correct === over && toggle++ % 2 === 0) {
      const target = (q.correct + 1 + (q.id % 3)) % 4;
      const opts = [...q.options];
      [opts[q.correct], opts[target]] = [opts[target], opts[q.correct]];
      return { ...q, options: opts, correct: target };
    }
    return q;
  });
}

const FILES = {
  finance: 'finance',
  general: 'general',
  entertainment: 'entertainment',
  sports: 'sports',
  science: 'science',
  popculture: 'popculture',
};

const report = {};

for (const cat of Object.keys(FILES)) {
  const existing = readExisting(cat);
  const additions = (newQ[cat] || []).filter(valid);
  const seen = new Set();
  const merged = [];
  for (const q of [...existing, ...additions]) {
    if (!valid(q)) continue;
    const key = norm(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(q);
  }
  let final = merged.map((q, i) => ({ ...q, id: i + 1 }));
  final = rebalance(final).map((q, i) => ({ ...q, id: i + 1 }));
  fs.writeFileSync(path.join(DATA, `${cat}.ts`), serialize(cat, cat, final));
  report[cat] = final.length;
}

// Food is brand new
{
  const additions = (newQ.food || []).filter(valid);
  const seen = new Set();
  const merged = [];
  for (const q of additions) {
    const key = norm(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(q);
  }
  let final = merged.map((q, i) => ({ ...q, id: i + 1 }));
  final = rebalance(final).map((q, i) => ({ ...q, id: i + 1 }));
  fs.writeFileSync(path.join(DATA, 'food.ts'), serialize('food', 'food', final));
  report.food = final.length;
}

console.log('Final counts:', JSON.stringify(report, null, 0));
