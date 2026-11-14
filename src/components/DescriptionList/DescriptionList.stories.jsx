import React from 'react';
import { DescriptionList } from './DescriptionList.jsx';

export default { title: 'Molecules/DescriptionList', component: DescriptionList, parameters: { layout: 'padded' } };

const items = [
  { term: 'Sample participant', value: 'Pat Example' },
  { term: 'Sample date of birth', value: '01/15/1960' },
  { term: 'Sample monthly benefit', value: '$1,234.50' },
  { term: 'Sample beneficiary', value: null },
  { term: 'Sample record', value: <a href="#sample">Open the sample record</a> },
];
/** A missing value shows "Not provided", never a blank. */
export const Default = { args: { items } };
export const Stacked = { args: { items, layout: 'stacked' } };
export const CustomEmptyText = { args: { items, emptyText: 'None on file' } };
