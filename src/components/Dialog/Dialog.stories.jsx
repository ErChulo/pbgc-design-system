import React, { useState } from 'react';
import { Dialog, ConfirmDialog } from './Dialog.jsx';
import { Button } from '../Button/Button.jsx';

export default {
  title: 'Organisms/Dialog',
  component: Dialog,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    placement: { control: 'inline-radio', options: ['center', 'end'] },
    dismissible: { control: 'boolean' },
  },
};

function Demo({ initialOpen = false, ...args }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const body = <p>This is sample dialog content. Focus is trapped here until the dialog closes, then returns to the button that opened it.</p>;
const footer = (
  <>
    <Button variant="secondary" data-pbgc-close>Cancel</Button>
    <Button data-pbgc-close>Save</Button>
  </>
);

export const Default = { render: (a) => <Demo {...a} />, args: { title: 'Sample dialog', children: body, footer } };
export const Large = { ...Default, args: { ...Default.args, size: 'lg' } };
export const Drawer = { ...Default, args: { ...Default.args, title: 'Sample drawer', placement: 'end' } };
export const LongContent = {
  ...Default,
  args: { ...Default.args, title: 'Long content scrolls inside the panel', children: Array.from({ length: 14 }, (_, i) => <p key={i}>Sample paragraph {i + 1}. The header and footer stay visible while this text scrolls.</p>) },
};
/* Opens on load so the accessibility gate tests the OPEN state. Excluded from the docs page. */
export const OpenOnLoad = { render: (a) => <Demo {...a} initialOpen />, args: Default.args, tags: ['!autodocs'] };

export const Confirm = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState('No choice yet.');
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete sample file</Button>
        <p role="status">{result}</p>
        <ConfirmDialog
          open={open}
          destructive
          title="Delete this sample file?"
          confirmLabel="Delete file"
          onConfirm={() => { setOpen(false); setResult('Confirmed.'); }}
          onCancel={() => { setOpen(false); setResult('Cancelled.'); }}
        >
          <p>This is a sample confirmation. Focus starts on Cancel so Enter does not confirm by accident.</p>
        </ConfirmDialog>
      </>
    );
  },
};
