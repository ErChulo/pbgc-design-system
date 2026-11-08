import React from 'react';

export default {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};

export const Scale = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <p className="pbgc-small pbgc-muted pbgc-prose">
        Arial is the brand's universal font; Helvetica Neue is preferred on Mac; Garamond is the secondary typeface (style guide p. 15). No web fonts are loaded, so nothing requires a network call.
      </p>
      <h1>Heading 1, 36px bold</h1>
      <h2>Heading 2, 28px bold</h2>
      <h3>Heading 3, 22px bold</h3>
      <p className="pbgc-lead pbgc-prose">Lead paragraph, 18px. Line length is capped at 60 characters, as the style guide requires (p. 16).</p>
      <p className="pbgc-prose">Body, 16px (12 pt). PBGC protects the retirement security of about 31 million American workers, retirees, and beneficiaries in both single-employer and multiemployer private sector pension plans.</p>
      <p className="pbgc-small pbgc-prose">Small, 14px. Captions, metadata, and table notes.</p>
      <p className="pbgc-prose pbgc-prose--serif">Garamond long-form, 20px. Use for fact sheets and reports. Garamond has a small x-height, so it is set larger than the sans body.</p>
      <p style={{ fontVariantNumeric: 'tabular-nums' }}>Tabular figures: 1,234.56 / 9,876.54 / 0.4%</p>
    </div>
  ),
};
