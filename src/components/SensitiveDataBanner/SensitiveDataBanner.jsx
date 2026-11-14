import React from 'react';
import { Icon } from '../Icon.jsx';

/**
 * SensitiveDataBanner: tells people that what is on screen is personally identifiable information (PII) or other
 * sensitive data, so they handle it accordingly. Put it at the top of the page or of the section that shows the data.
 *
 * Decisions (design.md section 7):
 * - It is NOT dismissible. Closing it would remove the reminder while the data is still on screen.
 * - It is NOT sticky and not a live region. A sticky bar would cover content and focus (WCAG 2.4.11), and announcing
 *   it on every load is noise: it is simply the first thing in the reading order.
 * - It is never color alone: a padlock shape, the words "Sensitive data", a full border, and a heavy rule that still
 *   prints in black and white and shows in Windows High Contrast.
 * - The wording of the handling rule is PBGC's, not this system's. The default says only what the page contains;
 *   pass `children` with the exact PBGC marking or handling text your application is required to show, and
 *   `policyHref` to link to the policy.
 */
export function SensitiveDataBanner({ title = 'Sensitive data', children, policyHref, policyLabel = 'Read the handling rules', className = '' }) {
  return (
    <div className={['pbgc-pii', className].filter(Boolean).join(' ')}>
      <Icon name="lock" className="pbgc-pii__icon" />
      <div className="pbgc-pii__body">
        <p className="pbgc-pii__title">{title}</p>
        <p className="pbgc-pii__text">
          {children ?? 'This page contains personally identifiable information (PII). Handle it only as PBGC policy requires.'}
          {policyHref && <> <a href={policyHref}>{policyLabel}</a></>}
        </p>
      </div>
    </div>
  );
}
