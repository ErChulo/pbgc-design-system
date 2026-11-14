import React from 'react';
import { Sidebar } from './Sidebar.jsx';

export default { title: 'Organisms/Sidebar', component: Sidebar, parameters: { layout: 'padded' } };

const items = [
  { label: 'Sample home', href: '#sample-home' },
  { label: 'Sample cases', items: [{ label: 'Open cases', href: '#sample-open' }, { label: 'Closed cases', href: '#sample-closed' }] },
  { label: 'Sample reports', items: [{ label: 'Monthly report', href: '#sample-monthly' }, { label: 'Annual report', href: '#sample-annual' }] },
  { label: 'Sample help', href: '#sample-help' },
];

/** Tab moves through links and group buttons; Enter or Space opens a group. The group holding the current page opens itself. Narrow the window to see the Menu button. */
export const Default = { args: { items, currentHref: '#sample-open' } };
export const CurrentIsTopLevel = { args: { items, currentHref: '#sample-help' } };
export const AllClosed = { args: { items } };
export const InLayout = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 16rem) minmax(0, 1fr)', gap: '2rem' }}>
      <Sidebar items={items} currentHref="#sample-open" label="Sample navigation" />
      <main><h1 style={{ marginTop: 0 }}>Open cases</h1><p>Sample page content.</p></main>
    </div>
  ),
};
