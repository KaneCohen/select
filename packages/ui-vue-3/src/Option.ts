import { h, defineComponent, VNode, PropType, ref, onUpdated } from 'vue';
import { SelectOption } from "@cohensive/select-core/types";

export default defineComponent({
  name: 'Option',

  inheritAttrs: false,

  props: {
    getClass: {
      type: Function,
      required: true
    },
    getThemeClass: {
      type: Function,
      required: true
    },
    formatOptionLabel: {
      type: Function,
      required: true
    },
    onOptionHover: {
      type: Function as PropType<() => void>,
      required: true
    },
    selectOption: {
      type: Function as PropType<() => void>,
      required: true
    },
    setFocusedOptionRef: {
      type: Function as PropType<(el: HTMLDivElement) => void>,
      required: true
    },
    slots: {
      type: Object,
      required: true,
    },
    option: {
      type: Object as PropType<SelectOption>,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    focused: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },

  setup(props): () => VNode {
    const optionRef = ref<HTMLDivElement | null>(null);

    onUpdated(() => {
      if (props.focused && optionRef.value) {
        props.setFocusedOptionRef(optionRef.value);
      }
    });

    return () => {
      const {
        getClass,
        getThemeClass,
        onOptionHover,
        selectOption,
        formatOptionLabel,
        option,
        selected,
        focused,
        id
      } = props;
      const classes: string[] = [
        getThemeClass('option', { option, selected, focused }),
        getClass('option'),
      ];

      if (option.disabled) {
        classes.push(getClass('option--is-disabled'));
      }

      if (focused) {
        classes.push(getClass('option--is-focused'));
      }

      const events: { [name: string]: () => void } = {};
      if (!option.disabled) {
        events.onClick = selectOption;
        events.onMousemove = onOptionHover;
        events.onMouseover = onOptionHover;
      }

      const child = props.slots['option']
        ? props.slots['option']({ props })
        : formatOptionLabel();

      return h(
        'div',
        {
          ref: optionRef,
          class: classes.filter((v: string) => v.length),
          id,
          tabIndex: -1,
          ...events,
        },
        [child]
      );
    };
  },
});
