import React, { useId } from 'react';

/**
 * Switch: turns a setting on or off, and the change TAKES EFFECT IMMEDIATELY.
 * Use a checkbox (ChoiceGroup) when the choice is only applied on Save or Submit.
 *
 * - It is a native checkbox with role="switch", so Space toggles it, it is in a form, and a screen reader
 *   says "switch, on" or "switch, off". No script is needed.
 * - The label names the SETTING ("Email notifications"), never the action ("Turn on email notifications"),
 *   because the control already says whether it is on.
 * - State is never shown by color alone: the knob moves, and the word On or Off is printed beside it.
 * - Works in Windows High Contrast (forced colors): see components.css.
 * Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`); other props go to the input.
 */
export function Switch({ label, hint, id, className = '', disabled = false, ...rest }) {
  const auto = useId();
  const inputId = id ?? `pbgc-switch-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={['pbgc-switch', className].filter(Boolean).join(' ')}>
      <label className="pbgc-switch__label" htmlFor={inputId}>
        <input id={inputId} className="pbgc-switch__input" type="checkbox" role="switch" disabled={disabled} aria-describedby={hintId} {...rest} />
        <span className="pbgc-switch__track" aria-hidden="true"><span className="pbgc-switch__knob" /></span>
        <span className="pbgc-switch__text">{label}</span>
        <span className="pbgc-switch__state" aria-hidden="true" />
      </label>
      {hint && <p className="pbgc-switch__hint" id={hintId}>{hint}</p>}
    </div>
  );
}
