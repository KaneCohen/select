import Vue, { CreateElement, VNode } from 'vue';
import Select, { theme } from '@cohensive/select-core';
import Props from './props';
import Container from './Container';

export default Vue.extend({
  name: 'Select',

  props: Props,

  data() {
    let props: any = this.$props;
    if (props.tailwind) {
      props.theme = theme;
    }
    return {
      select: new Select(props)
    };
  },

  watch: {
    $props: {
      handler(n, p) {
        this.select.setProps(this.$props);
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    const select = this.select;
    if (select.props.autoFocus) {
      select.focus();
    }

    select.startListeningComposition();
    select.startListeningToTouch();

    select.on('change', (newValue: any) => {
      this.$emit('update:value', [...newValue]);
    });

    if (select.props.closeMenuOnScroll && document && document.addEventListener) {
      // Listen to all scroll events, and filter them out inside of 'onScroll'
      document.addEventListener('scroll', select.onScroll, true);
    }

    if (select.props.autoFocus) {
      select.focusInput();
    }
  },

  render(h: CreateElement): VNode {
    return h(
      'div',
      [
        h(Container, {
          props: {
            select: this.select,
            state: this.select.state,
            slots: this.$scopedSlots
          }
        })
      ]
    );
  }
});
