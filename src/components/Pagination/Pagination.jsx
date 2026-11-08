import React from 'react';

/**
 * Pagination. A <nav> of real links (each page is a URL), 44px targets.
 * - Current page: aria-current="page", bold, filled. Its accessible name says "current page".
 * - Previous/Next are words, not just arrows, and are omitted (not disabled) at the ends.
 * - Gaps are shown as an ellipsis that is hidden from assistive tech.
 * hrefFor(page) returns the URL for a page number.
 */
function pageList(current, total) {
  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export function Pagination({ current, total, hrefFor, label = 'Pagination' }) {
  if (total <= 1) return null;
  return (
    <nav className="pbgc-pagination" aria-label={label}>
      <ul className="pbgc-pagination__list">
        {current > 1 && (
          <li><a className="pbgc-pagination__link" href={hrefFor(current - 1)} rel="prev">Previous<span className="pbgc-sr-only"> page</span></a></li>
        )}
        {pageList(current, total).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="pbgc-pagination__gap">…</li>
          ) : (
            <li key={p}>
              <a
                className="pbgc-pagination__link pbgc-pagination__link--num"
                href={hrefFor(p)}
                aria-current={p === current ? 'page' : undefined}
                aria-label={p === current ? `Page ${p}, current page` : `Page ${p}`}
              >
                {p}
              </a>
            </li>
          )
        )}
        {current < total && (
          <li><a className="pbgc-pagination__link" href={hrefFor(current + 1)} rel="next">Next<span className="pbgc-sr-only"> page</span></a></li>
        )}
      </ul>
    </nav>
  );
}
