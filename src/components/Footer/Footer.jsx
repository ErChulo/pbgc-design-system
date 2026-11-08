import React from 'react';
import { Logo } from '../Logo/Logo.jsx';

/**
 * Footer: <footer> (a contentinfo landmark) on PBGC Blue with the white logo and link columns.
 * Links are underlined, white, and keep the white focus ring. Each column heading is an <h2>
 * so the footer's structure is navigable by heading.
 * columns: [{ heading, links: [{ label, href }] }]
 */
export function Footer({ columns, note, homeHref = '/', logoBasePath, ariaLabel = 'Footer' }) {
  return (
    <footer className="pbgc-footer pbgc-on-inverse">
      <div className="pbgc-footer__inner">
        <a className="pbgc-footer__brand" href={homeHref}>
          <Logo variant="horizontal" color="wt" width={180} alt="PBGC home" basePath={logoBasePath} />
        </a>
        <nav aria-label={ariaLabel} className="pbgc-footer__columns">
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="pbgc-footer__heading">{col.heading}</h2>
              <ul className="pbgc-footer__list">
                {col.links.map((l) => (
                  <li key={l.href}><a className="pbgc-footer__link" href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {note && <p className="pbgc-footer__note">{note}</p>}
      </div>
    </footer>
  );
}
