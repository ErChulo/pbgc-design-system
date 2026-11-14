#!/usr/bin/env node
// Behavior gate. axe-core cannot test keyboard models, focus return, timing, or open states, so this drives
// the interactive components with REAL keystrokes and pointer events in a real browser, asserts the behavior
// the design.md keyboard model promises, and runs axe on each OPEN state.
//
// It runs every scenario against TWO builds of the same components and expects identical results:
//   1. the React components in the built Storybook (storybook-static/)
//   2. the framework-free single-file reference page (reference/pbgc-design-system-reference.html)
// Parity between them is the proof that the React wrappers and the vanilla build cannot drift.
//
// Prereqs: `npm run build-storybook` and `npm run reference`. Needs a local Chrome/Edge (CHROME_PATH to override).
// Usage:   node scripts/behavior-check.mjs [--only=menu,dialog] [--target=storybook|reference]

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'storybook-static');
const refFile = join(root, 'reference/pbgc-design-system-reference.html');
const axeSource = readFileSync(join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
const arg = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? '').split('=')[1];
const only = arg('only')?.split(',');
const targetArg = arg('target');

if (!existsSync(join(dist, 'index.json'))) { console.error('Run `npm run build-storybook` first.'); process.exit(2); }
if (!existsSync(refFile)) { console.error('Run `npm run reference` first.'); process.exit(2); }

const chromePath = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!chromePath) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = join(dist, path === '/' ? 'index.html' : path);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const PAGE_LEVEL = ['region', 'landmark-one-main', 'page-has-heading-one'];
const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });

class Fail extends Error {}
const assert = (cond, msg) => { if (!cond) throw new Fail(msg); };

// ---------- helpers (all run in the page) ----------
const active = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return a ? { tag: a.tagName, text: a.textContent.trim().slice(0, 60), inDialog: !!a.closest('dialog'), isBody: a === document.body } : null;
});
const popoverOpen = (page, sel) => page.evaluate((s) => document.querySelector(s)?.matches(':popover-open') ?? false, sel);
const attr = (page, sel, name) => page.evaluate(([s, n]) => document.querySelector(s)?.getAttribute(n), [sel, name]);
const until = (page, fn, arg, what) => page.waitForFunction(fn, arg, { timeout: 3000 }).catch(() => { throw new Fail(`timed out waiting for: ${what}`); });
async function axeOn(page, include, what) {
  await page.evaluate(axeSource);
  const res = await page.evaluate(([inc, skip]) =>
    // eslint-disable-next-line no-undef
    axe.run({ include: [[inc]] }, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      rules: Object.fromEntries(skip.map((r) => [r, { enabled: false }])),
    }), [include, PAGE_LEVEL]);
  const v = res.violations;
  assert(!v.length, `axe violations in ${what}: ${v.map((x) => `${x.id} (${x.nodes[0]?.target.join(' ')})`).join('; ')}`);
}

// ---------- scenarios ----------
const SCENARIOS = {
  async menu(page) {
    const trig = '.pbgc-menu__trigger';
    const list = '.pbgc-menu__list';
    await page.locator(trig).first().focus();
    await page.keyboard.press('Enter');
    await until(page, (s) => document.querySelector(s).matches(':popover-open'), list, 'menu opens on Enter');
    assert((await attr(page, trig, 'aria-expanded')) === 'true', 'aria-expanded=true when open');
    assert((await active(page)).tag === 'BUTTON' && (await page.evaluate(() => document.activeElement.getAttribute('role'))) === 'menuitem', 'focus moves to first menuitem');
    await axeOn(page, '.pbgc-menu', 'open menu');
    const first = await active(page);
    await page.keyboard.press('ArrowDown');
    assert((await active(page)).text !== first.text, 'ArrowDown moves focus');
    await page.keyboard.press('End');
    const last = await page.evaluate(() => { const i = [...document.querySelectorAll('.pbgc-menu__item')]; return i[i.length - 1].textContent.trim(); });
    assert((await active(page)).text === last, 'End focuses the last item');
    await page.keyboard.press('ArrowDown');
    assert((await active(page)).text === first.text, 'ArrowDown wraps to the first item');
    await page.keyboard.press('Home');
    assert((await active(page)).text === first.text, 'Home focuses the first item');
    // type-ahead: jump to the second item by its first letter (skip if it shares the first letter with item 1)
    const second = await page.evaluate(() => document.querySelectorAll('.pbgc-menu__item')[1].textContent.trim());
    if (second[0].toLowerCase() !== first.text[0].toLowerCase()) {
      await page.keyboard.press(second[0].toLowerCase());
      assert((await active(page)).text === second, `type-ahead "${second[0]}" jumps to "${second}"`);
    }
    await page.keyboard.press('Escape');
    assert(!(await popoverOpen(page, list)), 'Escape closes the menu');
    assert((await active(page)).tag === 'BUTTON' && (await attr(page, trig, 'aria-expanded')) === 'false', 'focus returns to the trigger, aria-expanded=false');
    await page.keyboard.press('ArrowUp');
    await until(page, (s) => document.querySelector(s).matches(':popover-open'), list, 'ArrowUp opens the menu');
    assert((await active(page)).text === last, 'ArrowUp on the trigger opens on the LAST item');
    // Disabled item (aria-disabled): activating it must not close the menu
    const disabled = page.locator('.pbgc-menu__item[aria-disabled="true"]').first();
    if (await disabled.count()) {
      await disabled.focus();
      await page.keyboard.press('Enter');
      assert(await popoverOpen(page, list), 'activating a disabled item leaves the menu open');
    }
    await page.keyboard.press('Tab');
    assert(!(await popoverOpen(page, list)), 'Tab closes the menu');
    // Focus leaves the menu list. (Where it lands depends on what follows the menu on the page; with nothing
    // focusable after it, it correctly leaves the page.)
    assert(await page.evaluate(() => !document.querySelector('.pbgc-menu__list').contains(document.activeElement)), 'Tab moves focus out of the menu list');
    // pointer: open by click, close by pressing elsewhere
    await page.locator(trig).first().click();
    assert(await popoverOpen(page, list), 'click opens the menu');
    await page.mouse.click(2, 2);
    assert(!(await popoverOpen(page, list)), 'pressing outside closes the menu');
    // selecting an item fires an event, closes, and returns focus
    await page.locator(trig).first().click();
    const pick = page.locator('.pbgc-menu__item:not([aria-disabled="true"]):not(.pbgc-menu__item--danger)').first();
    await pick.click();
    assert(!(await popoverOpen(page, list)), 'choosing an item closes the menu');
    assert((await active(page)).tag === 'BUTTON' && (await attr(page, trig, 'aria-expanded')) === 'false', 'focus returns to the trigger after choosing');
  },

  async dialog(page) {
    const opener = page.locator('button:has-text("Open dialog"), [data-pbgc-open]').first();
    await opener.focus();
    await page.keyboard.press('Enter');
    await until(page, () => !!document.querySelector('dialog[open]'), null, 'dialog opens');
    assert((await active(page)).inDialog, 'focus moves into the dialog');
    assert(await page.evaluate(() => !!document.querySelector('dialog[open]').getAttribute('aria-labelledby')), 'dialog is named by its heading');
    await axeOn(page, 'dialog[open]', 'open dialog');
    // A native modal dialog makes the rest of the page inert, but it does NOT wrap focus: after the last
    // control, Tab goes to the browser's own UI (document.activeElement becomes <body>) and the next Tab
    // re-enters the dialog. The guarantee that matters is that focus NEVER lands on page content behind it.
    let sawInside = 0;
    for (const key of ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      const a = await active(page);
      assert(a.inDialog || a.isBody, `${key}: focus must stay in the dialog or leave the page, never reach content behind it (landed on ${a.tag} "${a.text}")`);
      if (a.inDialog) sawInside++;
    }
    assert(sawInside >= 5, `focus keeps re-entering the dialog (${sawInside} of 10 presses landed inside)`);
    await page.keyboard.press('Escape');
    assert(!(await page.evaluate(() => !!document.querySelector('dialog[open]'))), 'Escape closes the dialog');
    assert((await active(page)).text.includes('Open dialog') || (await page.evaluate(() => document.activeElement.hasAttribute('data-pbgc-open'))), 'focus returns to the opener');
    // backdrop press closes
    await opener.click();
    await until(page, () => !!document.querySelector('dialog[open]'), null, 'dialog reopens');
    await page.mouse.click(3, 3);
    assert(!(await page.evaluate(() => !!document.querySelector('dialog[open]'))), 'backdrop click closes the dialog');
    // a press inside the panel does not
    await opener.click();
    await until(page, () => !!document.querySelector('dialog[open]'), null, 'dialog reopens again');
    await page.locator('dialog[open] .pbgc-dialog__body').click();
    assert(await page.evaluate(() => !!document.querySelector('dialog[open]')), 'clicking inside the panel does not close it');
    await page.locator('dialog[open] .pbgc-dialog__close').click();
    assert(!(await page.evaluate(() => !!document.querySelector('dialog[open]'))), 'Close button closes the dialog');
  },

  async confirm(page) {
    await page.getByRole('button', { name: 'Delete sample file' }).focus();
    await page.keyboard.press('Enter');
    await until(page, () => !!document.querySelector('dialog[open]'), null, 'confirm opens');
    assert((await active(page)).text === 'Cancel', 'focus starts on Cancel, not on the destructive button');
    await page.keyboard.press('Enter');
    await until(page, () => document.body.textContent.includes('Cancelled.'), null, 'Enter on Cancel cancels');
    await page.getByRole('button', { name: 'Delete sample file' }).click();
    await page.getByRole('button', { name: 'Delete file' }).click();
    await until(page, () => document.body.textContent.includes('Confirmed.'), null, 'confirm button confirms');
  },

  async tooltip(page) {
    const tip = '.pbgc-tooltip';
    const trigger = page.locator('.pbgc-tooltip-host > :first-child').first();
    await trigger.focus();
    await until(page, (s) => document.querySelector(s).matches(':popover-open'), tip, 'tooltip shows on keyboard focus');
    assert((await page.evaluate(() => document.querySelector('.pbgc-tooltip-host > :first-child').getAttribute('aria-describedby'))) === (await attr(page, tip, 'id')), 'trigger is described by the tooltip');
    await axeOn(page, '.pbgc-tooltip-host', 'open tooltip');
    await page.keyboard.press('Escape');
    assert(!(await popoverOpen(page, tip)), 'Escape dismisses the tooltip (WCAG 1.4.13 dismissible)');
    assert((await active(page)).tag === 'BUTTON', 'Escape does not move focus off the trigger');
    await page.evaluate(() => document.activeElement.blur());
    const box = await trigger.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await until(page, (s) => document.querySelector(s).matches(':popover-open'), tip, 'tooltip shows on hover');
    // hoverable: move the pointer onto the tooltip itself; it must stay
    const tb = await page.locator(tip).boundingBox();
    await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 8 });
    await page.waitForTimeout(450);
    assert(await popoverOpen(page, tip), 'tooltip stays open while the pointer is over it (WCAG 1.4.13 hoverable)');
    await page.mouse.move(2, 2);
    await until(page, (s) => !document.querySelector(s).matches(':popover-open'), tip, 'tooltip hides when the pointer leaves');
  },

  async toggletip(page) {
    const btn = '.pbgc-toggletip__button';
    const panel = '.pbgc-toggletip__panel';
    await page.locator(btn).first().focus();
    await page.keyboard.press('Enter');
    await until(page, (s) => document.querySelector(s).matches(':popover-open'), panel, 'toggletip opens');
    assert((await attr(page, btn, 'aria-expanded')) === 'true', 'aria-expanded=true when open');
    await axeOn(page, '.pbgc-toggletip', 'open toggletip');
    await page.keyboard.press('Escape');
    assert(!(await popoverOpen(page, panel)), 'Escape closes the toggletip');
    assert((await active(page)).tag === 'BUTTON', 'focus stays on the toggletip button');
    await page.locator(btn).first().click();
    assert(await popoverOpen(page, panel), 'click opens the toggletip');
    await page.mouse.click(2, 2);
    assert(!(await popoverOpen(page, panel)), 'pressing outside closes the toggletip');
  },

  async filepicker(page) {
    const input = page.locator('.pbgc-filepicker__input').first();
    const names = () => page.evaluate(() => [...document.querySelectorAll('.pbgc-filepicker__name')].map((e) => e.textContent));
    const count = () => page.evaluate(() => document.querySelector('.pbgc-filepicker__input').files.length);
    await input.setInputFiles([
      { name: 'valid.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') },
      { name: 'bad.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') },
      { name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) },
    ]);
    await until(page, () => document.querySelectorAll('.pbgc-filepicker__item').length === 1, null, 'one valid file listed');
    assert((await names()).join() === 'valid.csv', 'only the valid file is listed');
    const errs = await page.evaluate(() => document.querySelector('[data-fp-errors]').textContent);
    assert(errs.includes('Error: bad.pdf is not an accepted file type'), 'wrong type is rejected with a text error');
    assert(errs.includes('huge.csv') && errs.includes('over the 5 MB limit'), 'oversize file is rejected with a text error');
    assert((await count()) === 1, 'the native input holds only the accepted file');
    assert((await page.evaluate(() => document.querySelector('[data-fp-status]').textContent)).includes('1 file selected. 2 files were not accepted.'), 'status message announces the result');
    await axeOn(page, '.pbgc-filepicker', 'file picker with a list and errors');
    await input.setInputFiles([{ name: 'second.csv', mimeType: 'text/csv', buffer: Buffer.from('c\n3\n') }]);
    await until(page, () => document.querySelectorAll('.pbgc-filepicker__item').length === 2, null, 'second pick is ADDED');
    assert((await count()) === 2, 'input and list stay in sync after adding');
    await page.getByRole('button', { name: 'Remove valid.csv' }).click();
    assert((await names()).join() === 'second.csv', 'Remove drops the right file');
    assert((await active(page)).text.includes('Remove'), 'focus moves to the next Remove button (never stranded)');
    await page.getByRole('button', { name: 'Remove second.csv' }).click();
    assert((await page.evaluate(() => document.activeElement.type)) === 'file', 'removing the last file returns focus to the file input');
    assert((await count()) === 0, 'input is empty after removing everything');
  },

  async carousel(page) {
    const status = () => page.evaluate(() => document.querySelector('[data-carousel-status]').textContent);
    const disabled = (s) => attr(page, s, 'aria-disabled');
    assert((await status()) === 'Slide 1 of 3', 'starts on slide 1 of 3');
    assert((await disabled('[data-carousel-prev]')) === 'true', 'Previous is aria-disabled on the first slide');
    assert(await page.evaluate(() => [...document.querySelectorAll('.pbgc-carousel__slide')].map((s) => s.inert).join()) === 'false,true,true', 'only the current slide is interactive (others inert)');
    await axeOn(page, '.pbgc-carousel', 'carousel');
    await page.locator('[data-carousel-next]').click();
    assert((await status()) === 'Slide 2 of 3', 'Next advances');
    await until(page, () => { const t = document.querySelector('.pbgc-carousel__track'); return Math.abs(t.scrollLeft - t.clientWidth) < 3; }, null, 'track scrolls to slide 2');
    await page.locator('[data-carousel-next]').click();
    assert((await disabled('[data-carousel-next]')) === 'true', 'Next is aria-disabled on the last slide');
    assert((await page.evaluate(() => document.activeElement.hasAttribute('data-carousel-next'))), 'focus stays on Next (not stranded) when it becomes disabled');
    // force: Playwright refuses to click aria-disabled controls; a real user can, and it must do nothing.
    await page.locator('[data-carousel-next]').click({ force: true });
    assert((await status()) === 'Slide 3 of 3', 'clicking a disabled Next does nothing');
    await page.locator('[data-carousel-prev]').click();
    assert((await status()) === 'Slide 2 of 3', 'Previous goes back');
    // keyboard: arrow keys on the focused track
    await until(page, () => { const t = document.querySelector('.pbgc-carousel__track'); return Math.abs(t.scrollLeft - t.clientWidth) < 3; }, null, 'settled on slide 2');
    await page.locator('.pbgc-carousel__track').focus();
    await page.keyboard.press('ArrowRight');
    await until(page, () => document.querySelector('[data-carousel-status]').textContent === 'Slide 3 of 3', null, 'ArrowRight on the track reaches slide 3');
  },

  async toast(page) {
    const btn = (name) => page.getByRole('button', { name, exact: true });
    assert(await page.evaluate(() => !!document.querySelector('.pbgc-toast-region [role="status"]') && !!document.querySelector('.pbgc-toast-region [role="alert"]')), 'both live regions exist BEFORE any toast (required for reliable announcements)');
    await btn('Info').click();
    await btn('Success').click();
    await btn('Warning').click();
    await btn('Error').click();
    assert(await page.evaluate(() => document.querySelectorAll('[role="status"] .pbgc-toast').length === 3 && document.querySelectorAll('[role="alert"] .pbgc-toast').length === 1), 'info/success/warning go to the polite region; error goes to the assertive region');
    assert((await page.evaluate(() => document.querySelector('[role="alert"] .pbgc-toast').textContent)).startsWith('Error:'), 'the status word is real text, not only an icon');
    await page.waitForTimeout(500); // toasts fade in over 250 ms; axe must read settled colors, not a half-faded toast
    await axeOn(page, '.pbgc-toast-region', 'toasts on screen');
    // hovering an info toast pauses its timer; the un-hovered success toast auto-dismisses after 10 s; warning and error persist
    const infoBox = await page.locator('.pbgc-toast--info, .pbgc-alert--info.pbgc-toast').first().boundingBox();
    await page.mouse.move(infoBox.x + 10, infoBox.y + 10);
    await page.waitForTimeout(10600);
    const left = await page.evaluate(() => [...document.querySelectorAll('.pbgc-toast')].map((t) => t.className.match(/pbgc-alert--(\w+)/)[1]).sort().join());
    assert(left === 'error,info,warning', `after 10.6 s: success gone, hovered info paused, warning and error persist (got ${left})`);
    await page.mouse.move(2, 2);
    // dismiss with the button; focus must not be lost
    await btn('Warning').focus();
    await page.locator('.pbgc-alert--warning .pbgc-toast__dismiss').focus();
    await page.keyboard.press('Enter');
    assert(await page.evaluate(() => !document.querySelector('.pbgc-alert--warning.pbgc-toast')), 'Dismiss removes the toast');
    assert(!(await active(page)).isBody, 'dismissing the focused toast does not strand focus on <body>');
    // Escape on a focused toast dismisses it
    await page.locator('.pbgc-alert--error .pbgc-toast__dismiss').focus();
    await page.keyboard.press('Escape');
    assert(await page.evaluate(() => !document.querySelector('.pbgc-alert--error.pbgc-toast')), 'Escape dismisses the focused toast');
    await btn('Clear all').click();
    assert(await page.evaluate(() => document.querySelectorAll('.pbgc-toast').length === 0), 'Clear all removes every toast');
  },

  async numeric(page) {
    const sel = '[data-pbgc-numeric] input';
    const input = page.locator(sel).first();
    const val = () => input.inputValue();
    const errText = () => page.evaluate(() => { const e = document.querySelector('[data-nf-error]'); return e.hidden ? '' : e.textContent; });
    const typeThenLeave = async (text) => { await input.focus(); await input.fill(text); await page.keyboard.press('Tab'); };
    await page.evaluate(() => { window.__nv = null; document.querySelector('[data-pbgc-numeric]').addEventListener('pbgc:value', (e) => { window.__nv = e.detail; }); });

    // Typing never rewrites the text, and no error shows before the first blur.
    await input.focus();
    await page.keyboard.type('1234.5');
    assert((await val()) === '1234.5', 'text is not rewritten while the person types');
    assert((await errText()) === '', 'no error before the field has been left once');
    await page.keyboard.press('Tab');
    assert((await val()) === '1,234.50', 'on leaving: grouped with commas and padded to cents');
    const d = await page.evaluate(() => window.__nv);
    assert(d.valid && d.value === 1234.5 && d.valueText === '1234.5', `pbgc:value reports the number (got ${JSON.stringify(d)})`);

    // Malformed input: text is kept as typed, and the error is announced as text on the field.
    await typeThenLeave('12,34');
    assert((await errText()) === 'Error: Enter a number such as 1,234.56.', `malformed grouping is an error (got "${await errText()}")`);
    assert((await val()) === '12,34', 'the typed text is left exactly as typed');
    assert((await attr(page, sel, 'aria-invalid')) === 'true', 'aria-invalid is set');
    assert((await attr(page, sel, 'aria-describedby')).includes('-error'), 'the error is part of the description');
    await axeOn(page, '[data-pbgc-numeric]', 'numeric field in its error state');

    // After the first blur, a fixed mistake clears at once (no need to leave the field again).
    await input.focus();
    await input.fill('1234');
    assert((await errText()) === '' && (await attr(page, sel, 'aria-invalid')) === null, 'error clears as soon as the mistake is fixed');

    // Never silently rounds.
    await typeThenLeave('1.005');
    assert((await errText()) === 'Error: Enter no more than 2 decimal places.', 'extra decimal places are an error');
    assert((await val()) === '1.005', 'it did not round or truncate what was typed');
    await typeThenLeave('-5');
    assert((await errText()) === 'Error: Enter a number that is not negative.', 'negative is refused when not allowed');
    await typeThenLeave('1234567890123456');
    assert((await errText()) === 'Error: Enter no more than 15 digits.', '16 digits are refused (the number would not be exact)');

    // Pasted values with symbols work and are formatted.
    await typeThenLeave('$1,234,567.8');
    assert((await errText()) === '' && (await val()) === '1,234,567.80', `a pasted "$1,234,567.8" becomes 1,234,567.80 (got "${await val()}")`);
    assert((await page.evaluate(() => window.__nv)).valueText === '1234567.8', 'valueText is the canonical decimal string');

    // Required.
    await typeThenLeave('');
    assert((await errText()) === 'Error: Enter a value for Sample monthly benefit.', `required names the field (got "${await errText()}")`);

    // Percent range (the reference page also has a percent field).
    if ((await page.locator(sel).count()) > 1) {
      const pct = page.locator(sel).nth(1);
      await pct.focus(); await pct.fill('100.0001'); await page.keyboard.press('Tab');
      const e2 = await page.evaluate(() => document.querySelectorAll('[data-nf-error]')[1].textContent);
      assert(e2 === 'Error: Enter a number between 0% and 100%.', `percent range error names the limits (got "${e2}")`);
      await pct.focus(); await pct.fill('5.25%'); await page.keyboard.press('Tab');
      assert((await pct.inputValue()) === '5.25', 'a typed trailing % is accepted and removed (the % is shown beside the field)');
    }
  },

  // A browser without the Popover API (Firefox ESR 115, Edge/Chrome < 114, Safari < 17) must DEGRADE, not break.
  async nopopover(page) {
    const vis = (sel) => page.evaluate((s) => {
      const e = document.querySelector(s);
      if (!e) return false;
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility === 'visible' && cs.display !== 'none';
    }, sel);
    assert(await page.evaluate(() => typeof HTMLElement.prototype.showPopover === 'undefined'), 'test setup: the Popover API is gone');
    assert(await page.evaluate(() => document.documentElement.classList.contains('pbgc-no-popover')), '<html> gets class pbgc-no-popover');
    assert(page._console.filter((t) => t.includes('no Popover API')).length === 1, 'exactly one console warning explains the degraded mode');
    // Menu: the dead trigger is hidden, the actions show inline as plain buttons, and selecting still works.
    assert(!(await vis('.pbgc-menu__trigger')), 'menu trigger is hidden (it could do nothing)');
    assert(await vis('.pbgc-menu__item'), 'menu actions are visible inline');
    assert(await page.evaluate(() => !document.querySelector('[role="menuitem"]') && document.querySelector('.pbgc-menu__list').getAttribute('role') === 'group'), 'menu roles are dropped (no false arrow-key promise)');
    await page.evaluate(() => { window.__sel = null; document.querySelector('[data-pbgc-menu]').addEventListener('pbgc:select', (e) => { window.__sel = e.detail.value; }); });
    await page.locator('.pbgc-menu__item').first().focus();
    await page.keyboard.press('Enter');
    assert((await page.evaluate(() => window.__sel)) === 'view', 'Enter on an action still fires pbgc:select');
    await page.evaluate(() => { window.__sel = null; });
    await page.locator('.pbgc-menu__item[aria-disabled="true"]').click({ force: true });
    assert((await page.evaluate(() => window.__sel)) === null, 'a disabled action fires nothing');
    // Toggletip help shows inline; tooltip (supplementary text) is hidden but still describes its control.
    assert(await vis('.pbgc-toggletip__panel') && !(await vis('.pbgc-toggletip__button')), 'toggletip help is inline and its dead button is hidden');
    assert(!(await vis('.pbgc-tooltip')), 'tooltip is hidden');
    assert(await page.evaluate(() => document.querySelector('.pbgc-tooltip-host > :first-child').getAttribute('aria-describedby') === document.querySelector('.pbgc-tooltip').id), 'tooltip text still describes its control');
    await axeOn(page, '#demo-menu', 'degraded menu');
    await axeOn(page, '#demo-tooltip', 'degraded tooltip and toggletip');
    // Everything that needs no Popover API keeps working.
    await page.locator('[data-pbgc-open="dlg-sample"]').click();
    assert(await page.evaluate(() => !!document.querySelector('dialog[open]')), 'dialogs still open');
    await page.keyboard.press('Escape');
    assert(await page.evaluate(() => !document.querySelector('dialog[open]')), 'Escape still closes the dialog');
    await page.locator('[data-toast="success"]').click();
    assert(await page.evaluate(() => document.querySelectorAll('.pbgc-toast').length === 1), 'toasts still work');
  },
  async textarea(page) {
    const sel = '[data-pbgc-textarea] textarea';
    const ta = page.locator(sel).first();
    const errText = () => page.evaluate(() => { const e = document.querySelector('[data-ta-error]'); return e.hidden ? '' : e.textContent; });
    const count = () => page.locator('[data-ta-count]').first().textContent();
    const status = () => page.locator('[data-ta-status]').first().textContent();
    const max = Number(await attr(page, '[data-pbgc-textarea]', 'data-max'));

    // Before the first blur nothing complains; the visible count tracks typing.
    await ta.focus();
    await page.keyboard.type('hello');
    assert((await count()) === `5 of ${max} characters`, `count updates on every key (got "${await count()}")`);
    assert((await errText()) === '', 'no error while typing within the limit');
    assert((await status()) === '', 'screen readers are not interrupted while plenty is left');

    // Required: empty text is an error only after leaving the field, then clears as soon as it is fixed.
    await ta.fill('');
    await page.keyboard.press('Tab');
    assert((await errText()) === 'Error: Enter a response.', `required error on blur (got "${await errText()}")`);
    assert((await attr(page, sel, 'aria-invalid')) === 'true', 'aria-invalid is set');
    await axeOn(page, '[data-pbgc-textarea]', 'textarea in its error state');
    await ta.focus();
    await page.keyboard.type('x');
    assert((await errText()) === '', 'error clears as soon as text is entered');

    // The limit is soft: pasted text is NOT cut, and the error says by how many.
    const long = 'y'.repeat(max + 7);
    await ta.fill(long);
    assert((await ta.inputValue()) === long, 'text over the limit is never truncated');
    assert((await errText()) === `Error: Use ${max} characters or fewer. You are 7 over.`, `over-limit error appears at once (got "${await errText()}")`);
    assert((await count()) === `7 over the limit of ${max}`, 'the visible count says how far over');
    assert((await attr(page, sel, 'maxlength')) === null, 'there is no maxlength attribute (browsers truncate pastes silently)');
    await axeOn(page, '[data-pbgc-textarea]', 'textarea over its limit');

    // Screen readers hear the count after a pause, not on every key.
    await page.waitForTimeout(1300);
    assert((await status()) === '7 characters over the limit.', `announced after a pause (got "${await status()}")`);

    // Emoji count as one character.
    await ta.fill('😀'.repeat(max));
    assert((await errText()) === '', 'emoji count once each, so exactly the limit is fine');
  },

  async switch(page) {
    const sw = page.locator('[role=switch]').first();
    const state = () => page.evaluate(() => getComputedStyle(document.querySelector('.pbgc-switch__state'), '::after').content);
    assert((await attr(page, '[role=switch]', 'role')) === 'switch', 'role is switch');
    assert((await sw.isChecked()) === false, 'starts off');
    assert((await state()) === '"Off"', 'the word Off is shown');
    await sw.focus();
    await page.keyboard.press('Space');
    assert((await sw.isChecked()) === true, 'Space turns it on');
    assert((await state()) === '"On"', 'the word On is shown, so state is not color alone');
    await page.keyboard.press('Space');
    assert((await sw.isChecked()) === false, 'Space turns it off');
    // Clicking the label text toggles it too, and the click target is at least 44px tall.
    await page.locator('.pbgc-switch__text').first().click();
    assert((await sw.isChecked()) === true, 'clicking the label toggles it');
    const h = await page.evaluate(() => document.querySelector('.pbgc-switch__label').getBoundingClientRect().height);
    assert(h >= 44, `target is at least 44px tall (got ${h})`);
    await axeOn(page, '.pbgc-switch', 'switch');
  },
};

// Storybook story id (React build) and whether the reference page (vanilla build) has the scenario too.
const STORIES = {
  menu: 'molecules-actionmenu--default',
  dialog: 'organisms-dialog--default',
  confirm: 'organisms-dialog--confirm',
  tooltip: 'molecules-tooltip--default',
  toggletip: 'molecules-tooltip--toggletip-default',
  filepicker: 'molecules-filepicker--default',
  carousel: 'organisms-carousel--default',
  toast: 'organisms-toast--playground',
  numeric: 'molecules-numericfield--currency',
  textarea: 'molecules-textarea--with-limit',
  switch: 'molecules-switch--default',
};
const REFERENCE = new Set(['menu', 'dialog', 'tooltip', 'toggletip', 'filepicker', 'carousel', 'toast', 'numeric', 'textarea', 'switch', 'nopopover']);
const REFERENCE_ONLY = new Set(['nopopover']); // simulates an old browser; only the framework-free page is used // confirm is React-only sugar over <form method=dialog>

let total = 0;
let failed = 0;
for (const target of targetArg ? [targetArg] : ['storybook', 'reference']) {
  for (const [name, run] of Object.entries(SCENARIOS)) {
    if (only && !only.includes(name)) continue;
    if (target === 'reference' && !REFERENCE.has(name)) continue;
    if (target === 'storybook' && REFERENCE_ONLY.has(name)) continue;
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page._console = [];
    page.on('console', (m) => page._console.push(m.text()));
    total++;
    try {
      if (target === 'storybook') {
        await page.goto(`${base}/iframe.html?id=${STORIES[name]}&viewMode=story`, { waitUntil: 'load' });
        await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
      } else if (name === 'nopopover') {
        // Remove the Popover API before any page script runs, and strip the `popover` attribute, which a browser
        // without the API ignores. Then load the same reference page.
        await page.addInitScript(() => { delete HTMLElement.prototype.showPopover; delete HTMLElement.prototype.hidePopover; delete HTMLElement.prototype.togglePopover; });
        // (Served through a routed URL: setContent would reuse the already-loaded blank document, so the init script would not run.)
        const html = readFileSync(refFile, 'utf8').replace(/ popover="manual"/g, '');
        await page.route('http://old-browser.test/', (route) => route.fulfill({ contentType: 'text/html', body: html }));
        await page.goto('http://old-browser.test/', { waitUntil: 'load' });
      } else {
        await page.goto(pathToFileURL(refFile).href, { waitUntil: 'load' });
        // The reference page has one demo of each component; scope the page to the one under test.
        await page.evaluate((n) => document.querySelector(`#demo-${n}`)?.scrollIntoView(), name);
      }
      await page.waitForTimeout(250);
      await run(page);
      assert(!errors.length, `uncaught page errors: ${errors.join(' | ')}`);
      console.log(`ok   [${target}] ${name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL [${target}] ${name}: ${e instanceof Fail ? e.message : e.stack}`);
    }
    await page.close();
  }
}
await browser.close();
server.close();
console.log(`\n${total} scenario runs, ${failed} failed.`);
process.exit(failed ? 1 : 0);
