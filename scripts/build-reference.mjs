#!/usr/bin/env node
// Builds reference/pbgc-design-system-reference.html: ONE self-contained file.
// No framework, no build step for the reader, no network calls, no web fonts. Opens from file://.
// It inlines tokens/tokens.css and src/styles/components.css, so it cannot drift from the real system.
// Intended for locked-down environments where Storybook (Node + npm) cannot run.
//
// Usage: node scripts/build-reference.mjs   (run `npm run tokens` first if tokens.json changed)

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVanilla } from './lib/vanilla.mjs';
import { overlayDemos, overlayDemoScript } from './lib/overlay-demos.mjs';
import { numericDemos, textFieldDemos, piiDemos, tabsDemos, stepperDemos, displayDemos } from './lib/form-demos.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const tokens = JSON.parse(read('tokens/tokens.json'));
const tokensCss = read('tokens/tokens.css');
const componentsCss = read('src/styles/components.css');
const vanillaJs = buildVanilla(read('src/behaviors/index.js'));

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const h = hex.replace('#', ''); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const swatchRows = (group) =>
  Object.entries(tokens.palette[group]).map(([name, t]) => {
    const r = ratio(t.$value, '#FFFFFF');
    const use = r >= 4.5 ? 'Text and UI' : r >= 3 ? 'UI and large graphics only' : 'Decorative only';
    return `<tr><td><span style="display:inline-block;width:48px;height:32px;background:${t.$value};border:1px solid #81807F" aria-hidden="true"></span></td><td>${name}</td><td><code>${t.$value}</code></td><td class="pbgc-num">${r.toFixed(2)}</td><td>${use}</td></tr>`;
  }).join('\n');

const swatchTable = (group, caption) => `
<div class="pbgc-table-region" role="region" aria-labelledby="cap-${group}" tabindex="0">
<table class="pbgc-table"><caption id="cap-${group}">${caption}</caption>
<thead><tr><th scope="col">Swatch</th><th scope="col">Name</th><th scope="col">HEX</th><th scope="col" class="pbgc-num">vs white</th><th scope="col">Safe for</th></tr></thead>
<tbody>${swatchRows(group)}</tbody></table></div>`;

const icon = (name) => {
  const p = {
    info: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    success: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    warning: '<path d="M12 3L2 20h20L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v5M12 17.5v.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    error: '<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8l6-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  }[name];
  return `<svg class="pbgc-alert__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
};
const alert = (v, title, text, role) =>
  `<div class="pbgc-alert pbgc-alert--${v}"${role ? ` role="${role}"` : ''}>${icon(v)}<div class="pbgc-alert__body"><h3 class="pbgc-alert__title">${title}</h3><p>${text}</p></div></div>`;

const html = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PBGC design system reference v1.8.0</title>
<style>
${tokensCss}
${componentsCss}
.ref-main { max-width: var(--pbgc-container-max); margin: 0 auto; padding: var(--pbgc-space-3) var(--pbgc-space-2) var(--pbgc-space-8); }
.ref-section { margin-top: var(--pbgc-space-6); }
.ref-demo { display: grid; gap: var(--pbgc-space-2); padding: var(--pbgc-space-3); border: 1px solid var(--pbgc-border-decorative); border-radius: var(--pbgc-radius-default); }
.ref-row { display: flex; flex-wrap: wrap; gap: var(--pbgc-space-2); align-items: center; }
.ref-grid { display: grid; gap: var(--pbgc-space-3); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
</style>
</head>
<body>
<header class="pbgc-header pbgc-on-inverse">
  <a class="pbgc-skip-link" href="#main">Skip to main content</a>
  <div class="pbgc-header__bar">
    <a class="pbgc-header__brand" href="#main">
      <span class="pbgc-logo"><span class="pbgc-logo__missing" role="img" aria-label="Pension Benefit Guaranty Corporation">[Official PBGC logo: see assets/logos/MANIFEST.md]</span></span>
    </a>
    <button type="button" class="pbgc-nav__toggle" id="navToggle" aria-expanded="false" aria-controls="navList">Menu</button>
    <nav aria-label="Main" class="pbgc-nav">
      <ul id="navList" class="pbgc-nav__list" data-open="false">
        <li><a class="pbgc-nav__link" href="#tokens" aria-current="page">Tokens</a></li>
        <li><a class="pbgc-nav__link" href="#type">Typography</a></li>
        <li><a class="pbgc-nav__link" href="#components">Components</a></li>
        <li><a class="pbgc-nav__link" href="#contrast">Contrast</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="main" class="ref-main" tabindex="-1">
  <h1>PBGC design system reference</h1>
  <p class="pbgc-lead pbgc-prose">Version 1.8.0. One file, no dependencies, no network calls. Built from <code>tokens/tokens.json</code> and <code>src/styles/components.css</code>.</p>
  <p><button type="button" class="pbgc-button pbgc-button--secondary" id="themeToggle" aria-pressed="false">Dark theme (provisional)</button></p>
  <p class="pbgc-small pbgc-muted pbgc-prose">The PBGC style guide defines no dark theme. The dark theme here is provisional and must not ship without COLA approval.</p>

  <section class="ref-section" id="tokens" aria-labelledby="h-tokens">
    <h2 id="h-tokens">Color tokens</h2>
    <p class="pbgc-prose">Ratios are computed at build time against white. Source: PBGC Branding and Editorial Style Guide, September 2025.</p>
    ${swatchTable('brand', 'Brand palette')}
    <p></p>
    ${swatchTable('secondary', 'Secondary palette')}
    <p></p>
    ${swatchTable('support', 'Supporting hues for graphics')}
    <p></p>
    ${swatchTable('derived', 'Derived (not in the style guide; pending COLA confirmation)')}
  </section>

  <section class="ref-section" id="type" aria-labelledby="h-type">
    <h2 id="h-type">Typography</h2>
    <p class="pbgc-small pbgc-muted pbgc-prose">Arial is the universal brand font, Helvetica Neue is preferred on Mac, Garamond is secondary. No web fonts are loaded.</p>
    <h3>Heading 3, 22px bold</h3>
    <p class="pbgc-lead pbgc-prose">Lead paragraph, 18px. Line length is capped at 60 characters per the style guide.</p>
    <p class="pbgc-prose">Body text, 16px (12 pt). PBGC protects the retirement security of about 31 million American workers, retirees, and beneficiaries in both single-employer and multiemployer private sector pension plans.</p>
    <p class="pbgc-prose pbgc-prose--serif">Garamond long-form, 20px, for fact sheets and reports.</p>
  </section>

  <section class="ref-section" id="components" aria-labelledby="h-components">
    <h2 id="h-components">Components</h2>

    <h3>Button</h3>
    <div class="ref-demo"><div class="ref-row">
      <button type="button" class="pbgc-button pbgc-button--primary">Primary</button>
      <button type="button" class="pbgc-button pbgc-button--secondary">Secondary</button>
      <button type="button" class="pbgc-button pbgc-button--danger">Danger</button>
      <button type="button" class="pbgc-button pbgc-button--primary pbgc-button--lg">Large</button>
      <button type="button" class="pbgc-button pbgc-button--primary" disabled>Disabled</button>
      <a class="pbgc-button pbgc-button--primary" href="#components">Link styled as button</a>
    </div></div>

    <h3 style="margin-top:2rem">Text field</h3>
    <div class="ref-demo ref-grid">
      <div class="pbgc-field">
        <label class="pbgc-field__label" for="f1">Plan name<span class="pbgc-field__required"> (required)</span></label>
        <p class="pbgc-field__hint" id="f1-hint">Enter the plan name exactly as it appears on the plan document.</p>
        <input id="f1" class="pbgc-field__input" required aria-describedby="f1-hint">
      </div>
      <div class="pbgc-field pbgc-field--error">
        <label class="pbgc-field__label" for="f2">Monthly benefit amount<span class="pbgc-field__required"> (required)</span></label>
        <p class="pbgc-field__hint" id="f2-hint">Whole dollars and cents, for example 1234.56</p>
        <input id="f2" class="pbgc-field__input pbgc-field__input--numeric" inputmode="decimal" required aria-invalid="true" aria-describedby="f2-hint f2-error" value="12x4">
        <p class="pbgc-field__error" id="f2-error">${icon('error').replace('pbgc-alert__icon', '')}<span>Error: Enter a number, for example 1234.56.</span></p>
      </div>
    </div>

    <h3 style="margin-top:2rem">Alert</h3>
    <div class="ref-demo">
      ${alert('info', 'Statement available', 'Your benefit statement is ready to view.')}
      ${alert('success', 'Changes saved', 'Your changes were saved.')}
      ${alert('warning', 'Review before you submit', 'Some fields are incomplete.')}
      ${alert('error', 'Submission failed', 'We could not submit the form. Try again.', 'alert')}
    </div>

    <h3 style="margin-top:2rem">Factsheet card</h3>
    <div class="ref-grid">
      <article class="pbgc-card">
        <div class="pbgc-card__meta"><span class="pbgc-card__category">Fact sheet</span><time datetime="2026-11-01">November 2026</time></div>
        <h4 class="pbgc-card__title"><a class="pbgc-card__link" href="#components">Sample fact sheet title in sentence case</a></h4>
        <p class="pbgc-card__summary">A one or two sentence summary written in plain language. Sample content only.</p>
      </article>
    </div>

    <h3 style="margin-top:2rem">Data table</h3>
    <div class="pbgc-table-region" role="region" aria-labelledby="cap-demo" tabindex="0">
      <table class="pbgc-table">
        <caption id="cap-demo">Sample benefit factors<span class="pbgc-small">Illustrative values only. Not actual PBGC figures.</span></caption>
        <thead><tr><th scope="col" class="pbgc-num">Age</th><th scope="col" class="pbgc-num">Factor</th><th scope="col">Description</th></tr></thead>
        <tbody>
          <tr><td class="pbgc-num">55</td><td class="pbgc-num">0.41</td><td>Sample row A</td></tr>
          <tr><td class="pbgc-num">60</td><td class="pbgc-num">0.64</td><td>Sample row B</td></tr>
          <tr><td class="pbgc-num">62</td><td class="pbgc-num">0.75</td><td>Sample row C</td></tr>
          <tr><td class="pbgc-num">65</td><td class="pbgc-num">1.00</td><td>Sample row D</td></tr>
        </tbody>
      </table>
    </div>
    <p class="pbgc-small pbgc-muted">Sortable headers are available in the React component (Storybook). This static reference shows the markup only.</p>
${overlayDemos}
${numericDemos}
${textFieldDemos}
${piiDemos}
${tabsDemos}
${stepperDemos}
${displayDemos}
  </section>

  <section class="ref-section" id="contrast" aria-labelledby="h-contrast">
    <h2 id="h-contrast">Contrast</h2>
    <p class="pbgc-prose">Every semantic color pair is validated by <code>npm run tokens</code> in both themes. The build fails if any pair drops below its WCAG minimum. See <code>tokens/contrast-report.md</code> for all ${tokens.pairs.length * 2 - 1} checks.</p>
  </section>
</main>

<script>
${vanillaJs}
</script>
<script>
(function () {
  var toggle = document.getElementById('navToggle');
  var list = document.getElementById('navList');
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    list.setAttribute('data-open', String(!open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false'); list.setAttribute('data-open', 'false'); toggle.focus();
    }
  });
  var tt = document.getElementById('themeToggle');
  tt.addEventListener('click', function () {
    var dark = tt.getAttribute('aria-pressed') !== 'true';
    tt.setAttribute('aria-pressed', String(dark));
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  });
${overlayDemoScript}})();
</script>
</body>
</html>
`;

mkdirSync(join(root, 'reference'), { recursive: true });
writeFileSync(join(root, 'reference/pbgc-design-system-reference.html'), html);
console.log(`reference/pbgc-design-system-reference.html written (${(html.length / 1024).toFixed(0)} KB)`);
