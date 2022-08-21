import { h, defineComponent, VNode, PropType } from 'vue';
import { SelectOption } from "@cohensive/select-core/types";
import Select from "@cohensive/select-core";

export default defineComponent({
  name: 'Option',

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

  updated() {
    if (this.$props.focused) {
      this.$props.setFocusedOptionRef(this.$el);
    }
  },

  render(): VNode {
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
    } = this.$props;
    const classes: string[] = [
      getThemeClass('option', {option, selected, focused}),
      getClass('option'),
    ];

    if (option.disabled) {
      classes.push(getClass('option--is-disabled'));
    }

    if (focused) {
      classes.push(getClass('option--is-focused'));
    }

    const events: {[name: string]: () => void} = {};
    if (!option.disabled) {
      events.onClick = selectOption;
      events.onMousemove = onOptionHover;
      events.onMouseover = onOptionHover;
    }

    let child = this.slots['option']
      ? this.slots['option']({props: this.$props})
      : formatOptionLabel();

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        id,
        tabIndex: -1,
        ...events,
      },
      [child]
    );
  }
});
