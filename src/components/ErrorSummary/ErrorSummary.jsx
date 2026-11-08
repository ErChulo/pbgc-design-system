import React, { useEffect, useId, useRef } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * ErrorSummary. Shown at the top of the page after a failed submit.
 * - Focus moves to the summary on mount, so keyboard and screen-reader users land on it.
 * - Each item links to the field in error (href="#field-id"); activating it moves focus to that field.
 * - Messages must match the field-level messages exactly.
 * - Do not render it before the first submit attempt.
 * errors: [{ href: '#plan-name', message: 'Enter the plan name.' }]
 */
export function ErrorSummary({ title = 'There is a problem', errors, focusOnMount = true, headingLevel = 2 }) {
  const ref = useRef(null);
  const headingId = useId();
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  const onLink = (e, href) => {
    const el = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (el) {
      e.preventDefault();
      el.focus();
      el.scrollIntoView?.({ block: 'center' });
    }
  };
  const Heading = `h${headingLevel}`;
  return (
    <div ref={ref} className="pbgc-error-summary" tabIndex={-1} role="group" aria-labelledby={headingId}>
      <Heading className="pbgc-error-summary__title" id={headingId}>
        <Icon name="error" size={24} className="pbgc-error-summary__icon" />
        <span>{title}</span>
      </Heading>
      <ul className="pbgc-error-summary__list">
        {errors.map((e) => (
          <li key={e.href}>
            <a href={e.href} onClick={(ev) => onLink(ev, e.href)}>{e.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
