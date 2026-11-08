import React, { useId } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * Select. A native <select>: keyboard, typeahead, and mobile pickers come for free.
 * Same label / hint / error contract as TextField (hint and error both in aria-describedby).
 * options: [{ value, label }]. `placeholder` adds a leading empty option; it is a prompt, never a valid answer.
 */
export function Select({ label, hint, error, required = false, options, placeholder, id, className = '', ...rest }) {
  const auto = useId();
  const selectId = id ?? `pbgc-select-${auto}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={['pbgc-field', error && 'pbgc-field--error', className].filter(Boolean).join(' ')}>
      <label className="pbgc-field__label" htmlFor={selectId}>
        {label}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </label>
      {hint && <p className="pbgc-field__hint" id={hintId}>{hint}</p>}
      <select
        id={selectId}
        className="pbgc-field__input pbgc-field__select"
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="pbgc-field__error" id={errorId}>
          <Icon name="error" size={18} />
          <span>Error: {error}</span>
        </p>
      )}
    </div>
  );
}
