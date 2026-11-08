import React, { useEffect, useId, useRef, useState } from 'react';
import { Logo } from '../Logo/Logo.jsx';

/**
 * HeaderNav.
 * - Skip link is the first focusable element.
 * - Navigation items are links (<a>), with aria-current="page" on the current one.
 * - Below 1024px the list collapses into a disclosure (aria-expanded / aria-controls), closes on Escape
 *   and returns focus to the toggle. The v1.0.0 workbench hid the nav on mobile and provided no replacement.
 * - The header is PBGC Blue, so it always uses the white logo (color="wt") and the on-inverse focus ring.
 */
export function HeaderNav({ items, skipTarget = '#main', homeHref = '/', logoBasePath, ariaLabel = 'Main' }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="pbgc-header pbgc-on-inverse">
      <a className="pbgc-skip-link" href={skipTarget}>Skip to main content</a>
      <div className="pbgc-header__bar">
        <a className="pbgc-header__brand" href={homeHref}>
          <Logo variant="horizontal" color="wt" width={180} alt="PBGC home" basePath={logoBasePath} />
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="pbgc-nav__toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav aria-label={ariaLabel} className="pbgc-nav">
          <ul id={listId} className="pbgc-nav__list" data-open={open}>
            {items.map((item) => (
              <li key={item.href}>
                <a className="pbgc-nav__link" href={item.href} aria-current={item.current ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
