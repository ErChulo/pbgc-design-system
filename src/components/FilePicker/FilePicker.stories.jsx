import React, { useState } from 'react';
import { FilePicker } from './FilePicker.jsx';

export default { title: 'Molecules/FilePicker', component: FilePicker, parameters: { layout: 'padded' } };

export const Default = {
  render: (args) => {
    const [n, setN] = useState(0);
    return (
      <>
        <FilePicker {...args} onFilesChange={({ files }) => setN(files.length)} />
        <p>Files held by the page: {n}</p>
      </>
    );
  },
  args: { label: 'Sample data files', hint: 'CSV or XLSX, up to 5 MB each. Files stay on your computer.', accept: '.csv,.xlsx', multiple: true, maxSizeMB: 5 },
};
export const SingleFile = { ...Default, args: { label: 'Sample data file', hint: 'One CSV file, up to 5 MB.', accept: '.csv', multiple: false, maxSizeMB: 5 } };
