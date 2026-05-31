import { h, defineComponent, VNode, PropType, ref, onMounted } from 'vue';
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

  setup(props) {
    const menuRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (!menuRef.value) {
        return;
      }

      props.select.setMenuListRef(menuRef.value);
      const placement = props.select.getMenuPlacement(menuRef.value);

      menuRef.value.classList.remove(...menuRef.value.classList);
      menuRef.value.classList.add(
      ...[
        ...props.select.getThemeClass('menu', placement).split(' '),
        props.select.getClass('menu'),
        props.select.getClass(`menu--${placement.placement}`)
      ].filter((v: string) => v.length),
      );
      menuRef.value.style.maxHeight = `${placement.maxHeight}px`;

      if (placement.shouldScroll) {
        props.select.scrollToMenu(menuRef.value, placement.placement);
      }
    });

    return (): VNode => {
      const { select, slots, options } = props;
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
        const groupOptions: VNode[] = group.options.map((option) => {
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
            children: groupOptions,
          },
        );
      };

      options.forEach((item: SelectOptionOrGroup) => {
        if (item.type === 'group') {
          children.push(renderGroup(item));
        } else {
          children.push(renderOption(item, `${item.index}`));
        }
      });

      if (!children.length) {
        if (props.state.isLoading && select.props.showLoadingMessage) {
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
          ref: menuRef,
          class: classes.filter((v: string) => v.length),
          onMousedown(e: MouseEvent) {
            select.onMenuMouseDown(e);
          },
          onMousemove(e: MouseEvent) {
            select.onMenuMouseMove(e);
          },
        },
        children
      );
    };
  },
});
