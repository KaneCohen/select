import { CreateElement, VNode } from 'vue';
import { CommonProps } from './types';
import Control from './Control';
import Menu from './Menu';

export default {
  name: 'Container',

  functional: true,

  render(h: CreateElement, { props }: { props: CommonProps}): VNode {
    const { select, state } = props;
    const options = select.getSelectOptions();

    const children: VNode[] = [
      h(Control, { props })
    ];

    if (state.isOpen && options.length) {
      children.push(h(Menu, {props: {...props, options}}));
    }

    return h(
      'div',
      {
        class: [select.getThemeClass('container'), select.getClass('container')],
      },
      children
    )
  }
}
