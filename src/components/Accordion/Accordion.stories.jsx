import React from 'react';
import { Accordion } from './Accordion.jsx';

export default {
  title: 'Organisms/Accordion',
  component: Accordion,
  args: {
    items: [
      { id: 'a', title: 'Sample question one', content: <p>Sample answer in plain language. Not real guidance.</p>, defaultOpen: true },
      { id: 'b', title: 'Sample question two', content: <p>Another sample answer that shows how a panel wraps across several lines of text.</p> },
      { id: 'c', title: 'Sample question three', content: <p>A third sample answer.</p> },
    ],
  },
  argTypes: { exclusive: { control: 'boolean' } },
};

export const Default = {};
export const Exclusive = { args: { exclusive: true } };
