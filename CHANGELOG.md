# Changelog

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
