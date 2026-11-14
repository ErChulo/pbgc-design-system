import React from 'react';

/**
 * StatTiles: a few headline figures at the top of a page or section ("Open cases 42").
 * A <dl>: each tile is a label (dt) and its figure (dd), so a screen reader says the label with the number.
 *
 * - Use for 2 to 6 figures people need at a glance. More than that is a table.
 * - The figure is TEXT you format (this component never rounds or reformats). Always give `context` for anything that
 *   changes ("as of 11/14/2026"), so a stale number is never mistaken for a current one.
 * - Large type, tabular figures. No trend arrows or red/green: a change is stated in words in `context`
 *   ("up 3 from last month"), because direction by color alone fails people who cannot see it.
 * - Tiles wrap onto more lines; none scrolls sideways.
 * items: [{ label, value, context? }]
 */
export function StatTiles({ items, className = '' }) {
  return (
    <dl className={['pbgc-stats', className].filter(Boolean).join(' ')}>
      {items.map((it) => (
        <div className="pbgc-stat" key={it.label}>
          <dt className="pbgc-stat__label">{it.label}</dt>
          <dd className="pbgc-stat__value">{it.value}</dd>
          {it.context && <dd className="pbgc-stat__context">{it.context}</dd>}
        </div>
      ))}
    </dl>
  );
}
