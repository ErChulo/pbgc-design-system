import React from 'react';
import { StatTiles } from './StatTiles.jsx';

export default { title: 'Molecules/StatTiles', component: StatTiles, parameters: { layout: 'padded' } };

/** A change is stated in words, never by arrow or color alone. */
export const Default = {
  args: {
    items: [
      { label: 'Sample open cases', value: '42', context: 'Up 3 from last month' },
      { label: 'Sample average days to close', value: '12.5', context: 'As of 11/14/2026' },
      { label: 'Sample total benefits', value: '$1,234,567.89', context: 'As of 11/14/2026' },
    ],
  },
};
export const NoContext = { args: { items: [{ label: 'Sample cases', value: '42' }, { label: 'Sample plans', value: '7' }] } };
