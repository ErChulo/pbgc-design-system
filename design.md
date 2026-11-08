# PBGC Design System Specification

**Version:** 1.1.0
**Status:** DRAFT for COLA and Section 508 review. Not approved. (v1.0.0 was labelled "Approved / Release Candidate" while missing its color tokens; nothing is "approved" until the items in `OPEN-QUESTIONS.md` are answered.)
**Last updated:** November 7, 2026
**Replaces:** `design.v1.0.0.md`
**Machine-readable source of truth:** `tokens/tokens.json` (this document explains it; the file decides)

---

## 1. Purpose and authority

This design system lets PBGC application teams (and AI assistants working for them) build interfaces that look like PBGC, work for everyone, and read in PBGC's voice, without re-deciding colors, type, logos, or wording each time.

**Order of authority when sources disagree:**

1. The PBGC Branding & Editorial Style Guide (September 2025) and `pbgc-logo-guidance.pdf`
2. This specification
3. The implementation (`tokens/`, `src/`)

If the code disagrees with this document, the code is wrong. If this document disagrees with the style guide, this document is wrong. Where the style guide disagrees with itself, see `OPEN-QUESTIONS.md`.

### Principles

1. **Reproduce, never redraw.** The logo is official artwork. We place it; we do not recreate, recolor, outline, or approximate it.
2. **Accessibility is a test, not a claim.** No page in this system says "Pass" unless a script computed it.
3. **One source of truth.** Tokens live in one JSON file. CSS, docs, and contrast reports are generated from it.
4. **Content is part of the system.** Wording rules from the Editorial Style Guide apply to every sample, label, and error message.
5. **Print counts.** PBGC's brand is built around printed fact sheets, letters, and reports. Screens are not the only output.
6. **Works offline.** No web fonts, no CDN, no telemetry. The agency's build environments may have no network.

---

## 2. Color

All values are in `tokens/tokens.json`. Each carries `$source: "style-guide"` or `"derived"`.

### 2.1 Brand palette (style guide, p. 12-13)

| Token | HEX | Pantone | Use |
|---|---|---|---|
| `brand.blue` | `#002D72` | 288 C | Primary. Headers, primary actions, links. |
| `brand.red` | `#E4002B` | 185 C | **Accent only.** Rules, highlights. Never an error state. |

### 2.2 Secondary and supporting colors

Seven secondary colors and thirteen supporting tints/shades exist (`secondary.*`, `support.*`). **Not every brand color may carry text.** Contrast against white, computed:

| Color | HEX | vs white | May be used for |
|---|---|---|---|
| Medium Blue | `#004B8D` | 8.78 | Text and UI |
| Medium Green | `#008065` | 4.91 | Text and UI |
| PBGC Red | `#E4002B` | 4.85 | Text on **white only** (4.33 on `#F2F2F2`: fails) |
| Support Gray 1 | `#58585B` | 7.09 | Text and UI |
| Gray 425 | `#81807F` | 3.94 | UI boundaries and icons, not text |
| Support Blue 3 | `#4A7DBA` | 4.26 | UI and large text only |
| Light Blue Gray | `#6E93C2` | 3.17 | UI and large graphics only |
| Teal | `#00A9A1` | 2.92 | Decorative only |
| Light Green | `#88B672` | 2.34 | Decorative only |

The full computed table is `tokens/contrast-report.md`. The secondary palette must never be more prominent than the primary colors (style guide p. 12).

### 2.3 Semantic tokens (what components use)

Components read semantic tokens, never raw palette values.

- **Surface:** `bg-page` (white), `bg-subtle` (`#F2F2F2`), `bg-inverse` (PBGC Blue)
- **Text:** `text-default` (ink), `text-muted`, `text-inverse`, `text-link`, `text-link-hover`
- **Border:** `border-input` (`#81807F`, 3.94:1, meets WCAG 1.4.11), `border-decorative` (`#D2D2D2`, not for controls), `border-accent` (PBGC Red)
- **Action:** `action-primary-*`, `action-secondary-*`, `action-danger-*`
- **Focus:** `focus-ring`, `focus-ring-on-inverse`
- **Status:** `status-{info,success,warning,error}-{bg,accent}`

### 2.4 Rules

- **Links are always underlined.** Link blue versus body text is below 3:1, so color alone cannot mark a link (WCAG 1.4.1).
- **Never convey meaning by color alone.** Status uses a different icon shape, text, and a heavy left border. Errors read "Error: ...".
- **Brand red is not "error".** Error uses `#B3001B`, deliberately darker, so accent and failure are never confused.
- **Derived values** (status colors, focus ring, ink `#1A1A1A`, dark theme) fill gaps the style guide leaves. They pass contrast but are **not PBGC-approved** (`OPEN-QUESTIONS.md` Q5).

### 2.5 Dark theme: PROVISIONAL

The style guide defines no dark theme. One is provided (`data-theme="dark"`, or `prefers-color-scheme: dark`) for evaluation. **Do not ship it** without COLA approval. PBGC Blue cannot be used as foreground on dark surfaces (1.38:1), so the dark theme uses supporting blues instead. The header stays PBGC Blue in both themes.

---

## 3. Typography

| | Stack | Source |
|---|---|---|
| Sans (UI and body) | `"Helvetica Neue", Arial, sans-serif` | Style guide p. 15: Arial is the universal font; Helvetica Neue is preferred on Mac |
| Serif (long-form) | `Garamond, "Adobe Garamond Pro", "Times New Roman", serif` | Garamond is the secondary typeface; Times New Roman is acceptable for correspondence (p. 27) |
| Mono | `Consolas, "Courier New", monospace` | System fonts only |

**No web fonts.** Nothing is downloaded, and nothing breaks in an offline environment. (v1.0.0 specified Public Sans / Source Sans Pro, which contradicted the brand and could not load.)

| Level | Size | Weight | Line height | Use |
|---|---|---|---|---|
| H1 | 2.25rem (36px) | 700 | 1.25 | Page title |
| H2 | 1.75rem (28px) | 700 | 1.25 | Section |
| H3 | 1.375rem (22px) | 700 | 1.25 | Sub-section, card title |
| Lead | 1.125rem (18px) | 400 | 1.5 | Lead paragraph |
| Body | 1rem (16px = 12 pt) | 400 | 1.5 | Standard content |
| Small | 0.875rem (14px) | 400 | 1.5 | Captions, metadata, table notes |
| Serif long-form | 1.25rem (20px) | 400 | 1.5 | Fact sheets and reports |

Rules:

- **Weights are 400 and 700 only.** Arial has no 600; browsers would fake it.
- **No negative letter-spacing.**
- **Line length is capped at 60 characters** for prose (`--pbgc-measure-prose: 60ch`). The style guide lists lines over 50-60 characters as unacceptable (p. 16).
- **Minimum body size is 10 pt (about 13.3px).** Nothing below 14px carries content.
- **Numbers in tables and forms use tabular figures** (`font-variant-numeric: tabular-nums`) and right-align.
- Garamond has a small x-height. It is set at 20px on screen (the cover specification is 16 pt in print).

---

## 4. Logo

The component renders **official files only** and shows a labelled placeholder if a file is missing. It never draws a substitute.

- **Files:** see `assets/logos/MANIFEST.md`. Colors: `fc` (full color), `bw`, `wt` (white, for dark and blue surfaces).
- **Web header:** horizontal logo with agency name (style guide p. 7: "for letterhead, the web, and limited-size documents").
- **On PBGC Blue:** use the white (`wt`) artwork.
- **Minimum width:** 0.625 in = **60px**. The component clamps; it will not render smaller.
- **Clear space:** equal to the width of the "P" in the logo (measurement pending, `OPEN-QUESTIONS.md` Q4). Default 0.5rem padding until measured.
- **Never:** outline the text, move or rearrange elements, alter colors, scale non-proportionally, distort, or redraw (style guide p. 11).
- **Alt text:** "Pension Benefit Guaranty Corporation". When the logo is the home link, "PBGC home".
- **External use needs COLA approval:** COLAGraphicsAV@pbgc.gov.
- **Formats:** PNG for web (transparent background). Do not convert EPS masters to SVG without approval; that is a redraw.

---

## 5. Layout and spacing

- **Spacing scale (8-point grid):** 8, 16, 24, 32, 48, 64 px (`--pbgc-space-1` to `-8`).
- **Breakpoints:** mobile < 640px, tablet 640-1023px, desktop 1024-1439px, wide 1440px and up. Content container maxes at 1400px.
- **Navigation collapses to a disclosure menu below 1024px.**
- **Touch and click targets are at least 44 x 44px** (`--pbgc-target-min`). There is no "small" button. (WCAG 2.2 AA requires 24px; 44px is our stricter house standard.)
- **Reflow:** content must work at 320px wide and at 400% zoom without horizontal scrolling (except data tables, which scroll inside a labelled region).

The v1.0.0 mapping "desktop = Word interior-page template" is withdrawn: the two `.docx` templates are Word page styles, not web layouts.

---

## 6. Motion

- **CSS transitions only.** 150 ms for state changes, 250 ms for elevation. GSAP is not required and not used. (A library mandate is an engineering decision, not a design rule; add one only after a dependency and license review.)
- **Reduced motion is honored at the token level:** under `prefers-reduced-motion: reduce`, `--pbgc-motion-duration-*` become 0.01 ms, so no component can forget to check.
- No autoplay, parallax, or looping animation. Nothing moves for more than 5 seconds.
- Hover effects never carry meaning on their own.

---

## 7. Components

| Component | Layer | Status | Accessibility contract |
|---|---|---|---|
| Button | Atom | Built | Real `<button>` or `<a>`; 44px minimum; disabled is not conveyed by opacity alone |
| Logo | Atom | Built | Official art only; 60px floor; alt text |
| Icon (status) | Atom | Built | Decorative, `aria-hidden`; distinct shape per status |
| TextField (FormField) | Molecule | Built | Visible label; hint and error both in `aria-describedby`; "(required)" in words; error is text + icon + border |
| Alert | Molecule | Built | No live region by default; `polite` -> `role="status"`, `assertive` -> `role="alert"`; never both |
| FactsheetCard | Organism | Built | One real link in the heading, stretched over the card; `<time>` for dates |
| HeaderNav | Organism | Built | Skip link first; links not buttons; `aria-current="page"`; disclosure menu with Escape and focus return |
| DataTable | Organism | Built | `<caption>`; `scope="col"`; `aria-sort`; polite announcement; focusable labelled scroll region |
| Select | Molecule | Built | Native `<select>`; same label, hint, and error contract as TextField |
| ChoiceGroup (radio / checkbox) | Molecule | Built | `<fieldset>` + `<legend>`; 24px native inputs in 44px rows; per-option hints tied by `aria-describedby`; group error announced with the legend |
| ErrorSummary | Organism | Built | Focus moves to it on mount; each item links to its field; messages match field-level messages |
| Breadcrumb | Molecule | Built | `<nav aria-label="Breadcrumb">` + `<ol>`; current page is text with `aria-current="page"`; separators are CSS |
| Pagination | Molecule | Built | Real links; `aria-current="page"`; "Previous" and "Next" are words; 44px targets |
| Badge, SearchBar, Footer, Sidebar, NavGroup, date input | | Backlog | Native-element first; see `OPEN-QUESTIONS.md` Q16 |
| Tabs, accordion, modal, charts | | Backlog | Custom widgets: full keyboard model required before building (see §8) |

Naming note: v1.0.0 mixed up layers (Input as a molecule, Alert as an organism). Layer here means: **atom** = single element; **molecule** = a small group working as one unit; **organism** = a self-contained section.

---

## 8. Keyboard model for custom widgets

Native elements first. If a custom widget is unavoidable, it must implement the WAI-ARIA Authoring Practices pattern completely:

- **Tabs:** `role=tablist/tab/tabpanel`, `aria-selected`, Left/Right arrows, Home/End, roving tabindex.
- **Modal dialog:** focus moves in, is trapped, Escape closes, focus returns to the trigger.
- **Disclosure/accordion:** `aria-expanded`, `aria-controls`, Enter and Space.
- **Menus and dropdowns:** do not build one until a native `<select>` or disclosure cannot do the job.

---

## 9. Accessibility

### 9.1 Targets

- **Design target: WCAG 2.2 Level AA.** (v1.0.0 targeted 2.1; 2.2 has been a W3C Recommendation since October 2023.)
- **Legal floor:** Section 508. To our understanding the 2017 refresh incorporates WCAG 2.0 AA by reference. Confirm with Section508ComplianceTeam@pbgc.gov (`OPEN-QUESTIONS.md` Q11).
- **Text contrast:** 4.5:1 (3:1 for 18pt+/14pt bold). **UI boundaries, icons, focus indicators:** 3:1.

### 9.2 Focus

`outline: 3px solid var(--pbgc-focus-ring); outline-offset: 2px`. **Outline, never box-shadow**: outlines survive Windows High Contrast / forced-colors mode; box-shadows are removed. On PBGC Blue surfaces the ring is white (`focus-ring-on-inverse`). Never `outline: none` without replacement.

### 9.3 Automated gate (runs in CI)

```
npm run tokens:check        # every color pair, both themes, fails below threshold
npm run build-storybook
npm run test:a11y           # axe-core, WCAG 2.0-2.2 A/AA + best practices, every story, both themes
```

### 9.4 Manual checks (required before any release; automation cannot do these)

- [ ] Keyboard only: reach and operate every control; focus order matches reading order; no traps; focus never hidden behind sticky UI.
- [ ] Screen reader: NVDA + Firefox or Chrome, JAWS + Chrome, VoiceOver + Safari. Headings, landmarks, form errors, table navigation, dynamic announcements.
- [ ] Windows High Contrast / forced-colors: focus, current-page marker, status icons, and borders are visible.
- [ ] 200% text zoom and 400% page zoom (320px width): no loss of content, no horizontal scroll.
- [ ] Text spacing override (WCAG 1.4.12): nothing clips.
- [ ] `prefers-reduced-motion`: nothing animates.
- [ ] Print preview: readable in black and white, links show their URLs.
- [ ] Each custom widget against its APG keyboard model.

---

## 10. Content and editorial (from the Editorial Style Guide)

The guide defers to AP style except where PBGC differs. Rules that surface in UI:

| Topic | Rule |
|---|---|
| Headlines and subheads (web, press releases) | Sentence case: capitalize the first word and proper nouns only. Reports may differ. |
| Dates | Spell out the month with a day or year: "November 1, 2026". No "1st". Abbreviate (Jan, Feb...) only in tables, without periods. |
| Numbers | Spell out zero to nine; figures for 10 and above. Always figures for ages, percentages (3%), times, dollars. Numerals in headlines. |
| Times | "8 a.m.", "noon", never "12 p.m." |
| Lists | Capitalize the first word; periods only if items are full sentences. |
| Commas | Serial (Oxford) comma is required. |
| The agency | "PBGC", never "the PBGC". "The Corporation" (capitalized) or "the agency" (lowercase) as a second reference. |
| Participant | The term for a worker, retiree, or beneficiary covered by a plan. |
| Program names | Capitalize PBGC programs: Single-Employer Program, Multiemployer Program, Special Financial Assistance Program. |
| "Multiemployer", "defined benefit plan" | No hyphen. |
| Use | "use", not "utilize". |
| Web addresses | "PBGC.gov", no "www" or "https://". |
| Plain language | Legally required for documents that explain a benefit or how to comply with a requirement. Follow plainlanguage.gov. |
| Sample content | Use obviously fictional text. Never invent regulations, deadlines, dollar amounts, or program names in samples. |

---

## 11. Print

Fact sheets and letters are printed. Stylesheet rules shipped in `components.css`: black on white, 12 pt, nav and buttons hidden, link URLs printed after the link text, cards avoid page breaks. Test every template in print preview.

---

## 12. Governance

- **Versioning:** semantic. Any change to a token value is at least a minor version; any removal is major.
- **Single edit point:** change `tokens/tokens.json`, run `npm run tokens`. Never edit `tokens.css` or `contrast-report.md`.
- **Derived values** are tracked in `OPEN-QUESTIONS.md` until COLA confirms or replaces them.
- **Source map:** the style guide supplied colors, type, logo rules, and editorial rules; `pbgc-logo-guidance.pdf` supplied logo files and clear-space rules; the two interior-page `.docx` templates supplied only the "Main Header / Secondary Header" structure; `pbgc-branding-templates-icons-logo.txt` points to an internal SharePoint library of icons and templates that was not available to this review.
