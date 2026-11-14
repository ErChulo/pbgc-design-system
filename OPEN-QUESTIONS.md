# Open questions and decisions

The source material does not settle everything. Each item below is a place where this design system had to make a call. As of v1.2.2 every item has a status:

- **Decided.** A system-level call has been made and recorded with its reasoning. It stays in force unless PBGC overrules it. Nothing is waiting on anyone.
- **Default in use, confirm.** A default is shipping, and it rests on an assumption about PBGC that only PBGC can confirm. Ask once; if the answer differs it is a small change (noted per item).
- **Imputed.** The value was estimated, not measured or sourced, because the source was not available to this review. It is set on the safe side, labelled as imputed everywhere it appears, and should be replaced by a measured or official value when one is available.

Send the "confirm" and "imputed" items to COLA (COLAGraphicsAV@pbgc.gov) and, for accessibility, the Section 508 team (Section508ComplianceTeam@pbgc.gov). Record the answers here and in `tokens/tokens.json`.

## Summary

| Status | Items |
|---|---|
| Decided | Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q18 |
| Imputed (estimated, not measured) | Q4 |
| Default in use, confirm | Q1, Q2, Q3, Q17 |

Nothing is blocked. v1.2.2 converted the six items that were waiting on PBGC facts into decisions or an imputed value, so no component depends on an unanswered question. The values and choices most worth a look by PBGC when convenient are Q4 (logo clear space), Q8 (logo file mapping), Q17 (browsers) and Q1 to Q3 (colors).

---

## A. The style guide contradicts itself

| # | Issue | Evidence | Status and decision |
|---|---|---|---|
| Q1 | **PBGC Blue: HEX and RGB disagree.** | Guide pp. 10 and 13 list HEX `#002D72` but RGB 0, 75, 141, which is `#004B8D`. | **Default in use, confirm.** Rule applied to all three colors: the guide's printed HEX is the web value, because HEX is the value screen tools consume; the RGB figures read as print-process conversions. `#002D72` is used; `#004B8D` is kept as Medium Blue. If COLA rules the other way it is a one-line change in `tokens/tokens.json`, and the 65 contrast checks re-run automatically. |
| Q2 | **PBGC Red: HEX and RGB disagree.** | HEX `#E4002B` but RGB 238, 58, 67 = `#EE3A43`. | **Default in use, confirm.** `#E4002B`, same rule. |
| Q3 | **Medium Blue (307 C): HEX and RGB disagree.** | HEX `#004B8D` but RGB 19, 119, 174 = `#1377AE`. | **Default in use, confirm.** `#004B8D`, same rule. It is also identical to the "supporting blue" in the graphics set. |

The other secondary colors (Gray, Light Blue Gray, Medium Green, Teal, Light Green) have matching HEX and RGB.

## B. Logo

The logo is official artwork that may not be redrawn, so `assets/logos/` is intentionally empty of artwork and the `Logo` component shows a labelled placeholder until files are copied in locally.

| # | Question | Status and decision |
|---|---|---|
| Q4 | **Clear space** is "the width of the P in the logo". Which file is the master for measuring, and what is that width as a fraction of the logo width? | **Imputed.** The master files could not be measured here, so the `Logo` component applies generous estimates: 10% of the rendered width for horizontal and banner lockups, 20% for square lockups (about 1.5 to 2 times the expected P width). More space than required stays compliant; the cost is some extra whitespace. Measure the P in `PBGC_logo_name_hor_fc.png` and `PBGC_logo_fc.png` and update `CLEAR_SPACE` in `Logo.jsx` to replace the estimate. |
| Q8 | **Which logo file maps to which guide variant?** File names (`name_hor`, `words_only`, `tagl`, `notag`, `banner_slim`, `text_banner_slim`) were mapped by inference; see `assets/logos/MANIFEST.md`. | **Decided.** The file-name mapping is the working mapping. It was not checked by eye. The names are consistent with the guide's variant names, and the risk is contained: if a file proves to be a different variant than its name says, the fix is one line in `FILES` in `Logo.jsx`. |
| Q9 | **`logo-negro.png`** has a Spanish name, an older modified date, and is not in the guide. Is it official? | **Decided.** It stays excluded. Using an unverified file as an official logo is the worse error. The official monochrome files are `PBGC_logo_bw.png` and `PBGC_logo_notag_bw.png`. Reopen only if COLA says it is official. |
| Q10 | **Approval to store the logo in a repository and to publish it.** The guide requires COLA approval for external use. Does the GitHub repository count? | **Decided.** Policy: official artwork is never committed to this repository. `.gitignore` now excludes `assets/logos/*.png`, `.eps`, `.svg` and `.pdf`, so it cannot be added by accident, and each app copies the files in locally from the official source. That removes the approval question for this repository. Separate and not decided here: `ErChulo/pbgc-design-system` is **public** (other projects depend on it, so the system did not change it). Whether design guidance derived from internal PBGC style documents may be public is the repository owner's call. |

## C. Values this system derived (not in any PBGC source)

| # | Value | Status and decision |
|---|---|---|
| Q5 | Error red `#B3001B`; warning `#8A5700`; tints `#FDECEF`, `#FFF4D6`, `#EAF0F8`, `#E6F2EF`; ink `#1A1A1A`; focus ring = Medium Blue; hover red `#8F0016`. | **Decided.** The brand defines no status colors, so these are the system's status palette. Each passes its contrast threshold (tested on every build). If PBGC supplies a status-color standard, it replaces these by editing `palette.derived`. |
| Q6 | **Dark theme** (`night-0/1/2` and all dark mappings). | **Decided.** Kept, and stays **provisional and opt-in**, as `design.md` section 2.5 already says: it is not the default and should not ship in a public-facing PBGC product without COLA approval. For internal utility apps it is available through `data-theme="dark"`. |
| Q18 | Dark-theme tooltip and toast contrast, and the `bg.scrim` and elevation (shadow) values added in v1.2.0. | **Decided.** Adopted on the same terms as Q5 and Q6. Computed contrast passes (65 checks; toast text measured at 15.3:1 light and 12.9:1 dark). |

## D. Typography

| # | Question | Status and decision |
|---|---|---|
| Q7 | Arial or Garamond for web applications? | **Decided.** Arial (Helvetica Neue on Mac) for all UI and body text; Garamond only for long-form fact-sheet pages at 20px, never in controls, tables or forms. See `design.md` section 3. |

## E. Standards and policy

| # | Question | Status and decision |
|---|---|---|
| Q11 | **Which WCAG version does PBGC require?** And is there a PBGC-specific accessibility test tool? | **Decided (standard).** The system targets WCAG 2.2 AA. To our understanding Section 508 incorporates WCAG 2.0 AA by reference; 2.2 AA is a superset, so meeting it meets 2.0 AA, and automated checks are tagged 2.0, 2.1 and 2.2. **Test tool decided too.** Automated axe checks plus the manual checks in `design.md` section 9.4 are the release gate. If PBGC mandates a specific tool (for example Trusted Tester or ANDI), add it as a further manual step; it does not change any component. Note that automated checks cover only part of WCAG, and no screen-reader testing has been done. |
| Q12 | **GSAP and other third-party libraries.** | **Decided.** No third-party runtime libraries. CSS transitions only, as in `design.md` section 6. Adding any library needs a dependency, license and supply-chain review first; that process is PBGC's to define. |
| Q13 | **Icon set.** The official icon library is on an internal SharePoint site this review could not reach. | **Decided.** The status icons drawn in this system (a different shape per status, so meaning never depends on color) are the system's icons. They are not PBGC brand marks. If an official set is later provided, swapping them is a localized change in `Icon.jsx` and `src/behaviors/index.js`. |
| Q14 | **Web templates.** Only Word templates were in the source folder. Is there a web template or a PBGC.gov pattern library to align with? | **Decided.** The system defines its own page structure (header, main, footer, layout and spacing rules) from the style guide. No web template exists in the source material to align to. If PBGC.gov patterns are supplied later, compare them against `design.md` sections 5 and 7. |
| Q15 | **Editorial rules for UI microcopy.** | **Decided.** Rules written in `design.md` section 10.1 (buttons, links, errors, notifications, loading, confirmations, empty states). They extend the Editorial Style Guide rules and match the wording the components already use. COLA review welcome, not blocking. |
| Q16 | **Which components next, and which apps consume the system first?** | **Decided.** First consumers: the single-file HTML utility apps, which is why the framework-free build is first-class. Next components, in this order: (1) numeric, currency and percent field (built in v1.3.0); (2) Textarea and Switch (built in v1.4.0); (3) sensitive-data (PII) banner; (4) Tabs; (5) Stepper; (6) description list, empty state and stat tile; (7) date input; (8) Sidebar and NavGroup; (9) charts, last and under their own data-visualization rules. Tabs and Stepper need the full keyboard model in `design.md` section 8 before they are built. |
| Q17 | **Supported browser baseline.** | **Default in use, confirm.** Baseline: Chrome/Edge 114+, Firefox 125+, Safari 17+ (set by the Popover API). Where it is missing, menus, tooltips and toggletips now degrade instead of breaking (v1.2.1; see `design.md` section 13 and the `nopopover` test). Please confirm which browsers PBGC deploys. If Firefox ESR 115 or older Edge is in use, the degraded mode applies there; if IE mode is required, the system cannot support it. |
