import { h, defineComponent } from 'vue';
import Select, { theme } from '@cohensive/select-core';
import Props from './props';
import Container from './Container';

export default defineComponent({
  name: 'Select',

  props: Props,

  data() {
    let props: any = {...this.$props};
    if (props.tailwind) {
      props.theme = theme;
    }

    const select = new Select(props as any);
    const state = select.state;

    return {
      select,
      state,
    };
  },

  watch: {
    $props: {
      handler(setupProps) {
        let props: any = { ...setupProps };
        if (props.tailwind) {
          props.theme = theme;
        }
        this.select.setProps(props);
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

    select.on('state-updated', () => {
      this.state = select.state;
    });

    select.on('change', (newValue: any) => {
      this.$emit('update:value', [...newValue]);
    });

    if (
      select.props.closeMenuOnScroll &&
      document &&
      document.addEventListener
    ) {
      // Listen to all scroll events, and filter them out inside of 'onScroll'
      document.addEventListener('scroll', select.onScroll, true);
    }

    if (select.props.autoFocus) {
      select.focusInput();
    }
  },

  beforeDestroy() {
    this.select.stopListeningComposition();
    this.select.stopListeningToTouch();
  },

  render() {
    return h('div', [
      h(Container, {
        select: this.select as Select,
        state: this.state,
        slots: this.$slots,
      }),
    ]);
  },
});
