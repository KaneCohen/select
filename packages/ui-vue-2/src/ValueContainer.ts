import { CreateElement, VNode } from 'vue';
import { CommonProps } from './types';
import Placeholder from './Placeholder';
import Value from './Value';
import Typehead from './Typehead';
import { Option } from '@cohensive/select-core/types';

export default {
  name: 'ValueContainer',

  functional: true,

  render(h: CreateElement, { props }: { props: CommonProps }): VNode {
    const { select, state } = props;
    const { value, inputValue } = state;
    const { multiple } = select.props;

    const children: VNode[] = [];

    if ((value.length && !inputValue) || (value.length && multiple)) {
      value.forEach((option: Option, i: number) => {
        children.push(h(Value, {props: {...props, option, id: `${i}`}}));
      });
    } else if (!inputValue) {
      children.push(h(Placeholder, {key: 'placeholder', props}));
    }

    children.push(h(
      'div',
      {
        key: 'inputContainer',
        class: [select.getThemeClass('inputContainer'), select.getClass('input-container')],
        style: {
          gridTemplateColumns: '0px min-content'
        }
      },
      [
        h(Typehead, {props}),
        h('div', {class: [select.getThemeClass('inputSizer'), select.getClass('input-sizer')]}, state.inputValue)
      ]
    ));

    let classes = [
      select.getThemeClass('valueContainer'),
      select.getClass('value-container'),
    ];

    if (multiple && value.length) {
      classes = [
        select.getThemeClass('multipleValueContainer'),
        select.getClass('multiple-value-container'),
      ];
    }

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length)
      },
      children
    );
  }
};
