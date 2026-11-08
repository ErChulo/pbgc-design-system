import React from 'react';

/**
 * Button. Renders a real <button>, or an <a> when `href` is given (navigation is a link, not a button).
 * Minimum height is 44px at every size; there is deliberately no "small" size.
 */
export function Button({ variant = 'primary', size = 'md', href, children, className = '', ...rest }) {
  const classes = ['pbgc-button', `pbgc-button--${variant}`, size === 'lg' && 'pbgc-button--lg', className]
    .filter(Boolean)
    .join(' ');
  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
