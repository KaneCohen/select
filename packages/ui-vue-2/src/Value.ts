import { CreateElement, VNode } from 'vue';
import { renderCross } from './Indicators';
import { ValueProps } from './types';

export default {
  name: 'Value',

  functional: true,

  render(h: CreateElement, { props }: { props: ValueProps }): VNode {
    const { select, slots, option, id } = props;
    const { multiple } = select.props;

    let label = slots['value-label']
      ? slots['value-label']({props})
      : select.formatOptionLabel(option, 'control');

    let remove = slots['value-remove']
      ? slots['value-remove']({props})
      : renderCross(h, 14);

    if (multiple) {
      return h(
        'div',
        {
          key: id,
          class: select.getThemeClass('multipleValue', {value: option}),
          on: {
            mousedown(e: MouseEvent) {
              select.onValueMouseDown(e, option);
            },

            click(e: MouseEvent) {
              select.focusValue(option, e.shiftKey, e.ctrlKey || e.shiftKey);
            }
          }
        },
        [
          h(
            'div',
            {
              class: select.getThemeClass('multipleValueLabel', {value: option})
            },
            [label]
          ),
          h(
            'button',
            {
              class: select.getThemeClass('multipleValueRemove', {value: option}),
              on: {
                click() {
                  select.removeValue(option)
                }
              }
            },
            [remove]
          ),
        ]
      );
    }

    return h(
      'div',
      {
        key: id,
        class: select.getThemeClass('value', {value: option})
      },
      [label]
    );
  }
};
