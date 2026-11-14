import React from 'react';
import { EmptyState } from './EmptyState.jsx';
import { Button } from '../Button/Button.jsx';

export default { title: 'Molecules/EmptyState', component: EmptyState, parameters: { layout: 'padded' } };

/** Nothing exists yet: say so, and offer the action that creates the first one. */
export const NothingYet = {
  args: { title: 'No sample cases yet', children: 'Cases you create appear here.', action: <Button>Create a sample case</Button> },
};
/** Nothing matches: say that, and offer the action that clears the filters. */
export const NoMatches = {
  args: { title: 'No sample cases match your filters', children: 'Try a different date range or remove a filter.', action: <Button variant="secondary">Clear filters</Button> },
};
export const TitleOnly = { args: { title: 'No sample notes', headingLevel: 3 } };
