import { useEffect } from 'react';
import { toast, initToasts } from '../../behaviors/index.js';

/**
 * useToast(): returns { show, dismiss, clear }. Toasts are drawn by the framework-free core into two
 * persistent live regions (polite, and assertive for errors), so they are not React state.
 *
 *   const toast = useToast();
 *   toast.show({ variant: 'success', title: 'Report saved', message: 'Optional detail.' });
 *
 * Rules: info and success auto-dismiss after 10 s (pause on hover or focus); warning and error stay until
 * dismissed. Do not use a toast for anything that must be acted on or read later; use Alert or ErrorSummary,
 * which stay in the page. A toast can cover content at the bottom right: it is dismissible with its button
 * or with Escape when focused.
 */
export function useToast() {
  useEffect(() => { initToasts(); }, []);
  return toast;
}
