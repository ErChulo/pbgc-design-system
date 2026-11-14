import React, { createElement } from 'react';

/**
 * EmptyState: what to show where a list, table or section has nothing in it.
 * Always say WHY it is empty and WHAT to do next. Two different situations, two different wordings:
 *   - nothing exists yet:      "No cases yet." + the action that creates one
 *   - nothing matches a filter: "No cases match your filters." + the action that clears them
 * Never leave a bare blank area, and never use an error style: empty is not a failure.
 *
 * - A real heading (pick `headingLevel` to fit the page outline) so people can find it by heading.
 * - Not a live region: it is on the page when the page loads. If a search or filter EMPTIES an existing list, the
 *   app should announce the result count through its own polite status message, as the search results do.
 * - `children` is the explanation. `action` is the one next step (a Button or a link). No decorative illustration:
 *   it adds nothing for people using a screen reader and delays the message for everyone else.
 */
export function EmptyState({ title, headingLevel = 2, children, action, className = '' }) {
  return (
    <div className={['pbgc-empty', className].filter(Boolean).join(' ')}>
      {createElement(`h${headingLevel}`, { className: 'pbgc-empty__title' }, title)}
      {children && <p className="pbgc-empty__text">{children}</p>}
      {action && <div className="pbgc-empty__action">{action}</div>}
    </div>
  );
}
