#!/usr/bin/env node
// Accessibility gate. Opens EVERY story of the built Storybook (storybook-static/) in a real browser,
// in both themes, and runs axe-core with WCAG 2.0 / 2.1 / 2.2 A and AA rules plus best practices.
// Exits 1 on any violation. This replaces the v1.0.0 workbench's hardcoded "Pass" badge with a real test.
//
// Prereqs: `npm run build-storybook` first. A Chrome/Chromium binary must exist
// (set CHROME_PATH to override). No browser download, no network: playwright-core only drives the local binary.
//
// Usage: node scripts/a11y-check.mjs [--theme=light|dark|both]

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'storybook-static');
const axeSource = readFileSync(join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
const themeArg = (process.argv.find((a) => a.startsWith('--theme=')) ?? '--theme=both').split('=')[1];
const themes = themeArg === 'both' ? ['light', 'dark'] : [themeArg];

if (!existsSync(join(dist, 'index.json'))) {
  console.error('storybook-static/index.json not found. Run `npm run build-storybook` first.');
  process.exit(2);
}

const chromePath = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!chromePath) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, path === '/' ? 'index.html' : path);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(readFileSync(join(dist, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

// Rules that only make sense for a whole page, not an isolated component story.
const PAGE_LEVEL = new Set(['region', 'landmark-one-main', 'page-has-heading-one']);

const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
let total = 0, bad = 0;
for (const theme of themes) {
  for (const s of stories) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story&globals=theme:${theme}`, { waitUntil: 'load' });
    await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
    await page.waitForTimeout(250);
    await page.evaluate(axeSource);
    // Storybook's own a11y addon runs axe on every story at load (a11y.test = 'error'). On slower stories (an
    // open dialog, say) that run can still be going when ours starts, and axe refuses to run twice at once.
    // Wait and retry; this changes timing only, not what is checked.
    let result;
    for (let attempt = 0; ; attempt++) {
      try {
        result = await page.evaluate(() =>
          // eslint-disable-next-line no-undef
          axe.run(document.querySelector('#storybook-root'), {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
          })
        );
        break;
      } catch (e) {
        if (!/already running/i.test(String(e)) || attempt >= 20) throw e;
        await page.waitForTimeout(500);
      }
    }
    const violations = result.violations.filter((v) => !PAGE_LEVEL.has(v.id));
    total++;
    if (violations.length) {
      bad++;
      console.log(`FAIL [${theme}] ${s.id}`);
      for (const v of violations) {
        console.log(`   ${v.id} (${v.impact}): ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(' ')}  ${(n.any[0] ?? n.all[0] ?? n.none[0])?.message ?? ''}`);
      }
    } else {
      console.log(`ok   [${theme}] ${s.id}  (${result.passes.length} rules passed)`);
    }
    await page.close();
  }
}
await browser.close();
server.close();
console.log(`\n${total} story/theme runs, ${bad} with violations.`);
process.exit(bad ? 1 : 0);
