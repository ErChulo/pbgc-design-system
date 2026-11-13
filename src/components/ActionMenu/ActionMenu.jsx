import React, { useEffect, useId, useRef } from 'react';
import { enhanceMenu } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * ActionMenu: a menu button following the WAI-ARIA APG pattern, for row and toolbar actions.
 * Keys: Enter/Space/ArrowDown open on the first item, ArrowUp opens on the last, Arrow keys move,
 * Home/End jump, a letter jumps to the next item starting with it, Escape closes and returns focus to the
 * button, Tab closes. Disabled items stay focusable (aria-disabled) so they can be discovered.
 *
 * Do NOT use for site navigation (use HeaderNav links) or to pick a form value (use Select).
 * items: [{ id, label, onSelect?, disabled?, danger? }]
 */
export function ActionMenu({ label = 'Actions', items, onSelect, defaultOpen = false }) {
  const uid = useId();
  const ref = useRef(null);
  const handle = useEnhance(ref, enhanceMenu);

  useEffect(() => {
    const el = ref.current;
    const onPick = (e) => {
      const item = items.find((i) => i.id === e.detail.value);
      item?.onSelect?.();
      onSelect?.(e.detail.value);
    };
    el.addEventListener('pbgc:select', onPick);
    return () => el.removeEventListener('pbgc:select', onPick);
  }, [items, onSelect]);

  // Test hook for stories: open on mount so the accessibility gate can check the open state.
  useEffect(() => {
    if (defaultOpen) handle.current?.open();
  }, [defaultOpen, handle]);

  return (
    <div ref={ref} className="pbgc-menu" data-pbgc-menu>
      <button type="button" id={`${uid}-btn`} className="pbgc-button pbgc-button--secondary pbgc-menu__trigger" aria-haspopup="menu" aria-expanded="false" aria-controls={`${uid}-list`}>
        {label}
        <span className="pbgc-menu__caret" aria-hidden="true" />
      </button>
      <div id={`${uid}-list`} className="pbgc-menu__list" role="menu" aria-labelledby={`${uid}-btn`} popover="manual">
        {items.map((i) => (
          <button key={i.id} type="button" role="menuitem" tabIndex={-1} data-value={i.id} aria-disabled={i.disabled ? 'true' : undefined} className={`pbgc-menu__item${i.danger ? ' pbgc-menu__item--danger' : ''}`}>
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}
