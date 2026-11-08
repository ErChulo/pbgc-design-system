import React, { createElement } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * Alert.
 * `live` controls announcement and is OFF by default:
 *   - omit it for content that is simply on the page (announcing it on load is noise),
 *   - "polite"    -> role="status"  for non-urgent updates inserted after load,
 *   - "assertive" -> role="alert"   for errors that need immediate attention.
 * Never combine role="alert" with aria-live="polite": the roles contradict each other.
 */
export function Alert({ variant = 'info', title, live, headingLevel = 3, children, className = '' }) {
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  return (
    <div className={['pbgc-alert', `pbgc-alert--${variant}`, className].filter(Boolean).join(' ')} role={role}>
      <Icon name={variant} className="pbgc-alert__icon" />
      <div className="pbgc-alert__body">
        {title && createElement(`h${headingLevel}`, { className: 'pbgc-alert__title' }, title)}
        {children}
      </div>
    </div>
  );
}
