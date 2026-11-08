import React from 'react';
import { Logo } from './Logo.jsx';

export default {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          'Renders official PBGC artwork only. If the file has not been copied into `assets/logos/`, a dashed placeholder naming the missing file is shown. The component never draws a substitute mark. External use requires approval: COLAGraphicsAV@pbgc.gov.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['horizontal', 'alt-horizontal', 'square', 'square-tagline', 'square-no-name', 'banner-slim', 'banner-text-slim'] },
    color: { control: 'inline-radio', options: ['fc', 'bw', 'wt'] },
    width: { control: { type: 'number', min: 60 }, description: 'Clamped to a 60px minimum (0.625 in).' },
  },
};

export const Horizontal = { args: { variant: 'horizontal', color: 'fc', width: 240 } };
export const Square = { args: { variant: 'square', color: 'fc', width: 120 } };
/** White artwork needs a dark background. */
export const Reversed = {
  args: { variant: 'horizontal', color: 'wt', width: 240 },
  decorators: [(Story) => <div className="pbgc-on-inverse" style={{ background: 'var(--pbgc-bg-inverse)', padding: '1rem', color: '#fff' }}><Story /></div>],
};
