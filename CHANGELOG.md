# Changelog

## 1.3.0 (2026-11-14)

### Added
- **NumericField** (integer, decimal, currency, percent), React and framework-free. Built for amounts and rates that people rely on:
  - never silently changes what was typed: too many decimal places is an error, not a rounding;
  - digits handled as a string, at most 15, so `value` is exact in a double (`valueText` is the canonical decimal string);
  - strict thousands grouping (`1,234` accepted, `12,34` rejected); pasted `$1,234.50` and `5.25%` work;
  - a percent is in percent units (5.25 gives 5.25);
  - errors appear when the field is left and clear as soon as the mistake is fixed; `validate()` for submit; an `error` prop for outside rules;
  - `$` and `%` are shown beside the input but spoken through the field's description (`in dollars`, `percent`).
- `parseNumber`, `formatNumber` and `numericOptions` are exported (also on `window.PBGC`), so apps can reuse the exact rules.
- `scripts/numeric-check.mjs` (`npm run test:numeric`): 6,074 checks including a property test that 15-digit values stay exact. Verified to fail when the decimals rule or the digit limit is broken.
- `numeric` scenario in the behavior gate (18 runs, was 16), run against both builds; verified to fail when errors stop clearing while typing.

### Changed
- `.pbgc-field__error[hidden]` now hides (a class rule had been overriding the `hidden` attribute).
- The field-error icon helper in the core takes a size.

## 1.2.2 (2026-11-13)

No open question is blocked any more. The six that were waiting on PBGC facts are now decisions or an imputed value, so no component depends on an unanswered question and none was removed.

### Changed
- **Logo clear space is imputed, not measured** (Q4). `Logo` sets clear space per variant instead of a fixed 0.5rem: 10% of rendered width for horizontal and banner lockups, 20% for square lockups, deliberately generous. Exported as `CLEAR_SPACE`. Visible effect: the default header logo (180px wide) now has 18px of clear space on each side, up from 8px, so the header is about 20px taller. The master files could not be measured; replace with measured values when possible.
- Logo variant-to-file mapping (Q8) adopted as the working mapping, inferred from file names and not checked by eye.
- Q10: official artwork can no longer be committed by accident; `.gitignore` excludes `assets/logos/*.png`, `.eps`, `.svg`, `.pdf`.
- Q11 (test tool), Q13 (icons) and Q14 (web templates) recorded as decisions.
- `OPEN-QUESTIONS.md` gains an **Imputed** status so estimated values are never mistaken for measured or sourced ones.

## 1.2.1 (2026-11-13)

Open-question triage, plus one real fix found while closing Q17.

### Fixed
- **Browsers without the Popover API** (Firefox ESR 115, Chrome/Edge before 114, Safari before 17): v1.2.0 called the Popover API with no feature check, so ActionMenu, Tooltip and Toggletip had no working fallback. They now degrade: `<html>` gets `pbgc-no-popover`, one console warning is logged, ActionMenu shows its actions inline as plain buttons and still fires `pbgc:select`, Toggletip help shows inline, and tooltips (supplementary text only) are hidden. `PBGC.support.popover` exposes the check.

### Added
- `design.md` section 10.1: interface-text rules (buttons, links, errors, notifications, loading, confirmations, empty states).
- `design.md` section 13: supported browsers and what degrades where.
- `nopopover` scenario in the behavior gate (16 runs, was 15). It was verified against the merged v1.2.0 page, which fails it.

### Changed
- `OPEN-QUESTIONS.md` rewritten with a status on every item: Decided (Q5, Q6, Q7, Q9, Q11 standard, Q12, Q15, Q16, Q18), Default in use and confirm (Q1, Q2, Q3, Q17), Blocked on PBGC (Q4, Q8, Q10, Q11 test tool, Q13, Q14). Nothing blocked was guessed.
- `design.md` section 3 records the type decision (Arial for all web UI; Garamond only for long-form fact sheets).
- Next-component order recorded in Q16: numeric/currency field, Textarea and Switch, PII banner, Tabs, Stepper, summaries, date input, Sidebar, charts.

## 1.2.0 (2026-11-13)

Overlay and feedback components, built native-first and delivered twice: React, and a framework-free build for single-file HTML apps. Both share one behavior implementation (`src/behaviors/index.js`), so they cannot drift.

### Added
- Components: Dialog (center, large, drawer) and ConfirmDialog, Spinner, ProgressBar, Skeleton, ActionMenu, Tooltip, Toggletip, FilePicker, Carousel, Toast (`useToast` / `PBGC.toast`).
- Tokens: `z` (sticky, overlay, toast), `elevation` (1-3), `bg.scrim` in both themes. Six new contrast pairs (65 checks, was 59).
- `dist/pbgc.js` + `dist/pbgc.css` (`npm run vanilla`) and demos of every new component in the single-file reference page.
- `scripts/behavior-check.mjs` (`npm run test:behavior`): real keystrokes and pointer events, axe on every OPEN state, identical scenarios against the React and vanilla builds.
- `scripts/reference-check.mjs` (`npm run test:reference`): reference page at 1200px and 375px, both themes; 0 axe violations, no horizontal scroll, no network requests. The README previously claimed this check without a script behind it.
- Package exports `./behaviors`, `./pbgc.js`, `./pbgc.css`.

### Changed
- `design.md` section 6: looping animation is allowed ONLY for loading indicators (labelled, stopped under reduced motion). Previously "no looping animation", which a spinner contradicts.
- `design.md` section 8: ActionMenu is now the single sanctioned custom menu; modal-dialog focus behavior stated accurately (a native modal does not wrap focus).
- Test suite (`npm test`) now runs the vanilla build, the reference check and the behavior check.

### Known gaps
- Browser baseline for `<dialog>`, Popover API and `inert` is unconfirmed (`OPEN-QUESTIONS.md` Q17).
- No keyboard or screen-reader testing with NVDA, JAWS or VoiceOver. Tooltip, menu and toast announcements in particular need it.
- Carousel touch swipe is untested; no autoplay by design.

## 1.1.0 (2026-11-07)

Complete rebuild after review (`CRITIQUE.md`). v1.0.0 was missing its color tokens, used a non-brand blue and non-brand fonts, drew a substitute logo, and printed accessibility results that no test produced.

### Added
- `tokens/tokens.json` as the single source of truth; generated `tokens.css` and `contrast-report.md`.
- `scripts/build-tokens.mjs`: resolves aliases, emits CSS, fails the build when any color pair drops below its WCAG threshold (59 checks).
- Full PBGC brand, secondary, and supporting palettes from the Style Guide, with computed text-safety for each color.
- Real Storybook 10 project (React + Vite): 49 stories across Foundations, Atoms, Molecules, Organisms; `@storybook/addon-a11y` set to fail on violations; telemetry disabled.
- `scripts/a11y-check.mjs`: axe-core (WCAG 2.0-2.2 A/AA + best practices) on every story in both themes.
- `reference/pbgc-design-system-reference.html`: single-file, zero-dependency reference for environments that cannot run Node.
- Components: Button, Logo, TextField, Select, ChoiceGroup (radio/checkbox), Alert, ErrorSummary, FactsheetCard, HeaderNav, Breadcrumb, Pagination, Badge, Accordion (native details), SearchBar, Footer, DataTable.
- Installable by other projects: `src/index.js` entry, `exports` for the two stylesheets and `tokens.json`, React as a peer dependency.
- `design.md` v1.1.0 with editorial/content rules, print rules, keyboard model, manual test checklist.
- `OPEN-QUESTIONS.md`: every derived value and source contradiction, ready to send to COLA.

### Changed
- Primary blue `#003366` -> `#002D72`. Typeface Public Sans -> Arial / Helvetica Neue / Garamond. WCAG 2.1 AA -> 2.2 AA target.
- Focus indicator: Tailwind ring (box-shadow) -> outline, so it survives forced-colors mode.
- Motion: GSAP -> CSS transitions; reduced motion honored via tokens and `prefers-reduced-motion`.
- Alert: `role="alert"` + `aria-live="polite"` conflict removed; announcements are opt-in.

### Removed
- The workbench's fabricated logo, hardcoded "Pass: WCAG AAA" badge, invented contrast figure, and Tailwind/GSAP/lucide dependencies.
- `logo-negro.png` from the approved assets (provenance unconfirmed).
- App-state-management guidance (belongs in an engineering guide).
- 36px "small" button.

### Known gaps
See "What v1.1.0 does NOT solve" in `CRITIQUE.md`.

## 1.0.0 (2026-11)
Initial draft. Superseded.
