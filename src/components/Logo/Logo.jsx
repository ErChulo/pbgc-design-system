import React, { useState } from 'react';

/*
 * Logo. Renders the OFFICIAL artwork only. This component never draws, recolors, outlines or
 * re-creates the PBGC mark: the style guide forbids it (p. 11) and external use needs COLA approval.
 *
 * Filenames follow the set stored in Drive: 03_Branding_Assets/images. The variant-to-file mapping is
 * INFERRED from file names (decided, not eyeballed); see assets/logos/MANIFEST.md.
 * Color suffixes: fc = full color, bw = black and white, wt = white (reversed).
 */
const FILES = {
  horizontal: (c) => `PBGC_logo_name_hor_${c}.png`,
  'alt-horizontal': (c) => `PBGC_logo_words_only_${c}.png`,
  square: (c) => `PBGC_logo_${c}.png`,
  'square-tagline': (c) => `PBGC_logo_tagl_${c}.png`,
  'square-no-name': (c) => `PBGC_logo_notag_${c}.png`,
  'banner-slim': (c) => `PBGC_logo_banner_slim_${c}.png`,
  'banner-text-slim': (c) => `PBGC_logo_text_banner_slim_${c}.png`,
};

/*
 * Clear space, as a fraction of the rendered logo width. The style guide says clear space equals the width of
 * the "P" in the logo. These fractions are IMPUTED, not measured: they were set at roughly 1.5 to 2 times the
 * P width expected for each lockup (a P in a wide horizontal lockup is a smaller share of the width than in a
 * stacked square lockup), so they err toward MORE space, which keeps the logo compliant. Replace with
 * measured values from the master files when someone can (design.md section 4, OPEN-QUESTIONS.md Q4).
 */
export const CLEAR_SPACE = {
  horizontal: 0.1,
  'alt-horizontal': 0.1,
  'banner-slim': 0.1,
  'banner-text-slim': 0.1,
  square: 0.2,
  'square-tagline': 0.2,
  'square-no-name': 0.2,
};

const DEFAULT_ALT = {
  'square-no-name': 'PBGC',
  'banner-slim': 'PBGC',
};

export function Logo({ variant = 'horizontal', color = 'fc', width = 200, alt, basePath = '/logos/' }) {
  const [missing, setMissing] = useState(false);
  const file = FILES[variant]?.(color);
  const label = alt ?? DEFAULT_ALT[variant] ?? 'Pension Benefit Guaranty Corporation';

  // The 60px floor is 0.625 in at 96 dpi (style guide p. 9). Clamp, never shrink below it.
  const safeWidth = Math.max(width, 60);

  if (!file) return null;
  const clearSpace = `${(safeWidth * (CLEAR_SPACE[variant] ?? 0.2)).toFixed(1)}px`;
  return (
    <span className="pbgc-logo" style={{ '--pbgc-logo-clear-space': clearSpace }}>
      {missing ? (
        <span className="pbgc-logo__missing" role="img" aria-label={label}>
          [Official PBGC logo: copy <code>{file}</code> into assets/logos/]
        </span>
      ) : (
        <img src={`${basePath}${file}`} alt={label} width={safeWidth} onError={() => setMissing(true)} />
      )}
    </span>
  );
}
