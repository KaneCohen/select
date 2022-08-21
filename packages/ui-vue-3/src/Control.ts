import { h, defineComponent } from 'vue';
import Indicators from './Indicators';
import { CommonProps } from './types';
import ValueContainer from './ValueContainer';

export default defineComponent({
  name: 'Control',

  props: {
    select: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    slots: {
      type: Object,
      required: true
    }
  },

  mounted() {
    this.select.setControlRef(this.$el);
  },

  render() {
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
        onMousedown(e: MouseEvent) {
          select.onControlMouseDown(e);
        },
      },
      [
        h(ValueContainer, props as CommonProps),
        h(Indicators, props as CommonProps),
      ]
    );
  }
});
