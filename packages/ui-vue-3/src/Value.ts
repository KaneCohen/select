import { h, VNode } from 'vue';
import { renderCross } from './Indicators';
import { ValueProps } from './types';

export default function Value(props: ValueProps): VNode {
  const { select, slots, option, id } = props;
  const { multiple } = select.props;
  const themeClassName = multiple ? 'multipleValue' : 'value';
  const className = multiple ? 'multiple-value' : 'value';
  const isFocused = select.getFocusedValue().indexOf(option) >= 0;

  let classes = [
    select.getThemeClass(themeClassName, {value: option}),
    select.getClass(className),
  ];

  if (multiple && isFocused) {
    classes.push(select.getClass('multiple-value--is-focused'));
  }

  let label = slots['value-label']
    ? slots['value-label']({props})
    : select.formatOptionLabel(option, 'control');

  let remove = slots['value-remove']
    ? slots['value-remove']({props})
    : renderCross(14);

  if (multiple) {
    return h(
      'div',
      {
        key: id,
        class: classes,
        onMousedown(e: MouseEvent) {
          select.onValueMouseDown(e, option);
        },

        onClick(e: MouseEvent) {
          select.focusValue(option, e.shiftKey, e.ctrlKey || e.shiftKey);
        }
      },
      [
        h(
          'div',
          {
            class: [
              select.getThemeClass('multipleValueLabel', {value: option}),
              select.getClass('multiple-value-label'),
            ]
          },
          [label]
        ),
        h(
          'button',
          {
            class: [
              select.getThemeClass('multipleValueRemove', {value: option}),
              select.getClass('multiple-value-remove'),
            ],
            onClick() {
              select.removeValue(option)
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
      class: classes,
    },
    [label]
  );
}
