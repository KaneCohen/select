import Vue, { CreateElement, VNode } from 'vue';
import Indicators from './Indicators';
import { commonProps } from './props';
import ValueContainer from './ValueContainer';

export default Vue.extend({
  name: 'Control',

  props: commonProps,

  mounted() {
    this.select.setControlRef(this.$el);
  },

  render(h: CreateElement): VNode {
    const select = this.select;
    const state = this.state;
    const props = this.$props;

    let classes = [
      select.getThemeClass('control', {focused: state.isFocused, open: state.isOpen}),
      select.getClass('control'),
    ];

    if (state.isFocused) {
      classes.push(select.getClass('control--is-focused'));
    }

    if (state.isOpen) {
      classes.push(select.getClass('control--menu-is-open'));
    }

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        on: {
          mousedown(e: MouseEvent) {
            select.onControlMouseDown(e);
          },
        }
      },
      [
        h(ValueContainer, {props}),
        h(Indicators, {props}),
      ]
    );
  }
});
