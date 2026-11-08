import React, { useId } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * TextField (the spec's FormField molecule: label + hint + input + error).
 * - The label is always visible and programmatically tied to the input.
 * - Hint AND error are both referenced by aria-describedby (the v1.0.0 workbench referenced a hint id that did not exist).
 * - Errors are text ("Error: ...") plus a shape icon plus a thicker border. Never color alone.
 * - "(required)" is spelled out; an asterisk with aria-hidden tells screen-reader users nothing.
 */
export function TextField({ label, hint, error, required = false, numeric = false, id, className = '', ...rest }) {
  const auto = useId();
  const inputId = id ?? `pbgc-field-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['pbgc-field', error && 'pbgc-field--error', className].filter(Boolean).join(' ')}>
      <label className="pbgc-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </label>
      {hint && (
        <p className="pbgc-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <input
        id={inputId}
        className={['pbgc-field__input', numeric && 'pbgc-field__input--numeric'].filter(Boolean).join(' ')}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        inputMode={numeric ? 'decimal' : undefined}
        {...rest}
      />
      {error && (
        <p className="pbgc-field__error" id={errorId}>
          <Icon name="error" size={18} />
          <span>Error: {error}</span>
        </p>
      )}
    </div>
  );
}
