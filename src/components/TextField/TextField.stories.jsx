import { TextField } from './TextField.jsx';

export default {
  title: 'Molecules/TextField',
  component: TextField,
  args: { label: 'Plan name', hint: 'Enter the plan name exactly as it appears on the plan document.', required: true },
  argTypes: { error: { control: 'text' }, disabled: { control: 'boolean' }, numeric: { control: 'boolean' } },
};

export const Default = {};
export const WithError = { args: { error: 'Enter the plan name.', defaultValue: '' } };
/** Right-aligned, tabular figures, decimal keypad on mobile. Use for amounts and percentages. */
export const Numeric = { args: { label: 'Monthly benefit amount', hint: 'Whole dollars and cents, for example 1234.56', numeric: true, placeholder: '0.00' } };
export const Optional = { args: { required: false, label: 'Middle initial', hint: undefined } };
export const Disabled = { args: { disabled: true, defaultValue: 'Not editable' } };
