import React, { useState } from 'react';
import { Switch } from './Switch.jsx';

export default {
  title: 'Molecules/Switch',
  component: Switch,
  parameters: { layout: 'padded' },
  argTypes: { disabled: { control: 'boolean' } },
};

/** A switch applies at once. If the choice only applies on Save, use a checkbox instead. Space toggles it. */
export const Default = { args: { label: 'Email notifications', hint: 'Sample setting. Takes effect immediately.' } };
export const On = { args: { label: 'Email notifications', defaultChecked: true } };
export const Disabled = { args: { label: 'Email notifications', hint: 'Sample setting managed by an administrator.', defaultChecked: true, disabled: true } };
export const Controlled = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <>
        <Switch label="Show sample details" checked={on} onChange={(e) => setOn(e.target.checked)} />
        {on && <p role="status">Sample details are showing.</p>}
      </>
    );
  },
};
export const Group = {
  render: () => (
    <div role="group" aria-labelledby="sw-group" style={{ display: 'grid', gap: '0.25rem' }}>
      <h3 id="sw-group" style={{ margin: 0 }}>Sample notifications</h3>
      <Switch label="Email" defaultChecked />
      <Switch label="Text message" />
      <Switch label="Mail" hint="Printed notices take longer." />
    </div>
  ),
};
