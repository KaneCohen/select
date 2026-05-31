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
    const { select, options, slots, state } = this.$props;
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
        props: {
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
        }
      });
    };

    const renderGroup = (group: SelectGroup) => {
      const options: VNode[] = group.options.map((option) => {
        return renderOption(option, `${group.index}-${option.index}`);
      });

      return h(
        Group,
        {
          props: {
            slots,
            ...select.getCommonProps(),
            formatGroupLabel: () => select.formatGroupLabel(group.data),
            id: `${select.getElementId('group')}-${group.index}`,
            group,
            children: options,
          }
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
      if (state.isLoading && select.props.showLoadingMessage) {
        children.push(h(
          'div',
          {
            class: [select.getThemeClass('loadingMessage'), select.getClass('loadingMessage')]
          },
          select.props.loadingMessage
        ));
      } else if (select.props.showNoOptionsMessage) {
        children.push(h(
          'div',
          {
            class: [select.getThemeClass('noOptionsMessage'), select.getClass('noOptionsMessage')]
          },
          select.props.noOptionsMessage
        ));
      }
    }

    if (!children.length) {
      return null as unknown as VNode;
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
