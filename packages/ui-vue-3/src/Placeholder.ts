import { h, VNode } from 'vue';
import { CommonProps } from './types';

export default function Placeholder(props: CommonProps): VNode {
  const { select } = props;

  let classes = [
    select.getThemeClass('placeholder'),
    select.getClass('placeholder'),
  ];

  return h(
    'div',
    {
      class: [...classes].filter((v: string) => v.length)
    },
    select.props.placeholder
  );
}
