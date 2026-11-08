import React from 'react';
import { Badge } from './Badge.jsx';

export default {
  title: 'Atoms/Badge',
  component: Badge,
  args: { children: 'Under review', variant: 'neutral' },
  argTypes: { variant: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'error'] } },
};

export const Neutral = {};
export const Info = { args: { variant: 'info', children: 'Information' } };
export const Success = { args: { variant: 'success', children: 'Complete' } };
export const Warning = { args: { variant: 'warning', children: 'Action needed' } };
export const ErrorBadge = { args: { variant: 'error', children: 'Overdue' } };
