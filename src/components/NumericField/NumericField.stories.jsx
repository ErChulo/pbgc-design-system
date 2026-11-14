import React, { useRef, useState } from 'react';
import { NumericField } from './NumericField.jsx';
import { Button } from '../Button/Button.jsx';

export default {
  title: 'Molecules/NumericField',
  component: NumericField,
  parameters: { layout: 'padded' },
  argTypes: {
    kind: { control: 'inline-radio', options: ['integer', 'decimal', 'currency', 'percent'] },
    allowNegative: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

function Show({ children, last }) {
  return (
    <>
      {children}
      <p role="status" style={{ fontVariantNumeric: 'tabular-nums' }}>{last}</p>
    </>
  );
}
const describe = (d) => (d ? `value: ${d.value === null ? 'none' : d.value}   text: "${d.valueText}"   ${d.valid ? 'valid' : 'not valid'}` : 'Nothing entered yet.');

/** Currency pads to cents when you leave the field. Try 1234.5, $1,234.50, 12,34 and 1.005. */
export const Currency = {
  render: (args) => {
    const [last, setLast] = useState(describe(null));
    return <Show last={last}><NumericField {...args} onValueChange={(d) => setLast(describe(d))} /></Show>;
  },
  args: { label: 'Sample monthly benefit', hint: 'Whole dollars and cents. Commas are optional.', kind: 'currency', required: true },
};
/** A percent is in percent units: typing 5.25 gives 5.25, not 0.0525. Range errors name the limits. */
export const Percent = {
  ...Currency,
  args: { label: 'Sample interest rate', hint: 'Between 0% and 100%, up to 4 decimal places.', kind: 'percent', min: 0, max: 100 },
};
export const Integer = { ...Currency, args: { label: 'Sample number of participants', hint: 'A whole number.', kind: 'integer', min: 0 } };
export const Decimal = { ...Currency, args: { label: 'Sample factor', hint: 'Up to 6 decimal places.', kind: 'decimal', decimals: 6 } };
export const AllowNegative = { ...Currency, args: { label: 'Sample adjustment', hint: 'May be negative.', kind: 'currency', allowNegative: true } };
export const Prefilled = { ...Currency, args: { label: 'Sample amount', kind: 'currency', defaultValue: '1234567.5' } };
export const Disabled = { ...Currency, args: { label: 'Sample amount', kind: 'currency', defaultValue: '250', disabled: true } };

/** An error supplied from outside (for example a cross-field rule). The next keystroke clears it. */
export const ExternalError = {
  ...Currency,
  args: { label: 'Sample lump sum', hint: 'Enter an amount no larger than the sample maximum.', kind: 'currency', defaultValue: '90000', error: 'Enter an amount no larger than $75,000.' },
};

/** validate() shows errors for a submit, and returns the value. */
export const ValidateOnSubmit = {
  render: () => {
    const ref = useRef(null);
    const [msg, setMsg] = useState('Not submitted.');
    return (
      <form noValidate onSubmit={(e) => { e.preventDefault(); const r = ref.current.validate(); setMsg(r.ok ? `Submitted ${r.valueText}.` : 'Not submitted: fix the error.'); }}>
        <NumericField ref={ref} label="Sample amount" kind="currency" required />
        <p style={{ marginTop: '1rem' }}><Button type="submit">Submit sample</Button></p>
        <p role="status">{msg}</p>
      </form>
    );
  },
};
