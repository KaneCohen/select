import Vue, { CreateElement, VNode } from 'vue';
import { SelectGroup, SelectOption, SelectOptionOrGroup } from "@cohensive/select-core/types";
import Group from './Group';
import Option from './Option';
import { commonProps } from './props';

export default Vue.extend({
  name: 'Menu',

  props: {
    ...commonProps,
    options: Array
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

  render(h: CreateElement): VNode {
    const { select, options } = this.$props;
    const value = select.getValue();
    const focusedOption = select.getFocusedOption();
    const children: VNode[] = [];
    const classes = [
      select.getThemeClass('menu'),
      select.getClass('menu'),
    ];

    const renderOption = (option: SelectOption, id: string) => {
      let focused = focusedOption && focusedOption.value === option.value;
      let selected = value.indexOf(option.data) >= 0;
      let el = h(Option, {props: {...this.$props, option, selected, focused, id, key: id}});
      return el;
    };

    const renderGroup = (group: SelectGroup) => {
      const options: VNode[] = group.options.map((option) => {
        return renderOption(option, `${group.index}-${option.index}`);
      });

      return h(
        Group,
        {
          props: {
            ...this.$props, group, children: options
          },
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
        on: {
          mousedown(e: MouseEvent) {
            select.onMenuMouseDown(e);
          },
          mousemove(e: MouseEvent) {
            select.onMenuMouseMove(e);
          },
        }
      },
      children
    );
  }
});
