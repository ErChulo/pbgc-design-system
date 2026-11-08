import { Pagination } from './Pagination.jsx';

export default {
  title: 'Molecules/Pagination',
  component: Pagination,
  args: { current: 5, total: 12, hrefFor: (p) => `#page-${p}` },
  argTypes: { current: { control: { type: 'number', min: 1 } }, total: { control: { type: 'number', min: 1 } } },
};

export const Middle = {};
export const FirstPage = { args: { current: 1 } };
export const LastPage = { args: { current: 12 } };
export const FewPages = { args: { current: 2, total: 3 } };
