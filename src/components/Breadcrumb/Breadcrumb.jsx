import React from 'react';

/**
 * Breadcrumb. <nav aria-label="Breadcrumb"> + ordered list. The last item is the current page:
 * plain text with aria-current="page", not a link. Separators are CSS, so they are not read aloud.
 * items: [{ label, href }]; the final item's href is ignored.
 */
export function Breadcrumb({ items, label = 'Breadcrumb' }) {
  return (
    <nav className="pbgc-breadcrumb" aria-label={label}>
      <ol className="pbgc-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="pbgc-breadcrumb__item">
              {last ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
