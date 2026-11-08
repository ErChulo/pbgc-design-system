import React from 'react';
import tokens from '../../tokens/tokens.json';

// Contrast is COMPUTED here from the real values. Nothing on this page is a hardcoded badge.
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const h = hex.replace('#', ''); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

function Swatches({ group }) {
  const entries = Object.entries(tokens.palette[group]);
  return (
    <table className="pbgc-table">
      <caption>{group} palette{group === 'derived' ? ' (not in the style guide; see OPEN-QUESTIONS.md)' : ''}</caption>
      <thead>
        <tr><th scope="col">Swatch</th><th scope="col">Name</th><th scope="col">HEX</th><th scope="col" className="pbgc-num">vs white</th><th scope="col">Safe for</th></tr>
      </thead>
      <tbody>
        {entries.map(([name, t]) => {
          const r = ratio(t.$value, '#FFFFFF');
          const use = r >= 4.5 ? 'Text and UI' : r >= 3 ? 'UI and large graphics only' : 'Decorative only';
          return (
            <tr key={name}>
              <td><span style={{ display: 'inline-block', width: 48, height: 32, background: t.$value, border: '1px solid #81807F' }} aria-hidden="true" /></td>
              <td>{name}</td>
              <td><code>{t.$value}</code></td>
              <td className="pbgc-num">{r.toFixed(2)}</td>
              <td>{use}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};

export const BrandPalette = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <p className="pbgc-prose">Source: PBGC Branding and Editorial Style Guide, September 2025, pages 10-15. Ratios are computed live against white.</p>
      <Swatches group="brand" />
      <Swatches group="secondary" />
      <Swatches group="support" />
      <Swatches group="derived" />
    </div>
  ),
};
