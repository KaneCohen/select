import { h, defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Select, { theme } from '@cohensive/select-core';
import Props from './props';
import Container from './Container';

export default defineComponent({
  name: 'Select',

  props: Props,

  emits: ['update:modelValue'],

  setup(rawProps, { slots, emit }) {
    const resolveProps = (props: any) => {
      const nextProps: any = { ...props };
      if (nextProps.tailwind && !nextProps.theme) {
        nextProps.theme = theme;
      }
      nextProps.value = nextProps.modelValue;
      return nextProps;
    };

    let currentProps = resolveProps(rawProps);
    const select = new Select(currentProps);
    const state = ref(select.state);

    // Watch for changes in props and update the select instance accordingly
    watch(
      () => rawProps,
      (newProps) => {
        const nextProps = resolveProps(newProps);
        const changedProps: any = {};

        Object.keys(nextProps).forEach((key) => {
          if (nextProps[key] !== currentProps[key]) {
            changedProps[key] = nextProps[key];
          }
        });

        currentProps = nextProps;

        if (Object.keys(changedProps).length) {
          select.setProps(changedProps);
        }
      },
      { deep: true, immediate: true },
    );

    onMounted(() => {
      if (select.props.autoFocus) {
        select.focus();
      }

      select.startListeningComposition();
      select.startListeningToTouch();

      select.on('state-updated', () => {
        state.value = select.state;
      });

      select.on('change', (newValue: any) => {
        emit('update:modelValue', [...newValue]);
      });

      if (select.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', select.onScroll, true);
      }

      if (select.props.autoFocus) {
        select.focusInput();
      }
    });

    onBeforeUnmount(() => {
      select.stopListeningComposition();
      select.stopListeningToTouch();
    });

    return () => h(Container, {
      select: select as Select,
      state: state.value,
      slots,
    });
  },
});
