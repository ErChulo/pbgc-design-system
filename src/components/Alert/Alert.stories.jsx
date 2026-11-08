import React from 'react';
import { Alert } from './Alert.jsx';

export default {
  title: 'Molecules/Alert',
  component: Alert,
  args: { variant: 'info', title: 'Statement available', children: <p>Your benefit statement is ready to view.</p> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
    live: { control: 'inline-radio', options: [undefined, 'polite', 'assertive'], description: 'Omit for static page content. polite = role=status. assertive = role=alert.' },
    headingLevel: { control: { type: 'number', min: 2, max: 6 } },
  },
};

export const Info = {};
export const Success = { args: { variant: 'success', title: 'Changes saved', children: <p>Your changes were saved.</p> } };
export const Warning = { args: { variant: 'warning', title: 'Review before you submit', children: <p>Some fields are incomplete.</p> } };
export const ErrorAlert = { args: { variant: 'error', title: 'Submission failed', live: 'assertive', children: <p>We could not submit the form. Try again.</p> } };
