#!/usr/bin/env node
// Reference-page gate. Opens the single-file reference page from disk at 1200px and 375px in both themes and
// requires: 0 axe violations (WCAG 2.0-2.2 A/AA + best practices), no horizontal page scroll, and zero
// network requests (the page must work in a locked-down environment).
// Prereq: `npm run reference`. Needs a local Chrome/Edge (CHROME_PATH to override).

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ref = join(root, 'reference/pbgc-design-system-reference.html');
if (!existsSync(ref)) { console.error('Run `npm run reference` first.'); process.exit(2); }
const axeSource = readFileSync(join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
const chromePath = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!chromePath) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
let bad = 0;
for (const width of [1200, 375]) {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const external = [];
    page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });
    await page.goto(pathToFileURL(ref).href);
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(600); // buttons transition background-color for 150 ms; axe must read settled colors
    await page.evaluate(axeSource);
    const { violations } = await page.evaluate(() =>
      // eslint-disable-next-line no-undef
      axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const problems = [
      ...violations.map((v) => `axe ${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`),
      ...(hscroll ? ['horizontal page scroll'] : []),
      ...(external.length ? [`network requests: ${external.join(', ')}`] : []),
    ];
    if (problems.length) { bad++; console.log(`FAIL [${width}px ${theme}]\n   ${problems.join('\n   ')}`); }
    else console.log(`ok   [${width}px ${theme}]`);
    await page.close();
  }
}
await browser.close();
console.log(`\n4 reference-page runs, ${bad} failed.`);
process.exit(bad ? 1 : 0);
