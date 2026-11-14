// Static HTML for the numeric field in the single-file reference page. Same markup contract as NumericField.jsx;
// src/behaviors/index.js supplies the behavior.
const field = ({ id, kind, label, hint, extra = '', prefix = '', suffix = '', unit = '', required = false }) => `
      <div class="pbgc-field pbgc-numfield" data-pbgc-numeric data-kind="${kind}"${extra}${required ? ' data-required' : ''} data-label="${label}">
        <label class="pbgc-field__label" for="${id}">${label}${required ? '<span class="pbgc-field__required"> (required)</span>' : ''}</label>
        <p class="pbgc-field__hint" id="${id}-hint">${hint}</p>
        <div class="pbgc-numfield__control${prefix ? ' pbgc-numfield__control--prefix' : ''}${suffix ? ' pbgc-numfield__control--suffix' : ''}">
          ${prefix ? `<span class="pbgc-numfield__adorn pbgc-numfield__adorn--prefix" aria-hidden="true">${prefix}</span>` : ''}<input id="${id}" class="pbgc-field__input pbgc-field__input--numeric" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"${required ? ' aria-required="true"' : ''} aria-describedby="${id}-hint${unit ? ` ${id}-unit` : ''} ${id}-error">${suffix ? `<span class="pbgc-numfield__adorn pbgc-numfield__adorn--suffix" aria-hidden="true">${suffix}</span>` : ''}
        </div>
        ${unit ? `<span id="${id}-unit" class="pbgc-sr-only">${unit}</span>` : ''}
        <p class="pbgc-field__error" id="${id}-error" data-nf-error hidden></p>
      </div>`;

export const numericDemos = `
    <h3 style="margin-top:2rem">Numeric field</h3>
    <div class="ref-demo" id="demo-numeric">
      ${field({ id: 'nf-cur', kind: 'currency', label: 'Sample monthly benefit', hint: 'Whole dollars and cents. Commas are optional.', prefix: '$', unit: 'in dollars', required: true })}
      ${field({ id: 'nf-pct', kind: 'percent', label: 'Sample interest rate', hint: 'Between 0% and 100%, up to 4 decimal places.', extra: ' data-min="0" data-max="100"', suffix: '%', unit: 'percent' })}
      <p class="pbgc-small pbgc-muted">It never rounds what you type: too many decimal places is an error. Up to 15 digits. A percent is in percent units (5.25 means 5.25%).</p>
    </div>
`;

export const textFieldDemos = `
    <h3 style="margin-top:2rem">Textarea and switch</h3>
    <div class="ref-demo" id="demo-textarea">
      <div class="pbgc-field pbgc-textarea" data-pbgc-textarea data-max="40" data-required>
        <label class="pbgc-field__label" for="ta-1">Sample explanation<span class="pbgc-field__required"> (required)</span></label>
        <p class="pbgc-field__hint" id="ta-1-hint">Describe the sample situation. The limit is 40 characters.</p>
        <textarea id="ta-1" class="pbgc-field__input pbgc-textarea__input" rows="4" aria-required="true" aria-describedby="ta-1-hint ta-1-count ta-1-error"></textarea>
        <p class="pbgc-textarea__count" id="ta-1-count" data-ta-count></p>
        <span class="pbgc-sr-only" role="status" data-ta-status></span>
        <p class="pbgc-field__error" id="ta-1-error" data-ta-error hidden></p>
      </div>
      <p class="pbgc-small pbgc-muted">The limit is soft: nothing is cut off, and going over is an error that says by how many.</p>
    </div>
    <div class="ref-demo" id="demo-switch">
      <div class="pbgc-switch">
        <label class="pbgc-switch__label" for="sw-1">
          <input id="sw-1" class="pbgc-switch__input" type="checkbox" role="switch" aria-describedby="sw-1-hint">
          <span class="pbgc-switch__track" aria-hidden="true"><span class="pbgc-switch__knob"></span></span>
          <span class="pbgc-switch__text">Email notifications</span>
          <span class="pbgc-switch__state" aria-hidden="true"></span>
        </label>
        <p class="pbgc-switch__hint" id="sw-1-hint">Sample setting. Takes effect immediately.</p>
      </div>
    </div>
`;

export const piiDemos = `
    <h3 style="margin-top:2rem">Sensitive data banner</h3>
    <div class="ref-demo" id="demo-pii">
      <div class="pbgc-pii">
        <svg class="pbgc-pii__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10.5V7.5a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 15v2.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        <div class="pbgc-pii__body">
          <p class="pbgc-pii__title">Sensitive data</p>
          <p class="pbgc-pii__text">This page contains personally identifiable information (PII). Handle it only as PBGC policy requires.</p>
        </div>
      </div>
      <p class="pbgc-small pbgc-muted">Not dismissible and not sticky. Replace the wording with the exact text your application must show.</p>
    </div>
`;
