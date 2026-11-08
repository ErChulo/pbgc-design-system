import React, { createElement } from 'react';

/**
 * FactsheetCard. ONE real link (inside the heading) whose ::after stretches over the card.
 * The v1.0.0 workbench used a clickable <div>: unreachable by keyboard and invisible to screen readers.
 *
 * `date` is an ISO string for the machine-readable <time>; `dateLabel` is the human text.
 * Per the Editorial Style Guide, spell the month out ("November 2026"), never "Nov 2026".
 */
export function FactsheetCard({ title, href, category, date, dateLabel, summary, headingLevel = 3 }) {
  return (
    <article className="pbgc-card">
      <div className="pbgc-card__meta">
        <span className="pbgc-card__category">{category}</span>
        {date && <time dateTime={date}>{dateLabel ?? date}</time>}
      </div>
      {createElement(
        `h${headingLevel}`,
        { className: 'pbgc-card__title' },
        <a className="pbgc-card__link" href={href}>{title}</a>
      )}
      {summary && <p className="pbgc-card__summary">{summary}</p>}
    </article>
  );
}
