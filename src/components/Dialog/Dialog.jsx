import React, { createElement, useEffect, useId, useRef } from 'react';
import { enhanceDialog } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';
import { Button } from '../Button/Button.jsx';

/**
 * Dialog on the native <dialog> element opened with showModal(), so the BROWSER provides the focus trap,
 * Escape to close, an inert background, and focus return to the trigger. Nothing here re-implements those.
 *
 * - `open` is controlled; `onClose(returnValue)` fires for Escape, the Close button, a backdrop click,
 *   and any <form method="dialog"> submit.
 * - `placement="end"` makes it a side drawer.
 * - `dismissible={false}` disables backdrop-click closing (Escape and Close still work).
 * - Put `data-pbgc-close` on any button that should close it.
 */
export function Dialog({ open, onClose, title, children, footer, size = 'md', placement = 'center', dismissible = true, headingLevel = 2, className = '' }) {
  const ref = useRef(null);
  const titleId = useId();
  useEnhance(ref, enhanceDialog);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    const handler = () => onClose?.(d.returnValue);
    d.addEventListener('close', handler);
    return () => d.removeEventListener('close', handler);
  }, [onClose]);

  const classes = ['pbgc-dialog', size !== 'md' && `pbgc-dialog--${size}`, placement === 'end' && 'pbgc-dialog--drawer', className].filter(Boolean).join(' ');
  return (
    <dialog ref={ref} className={classes} aria-labelledby={titleId} data-pbgc-dialog data-dismissible={dismissible ? undefined : 'false'}>
      <div className="pbgc-dialog__panel">
        <header className="pbgc-dialog__header">
          {createElement(`h${headingLevel}`, { id: titleId, className: 'pbgc-dialog__title' }, title)}
          <button type="button" className="pbgc-dialog__close" data-pbgc-close>
            <span aria-hidden="true">&times;</span>
            <span className="pbgc-sr-only">Close dialog</span>
          </button>
        </header>
        <div className="pbgc-dialog__body">{children}</div>
        {footer && <footer className="pbgc-dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}

/**
 * ConfirmDialog: a small Dialog with Cancel and Confirm. Focus starts on CANCEL so Enter never confirms a
 * destructive action by accident. Buttons are a native <form method="dialog">; no click handlers needed.
 */
export function ConfirmDialog({ open, onConfirm, onCancel, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive = false }) {
  const cancelId = useId();
  useEffect(() => {
    if (open) document.getElementById(cancelId)?.focus();
  }, [open, cancelId]);
  return (
    <Dialog
      open={open}
      size="sm"
      title={title}
      onClose={(rv) => (rv === 'confirm' ? onConfirm?.() : onCancel?.())}
      footer={
        <form method="dialog" className="pbgc-dialog__actions">
          <Button id={cancelId} type="submit" value="cancel" variant="secondary">{cancelLabel}</Button>
          <Button type="submit" value="confirm" variant={destructive ? 'danger' : 'primary'}>{confirmLabel}</Button>
        </form>
      }
    >
      {children}
    </Dialog>
  );
}
