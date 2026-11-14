import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { enhanceNumericField } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

const UNIT = { currency: 'in dollars', percent: 'percent' };

/**
 * NumericField: an amount, rate, count or percentage typed by a person. Built on TextField's markup and
 * classes, so labels, hints and error text look and read the same.
 *
 * kind="integer" | "decimal" | "currency" | "percent". Defaults: integer 0 places, decimal 4, currency 2
 * (padded to .00 on blur), percent 4. A percent is in percent units: 5.25 means 5.25%, and value is 5.25.
 *
 * What it guarantees, because people rely on these figures:
 * - It never silently changes what was typed. Too many decimal places is an error, not a rounding.
 * - Digits are handled as a string; at most `maxDigits` (default 15) are accepted, so `value` is exact.
 *   `valueText` is the canonical decimal string (no commas, no trailing zeros) for anything beyond that.
 * - Commas are accepted only as proper thousands groups. A pasted "$1,234.50" or "5.25%" works.
 * - Errors appear when the field loses focus, then update as the person types, so a fixed mistake clears at once.
 *
 * It is UNCONTROLLED: pass `defaultValue` and read changes with onValueChange({ value, valueText, valid, error }).
 * `value` is null when the field is empty or invalid. On submit, call ref.current.validate() to show errors.
 * Pass `error` for a rule this field cannot know (for example a cross-field check); the next keystroke clears it.
 * Not for: IDs, phone numbers, ZIP codes or account numbers (those are text; leading zeros matter).
 */
export const NumericField = forwardRef(function NumericField(
  { label, hint, kind = 'decimal', decimals, min, max, allowNegative = false, required = false, maxDigits, defaultValue = '', error, onValueChange, id, name, disabled = false, className = '' },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `pbgc-numfield-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const unitId = UNIT[kind] ? `${inputId}-unit` : undefined;
  const errorId = `${inputId}-error`;
  const describedBy = [hintId, unitId, errorId].filter(Boolean).join(' ');
  const rootRef = useRef(null);
  const handle = useEnhance(rootRef, enhanceNumericField);

  useImperativeHandle(ref, () => ({
    validate: () => handle.current?.validate(),
    getValue: () => handle.current?.getValue(),
  }), [handle]);

  useEffect(() => {
    handle.current?.setError(error || null);
  }, [error, handle]);

  useEffect(() => {
    const el = rootRef.current;
    const onValue = (e) => onValueChange?.(e.detail);
    el.addEventListener('pbgc:value', onValue);
    return () => el.removeEventListener('pbgc:value', onValue);
  }, [onValueChange]);

  const prefix = kind === 'currency' ? '$' : null;
  const suffix = kind === 'percent' ? '%' : null;
  return (
    <div
      ref={rootRef}
      className={['pbgc-field', 'pbgc-numfield', className].filter(Boolean).join(' ')}
      data-pbgc-numeric
      data-kind={kind}
      data-decimals={decimals}
      data-min={min}
      data-max={max}
      data-max-digits={maxDigits}
      data-allow-negative={allowNegative ? '' : undefined}
      data-required={required ? '' : undefined}
      data-label={label}
    >
      <label className="pbgc-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </label>
      {hint && <p className="pbgc-field__hint" id={hintId}>{hint}</p>}
      <div className={['pbgc-numfield__control', prefix && 'pbgc-numfield__control--prefix', suffix && 'pbgc-numfield__control--suffix'].filter(Boolean).join(' ')}>
        {prefix && <span className="pbgc-numfield__adorn pbgc-numfield__adorn--prefix" aria-hidden="true">{prefix}</span>}
        <input
          id={inputId}
          name={name}
          className="pbgc-field__input pbgc-field__input--numeric"
          type="text"
          inputMode={kind === 'integer' ? 'numeric' : 'decimal'}
          autoComplete="off"
          spellCheck="false"
          defaultValue={defaultValue}
          disabled={disabled}
          aria-required={required ? 'true' : undefined}
          aria-describedby={describedBy}
        />
        {suffix && <span className="pbgc-numfield__adorn pbgc-numfield__adorn--suffix" aria-hidden="true">{suffix}</span>}
      </div>
      {unitId && <span id={unitId} className="pbgc-sr-only">{UNIT[kind]}</span>}
      <p className="pbgc-field__error" id={errorId} data-nf-error hidden />
    </div>
  );
});
