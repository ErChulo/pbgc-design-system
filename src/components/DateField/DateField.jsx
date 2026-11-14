import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { enhanceDateField } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * DateField: a calendar date typed as MM/DD/YYYY (US order). Built on TextField's markup and classes.
 *
 * What it guarantees, because a wrong date changes a benefit:
 * - It never guesses. A two-digit year is an error ("Enter the year with 4 digits"), an impossible date is an error
 *   that says why ("February 2023 has 28 days."), and day and month are never swapped.
 * - `value` is an ISO date (YYYY-MM-DD) or null, so it sorts and compares as text and has no time zone. There is no
 *   Date object in the middle that could shift a day.
 * - Typing "1/5/1960", "01-05-1960", "01.05.1960" or "01051960" all work, and on leaving the field it is shown as
 *   01/05/1960. A pasted ISO date (1960-01-05) works too.
 * - `min` and `max` are ISO dates. Messages name the limit ("Enter a date on or after 01/01/1900.").
 * - Errors appear when the field loses focus, then update as the person types, so a fixed mistake clears at once.
 *
 * Why not <input type="date">: browsers draw it differently, order its parts by the computer's region, and let a
 * scroll wheel change the value. Why no auto-inserted slashes: they move the cursor and confuse screen readers.
 * There is no calendar pop-up: for birth dates, hire dates and valuation dates people type faster than they click,
 * and a pop-up is a far larger keyboard and accessibility surface than this field needs.
 *
 * UNCONTROLLED: pass `defaultValue` (ISO or MM/DD/YYYY), read changes with onValueChange({ value, text, valid, error }).
 * On submit, call ref.current.validate(). Pass `error` for a rule this field cannot know (a cross-field check).
 */
export const DateField = forwardRef(function DateField(
  { label, hint, min, max, required = false, defaultValue = '', error, onValueChange, id, name, disabled = false, className = '' },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `pbgc-datefield-${auto}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const rootRef = useRef(null);
  const handle = useEnhance(rootRef, enhanceDateField);

  useImperativeHandle(ref, () => ({
    validate: () => handle.current?.validate(),
    getValue: () => handle.current?.getValue(),
  }), [handle]);
  useEffect(() => { handle.current?.setError(error || null); }, [error, handle]);
  useEffect(() => {
    const el = rootRef.current;
    const on = (e) => onValueChange?.(e.detail);
    el.addEventListener('pbgc:value', on);
    return () => el.removeEventListener('pbgc:value', on);
  }, [onValueChange]);

  return (
    <div
      ref={rootRef}
      className={['pbgc-field', 'pbgc-datefield', className].filter(Boolean).join(' ')}
      data-pbgc-date
      data-min={min}
      data-max={max}
      data-required={required ? '' : undefined}
      data-label={label}
    >
      <label className="pbgc-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </label>
      <p className="pbgc-field__hint" id={hintId}>{hint ? `${hint} ` : ''}Use MM/DD/YYYY, for example 01/15/1960.</p>
      <input
        id={inputId}
        name={name}
        className="pbgc-field__input pbgc-field__input--date"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck="false"
        defaultValue={defaultValue}
        disabled={disabled}
        aria-required={required ? 'true' : undefined}
        aria-describedby={`${hintId} ${errorId}`}
      />
      <p className="pbgc-field__error" id={errorId} data-df-error hidden />
    </div>
  );
});
