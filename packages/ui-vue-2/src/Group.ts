import { CreateElement, VNode } from 'vue';
import { GroupProps } from './types';

export default {
  name: 'Group',

  functional: true,

  render(h: CreateElement, { props }: { props: GroupProps }): VNode {
    const { select, slots, group, children } = props;
    const classes: string[] = [select.getThemeClass('group'), select.getClass('group')];
    const labelClasses = [select.getThemeClass('groupLabel'), select.getClass('group-label')];
    const groupId: string = `${select.getElementId('group')}-${group.index}`;

    let label = slots['group']
      ? slots['group']({props})
      : select.formatGroupLabel(group.data);

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        attrs: {
          id: groupId
        },
        key: groupId
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
