import React from 'react';
import { Spinner, ProgressBar, Skeleton } from './Loading.jsx';

export default { title: 'Atoms/Loading', parameters: { layout: 'padded' } };

export const SpinnerDefault = { render: (a) => <Spinner {...a} />, args: { label: 'Loading plan data', size: 'md' }, argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } } };
export const SpinnerLabelHidden = { render: () => <Spinner label="Saving" showLabel={false} /> };
export const ProgressDeterminate = { render: (a) => <ProgressBar {...a} />, args: { label: 'Importing sample rows', value: 42 }, argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } } };
export const ProgressIndeterminate = { render: () => <ProgressBar label="Working on it" /> };
export const SkeletonLines = { render: (a) => <Skeleton {...a} />, args: { lines: 4, label: 'Loading summary' } };
