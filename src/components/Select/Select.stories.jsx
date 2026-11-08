import { Select } from './Select.jsx';

export default {
  title: 'Molecules/Select',
  component: Select,
  args: {
    label: 'Plan type',
    hint: 'Choose the type that matches the plan document.',
    required: true,
    placeholder: 'Select a plan type',
    options: [
      { value: 'se', label: 'Single-employer plan' },
      { value: 'me', label: 'Multiemployer plan' },
    ],
  },
  argTypes: { error: { control: 'text' }, disabled: { control: 'boolean' } },
};

export const Default = {};
export const WithError = { args: { error: 'Select a plan type.' } };
export const Disabled = { args: { disabled: true } };
