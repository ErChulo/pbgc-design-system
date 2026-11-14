import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { enhanceTextarea } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * Textarea: multi-line text with the same label, hint and error as TextField, plus an optional character limit.
 *
 * - `maxLength` is a SOFT limit. There is deliberately no maxlength attribute: a browser cuts pasted text off
 *   silently, and a person could submit a statement that lost its ending without knowing. Going over is an error
 *   that says by how many; the text is never changed.
 * - The visible count updates on every key. Screen readers hear it only after a one-second pause, and only when
 *   20% or less is left (or the limit is passed), so typing is not interrupted.
 * - Errors: over the limit shows at once; "required" shows when the field is left, then clears as soon as it is fixed.
 * - Uncontrolled. Use onValueChange({ value, length, valid, error }), or ref.current.validate() / getValue() on submit.
 *   Pass `error` for a rule this field cannot know; the next keystroke clears it.
 * - Resizable vertically only, so it cannot be dragged wider than its container.
 */
export const Textarea = forwardRef(function Textarea(
  { label, hint, maxLength, required = false, requiredMessage, rows = 5, defaultValue = '', error, onValueChange, id, name, disabled = false, className = '', ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `pbgc-textarea-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const countId = maxLength ? `${inputId}-count` : undefined;
  const errorId = `${inputId}-error`;
  const describedBy = [hintId, countId, errorId].filter(Boolean).join(' ');
  const rootRef = useRef(null);
  const handle = useEnhance(rootRef, enhanceTextarea);

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
      className={['pbgc-field', 'pbgc-textarea', className].filter(Boolean).join(' ')}
      data-pbgc-textarea
      data-max={maxLength}
      data-required={required ? '' : undefined}
      data-required-message={requiredMessage}
    >
      <label className="pbgc-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </label>
      {hint && <p className="pbgc-field__hint" id={hintId}>{hint}</p>}
      <textarea
        id={inputId}
        name={name}
        className="pbgc-field__input pbgc-textarea__input"
        rows={rows}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-required={required ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {maxLength ? <p className="pbgc-textarea__count" id={countId} data-ta-count /> : null}
      <span className="pbgc-sr-only" role="status" data-ta-status />
      <p className="pbgc-field__error" id={errorId} data-ta-error hidden />
    </div>
  );
});
