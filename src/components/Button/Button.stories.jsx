import { Button } from './Button.jsx';

export default {
  title: 'Atoms/Button',
  component: Button,
  args: { children: 'Submit request', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'inline-radio', options: ['md', 'lg'], description: 'There is no small size: every target is at least 44px.' },
    disabled: { control: 'boolean' },
  },
};

export const Primary = {};
export const Secondary = { args: { variant: 'secondary' } };
export const Danger = { args: { variant: 'danger', children: 'Delete draft' } };
export const Large = { args: { size: 'lg' } };
export const Disabled = { args: { disabled: true } };
/** Navigation is a link, not a button: pass `href` and get a real <a>. */
export const AsLink = { args: { href: '#next', children: 'Continue' } };
