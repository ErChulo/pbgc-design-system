import React from 'react';

/**
 * Accordion built on native <details>/<summary>. The browser supplies Enter/Space toggling,
 * the expanded state, and screen-reader announcements, so there is no custom keyboard model to get wrong.
 * items: [{ id, title, content, defaultOpen? }]. Pass `exclusive` to make opening one close the others
 * (uses the shared `name` attribute; browsers without support simply allow several open, which is harmless).
 */
export function Accordion({ items, exclusive = false, name = 'pbgc-accordion' }) {
  return (
    <div className="pbgc-accordion">
      {items.map((item) => (
        <details key={item.id} className="pbgc-accordion__item" name={exclusive ? name : undefined} open={item.defaultOpen}>
          <summary className="pbgc-accordion__summary">{item.title}</summary>
          <div className="pbgc-accordion__panel">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
