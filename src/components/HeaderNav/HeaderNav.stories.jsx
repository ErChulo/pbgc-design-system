import React from 'react';
import { HeaderNav } from './HeaderNav.jsx';

export default {
  title: 'Organisms/HeaderNav',
  component: HeaderNav,
  parameters: { layout: 'fullscreen' },
  args: {
    items: [
      { label: 'Home', href: '#home', current: true },
      { label: 'Workers and retirees', href: '#workers' },
      { label: 'Employers and practitioners', href: '#employers' },
      { label: 'About PBGC', href: '#about' },
    ],
  },
  decorators: [(Story) => <div style={{ margin: '-1rem' }}><Story /><main id="main" tabIndex={-1} style={{ padding: '1rem' }}><h1>Page title</h1><p>Main content target for the skip link.</p></main></div>],
};

/** Resize below 1024px to see the disclosure menu. Escape closes it and returns focus to the button. */
export const Default = {};
