import React from 'react';

/**
 * Stepper (a step indicator): shows where a person is in a multi-step task, for example a five-part form.
 * It SHOWS progress; it is not a control, so it needs no custom keyboard model.
 *
 * - An ordered list. The current step has aria-current="step". Each step's state is also WRITTEN for screen readers
 *   ("completed", "current step", "not completed"), so nothing depends on color or shape alone.
 * - Three states look different by shape, not only by color: completed = filled circle with a check mark,
 *   current = thick ring with the number and bold label, upcoming = thin ring with the number. The connector is
 *   solid up to the current step and dashed after it.
 * - A visible summary ("Step 2 of 4: Review") sits above the list, so the position is plain text too.
 * - A completed step MAY link back (`href`) so people can fix an earlier answer. The current and upcoming steps
 *   are never links: skipping ahead would bypass validation.
 * - Wide screens: a row. Narrow screens: a column (nothing scrolls sideways).
 *
 * Your app owns the flow. When the step changes, move focus to the new step's heading so keyboard and screen-reader
 * users land at the top of the new content. Do not announce the change through a live region as well.
 * steps: [{ label, href? }], current: zero-based index of the current step (use steps.length for "all done").
 */
export function Stepper({ steps, current, label = 'Progress', className = '' }) {
  const total = steps.length;
  const done = current >= total;
  const summary = done ? `All ${total} steps complete` : `Step ${current + 1} of ${total}: ${steps[current].label}`;
  return (
    <div className={['pbgc-stepper', className].filter(Boolean).join(' ')}>
      <p className="pbgc-stepper__summary">{summary}</p>
      <ol className="pbgc-stepper__list" aria-label={label}>
        {steps.map((s, i) => {
          const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const text = state === 'complete' ? 'completed' : state === 'current' ? 'current step' : 'not completed';
          const marker = (
            <span className="pbgc-stepper__marker" aria-hidden="true">
              {state === 'complete' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                i + 1
              )}
            </span>
          );
          const body = (
            <>
              {marker}
              <span className="pbgc-stepper__label">{s.label}</span>
              <span className="pbgc-sr-only">, {text}</span>
            </>
          );
          return (
            <li key={s.label} className={`pbgc-stepper__step pbgc-stepper__step--${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              {state === 'complete' && s.href ? <a className="pbgc-stepper__link" href={s.href}>{body}</a> : <span className="pbgc-stepper__inner">{body}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
