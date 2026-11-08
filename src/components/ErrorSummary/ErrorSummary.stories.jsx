import { ErrorSummary } from './ErrorSummary.jsx';

export default {
  title: 'Organisms/ErrorSummary',
  component: ErrorSummary,
  args: {
    focusOnMount: false,
    errors: [
      { href: '#plan-name', message: 'Enter the plan name.' },
      { href: '#benefit', message: 'Enter a number, for example 1234.56.' },
    ],
  },
};

/** Moves focus to itself on mount in real use (focusOnMount defaults to true). Off here so the story does not steal focus. */
export const Default = {};
