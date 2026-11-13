import React from 'react';
import { Tooltip, Toggletip } from './Tooltip.jsx';
import { Button } from '../Button/Button.jsx';

export default { title: 'Molecules/Tooltip', component: Tooltip, parameters: { layout: 'padded' } };

export const Default = { render: (a) => <div style={{ padding: '4rem 1rem' }}><Tooltip {...a}><Button variant="secondary">Save draft</Button></Tooltip></div>, args: { content: 'Saves your changes without submitting.' } };
export const ToggletipDefault = {
  render: (a) => (
    <div style={{ padding: '1rem' }}>
      <p>Sample maximum guarantee <Toggletip {...a}><p>Sample help text. A toggletip can hold a short paragraph and a <a href="#sample">link</a>.</p></Toggletip></p>
    </div>
  ),
  args: { label: 'More information: sample maximum guarantee' },
};
/* Open on load so the accessibility gate tests the OPEN state. */
export const TooltipOpenOnLoad = { render: (a) => <div style={{ padding: '4rem 1rem' }}><Tooltip {...a} defaultOpen><Button variant="secondary">Save draft</Button></Tooltip></div>, args: Default.args, tags: ['!autodocs'] };
export const ToggletipOpenOnLoad = { ...ToggletipDefault, render: (a) => <div style={{ padding: '1rem', minHeight: '10rem' }}><Toggletip {...a} defaultOpen><p>Sample help text with a <a href="#sample">link</a>.</p></Toggletip></div>, tags: ['!autodocs'] };
