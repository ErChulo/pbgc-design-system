# PBGC design system

Design tokens, accessible components, and a Storybook for building PBGC applications.

**Status:** v1.1.0 draft. Not approved by COLA or the Section 508 team. Read `CRITIQUE.md` for why v1.0.0 was rebuilt and `OPEN-QUESTIONS.md` for what still needs a PBGC decision.

## What is in here

```
design.md                      The specification (human-readable)
CRITIQUE.md                    Review of v1.0.0 and what v1.1.0 fixes and does not fix
OPEN-QUESTIONS.md              Source contradictions and derived values awaiting COLA
CHANGELOG.md
tokens/
  tokens.json                  SINGLE SOURCE OF TRUTH. Edit this.
  tokens.css                   Generated. Do not edit.
  contrast-report.md           Generated. Do not edit.
src/
  styles/components.css        All component styles. Plain CSS, tokens only.
  components/                  Button, Logo, TextField, Select, ChoiceGroup, Alert, ErrorSummary, Badge,
                               Accordion, SearchBar, FactsheetCard, HeaderNav, Footer, Breadcrumb, Pagination,
                               DataTable (+ stories)
  index.js                     Public entry: every component
  foundations/                 Color and typography stories
.storybook/                    Storybook config (no telemetry)
scripts/
  build-tokens.mjs             tokens.json -> tokens.css + contrast validation
  build-reference.mjs          Builds the single-file reference page
  a11y-check.mjs               axe-core over every story, both themes
reference/
  pbgc-design-system-reference.html   One file, zero dependencies, opens from disk
assets/logos/MANIFEST.md       How to add the official logo files (not bundled)
```

## If you cannot run Node (locked-down machine)

Open `reference/pbgc-design-system-reference.html` in any browser. It is one file with no dependencies and makes no network calls. It contains the tokens, type scale, and every component, with a provisional dark-theme toggle.

To regenerate it after a token change, run `npm run tokens && npm run reference` on a machine that has Node, and commit the result.

## If you can run Node (Node 20 or later)

```bash
npm install
npm run storybook          # dev server on http://localhost:6006
npm run build-storybook    # static site in storybook-static/
npm run tokens:check       # validate every color pair (no files written)
npm run test:a11y          # axe over every story (build Storybook first; needs Chrome/Edge)
npm run reference          # rebuild the single-file reference
npm run vanilla            # build dist/pbgc.js + dist/pbgc.css (framework-free)
npm run test:reference     # reference page: axe at 1200px and 375px, both themes, no network
npm run test:behavior      # real keystrokes on the interactive components, React and vanilla builds
npm run test:numeric       # numeric field parse/format rules (no browser needed)
npm run test:fields        # textarea counter rules (no browser needed)
```

Full pre-release check: `npm test` (tokens, vanilla build, reference build, Storybook build, axe on every story, reference-page check, behavior check).

`test:a11y` drives a locally installed Chrome, Edge, or Chromium (set `CHROME_PATH` to override). Nothing is downloaded.

## Use it without React (single-file HTML apps)

Copy two files into your app: `dist/pbgc.css` (tokens + components) and `dist/pbgc.js` (behavior). Both are plain, dependency-free, and make no network calls. Write the markup shown in `reference/pbgc-design-system-reference.html` (it has a working example of every component) and call `PBGC.init()` once. Notifications need no markup: `PBGC.toast.show({ variant: 'success', title: 'Saved' })`. To inline everything into one `.html` file, paste the CSS into a `<style>` and the JS into a `<script>`.

Browser baseline: Chrome/Edge 114+, Firefox 125+, Safari 17+ (`design.md` section 13). Without the Popover API (for example Firefox ESR 115) menus, tooltips and toggletips degrade to inline content instead of breaking; Internet Explorer and IE mode are not supported. Confirm the baseline against PBGC's deployed browsers (`OPEN-QUESTIONS.md` Q17).

## Add the logo (required, one-time)

Artwork is deliberately not bundled. Copy the official PNGs into `assets/logos/` following `assets/logos/MANIFEST.md`. Until then the `Logo` component shows a labelled placeholder; it never draws a substitute.

## Use it from another project

```bash
npm install github:ErChulo/pbgc-design-system
```

```js
import 'pbgc-design-system/tokens.css';
import 'pbgc-design-system/components.css';
import { Button, TextField, DataTable } from 'pbgc-design-system';
```

Limitations, stated plainly: the package ships **JSX source**, not a compiled bundle, so the consuming app's bundler must compile JSX from `node_modules` (Vite and Next can; some setups need a transpile-packages or `optimizeDeps` setting). `tokens.css` is committed, so consumers never need to run the token build. Pin a tag or commit hash rather than the branch name; a token change is at least a minor version (see `design.md` section 12).

## Publish to GitHub

```bash
git add .
git commit -m "Rebuild design system as v1.1.0 (see CHANGELOG.md)"
git push
```

`node_modules/` and `storybook-static/` are git-ignored. Commit `package-lock.json`.

Logo artwork is never committed: `.gitignore` excludes it, so copying the files in locally is safe (`OPEN-QUESTIONS.md` Q10).

## How to change a color

1. Edit `tokens/tokens.json`.
2. `npm run tokens`. If a pair falls below its WCAG minimum, it fails and tells you which.
3. Commit `tokens.json` and the regenerated files.

## What has been verified, and what has not

| Check | Status |
|---|---|
| 65 color-pair contrast checks, light + dark | Pass (computed, `tokens/contrast-report.md`) |
| Storybook builds | Pass |
| axe-core on 91 stories x 2 themes (182 runs), including open dialog, menu, tooltip and toggletip | Pass, 0 violations |
| Numeric field parsing and formatting (6,074 checks, including a property test that values of up to 15 digits stay exact in a double) | Pass. Negative controls: two deliberately broken rules were both caught |
| Textarea counter rules (14 checks: emoji count once, 20% threshold, exactly at the limit is allowed) | Pass |
| Keystroke and pointer behavior of the 8 interactive components, React build and vanilla build, the numeric field, textarea and switch, and a simulated browser without the Popover API (22 runs) | Pass. Negative controls: deliberately broken behaviors were caught (including silent truncation in the textarea and a wrong switch state), and the shipped v1.2.0 page fails the no-Popover scenario |
| axe-core on the reference page at 1200px and 375px, both themes | Pass, 0 violations, no horizontal scroll, 0 external requests |
| Negative control (axe flags known-bad contrast and alt text here) | Pass |
| Carousel pan/swipe on a touch device | **Not done** (only button and keyboard paths are tested) |
| Tooltip, menu and toast placement in a printed or zoomed (400%) layout | **Not done** |
| Keyboard and screen-reader testing (NVDA, JAWS, VoiceOver) | **Not done** |
| Windows High Contrast visual check | **Not done** |
| Logo variant mapping confirmed against the guide | **Not done** |
| Review by COLA / Section 508 team | **Not done** |

Automated checks find only part of what matters. Run the manual checklist in `design.md` section 9.4 before relying on any of this.
