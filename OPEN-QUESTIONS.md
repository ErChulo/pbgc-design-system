# Open questions

Items the source material does not settle. Each one is a place where this design system had to make a call. Send the first set to COLA (COLAGraphicsAV@pbgc.gov) and the accessibility items to the Section 508 team (Section508ComplianceTeam@pbgc.gov), then record answers here and in `tokens/tokens.json`.

## A. The style guide contradicts itself (needs a COLA ruling)

| # | Issue | Evidence | What v1.1.0 does |
|---|---|---|---|
| Q1 | **PBGC Blue: HEX and RGB disagree.** | Guide pp. 10 and 13 list HEX `#002D72` but RGB 0, 75, 141, which is `#004B8D`. Pantone 288 C is conventionally `#002D72`. | Uses `#002D72` (the HEX, labelled the web value). `#004B8D` is kept as Medium Blue. |
| Q2 | **PBGC Red: HEX and RGB disagree.** | HEX `#E4002B` but RGB 238, 58, 67 = `#EE3A43`. | Uses `#E4002B`. |
| Q3 | **Medium Blue (307 C): HEX and RGB disagree.** | HEX `#004B8D` but RGB 19, 119, 174 = `#1377AE`. | Uses `#004B8D`. Note it is also identical to the "supporting blue" in the graphics set. |

The other secondary colors (Gray, Light Blue Gray, Medium Green, Teal, Light Green) have matching HEX and RGB.

## B. Logo

| # | Question |
|---|---|
| Q4 | **Clear space** is "the width of the P in the logo". Which file is the master for measuring, and what is that width as a fraction of the logo width? Default is 0.5rem until answered. |
| Q8 | **Which logo file maps to which guide variant?** The guide shows square/vertical, horizontal with name, alternate horizontal (without "PBGC"), with/without tagline, and two banner versions. File names (`name_hor`, `words_only`, `tagl`, `notag`, `banner_slim`, `text_banner_slim`) were mapped by inference; see `assets/logos/MANIFEST.md`. Confirm visually. |
| Q9 | **`logo-negro.png`** lives in `03_Branding_Assets/Other`, has a Spanish name, was modified months before the rest of the set, and is not in the guide. Is it official? v1.0.0 listed it as an approved monochrome asset. It is excluded until confirmed. The official monochrome files are `PBGC_logo_bw.png` and `PBGC_logo_notag_bw.png`. |
| Q10 | **Approval to store the logo in a repository and to publish it.** The guide requires COLA approval for external use. Does the GitHub repository (`ErChulo/pbgc-design-system`) count? Is it private? |

## C. Values this system derived (not in any PBGC source)

| # | Value | Where | Why it was needed |
|---|---|---|---|
| Q5 | Error red `#B3001B`; warning `#8A5700`; tints `#FDECEF`, `#FFF4D6`, `#EAF0F8`, `#E6F2EF`; ink `#1A1A1A` (Black 90%); focus ring = Medium Blue; hover red `#8F0016` | `palette.derived`, `theme.light` | The brand defines no error, warning, or tint colors. All pass their contrast thresholds, but none is approved. Does PBGC have a status-color standard (for example in an existing app)? |
| Q6 | **Dark theme** (`night-0/1/2` and all dark mappings) | `theme.dark` | Not in the guide. Is a dark theme wanted? If yes, COLA should define it; if no, delete `theme.dark`. |

## D. Typography

| # | Question |
|---|---|
| Q7 | The guide specifies Arial and Garamond, and Helvetica Neue on Mac, for **documents**. For **web applications**, is Arial acceptable throughout, with Garamond reserved for long-form fact sheets? Garamond's small x-height makes it hard to read at body sizes on screen; v1.1.0 sets it at 20px. Needs a design review. |

## E. Standards and policy

| # | Question |
|---|---|
| Q11 | **Which WCAG version does PBGC require?** This system targets 2.2 AA. To our understanding Section 508 incorporates 2.0 AA by reference. Confirm, and confirm whether there is a PBGC-specific accessibility standard or testing tool (for example Trusted Tester / ANDI). |
| Q12 | **GSAP and other third-party libraries.** v1.0.0 mandated GSAP. v1.1.0 uses CSS only. If GSAP is wanted, what is the approval process (license, supply chain, ATO)? |
| Q13 | **Icon set.** `pbgc-branding-templates-icons-logo.txt` points to an internal SharePoint library (`COLA/Pages/Logos_Icons_Templates.aspx`) that was not available to this review. Does it hold an official icon set and web templates that should replace the status icons drawn here? |
| Q14 | **Web templates.** The only templates in the source folder are Word documents. Does COLA have a web page template or an existing PBGC.gov pattern library to align with? |
| Q15 | **Editorial rules for UI microcopy** (buttons, errors, validation messages). The Editorial Style Guide covers prose; it does not cover interface text. |
| Q16 | **Which components does PBGC need next?** Backlog: Badge, SearchBar, Footer, Sidebar, NavGroup, date input, tabs, accordion, modal, charts. Which real applications will consume this system first, and what do they need that is not listed? |
