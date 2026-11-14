import React, { useRef, useState } from 'react';
import { Textarea } from './Textarea.jsx';
import { Button } from '../Button/Button.jsx';

export default {
  title: 'Molecules/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  argTypes: { required: { control: 'boolean' }, disabled: { control: 'boolean' }, maxLength: { control: 'number' } },
};

/** The count is a soft limit: going over is an error that says by how many, and nothing is cut off. Try pasting a long text. */
export const WithLimit = {
  render: (args) => {
    const [last, setLast] = useState('Nothing entered yet.');
    return (
      <>
        <Textarea {...args} onValueChange={(d) => setLast(`${d.length} characters, ${d.valid ? 'valid' : 'not valid'}`)} />
        <p role="status" style={{ fontVariantNumeric: 'tabular-nums' }}>{last}</p>
      </>
    );
  },
  args: { label: 'Sample explanation', hint: 'Describe the sample situation in your own words.', maxLength: 200, required: true },
};
export const NoLimit = { args: { label: 'Sample notes', hint: 'No character limit.' } };
export const Prefilled = { args: { label: 'Sample explanation', maxLength: 200, defaultValue: 'A sample answer that was saved earlier.' } };
export const OverLimit = { args: { label: 'Sample explanation', maxLength: 40, defaultValue: 'This starting text is longer than the forty characters allowed here.' } };
export const Disabled = { args: { label: 'Sample notes', defaultValue: 'Not editable.', disabled: true } };
export const ExternalError = { args: { label: 'Sample explanation', defaultValue: 'Too vague.', error: 'Add the date the sample event happened.' } };

/** validate() shows errors for a submit. */
export const ValidateOnSubmit = {
  render: () => {
    const ref = useRef(null);
    const [msg, setMsg] = useState('Not submitted.');
    return (
      <form noValidate onSubmit={(e) => { e.preventDefault(); const r = ref.current.validate(); setMsg(r.ok ? `Submitted ${r.value.length} characters.` : 'Not submitted: fix the error.'); }}>
        <Textarea ref={ref} label="Sample explanation" maxLength={200} required />
        <p style={{ marginTop: '1rem' }}><Button type="submit">Submit sample</Button></p>
        <p role="status">{msg}</p>
      </form>
    );
  },
};
