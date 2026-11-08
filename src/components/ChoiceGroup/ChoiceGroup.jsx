import React, { useId } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * ChoiceGroup: radios (pick one) or checkboxes (pick any) inside a <fieldset> with a <legend>.
 * - The legend is the group's question and is always visible.
 * - Each option's label wraps a 24px native input in a 44px-tall row.
 * - An option's hint is tied to its own input with aria-describedby.
 * - The group's hint and error are announced with the legend through the fieldset's aria-describedby.
 * type: 'radio' | 'checkbox'. For a single "I agree" box, use one option in a checkbox group.
 */
export function ChoiceGroup({ legend, hint, error, required = false, type = 'radio', name, options, defaultValue, className = '' }) {
  const auto = useId();
  const baseId = `pbgc-choice-${auto}`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const checked = (v) => (Array.isArray(defaultValue) ? defaultValue.includes(v) : defaultValue === v);
  return (
    <fieldset
      className={['pbgc-choice', error && 'pbgc-choice--error', className].filter(Boolean).join(' ')}
      aria-describedby={describedBy}
    >
      <legend className="pbgc-choice__legend">
        {legend}
        {required && <span className="pbgc-field__required"> (required)</span>}
      </legend>
      {hint && <p className="pbgc-field__hint" id={hintId}>{hint}</p>}
      <div className="pbgc-choice__list">
        {options.map((o, i) => {
          const optId = `${baseId}-${i}`;
          const optHint = o.hint ? `${optId}-hint` : undefined;
          return (
            <div className="pbgc-choice__item" key={o.value}>
              <label className="pbgc-choice__label" htmlFor={optId}>
                <input
                  id={optId}
                  className="pbgc-choice__input"
                  type={type}
                  name={name}
                  value={o.value}
                  defaultChecked={checked(o.value)}
                  disabled={o.disabled}
                  aria-describedby={optHint}
                />
                <span>{o.label}</span>
              </label>
              {o.hint && <p className="pbgc-choice__hint" id={optHint}>{o.hint}</p>}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="pbgc-field__error" id={errorId}>
          <Icon name="error" size={18} />
          <span>Error: {error}</span>
        </p>
      )}
    </fieldset>
  );
}
