import React from 'react';
import { FactsheetCard } from './FactsheetCard.jsx';

export default {
  title: 'Organisms/FactsheetCard',
  component: FactsheetCard,
  args: {
    title: 'Sample fact sheet title in sentence case',
    href: '#factsheet',
    category: 'Fact sheet',
    date: '2026-11-01',
    dateLabel: 'November 2026',
    summary: 'A one or two sentence summary written in plain language. Sample content only.',
  },
  decorators: [(Story) => <div style={{ maxWidth: '28rem' }}><Story /></div>],
};

export const Default = {};
export const NoDate = { args: { date: undefined, dateLabel: undefined } };
