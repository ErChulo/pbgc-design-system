import React from 'react';
import { SensitiveDataBanner } from './SensitiveDataBanner.jsx';

export default { title: 'Molecules/SensitiveDataBanner', component: SensitiveDataBanner, parameters: { layout: 'padded' } };

/** First in the reading order of the page or section that shows the data. Not dismissible, not sticky. */
export const Default = {};
/** Replace the wording with the exact text PBGC requires. This text is a sample. */
export const CustomWording = {
  args: { title: 'Sample marking: contains participant data', children: 'Sample handling text. Replace it with the exact wording your application must show.' },
};
export const WithPolicyLink = { args: { policyHref: '#sample-policy', policyLabel: 'Read the sample handling rules' } };
export const InContext = {
  render: () => (
    <main>
      <h1>Sample participant record</h1>
      <SensitiveDataBanner />
      <p>Sample name: Pat Example</p>
    </main>
  ),
};
