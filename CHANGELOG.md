# Changelog

## 1.1.0 (2026-11-07)

Complete rebuild after review (`CRITIQUE.md`). v1.0.0 was missing its color tokens, used a non-brand blue and non-brand fonts, drew a substitute logo, and printed accessibility results that no test produced.

### Added
- `tokens/tokens.json` as the single source of truth; generated `tokens.css` and `contrast-report.md`.
- `scripts/build-tokens.mjs`: resolves aliases, emits CSS, fails the build when any color pair drops below its WCAG threshold (59 checks).
- Full PBGC brand, secondary, and supporting palettes from the Style Guide, with computed text-safety for each color.
- Real Storybook 10 project (React + Vite): 39 stories across Foundations, Atoms, Molecules, Organisms; `@storybook/addon-a11y` set to fail on violations; telemetry disabled.
- `scripts/a11y-check.mjs`: axe-core (WCAG 2.0-2.2 A/AA + best practices) on every story in both themes.
- `reference/pbgc-design-system-reference.html`: single-file, zero-dependency reference for environments that cannot run Node.
- Components: Button, Logo, TextField, Select, ChoiceGroup (radio/checkbox), Alert, ErrorSummary, FactsheetCard, HeaderNav, Breadcrumb, Pagination, DataTable.
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
