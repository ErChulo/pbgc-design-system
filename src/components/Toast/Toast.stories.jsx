import React from 'react';
import { useToast } from './Toast.jsx';
import { Button } from '../Button/Button.jsx';

export default { title: 'Organisms/Toast', parameters: { layout: 'padded' } };

export const Playground = {
  render: () => {
    const toast = useToast();
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button onClick={() => toast.show({ variant: 'info', title: 'Sample report ready', message: 'This sample disappears after 10 seconds.' })}>Info</Button>
        <Button onClick={() => toast.show({ variant: 'success', title: 'Sample changes saved' })}>Success</Button>
        <Button onClick={() => toast.show({ variant: 'warning', title: 'Sample warning', message: 'Stays until you dismiss it.' })}>Warning</Button>
        <Button variant="danger" onClick={() => toast.show({ variant: 'error', title: 'Sample error', message: 'Stays until you dismiss it, and is announced immediately.' })}>Error</Button>
        <Button variant="secondary" onClick={() => toast.clear()}>Clear all</Button>
      </div>
    );
  },
};
