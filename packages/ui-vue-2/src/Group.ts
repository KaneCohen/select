import { CreateElement, VNode } from 'vue';
import { GroupProps } from './types';

export default {
  name: 'Group',

  functional: true,

  render(h: CreateElement, { props }: { props: GroupProps }): VNode {
    const {
      slots,
      getClass,
      getThemeClass,
      formatGroupLabel,
      children,
      id
    } = props;
    const classes: string[] = [getThemeClass('group'), getClass('group')];
    const labelClasses = [getThemeClass('groupLabel'), getClass('group-label')];

    let label = slots['group']
      ? slots['group']({props})
      : formatGroupLabel();

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        attrs: {
          id
        },
        key: id
      },
      [
        h('div',
          {
            class: [...labelClasses].filter((v: string) => v.length)
          },
          [label]
        ),
        h('div', {}, [children]),
      ]
    );
  }
};
