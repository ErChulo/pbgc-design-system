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
