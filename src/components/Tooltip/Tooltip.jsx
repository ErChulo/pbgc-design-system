import React, { Children, cloneElement, useEffect, useId, useRef } from 'react';
import { enhanceTooltip, enhanceToggletip } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';
import { Icon } from '../Icon.jsx';

/**
 * Tooltip: a short plain-text hint for a FOCUSABLE control (button, link, input).
 * Meets WCAG 1.4.13: appears on hover and keyboard focus, stays while the pointer is over it, and Escape
 * dismisses it. Contract: tooltips carry SUPPLEMENTARY text only. Touch users and many screen-reader users
 * never see them, so never put essential information or required instructions here. For longer or
 * linked help use Toggletip. Disabled buttons cannot show tooltips (they cannot be focused).
 */
export function Tooltip({ content, children, defaultOpen = false }) {
  const id = useId();
  const ref = useRef(null);
  const handle = useEnhance(ref, enhanceTooltip);
  useEffect(() => {
    if (defaultOpen) handle.current?.show();
  }, [defaultOpen, handle]);
  const child = Children.only(children);
  const describedBy = [child.props['aria-describedby'], id].filter(Boolean).join(' ');
  return (
    <span ref={ref} className="pbgc-tooltip-host" data-pbgc-tooltip>
      {cloneElement(child, { 'aria-describedby': describedBy })}
      <span id={id} role="tooltip" className="pbgc-tooltip" popover="manual">{content}</span>
    </span>
  );
}

/**
 * Toggletip: an (i) button that opens a small panel on click. Use it instead of a tooltip when the help is
 * longer than a phrase, contains a link, or must work by touch. `label` is the button's accessible name
 * (for example "More information: Maximum guarantee"). Escape or clicking elsewhere closes it.
 */
export function Toggletip({ label, children, defaultOpen = false }) {
  const id = useId();
  const ref = useRef(null);
  const handle = useEnhance(ref, enhanceToggletip);
  useEffect(() => {
    if (defaultOpen) handle.current?.open();
  }, [defaultOpen, handle]);
  return (
    <span ref={ref} className="pbgc-toggletip" data-pbgc-toggletip>
      <button type="button" className="pbgc-toggletip__button" aria-expanded="false" aria-controls={id}>
        <Icon name="info" />
        <span className="pbgc-sr-only">{label}</span>
      </button>
      <div id={id} className="pbgc-toggletip__panel" popover="manual">{children}</div>
    </span>
  );
}
