import { h, VNode } from 'vue';
import { CommonProps } from './types';
import Control from './Control';
import Menu from './Menu';

export default function Container(props: CommonProps) {
  const { select } = props;
  const options = select.getSelectOptions();

  const children: VNode[] = [
    h(Control, props),
  ];

  if (select.state.isOpen && options.length) {
     children.push(h(Menu, {...props, options}));
  }

  return h(
    'div',
    {
      class: [select.getThemeClass('container'), select.getClass('container')],
    },
    children
  );
}
