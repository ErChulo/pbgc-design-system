import React, { useEffect, useId, useRef } from 'react';
import { enhanceFilePicker } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * FilePicker: a native <input type="file"> stretched over a drop zone. Click, keyboard (Tab then Enter/Space)
 * and drag-and-drop all work, and drag-and-drop is only an enhancement: keyboard users use the native input.
 *
 * - Validates type (`accept`) and size (`maxSizeMB`) and lists rejected files as text errors.
 * - Selected files are listed with Remove buttons; with `multiple`, later picks are ADDED to the selection.
 * - LOCAL ONLY: the browser reads the file. This component never uploads anything, so it is safe in
 *   environments with no network. Read files with FileReader or file.text() in your app.
 * - onFilesChange({ files, rejected }) fires after every change.
 */
export function FilePicker({ label, hint, accept, multiple = false, maxSizeMB, name, onFilesChange }) {
  const uid = useId();
  const ref = useRef(null);
  useEnhance(ref, enhanceFilePicker);

  useEffect(() => {
    const el = ref.current;
    const handler = (e) => onFilesChange?.(e.detail);
    el.addEventListener('pbgc:files', handler);
    return () => el.removeEventListener('pbgc:files', handler);
  }, [onFilesChange]);

  const hintId = `${uid}-hint`;
  return (
    <div ref={ref} className="pbgc-filepicker" data-pbgc-filepicker data-max-size-mb={maxSizeMB}>
      <label htmlFor={uid} className="pbgc-filepicker__label">{label}</label>
      {hint && <p id={hintId} className="pbgc-filepicker__hint">{hint}</p>}
      <div className="pbgc-filepicker__zone">
        <input id={uid} className="pbgc-filepicker__input" type="file" name={name} accept={accept} multiple={multiple} aria-describedby={hint ? hintId : undefined} />
        <span className="pbgc-filepicker__prompt" aria-hidden="true">Drag {multiple ? 'files' : 'a file'} here, or</span>
        <span className="pbgc-button pbgc-button--secondary" aria-hidden="true">Choose {multiple ? 'files' : 'a file'}</span>
      </div>
      <div className="pbgc-filepicker__errors" data-fp-errors />
      <ul className="pbgc-filepicker__list" data-fp-list aria-label="Selected files" hidden />
      <p className="pbgc-sr-only" role="status" data-fp-status />
    </div>
  );
}
