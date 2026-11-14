import React from 'react';
import { Stepper } from './Stepper.jsx';

export default {
  title: 'Molecules/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  argTypes: { current: { control: { type: 'number', min: 0, max: 4 } } },
};

const steps = [{ label: 'Participant' }, { label: 'Plan' }, { label: 'Review' }, { label: 'Submit' }];

/** The current step is aria-current="step"; each state is also written for screen readers. Your app owns the flow and moves focus to the new step's heading. */
export const Default = { args: { steps, current: 2 } };
export const FirstStep = { args: { steps, current: 0 } };
export const AllComplete = { args: { steps, current: 4 } };
/** A completed step may link back to fix an earlier answer. The current and upcoming steps are never links. */
export const WithLinksBack = {
  args: { steps: steps.map((s, i) => (i < 2 ? { ...s, href: `#sample-step-${i + 1}` } : s)), current: 2 },
};
export const LongLabels = {
  args: {
    steps: ['Enter the sample participant details', 'Choose the sample plan and valuation date', 'Review the sample calculation', 'Submit the sample request'].map((label) => ({ label })),
    current: 1,
  },
};
