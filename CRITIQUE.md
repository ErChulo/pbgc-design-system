# Critique of the PBGC design system v1.0.0

Reviewed: 2026-11-07
Subject: `design.v1.0.0.md` and `PBGC_Design_System_Storybook_Workbench.txt`
Measured against: *PBGC Branding & Editorial Style Guide* (September 2025), `pbgc-logo-guidance.pdf`, the two interior-page templates, and WCAG.

## Verdict

v1.0.0 is a mood board wearing a compliance costume. It cannot be used to build agency software yet.

The spec is missing its own color tokens and contradicts the style guide it claims to implement. The workbench ignores the spec, draws a logo it has no right to draw, prints test results that were never run, and is not Storybook. Every one of those is fixable. None of them is cosmetic.

Evidence for every claim below is in your two files or in the style guide. Contrast figures were computed, not eyeballed.

---

## Critical: blocks any real use

### C1. The spec is missing its own contents
`design.md` has a heading **"Color Palette & Theme Tokens"** with nothing under it. Same for **"GSAP Motion Rules & Reduced Motion Detection"** and the focus-indicator rule in §7 ("Clear visual focus indicators required:" followed by nothing). The tables and code blocks were lost in the paste and nobody noticed.

Result: a design system with no colors. §3 then refers to `--pbgc-blue-700`, which is never defined. The header says **"Approved / Release Candidate"**, which are two different states, for a document with no palette.

### C2. The workbench draws a fake PBGC logo
`PBGCLogo` renders a rounded square with the letters "PB", the word PBGC, and an invented tagline ("Protecting America's Pensions"), plus a caption reading "Official Brand Mark" on the monochrome version. None of that is the logo.

The style guide says the elements, proportion, shape and visual attributes must not change, that the logo must be reproduced from a digital master, and that external use needs COLA approval. The same `design.md` correctly lists the real files (`PBGC_logo_wt.png` and others). The workbench ignores its own spec and improvises, which is the single thing a brand guide exists to prevent. In dark mode the "full color" variant also recolors the wordmark to `blue-400`, which is the "color alterations" violation on the guide's unacceptable-uses page.

### C3. The blue is wrong, everywhere
PBGC Blue is `#002D72`. The workbench hardcodes `#003366` dozens of times as "Primary Brand Blue". Its `PBGC_TOKENS` object (which also lists `#001f3f` and `#0056b3`, neither in the style guide) is declared at the top of the file and never referenced once. Everything else is Tailwind defaults (slate, emerald, amber, red). The secondary palette and all supporting hues (guide pp. 12-14) appear nowhere. PBGC Red, the brand's second color, is also absent.

### C4. Fabricated compliance claims
- A green badge reads **"Pass: WCAG 2.1 AAA Contrast"**. It is a string in the JSX. No test sits behind it.
- The audit tab says **"Contrast Ratio: Pass (7.2:1 against `--pbgc-blue-700`)"**. `#003366` on white is **12.61:1**. The 7.2 is invented.
- The tab titled "Section 508 & Accessibility Audit" is static text. "WCAG 2.1 Level AA & AAA Verification Active": nothing is active.
- AAA is not even the stated target; the spec says AA.

In an agency context a fake pass badge is worse than none, because someone will cite it. Meanwhile real text in the workbench fails under the spec's own 4.5:1 rule. `text-slate-400` (`#94a3b8`) on white is **2.56:1**, and it is used for:

- the input `placeholder-slate-400`,
- the sidebar category labels ("Atoms", "Molecules"... at 11px),
- the "Storybook Canvas /" breadcrumb.

The Audit tab also states the focus indicator is `outline: 3px solid #2563eb`. The code does not do that: it uses a `ring` (box-shadow), see B5.

### C5. Typography contradicts the brand, and cannot load
The spec says Public Sans / Source Sans Pro. The style guide says **Arial and Garamond**, Helvetica Neue preferred on Mac (pp. 15, 27). The spec is wrong, and it is also unloadable: no `@font-face`, no bundling, and your environment cannot fetch web fonts, so users get whatever sans-serif the OS picks.

Smaller defects: weight 600 does not exist in Arial (browsers fake it); negative letter-spacing on H1 is not in the brand; and the guide's rule that line length over 50-60 characters is unacceptable (p. 16) is absent.

### C6. This is not Storybook
Your project goal is a storybook.js project. What exists is one React file with a "Storybook Canvas" label. No stories, no CSF, no addons, no `package.json`. Only three of six "stories" have controls, and those lack half their props (`disabled` and `required` on Input and Button have no knob). It also needs React + Tailwind + GSAP + lucide with no build config, and several classes do not exist and silently do nothing: `bg-slate-850`, `ring-3` (not in Tailwind 3), `bg-grid-pattern`, `group-hover:` with no `group` ancestor.

---

## Major: accessibility defects in code the spec calls compliant

**B1. The card is a clickable `<div>`.** `FactsheetCard` has `cursor-pointer` and no link, no role, no tab stop. Keyboard and screen-reader users cannot open it. Note: automated tools (axe included) cannot detect this class of defect, which is why a green automated run is not the end of testing.

**B2. There is no mobile navigation.** The nav is `hidden md:flex`. The `Menu` icon is imported and never used. Below 768px a visitor has no navigation at all, though the spec demands a "mobile nav drawer". Items are `<button>`s, not links; there is no `aria-current`, no skip link, and the search button does nothing.

**B3. Input has a dangling `aria-describedby`.** It points at `${id}-hint`, but the hint `<p>` has no `id`. When there is an error, the hint is dropped from the description. The only visible "required" cue is a red asterisk, with no words. The canonical example also uses an SSN placeholder (`XXX-XX-XXXX`) and the label "Social Security / Pension Claim Number". A design system's flagship form example should not normalize collecting SSNs.

**B4. Alert contradicts itself.** `role="alert"` (assertive) combined with `aria-live="polite"`. Every alert, including static page content, announces on mount, so the "System Notice" in the layout story would interrupt a screen reader on page load. The slide-in animation re-runs on every variant change.

**B5. Focus indicators vanish in High Contrast.** Focus uses Tailwind `ring`, which is `box-shadow`, and box-shadows are removed in Windows forced-colors mode, which is what many federal AT users run. Every control also sets `focus-visible:outline-none`. Header nav buttons have no focus style at all. The audit tab claims `outline: 3px solid #2563eb`; the code does not do that.

**B6. Reduced motion is a prop, not a preference.** The workbench has a manual "Reduced Motion" toggle and components take a `reducedMotion` prop defaulting to `false`. Nothing reads `prefers-reduced-motion`. A user with the OS setting on gets full animation from every component. The spec's heading "Reduced Motion Detection" has no content (see C1).

**B7. The spec breaks its own 44px rule.** §6 says 44px for all clickable elements. The Button's `sm` is 36px (and the knob label says "Small (36px)"), the header icon button is 36px, nav buttons are 36px.

**B8. Text below the spec's own minimum.** `text-[9px]`, `text-[10px]`, `text-[11px]` and `text-xs` (12px) carry real content: hints, errors, alert bodies, the logo caption. The spec's smallest size is 14px; the brand floor is 10 pt (about 13.3px).

**B9. The workbench's own UI breaks §7.** The tab bar has no `role="tablist"`, `tab`, `tabpanel`, `aria-selected` or arrow-key handling, which are exactly the keyboard rules the spec lists. Story buttons have no `aria-current`.

---

## Spec problems

- **WCAG 2.1 AA is the wrong target for 2026.** WCAG 2.2 has been a W3C Recommendation since October 2023 (Focus Not Obscured, Target Size, Accessible Authentication, Redundant Entry, Consistent Help). As far as I know, the revised Section 508 incorporates WCAG 2.0 AA by reference, so 2.1 is neither the legal floor nor the current best practice. v1.1.0 targets 2.2 AA and states the 508 floor separately. Confirm with the Section 508 team (Section508ComplianceTeam@pbgc.gov).
- **Half the source was ignored.** The Editorial Style Guide governs content: sentence-case headlines, months spelled out in running text, serial commas, numerals, "the Corporation" vs "the agency", and a legal plain-language requirement. The workbench violates it in its own copy ("Updated Nov 2026", "Effective Nov 2026", Title Case headings). A design system for PBGC that says nothing about content is a UI kit.
- **Logo rules are incomplete.** Missing: minimum width 0.625 in (about 60px), clear space equal to the width of the "P", COLA approval for external use. "EPS converted to clean inline SVG" is a redraw of master artwork and needs approval first. `logo-negro.png` is listed as an official monochrome asset but sits in `03_Branding_Assets/Other`, has a Spanish name, predates the rest of the set by three months, and is not in the guide. Remove it until its provenance is confirmed.
- **Word templates are not a layout spec.** The two `pbgc-interior-page` documents contain "Main Header / Secondary Header / Place text here". They define Word styles. The mapping "desktop = 2-column interior page" is invented.
- **GSAP is a library choice dressed as a design rule.** "All structural and micro-interactions utilize GSAP" ties a federal app to a third-party dependency (bundle weight, license review, supply chain) for hover lifts and fades that CSS transitions do. The principle (motion is brief, respects the preference) belongs in the spec. The mechanism does not. The 4px hover "lift" is also applied to a card that is not interactive.
- **Taxonomy does not match the spec.** The spec puts Input in Atoms with FormField a molecule; the workbench calls Input a Molecule and Alert an Organism, and Alert is not in the spec. The spec lists 14 components; the workbench builds 5 of them (Button, Input, Logo, HeaderNav, FactsheetCard) plus Alert, which the spec does not list. Never built: Badge, Icon, FormField, SearchBar, NavGroup, Pagination, Sidebar, DataTable.
- **It omits what PBGC apps actually need:** data tables, numeric/currency/percent formatting with tabular figures, form validation and error summaries, print styles (the brand is print-first: fact sheets, letters, reports), skip links, landmarks, charts.
- **App architecture in a design spec.** "State Management Separation" (context, caching) is an engineering opinion that assumes React and contradicts framework-neutral tokens.
- **Two sources of truth, both wrong.** The spec says CSS custom properties; the code is Tailwind utilities with hex values pasted in dozens of places and light/dark class pairs that cannot be re-themed.
- **The dark theme is unsourced.** The spec itself asks for "system-aware Light and Dark modes", but the brand guide defines no dark palette, and the spec gives none (see C1). PBGC Blue on a dark surface is 1.38:1, so the workbench quietly substituted Tailwind blues. It may be wanted, but it needs COLA sign-off, and v1.1.0 labels it provisional.
- **Sample content asserts unsourced facts.** The card cites "financial assistance under Section 4261" and the layout story announces an "electronic filing deadline for plan year 2026 is approaching". Neither appears in any source file. As far as I know, the Special Financial Assistance Program sits under ERISA §4262, not 4261, so the citation is probably wrong; verify. Either way, plausible-looking citations in sample content get copied into real pages. v1.1.0 uses obviously fake sample text.
- **Dead code.** Five unused icon imports (`Eye`, `Play`, `RefreshCw`, `Menu`, `CornerDownRight`).

---

## What is worth keeping

- The atomic hierarchy and a catalog of organisms is the right shape.
- The 8-point grid and the 44px target goal are sound (the code just does not obey them).
- Tokens as CSS custom properties is the right decision; the implementation abandoned it.
- The logo file names in §3 match the files in Drive, and the instruction to mark decorative icons `aria-hidden` is correct.

---

## What v1.1.0 does about it

| Finding | Fix | Where |
|---|---|---|
| C1 missing tokens | Full token set, generated CSS, validator | `tokens/` |
| C2 fake logo | Component renders official files only, never draws | `src/components/Logo` |
| C3 wrong blue | `#002D72`, full brand palette, one source of truth | `tokens/tokens.json` |
| C4 fake claims | Computed contrast on every pair, build fails below threshold; axe gate over every story | `scripts/` |
| C5 typography | Arial / Helvetica Neue / Garamond system stacks, no web fonts | `design.md` §4 |
| C6 not Storybook | Real Storybook 10 project, 39 stories, a11y addon set to error | `.storybook/`, `src/` |
| B1 clickable div | Stretched-link card with a real heading link | `FactsheetCard` |
| B2 no mobile nav | Skip link, links, `aria-current`, disclosure menu, Escape handling | `HeaderNav` |
| B3 dangling describedby | `useId`, hint and error both referenced, visible "(required)" | `TextField` |
| B4 alert roles | `live` prop, off by default; no role/aria-live conflict | `Alert` |
| B5 focus | Outline-based, survives forced-colors; separate ring on blue header | `components.css` |
| B6 reduced motion | Motion tokens collapse under `prefers-reduced-motion` | `tokens.css` |
| B7 targets | No small size; every control 44px minimum | `Button`, nav |
| WCAG target | 2.2 AA; 508 floor stated | `design.md` §9 |
| DataTable gap | Built | `DataTable` |
| Content rules | Editorial section added | `design.md` §10 |

## What v1.1.0 does NOT solve

Be clear-eyed about these so nobody over-trusts the green checks:

1. **Automated testing finds a fraction of accessibility problems.** axe passes 50 of 50 story runs, and I confirmed with a negative control that it does flag low contrast and missing alt text. It cannot catch a fake-link `div`, bad reading order, or confusing focus flow. Manual keyboard and screen-reader testing (NVDA, JAWS, VoiceOver) has **not** been done. `design.md` §9 lists what to run.
2. **Logo files are not bundled.** I read the file list from Drive but did not copy official artwork into the repo. Copy it in; see `assets/logos/MANIFEST.md`. The variant-to-filename mapping is inferred from filenames and needs a visual check.
3. **Several values are derived, not sourced:** status colors, the focus ring, "ink" `#1A1A1A`, the whole dark theme. They pass contrast but are not PBGC-approved. They are listed in `OPEN-QUESTIONS.md`.
4. **The style guide contradicts itself** on PBGC Blue and PBGC Red (HEX vs RGB). I used the HEX. COLA must settle it.
5. **Garamond is set from the cover specification** (16 pt in print), converted for screen. No design review has judged it.
6. **JavaScript, not TypeScript**, to keep the first version small. Worth converting before the library grows.
7. **No real PBGC page has been built with this.** The first real application will find gaps.
