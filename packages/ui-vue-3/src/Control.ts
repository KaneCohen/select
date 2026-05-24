import { h, defineComponent, ref, onMounted } from 'vue';
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

  setup(props: CommonProps) {
    const controlRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (controlRef.value) {
        props.select.setControlRef(controlRef.value);
      }
    });

    return () => {
      const { select, state } = props;

      const classes = [
        select.getThemeClass('control', { focused: state.isFocused, open: state.isOpen }),
        select.getClass('control'),
        state.isFocused ? select.getClass('control--is-focused') : '',
        state.isOpen ? select.getClass('control--menu-is-open') : '',
      ];

      return h(
        'div',
        {
          class: classes.filter((v: string) => v.length),
          ref: controlRef,
          onMousedown(e: MouseEvent) {
            select.onControlMouseDown(e);
          },
        },
        [
          h(ValueContainer, props as CommonProps),
          h(Indicators, props as CommonProps),
        ]
      );
    };
  },
});
