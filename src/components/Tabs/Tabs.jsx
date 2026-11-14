import React, { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import { enhanceTabs } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * Tabs: switch between related panels of content in the same place. NOT for navigating between pages
 * (use links) and not for steps that must happen in order (a Stepper, later).
 *
 * Keyboard (WAI-ARIA Authoring Practices): Left/Right move between tabs and wrap, Home/End go to the first/last,
 * Tab leaves the tab list for the panel. Only the selected tab is in the Tab order (roving tabindex).
 *
 * activation="auto" (default): a tab is selected as focus reaches it. Use "manual" (Enter or Space selects) when
 * showing a panel is slow or has side effects.
 *
 * `label` names the tab list for screen readers. Keep tab labels short and unique; they wrap onto more lines at
 * narrow widths rather than scrolling sideways. Disabled tabs are deliberately not supported: a tab people cannot
 * reach hides content from them; explain in the panel instead.
 * Uncontrolled: `defaultIndex`, `onTabChange({ index, id })`, and ref.current.select(index) to move programmatically.
 * tabs: [{ id, label, content }].
 */
export const Tabs = forwardRef(function Tabs({ tabs, label, defaultIndex = 0, activation = 'auto', onTabChange, className = '' }, ref) {
  const auto = useId();
  const base = `pbgc-tabs-${auto}`;
  const rootRef = useRef(null);
  const handle = useEnhance(rootRef, enhanceTabs);
  useImperativeHandle(ref, () => ({ select: (i) => handle.current?.select(i, { focus: false }), getIndex: () => handle.current?.getIndex() }), [handle]);

  React.useEffect(() => {
    const el = rootRef.current;
    const on = (e) => onTabChange?.(e.detail);
    el.addEventListener('pbgc:tab', on);
    return () => el.removeEventListener('pbgc:tab', on);
  }, [onTabChange]);

  return (
    <div ref={rootRef} className={['pbgc-tabs', className].filter(Boolean).join(' ')} data-pbgc-tabs data-activation={activation}>
      <div className="pbgc-tabs__list" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className="pbgc-tabs__tab"
            id={`${base}-tab-${t.id}`}
            aria-controls={`${base}-panel-${t.id}`}
            aria-selected={i === defaultIndex ? 'true' : 'false'}
            tabIndex={i === defaultIndex ? 0 : -1}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          className="pbgc-tabs__panel"
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== defaultIndex}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
});
