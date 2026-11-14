import React, { useRef, useState } from 'react';
import { DateField } from './DateField.jsx';
import { Button } from '../Button/Button.jsx';

export default {
  title: 'Molecules/DateField',
  component: DateField,
  parameters: { layout: 'padded' },
  argTypes: { required: { control: 'boolean' }, disabled: { control: 'boolean' } },
};

/** Type 1/5/1960, 01-05-1960 or 01051960: all become 01/05/1960 when you leave the field. Try 02/30/2024 or 1/5/60. */
export const Default = {
  render: (args) => {
    const [last, setLast] = useState('Nothing entered yet.');
    return (
      <>
        <DateField {...args} onValueChange={(d) => setLast(d.valid ? `Value: ${d.value ?? '(empty)'}` : `Not valid: ${d.error}`)} />
        <p role="status" style={{ fontVariantNumeric: 'tabular-nums' }}>{last}</p>
      </>
    );
  },
  args: { label: 'Sample date of birth', required: true, min: '1900-01-01', max: '2099-12-31' },
};
export const NoLimits = { args: { label: 'Sample date' } };
export const Prefilled = { args: { label: 'Sample date of birth', defaultValue: '1960-01-15', min: '1900-01-01' } };
export const WithHint = { args: { label: 'Sample valuation date', hint: 'The date the sample benefit is valued as of.' } };
export const Disabled = { args: { label: 'Sample date', defaultValue: '2024-02-29', disabled: true } };
export const ExternalError = { args: { label: 'Sample end date', defaultValue: '01/01/2020', error: 'The end date must be after the start date.' } };
export const ValidateOnSubmit = {
  render: () => {
    const ref = useRef(null);
    const [msg, setMsg] = useState('Not submitted.');
    return (
      <form noValidate onSubmit={(e) => { e.preventDefault(); const r = ref.current.validate(); setMsg(r.ok ? `Submitted ${r.iso}.` : 'Not submitted: fix the error.'); }}>
        <DateField ref={ref} label="Sample date of birth" required />
        <p style={{ marginTop: '1rem' }}><Button type="submit">Submit sample</Button></p>
        <p role="status">{msg}</p>
      </form>
    );
  },
};
