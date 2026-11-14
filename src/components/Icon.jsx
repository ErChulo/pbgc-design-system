import React from 'react';

/* Status icons. Each status has a DIFFERENT SHAPE so meaning never depends on color alone (WCAG 1.4.1).
   All are decorative (aria-hidden): the visible title/text carries the meaning. */
const PATHS = {
  lock: <><rect x="4.5" y="10.5" width="15" height="10.5" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 10.5V7.5a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 15v2.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
  info: <><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 11v6M12 7.5v.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
  success: <><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  warning: <><path d="M12 3L2 20h20L12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M12 10v5M12 17.5v.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
  error: <><path d="M8 2h8l6 6v8l-6 6H8l-6-6V8l6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
};

export function Icon({ name, size = 24, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
