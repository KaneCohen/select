import Vue, { CreateElement, VNode } from 'vue';

export default Vue.extend({
  name: 'Option',

  props: {
    select: Object,
    slots: Object,
    option: Object,
    selected: Boolean,
    focused: Boolean,
    id: String
  },

  updated() {
    if (this.$props.focused) {
      this.$props.select.setFocusedOptionRef(this.$el);
      this.$props.select.updated();
    }
  },

  render(h: CreateElement): VNode {
    const { select, option, selected, focused, id } = this.$props;
    const classes: string[] = [
      select.getThemeClass('option', {option, selected, focused}),
      select.getClass('option'),
    ];

    if (option.disabled) {
      classes.push(select.getClass('option--is-disabled'));
    }

    if (focused) {
      classes.push(select.getClass('option--is-focused'));
    }

    const optionId: string = `${select.getElementId('option')}-${id}`;

    const events: {[name: string]: () => void} = {};
    if (!option.disabled) {
      const onHover = () => select.onOptionHover(option.data);
      events.click = () => select.selectOption(option.data);
      events.mousemove = onHover;
      events.mouseover = onHover;
    }

    let child = this.slots['option']
      ? this.slots['option']({props: this.$props})
      : select.formatOptionLabel(option.data, 'menu');

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        attrs: {
          id: optionId,
          tabIndex: -1,
        },
        on: events,
      },
      [child]
    );
  }
});
