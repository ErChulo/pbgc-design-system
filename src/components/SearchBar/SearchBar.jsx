import React, { useId } from 'react';

/**
 * SearchBar: a <form role="search"> with a visible label (hide it with `hideLabel` only when the
 * surrounding page already makes the purpose obvious; it stays available to screen readers).
 * Submits by GET to `action`; no JavaScript required.
 */
export function SearchBar({ label = 'Search PBGC.gov', action = '/search', name = 'q', hideLabel = false, buttonLabel = 'Search', ...rest }) {
  const id = useId();
  return (
    <form className="pbgc-search" role="search" action={action} method="get">
      <label className={hideLabel ? 'pbgc-sr-only' : 'pbgc-search__label'} htmlFor={`${id}-q`}>{label}</label>
      <div className="pbgc-search__row">
        <input id={`${id}-q`} className="pbgc-field__input pbgc-search__input" type="search" name={name} autoComplete="off" {...rest} />
        <button type="submit" className="pbgc-button pbgc-button--primary">{buttonLabel}</button>
      </div>
    </form>
  );
}
