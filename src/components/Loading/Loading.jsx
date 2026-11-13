import React, { useId } from 'react';

/**
 * Spinner. Always shows a TEXT label (motion and color alone do not say what is loading).
 * `role="status"` announces politely. For reliable announcement, render the Spinner's container
 * before the work starts, not at the same instant it begins.
 * Under prefers-reduced-motion the ring is static; the label still says what is happening.
 */
export function Spinner({ label = 'Loading', size = 'md', showLabel = true }) {
  return (
    <span className={`pbgc-spinner-wrap pbgc-spinner-wrap--${size}`} role="status">
      <span className="pbgc-spinner" aria-hidden="true" />
      <span className={showLabel ? 'pbgc-spinner__label' : 'pbgc-sr-only'}>{label}</span>
    </span>
  );
}

/**
 * ProgressBar on the native <progress> element. Pass `value` for determinate; omit it for indeterminate
 * (the browser reports "busy" to assistive technology). The percentage is shown as TEXT.
 */
export function ProgressBar({ value, max = 100, label, showValue = true }) {
  const id = useId();
  const determinate = typeof value === 'number';
  return (
    <div className="pbgc-progress">
      <label htmlFor={id} className="pbgc-progress__label">{label}</label>
      <div className="pbgc-progress__row">
        <progress id={id} className="pbgc-progress__bar" max={max} value={determinate ? value : undefined} />
        {determinate && showValue && <span className="pbgc-progress__value">{Math.round((value / max) * 100)}%</span>}
      </div>
    </div>
  );
}

/** Skeleton placeholder lines for content that is on its way. Decorative; one status message names it. */
export function Skeleton({ lines = 3, label = 'Loading content' }) {
  return (
    <div className="pbgc-skeleton" role="status">
      <span className="pbgc-sr-only">{label}</span>
      {Array.from({ length: lines }, (_, i) => <span key={i} className="pbgc-skeleton__line" aria-hidden="true" />)}
    </div>
  );
}
