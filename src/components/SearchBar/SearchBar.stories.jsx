import React from 'react';
import { SearchBar } from './SearchBar.jsx';

export default {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  args: { label: 'Search PBGC.gov', action: '#search' },
  argTypes: { hideLabel: { control: 'boolean' } },
};

export const Default = {};
/** Label stays in the accessibility tree. Use only when the page already makes the purpose obvious. */
export const HiddenLabel = { args: { hideLabel: true, placeholder: 'Search' } };
