import React, { useId, useRef } from 'react';
import { enhanceSidebar } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * Sidebar: the main navigation of an application, with optional collapsible groups.
 * It is DISCLOSURE NAVIGATION, not an ARIA menu: links are links, a group heading is a button with aria-expanded,
 * and people move with Tab. A menu role would promise arrow-key behavior that navigation does not have.
 *
 * - One <nav> landmark with an accessible name (`label`, default "Main"). If the page has two, give them different names.
 * - Keyboard: Tab and Shift+Tab through links and group buttons (a collapsed group's links are skipped);
 *   Enter or Space opens and closes a group. Arrow keys are intentionally not used.
 * - The current page is marked aria-current="page" AND drawn with a bar and bold text, not color alone.
 *   Pass `currentHref`; the group that holds it opens by itself.
 * - Wide screens: always shown. Narrow screens: collapsed behind a "Menu" button (aria-expanded); Escape closes it
 *   and returns focus to that button. Nothing scrolls sideways.
 * - Two levels at most (a group of links). Deeper trees are a sign the structure needs rethinking, not a deeper widget.
 * - Not sticky: a pinned bar would cover content and keyboard focus (WCAG 2.4.11). Place it in your own layout column.
 * items: [{ label, href } | { label, items: [{ label, href }], defaultOpen? }]
 */
export function Sidebar({ items, currentHref, label = 'Main', menuLabel = 'Menu', className = '' }) {
  const base = `pbgc-sidebar-${useId()}`;
  const rootRef = useRef(null);
  useEnhance(rootRef, enhanceSidebar);
  const isCurrent = (it) => it.href !== undefined && it.href === currentHref;
  const link = (it) => (
    <a className="pbgc-sidebar__link" href={it.href} aria-current={isCurrent(it) ? 'page' : undefined}>{it.label}</a>
  );
  return (
    <nav ref={rootRef} className={['pbgc-sidebar', className].filter(Boolean).join(' ')} aria-label={label} data-pbgc-sidebar>
      <button type="button" className="pbgc-sidebar__toggle" data-sb-toggle aria-expanded="false" aria-controls={`${base}-list`}>{menuLabel}</button>
      <ul className="pbgc-sidebar__list" id={`${base}-list`}>
        {items.map((it, i) => {
          if (!it.items) return <li key={it.label}>{link(it)}</li>;
          const open = it.defaultOpen || it.items.some(isCurrent);
          return (
            <li key={it.label}>
              <button type="button" className="pbgc-sidebar__group" aria-expanded={open ? 'true' : 'false'} aria-controls={`${base}-g${i}`}>{it.label}</button>
              <ul className="pbgc-sidebar__sublist" id={`${base}-g${i}`} hidden={!open}>
                {it.items.map((sub) => <li key={sub.label}>{link(sub)}</li>)}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
