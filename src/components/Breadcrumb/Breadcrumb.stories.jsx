import { Breadcrumb } from './Breadcrumb.jsx';

export default {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'Home', href: '#home' },
      { label: 'Workers and retirees', href: '#workers' },
      { label: 'Sample fact sheet', href: '#sample' },
    ],
  },
};

export const Default = {};
export const Short = { args: { items: [{ label: 'Home', href: '#home' }, { label: 'About PBGC', href: '#about' }] } };
