import React from 'react';
import { Footer } from './Footer.jsx';

export default {
  title: 'Organisms/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  args: {
    columns: [
      { heading: 'Workers and retirees', links: [{ label: 'Sample link one', href: '#w1' }, { label: 'Sample link two', href: '#w2' }] },
      { heading: 'Employers and practitioners', links: [{ label: 'Sample link three', href: '#e1' }, { label: 'Sample link four', href: '#e2' }] },
      { heading: 'About PBGC', links: [{ label: 'Sample link five', href: '#a1' }, { label: 'Accessibility', href: '#a2' }] },
    ],
    note: 'Sample footer note. Replace with approved agency text.',
  },
  decorators: [(Story) => <div style={{ margin: '-1rem' }}><Story /></div>],
};

export const Default = {};
