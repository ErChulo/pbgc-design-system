import React from 'react';
import { Tabs } from './Tabs.jsx';

export default { title: 'Molecules/Tabs', component: Tabs, parameters: { layout: 'padded' } };

const tabs = [
  { id: 'summary', label: 'Summary', content: <p>Sample summary text. A panel with no focusable content can still be reached by keyboard so it can be scrolled.</p> },
  { id: 'details', label: 'Details', content: <><p>Sample details.</p><p><a href="#sample">A sample link</a></p></> },
  { id: 'history', label: 'History', content: <p>Sample history text.</p> },
];

/** Left/Right and Home/End move between tabs; Tab moves into the panel. The first set selects as focus moves; the second needs Enter or Space. */
export const Default = {
  render: () => (
    <>
      <h3>Automatic activation</h3>
      <Tabs label="Sample sections" tabs={tabs} />
      <h3 style={{ marginTop: '2rem' }}>Manual activation</h3>
      <Tabs label="Sample sections, manual" tabs={tabs} activation="manual" />
    </>
  ),
};
export const SecondSelected = { args: { label: 'Sample sections', tabs, defaultIndex: 1 } };
/** Many tabs wrap onto more lines instead of scrolling sideways. */
export const ManyTabs = {
  args: {
    label: 'Sample sections',
    tabs: ['Overview', 'Participants', 'Benefits', 'Valuation', 'Assumptions', 'Documents', 'Correspondence', 'History'].map((l) => ({ id: l.toLowerCase(), label: l, content: <p>Sample content for {l}.</p> })),
  },
};
