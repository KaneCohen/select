import { h, defineComponent, VNode, PropType } from 'vue';
import Select from "@cohensive/select-core";
import { SelectGroup, SelectOption, SelectOptionOrGroup, State } from "@cohensive/select-core/types";
import Group from './Group';
import Option from './Option';

export default defineComponent({
  name: 'Menu',

  props: {
    select: {
      type: Object as PropType<Select>,
      required: true
    },
    state: {
      type: Object as PropType<State>,
      required: true
    },
    slots: {
      type: Object,
      required: true
    },
    options: {
      type: Array as PropType<SelectOptionOrGroup[]>,
      required: true
    }
  },

  mounted() {
    this.select.setMenuListRef(this.$el);
    const placement = this.select.getMenuPlacement(this.$el);

    this.$el.classList.remove(...this.$el.classList);
    this.$el.classList.add(
      ...[
        ...this.select.getThemeClass(`menu`, placement).split(' '),
        this.select.getClass('menu'),
        this.select.getClass(`menu--${placement.placement}`)
      ].filter((v: string) => v.length),
    );
    (this.$el as HTMLElement).style.maxHeight = `${placement.maxHeight}px`;

    if (placement.shouldScroll) {
      this.select.scrollToMenu(this.$el, placement.placement);
    }
  },

  render(): VNode {
    const { select, slots, options } = this.$props;
    const value = select.getValue();
    const focusedOption = select.getFocusedOption();
    const children: VNode[] = [];
    const classes = [
      select.getThemeClass('menu'),
      select.getClass('menu'),
    ];

    const renderOption = (option: SelectOption, index: string) => {
      const focused = focusedOption ? focusedOption.value === option.value : false;
      const selected = value.indexOf(option.data) >= 0;
      return h(Option, {
        ...select.getCommonProps(),
        onOptionHover: () => select.onOptionHover(option.data),
        selectOption: () => select.selectOption(option.data),
        formatOptionLabel: () => select.formatOptionLabel(option.data, 'menu'),
        setFocusedOptionRef: (el: HTMLDivElement) => select.setFocusedOptionRef(el),
        slots,
        option,
        selected,
        focused,
        id: `${select.getElementId('option')}-${index}`
      });
    };

    const renderGroup = (group: SelectGroup) => {
      const options: VNode[] = group.options.map((option) => {
        return renderOption(option, `${group.index}-${option.index}`);
      });

      return h(
        Group,
        {
          slots,
          ...select.getCommonProps(),
          formatGroupLabel: () => select.formatGroupLabel(group.data),
          id: `${select.getElementId('group')}-${group.index}`,
          group,
          children: options,
        },
      );
    }

    options.forEach((item: SelectOptionOrGroup) => {
      if (item.type === 'group') {
        children.push(renderGroup(item));
      } else {
        children.push(renderOption(item, `${item.index}`));
      }
    });

    if (!children.length) {
      children.push(h(
        'div',
        {
          class: [select.getThemeClass('noOptionsMessage')]
        },
        select.props.noOptionsMessage
      ));
    }

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
        onMousedown(e: MouseEvent) {
          select.onMenuMouseDown(e);
        },
        onMousemove(e: MouseEvent) {
          select.onMenuMouseMove(e);
        },
      },
      children
    );
  }
});
