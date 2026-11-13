import { useEffect, useRef } from 'react';

/**
 * Attach a framework-free behavior (src/behaviors) to the element in `ref`, and tear it down on unmount.
 * `enhance` must be a module-level function (stable identity). Returns a ref to the behavior handle
 * (for example { open, close }) so a component can call it.
 */
export function useEnhance(ref, enhance) {
  const handle = useRef(null);
  useEffect(() => {
    handle.current = enhance(ref.current);
    return () => {
      handle.current?.destroy();
      handle.current = null;
    };
  }, [ref, enhance]);
  return handle;
}
