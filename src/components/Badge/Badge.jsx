import React from 'react';

/**
 * Badge: a short status label. The text always carries the meaning; color only reinforces it.
 * Not interactive. If it must be clickable, wrap it in a real link or button.
 * variant: 'neutral' | 'info' | 'success' | 'warning' | 'error'
 */
export function Badge({ variant = 'neutral', children, className = '' }) {
  return <span className={['pbgc-badge', `pbgc-badge--${variant}`, className].filter(Boolean).join(' ')}>{children}</span>;
}
