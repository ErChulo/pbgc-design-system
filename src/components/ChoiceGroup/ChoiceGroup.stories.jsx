import { ChoiceGroup } from './ChoiceGroup.jsx';

export default {
  title: 'Molecules/ChoiceGroup',
  component: ChoiceGroup,
  args: {
    legend: 'How would you like to receive your statement?',
    hint: 'Sample content. Choose one.',
    type: 'radio',
    name: 'delivery',
    required: true,
    options: [
      { value: 'mail', label: 'By mail' },
      { value: 'online', label: 'Online', hint: 'You can change this later.' },
      { value: 'both', label: 'Both' },
    ],
  },
  argTypes: { type: { control: 'inline-radio', options: ['radio', 'checkbox'] }, error: { control: 'text' } },
};

export const Radios = {};
export const WithError = { args: { error: 'Select how you would like to receive your statement.' } };
export const Checkboxes = {
  args: { type: 'checkbox', legend: 'Which notices apply?', hint: 'Select all that apply.', name: 'notices', required: false, defaultValue: ['a'], options: [{ value: 'a', label: 'Sample notice A' }, { value: 'b', label: 'Sample notice B' }] },
};
export const SingleAgreement = {
  args: { type: 'checkbox', legend: 'Confirmation', hint: undefined, name: 'confirm', required: true, options: [{ value: 'yes', label: 'I have read the instructions.' }] },
};
