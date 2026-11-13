import React, { useState } from 'react';
import { ActionMenu } from './ActionMenu.jsx';

export default { title: 'Molecules/ActionMenu', component: ActionMenu, parameters: { layout: 'padded' } };

const items = [
  { id: 'view', label: 'View details' },
  { id: 'download', label: 'Download copy' },
  { id: 'archive', label: 'Archive', disabled: true },
  { id: 'delete', label: 'Delete', danger: true },
];

export const Default = {
  render: (args) => {
    const [last, setLast] = useState('Nothing chosen yet.');
    return (
      <div style={{ minHeight: '16rem' }}>
        <ActionMenu {...args} onSelect={(id) => setLast(`Chose: ${id}`)} />
        <p role="status">{last}</p>
      </div>
    );
  },
  args: { label: 'Actions', items },
};
/* Opens on load so the accessibility gate tests the OPEN state. */
export const OpenOnLoad = { render: (a) => <div style={{ minHeight: '16rem' }}><ActionMenu {...a} /></div>, args: { label: 'Actions', items, defaultOpen: true }, tags: ['!autodocs'] };
