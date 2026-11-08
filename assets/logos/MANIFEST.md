# Logo assets

**This folder is intentionally empty of artwork.** The PBGC logo is official artwork: it must be reproduced from the digital master, may not be redrawn, and external use needs COLA approval (COLAGraphicsAV@pbgc.gov). Copy the files in by hand from the source below. Until you do, the `Logo` component shows a dashed placeholder naming the missing file. It never draws a substitute.

## Where the files are

Google Drive: `pbgc-the-book-of-job` -> `03_Branding_Assets` -> `images` (all `PBGC_*` files and the two EPS masters)
https://drive.google.com/drive/folders/1bQZ0rt6VtbS6vLAlOe2cvt-MxjlPRDML

Official source of record (internal): the COLA SharePoint library `Logos_Icons_Templates.aspx` referenced in `pbgc-branding-templates-icons-logo.txt`.

Copy the PNGs into **this folder** (`assets/logos/`). Storybook serves it at `/logos/`.

## File naming

Suffix = color: **`fc`** full color, **`bw`** black and white, **`wt`** white (reversed, for PBGC Blue and dark surfaces).

| Component `variant` | File pattern | Style-guide name (inferred) |
|---|---|---|
| `horizontal` | `PBGC_logo_name_hor_{fc,bw,wt}.png` | Horizontal logo with agency name (web, letterhead) |
| `alt-horizontal` | `PBGC_logo_words_only_{fc,bw,wt}.png` | Alternate horizontal, without "PBGC" |
| `square` | `PBGC_logo_{fc,bw,wt}.png` | Square / vertical logo with agency name |
| `square-tagline` | `PBGC_logo_tagl_{fc,bw,wt}.png` | Square logo with tagline |
| `square-no-name` | `PBGC_logo_notag_{fc,bw,wt}.png` | Square logo without agency name / tagline |
| `banner-slim` | `PBGC_logo_banner_slim_{fc,bw,wt}.png` | Banner, agency name without "PBGC" |
| `banner-text-slim` | `PBGC_logo_text_banner_slim_{fc,bw,wt}.png` | Banner, agency name and "PBGC" |

**The mapping above is inferred from file names, not verified by eye.** Open each file and confirm it matches the variant in the style guide (pp. 7-8) before relying on it (`OPEN-QUESTIONS.md` Q8).

All 21 PNGs above (7 variants x 3 colors) exist in the Drive folder, plus two vector masters:
`PBGC-Logo-FullColor.eps` and `PBGC-Logo-Tagline-FullColor.eps`. Do not convert the EPS masters to SVG without COLA approval.

## Excluded

`logo-negro.png` (from `03_Branding_Assets/Other`) is **not** included. Provenance unconfirmed (`OPEN-QUESTIONS.md` Q9).

## Usage rules (style guide pp. 9-11)

- Minimum width **0.625 in (60px)**. The component enforces it.
- Clear space equal to the width of the "P" in the logo on all sides.
- Never outline the text, move elements, change colors, scale non-proportionally, or distort.
- PNG is for web and Microsoft Office; EPS/PDF is for press and signage.
