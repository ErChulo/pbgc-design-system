import React from 'react';

/**
 * DescriptionList: label and value pairs, such as the facts about one participant or one case.
 * A real <dl>, so a screen reader announces each label with its value. For tables of many rows and columns use DataTable.
 *
 * - A missing value is never left blank: it shows `emptyText` ("Not provided"). A blank gap reads as "forgot to render it".
 * - Wide screens: label beside value. Narrow screens: label above value (no sideways scroll). `layout="stacked"` forces the narrow form.
 * - Numbers use tabular figures. Pass already-formatted text; this component does not reformat amounts or dates.
 * - Labels are short noun phrases ("Date of birth"), without a trailing colon: the layout and the dl already pair them.
 * items: [{ term, value }]. `value` may be text or elements (a link, for example).
 */
export function DescriptionList({ items, layout = 'inline', emptyText = 'Not provided', className = '' }) {
  return (
    <dl className={['pbgc-deflist', layout === 'stacked' && 'pbgc-deflist--stacked', className].filter(Boolean).join(' ')}>
      {items.map((it) => {
        const empty = it.value === null || it.value === undefined || it.value === '';
        return (
          <div className="pbgc-deflist__row" key={it.term}>
            <dt className="pbgc-deflist__term">{it.term}</dt>
            <dd className={['pbgc-deflist__value', empty && 'pbgc-deflist__value--empty'].filter(Boolean).join(' ')}>{empty ? emptyText : it.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
