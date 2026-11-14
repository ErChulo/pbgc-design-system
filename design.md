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
- **Decision (v1.2.1, closes Q7):** all web-application UI and body text uses the sans stack (Arial; Helvetica Neue on Mac). Garamond is reserved for long-form fact-sheet and report pages, at 20px, and is never used in controls, tables, forms, menus or notifications.

---

## 4. Logo

The component renders **official files only** and shows a labelled placeholder if a file is missing. It never draws a substitute.

- **Files:** see `assets/logos/MANIFEST.md`. Colors: `fc` (full color), `bw`, `wt` (white, for dark and blue surfaces).
- **Web header:** horizontal logo with agency name (style guide p. 7: "for letterhead, the web, and limited-size documents").
- **On PBGC Blue:** use the white (`wt`) artwork.
- **Minimum width:** 0.625 in = **60px**. The component clamps; it will not render smaller.
- **Clear space:** the guide says it equals the width of the "P" in the logo. The master files were not measured, so the component uses **imputed** values, deliberately generous: 10% of the rendered width for horizontal and banner lockups, 20% for square lockups (`CLEAR_SPACE` in `Logo.jsx`, `OPEN-QUESTIONS.md` Q4). More space than the guide requires is compliant; replace these with measured values when someone can open the masters.
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
- No autoplay and no parallax. The ONLY looping animation allowed is a loading indicator (Spinner, indeterminate ProgressBar, Skeleton) while work is genuinely in progress: it is an essential activity under WCAG 2.2.2, always carries a text label, and stops under `prefers-reduced-motion`. Because a loop cannot use the 0.01 ms motion tokens, those three components switch their animation off in their own `prefers-reduced-motion` blocks. Nothing else moves for more than 5 seconds.
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
| Badge | Atom | Built | Text carries the meaning; color only reinforces it; not interactive |
| Accordion | Organism | Built | Native `<details>/<summary>`: browser supplies keyboard and state; optional exclusive mode |
| SearchBar | Molecule | Built | `<form role="search">`, visible label by default, GET submit, no JavaScript required |
| Footer | Organism | Built | `<footer>` landmark on PBGC Blue; white logo; underlined white links; column headings are `h2` |
| Dialog, ConfirmDialog, drawer | Organism | Built (v1.2) | Native `<dialog>` + `showModal()`: page behind is inert, Escape closes, focus returns to the opener; named by its heading; backdrop press closes only if the press also STARTED on the backdrop; ConfirmDialog starts focus on Cancel |
| Spinner, ProgressBar, Skeleton | Atom | Built (v1.2) | Always a text label; `role="status"`; native `<progress>`; percentage shown as text; static under reduced motion |
| ActionMenu | Molecule | Built (v1.2) | WAI-ARIA APG menu button (§8). For row and toolbar actions only, never site navigation or form values |
| Tooltip, Toggletip | Molecule | Built (v1.2) | WCAG 1.4.13: hoverable, dismissible with Escape, persistent. Tooltip is supplementary text for a focusable control; Toggletip is click-to-open for longer or linked help |
| FilePicker | Molecule | Built (v1.2) | Native `<input type=file>` over a drop zone (keyboard works with no script); type and size errors are text; Remove returns focus to a neighbour; reads files locally and never uploads |
| Carousel | Organism | Built (v1.2) | No autoplay; Previous/Next are `aria-disabled` (focus never stranded); off-screen slides are `inert`; "Slide n of N" status. Prefer Tabs or a Stepper for sequences |
| Toast (`useToast`, `PBGC.toast`) | Organism | Built (v1.2) | Two persistent live regions (polite; assertive for errors); info/success auto-dismiss at 10 s, warning/error persist; hover or focus pauses; status word is text; Escape and a Dismiss button |
| Sidebar, NavGroup, date input | | Backlog | Native-element first; see `OPEN-QUESTIONS.md` Q16 |
| NumericField (integer, decimal, currency, percent) | Molecule | Built (v1.3) | Text input with a decimal keypad, never `type=number`. Never silently rounds (too many decimals is an error); digits handled as a string, at most 15 so the value is exact; strict comma grouping; `$` and `%` shown beside the field and spoken in its description; errors appear on leaving the field and clear as soon as the mistake is fixed. Percent is in percent units. Not for IDs, phone numbers or ZIP codes |
| Textarea | Molecule | Built (v1.4) | Multi-line text with the TextField label, hint and error. Optional character limit that is SOFT: no `maxlength` attribute (browsers cut pasted text off silently); going over is an error that says by how many and nothing is cut. Visible count on every key; screen readers hear it after a one-second pause and only when 20% or less is left. Characters counted as people count them (an emoji is one). Vertical resize only. |
| Switch | Molecule | Built (v1.4) | Native checkbox with `role="switch"`, for a setting that takes effect immediately (use a checkbox if it applies only on Save). Label names the setting, not the action. State is never color alone: the knob moves and the word On or Off is printed. 44px target, forced-colors (Windows High Contrast) styles. No script needed. |
| SensitiveDataBanner | Molecule | Built (v1.5) | Tells people the screen shows PII or other sensitive data. First in the reading order of the page or section. NOT dismissible (closing it removes the reminder while the data is still shown), NOT sticky (it would cover content and focus), NOT a live region. Padlock shape, the words "Sensitive data", a full border and a heavy top rule that prints in black and white and shows in Windows High Contrast. The handling wording belongs to PBGC: the default only says what the page contains, and apps pass the exact required text. |
| Tabs | Molecule | Built (v1.6) | WAI-ARIA tabs pattern: `tablist`/`tab`/`tabpanel`, roving tabindex (one Tab stop), Left/Right with wrap, Home/End, Tab goes into the panel. Automatic activation by default; `manual` (Enter or Space selects) for slow or side-effecting panels. A panel with no focusable content is itself focusable so it can be scrolled. Tabs wrap onto more lines at narrow widths instead of scrolling sideways. Selected tab has a thick bar and bold text, not color alone. No disabled tabs by design. For switching content in place, not for navigating between pages. |
| Charts, Stepper | | Backlog | Custom widgets: full keyboard model required before building (see §8) |

Naming note: v1.0.0 mixed up layers (Input as a molecule, Alert as an organism). Layer here means: **atom** = single element; **molecule** = a small group working as one unit; **organism** = a self-contained section.

---

## 8. Keyboard model for custom widgets

Native elements first. If a custom widget is unavoidable, it must implement the WAI-ARIA Authoring Practices pattern completely:

- **Tabs (built v1.6):** `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls`/`aria-labelledby`, Left/Right arrows with wrap, Home/End, roving tabindex (only the selected tab is a Tab stop), Tab moves into the panel. Automatic activation (focus selects) by default; manual activation (Enter or Space selects) as an option. No disabled tabs.
- **Modal dialog:** use native `<dialog>` + `showModal()`. Focus moves in, the page behind is inert, Escape closes, focus returns to the trigger. Be precise about "trapped": a native modal does NOT wrap focus. After the last control, Tab moves to the browser's own UI and the next Tab re-enters the dialog. The guarantee is that focus never reaches page content behind it.
- **Menu button (ActionMenu):** Enter, Space or ArrowDown opens on the first item; ArrowUp opens on the last; arrows move and wrap; Home/End jump; a typed letter jumps to the next item starting with it; Escape closes and returns focus to the button; Tab closes. Items use roving `tabindex`. Disabled items stay focusable (`aria-disabled`).
- **Tooltip:** shows on hover and keyboard focus, stays while the pointer is over it, Escape dismisses it without moving focus. Never holds essential information.
- **Disclosure/accordion:** `aria-expanded`, `aria-controls`, Enter and Space.
- **Switch:** native checkbox with `role="switch"`; Space toggles (Enter does not, as with any checkbox).
- **Menus and dropdowns:** ActionMenu is the single sanctioned custom menu, built because row and toolbar actions cannot be done with a native `<select>` or disclosure. Do not build another; to choose a form value use Select, for navigation use links.

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

**Behavior gate (`npm run test:behavior`).** axe cannot test keyboard models, focus return, timing or open states. This gate drives the interactive components with real keystrokes and pointer events and runs axe on each OPEN state. It runs every scenario against both the React build and the framework-free build and expects identical results. `npm run test:reference` checks the single-file reference page at 1200px and 375px in both themes: 0 axe violations, no horizontal scroll, no network requests.

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

### 10.1 Interface text (closes Q15)

The Editorial Style Guide covers prose, not interface text. These rules extend the table above using plainlanguage.gov, and they match the wording the components already use ("There is a problem", the "Error:" prefix). COLA review is welcome but not blocking.

| Element | Rule | Write | Not |
|---|---|---|---|
| Buttons | Verb first, sentence case, say what happens. Name the object when it is destructive or ambiguous. | "Save changes", "Download report", "Delete file" | "Submit", "OK", "Click here", "Yes" |
| Cancel | Always "Cancel", on the safe side of a pair. | "Cancel" / "Delete file" | "No", "Go back" |
| Links | The text names the destination or action and makes sense out of context. | "Read the Section 508 policy" | "Click here", "Read more", "Link" |
| Field labels | A noun phrase above the field. Hints go under the label, never in the placeholder. Mark optional fields "(optional)"; do not use asterisks. | "Date of birth" + hint "For example, November 1, 1960" | Placeholder as the only label |
| Errors | Start with "Error:" (not color alone). Say what is wrong, then how to fix it. No blame, no codes alone, no "invalid". | "Error: Enter the date as MM/DD/YYYY." | "Invalid input", "You entered it wrong", "Error 422" |
| Error summary | Title "There is a problem". Each item links to its field and repeats the field's error text. | | "Oops!", "Please fix the following" |
| Notifications | Past tense, specific, no exclamation marks, no humor. One idea per message. | "Report saved." "Import failed: the file is not a CSV." | "Success!", "Something went wrong" |
| Loading | Present participle that names the work. Do not say "please wait". | "Loading plan data" | "Please wait...", "Loading..." |
| Confirm dialogs | The title is the question and names the object. The body states the consequence. The buttons repeat the action. | "Delete this file?" / "This cannot be undone." / "Delete file", "Cancel" | "Are you sure?" / "OK" |
| Empty states | Say what is missing and the next step. | "No cases yet. Add a case to begin." | A blank area, "No data" |
| Numbers and dates | Follow section 10 (dates "November 1, 2026"; times "8 a.m."). Currency "$1,234.56"; percentages "3%"; units spelled or standard ("years", "mo."). Never truncate figures a person must check. | | "1st Nov", "12 p.m." |
| Abbreviations | Spell out on first use in a screen with the abbreviation in parentheses. "PBGC" is not expanded. | "Adjustable-rate (AR) factor" | Unexplained actuarial shorthand |
| Voice | Plain, neutral, direct. Address the person as "you" for actions; say "participant" for the plan member. | | Marketing language, jargon, "utilize" |
| Sample or demo text | Obviously fictional (see section 10). | "Sample plan A" | Real names, amounts or deadlines |

---

## 11. Print

Fact sheets and letters are printed. Stylesheet rules shipped in `components.css`: black on white, 12 pt, nav and buttons hidden, link URLs printed after the link text, cards avoid page breaks. Test every template in print preview.

---

## 12. Governance

- **Versioning:** semantic. Any change to a token value is at least a minor version; any removal is major.
- **Single edit point:** change `tokens/tokens.json`, run `npm run tokens`. Never edit `tokens.css` or `contrast-report.md`.
- **Derived values** and every decision made without a PBGC source are tracked in `OPEN-QUESTIONS.md` (each marked Decided, Imputed, or Default in use) until COLA confirms or replaces them.
- **Source map:** the style guide supplied colors, type, logo rules, and editorial rules; `pbgc-logo-guidance.pdf` supplied logo files and clear-space rules; the two interior-page `.docx` templates supplied only the "Main Header / Secondary Header" structure; `pbgc-branding-templates-icons-logo.txt` points to an internal SharePoint library of icons and templates that was not available to this review.

---

## 13. Supported browsers (closes Q17)

**Baseline: current Chrome and Edge 114+, Firefox 125+, Safari 17+.** The newest requirement is the Popover API, used by ActionMenu, Tooltip and Toggletip. Everything else (native `<dialog>`, `inert`, `<progress>`, scroll-snap, CSS `:has()`, `dvh` units) shipped earlier in each of those browsers. Internet Explorer and Edge IE mode are not supported. This baseline is an assumption about PBGC's deployed browsers (`OPEN-QUESTIONS.md` Q17 asks PBGC to confirm).

| Feature missing | Affected components | What happens (v1.2.1) |
|---|---|---|
| Popover API (for example Firefox ESR 115) | ActionMenu, Tooltip, Toggletip | The page keeps working. `<html>` gets `pbgc-no-popover` and one console warning is logged. ActionMenu shows its actions inline as plain buttons (still fires `pbgc:select`; menu roles are dropped because the arrow-key model is not available). Toggletip help text shows inline. Tooltips are hidden, which is safe because tooltips never carry essential information (section 8). |
| Nothing else needs a fallback | Dialog, Spinner, ProgressBar, Skeleton, FilePicker, Carousel, Toast | Covered by the baseline. |

The behavior gate simulates the missing Popover API (`npm run test:behavior`, scenario `nopopover`) and checks that the page degrades as described and that dialogs and toasts still work.
