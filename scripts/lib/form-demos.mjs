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

export const tabsDemos = `
    <h3 style="margin-top:2rem">Tabs</h3>
    <div class="ref-demo" id="demo-tabs">
      <h4>Automatic activation</h4>
      <div class="pbgc-tabs" data-pbgc-tabs data-activation="auto">
        <div class="pbgc-tabs__list" role="tablist" aria-label="Sample sections">
          <button type="button" role="tab" class="pbgc-tabs__tab" id="ta-t1" aria-controls="ta-p1" aria-selected="true" tabindex="0">Summary</button>
          <button type="button" role="tab" class="pbgc-tabs__tab" id="ta-t2" aria-controls="ta-p2" aria-selected="false" tabindex="-1">Details</button>
          <button type="button" role="tab" class="pbgc-tabs__tab" id="ta-t3" aria-controls="ta-p3" aria-selected="false" tabindex="-1">History</button>
        </div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="ta-p1" aria-labelledby="ta-t1"><p>Sample summary text.</p></div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="ta-p2" aria-labelledby="ta-t2" hidden><p>Sample details.</p><p><a href="#sample">A sample link</a></p></div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="ta-p3" aria-labelledby="ta-t3" hidden><p>Sample history text.</p></div>
      </div>
      <h4 style="margin-top:1.5rem">Manual activation</h4>
      <div class="pbgc-tabs" data-pbgc-tabs data-activation="manual">
        <div class="pbgc-tabs__list" role="tablist" aria-label="Sample sections, manual">
          <button type="button" role="tab" class="pbgc-tabs__tab" id="tm-t1" aria-controls="tm-p1" aria-selected="true" tabindex="0">Summary</button>
          <button type="button" role="tab" class="pbgc-tabs__tab" id="tm-t2" aria-controls="tm-p2" aria-selected="false" tabindex="-1">Details</button>
          <button type="button" role="tab" class="pbgc-tabs__tab" id="tm-t3" aria-controls="tm-p3" aria-selected="false" tabindex="-1">History</button>
        </div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="tm-p1" aria-labelledby="tm-t1"><p>Sample summary text.</p></div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="tm-p2" aria-labelledby="tm-t2" hidden><p>Sample details.</p><p><a href="#sample">A sample link</a></p></div>
        <div class="pbgc-tabs__panel" role="tabpanel" id="tm-p3" aria-labelledby="tm-t3" hidden><p>Sample history text.</p></div>
      </div>
    </div>
`;

export const stepperDemos = `
    <h3 style="margin-top:2rem">Stepper</h3>
    <div class="ref-demo" id="demo-stepper">
      <div class="pbgc-stepper">
        <p class="pbgc-stepper__summary">Step 3 of 4: Review</p>
        <ol class="pbgc-stepper__list" aria-label="Progress">
          <li class="pbgc-stepper__step pbgc-stepper__step--complete"><a class="pbgc-stepper__link" href="#sample-step-1"><span class="pbgc-stepper__marker" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="pbgc-stepper__label">Participant</span><span class="pbgc-sr-only">, completed</span></a></li>
          <li class="pbgc-stepper__step pbgc-stepper__step--complete"><a class="pbgc-stepper__link" href="#sample-step-2"><span class="pbgc-stepper__marker" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="pbgc-stepper__label">Plan</span><span class="pbgc-sr-only">, completed</span></a></li>
          <li class="pbgc-stepper__step pbgc-stepper__step--current" aria-current="step"><span class="pbgc-stepper__inner"><span class="pbgc-stepper__marker" aria-hidden="true">3</span><span class="pbgc-stepper__label">Review</span><span class="pbgc-sr-only">, current step</span></span></li>
          <li class="pbgc-stepper__step pbgc-stepper__step--upcoming"><span class="pbgc-stepper__inner"><span class="pbgc-stepper__marker" aria-hidden="true">4</span><span class="pbgc-stepper__label">Submit</span><span class="pbgc-sr-only">, not completed</span></span></li>
        </ol>
      </div>
      <p class="pbgc-small pbgc-muted">Shows progress; it is not a control. Completed steps may link back. Your app moves focus to the new step's heading when the step changes.</p>
    </div>
`;

export const displayDemos = `
    <h3 style="margin-top:2rem">Description list</h3>
    <div class="ref-demo" id="demo-deflist">
      <dl class="pbgc-deflist">
        <div class="pbgc-deflist__row"><dt class="pbgc-deflist__term">Sample participant</dt><dd class="pbgc-deflist__value">Pat Example</dd></div>
        <div class="pbgc-deflist__row"><dt class="pbgc-deflist__term">Sample date of birth</dt><dd class="pbgc-deflist__value">01/15/1960</dd></div>
        <div class="pbgc-deflist__row"><dt class="pbgc-deflist__term">Sample monthly benefit</dt><dd class="pbgc-deflist__value">$1,234.50</dd></div>
        <div class="pbgc-deflist__row"><dt class="pbgc-deflist__term">Sample beneficiary</dt><dd class="pbgc-deflist__value pbgc-deflist__value--empty">Not provided</dd></div>
      </dl>
    </div>
    <h3 style="margin-top:2rem">Empty state</h3>
    <div class="ref-demo" id="demo-emptystate">
      <div class="pbgc-empty">
        <h4 class="pbgc-empty__title">No sample cases yet</h4>
        <p class="pbgc-empty__text">Cases you create appear here.</p>
        <div class="pbgc-empty__action"><button type="button" class="pbgc-button pbgc-button--primary">Create a sample case</button></div>
      </div>
    </div>
    <h3 style="margin-top:2rem">Stat tiles</h3>
    <div class="ref-demo" id="demo-stats">
      <dl class="pbgc-stats">
        <div class="pbgc-stat"><dt class="pbgc-stat__label">Sample open cases</dt><dd class="pbgc-stat__value">42</dd><dd class="pbgc-stat__context">Up 3 from last month</dd></div>
        <div class="pbgc-stat"><dt class="pbgc-stat__label">Sample average days to close</dt><dd class="pbgc-stat__value">12.5</dd><dd class="pbgc-stat__context">As of 11/14/2026</dd></div>
        <div class="pbgc-stat"><dt class="pbgc-stat__label">Sample total benefits</dt><dd class="pbgc-stat__value">$1,234,567.89</dd><dd class="pbgc-stat__context">As of 11/14/2026</dd></div>
      </dl>
    </div>
`;

export const dateDemos = `
    <h3 style="margin-top:2rem">Date field</h3>
    <div class="ref-demo" id="demo-datefield">
      <div class="pbgc-field pbgc-datefield" data-pbgc-date data-min="1900-01-01" data-max="2099-12-31" data-required data-label="Sample date of birth">
        <label class="pbgc-field__label" for="df-1">Sample date of birth<span class="pbgc-field__required"> (required)</span></label>
        <p class="pbgc-field__hint" id="df-1-hint">Use MM/DD/YYYY, for example 01/15/1960.</p>
        <input id="df-1" class="pbgc-field__input pbgc-field__input--date" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-required="true" aria-describedby="df-1-hint df-1-error">
        <p class="pbgc-field__error" id="df-1-error" data-df-error hidden></p>
      </div>
      <p class="pbgc-small pbgc-muted">Never guesses: a two-digit year or an impossible date such as 02/30 is an error that says why.</p>
    </div>
`;

export const sidebarDemos = `
    <h3 style="margin-top:2rem">Sidebar</h3>
    <div class="ref-demo" id="demo-sidebar" style="max-width:20rem">
      <nav class="pbgc-sidebar" data-pbgc-sidebar aria-label="Sample navigation">
        <button type="button" class="pbgc-sidebar__toggle" data-sb-toggle aria-expanded="false" aria-controls="sb-list">Menu</button>
        <ul class="pbgc-sidebar__list" id="sb-list">
          <li><a class="pbgc-sidebar__link" href="#sample-home">Sample home</a></li>
          <li><button type="button" class="pbgc-sidebar__group" aria-expanded="true" aria-controls="sb-g1">Sample cases</button>
            <ul class="pbgc-sidebar__sublist" id="sb-g1">
              <li><a class="pbgc-sidebar__link" href="#sample-open" aria-current="page">Open cases</a></li>
              <li><a class="pbgc-sidebar__link" href="#sample-closed">Closed cases</a></li>
            </ul></li>
          <li><button type="button" class="pbgc-sidebar__group" aria-expanded="false" aria-controls="sb-g2">Sample reports</button>
            <ul class="pbgc-sidebar__sublist" id="sb-g2" hidden>
              <li><a class="pbgc-sidebar__link" href="#sample-monthly">Monthly report</a></li>
              <li><a class="pbgc-sidebar__link" href="#sample-annual">Annual report</a></li>
            </ul></li>
          <li><a class="pbgc-sidebar__link" href="#sample-help">Sample help</a></li>
        </ul>
      </nav>
      <p class="pbgc-small pbgc-muted">Disclosure navigation, not an ARIA menu: Tab moves through links and group buttons, Enter or Space opens a group. On narrow screens it collapses behind a Menu button.</p>
    </div>
`;
