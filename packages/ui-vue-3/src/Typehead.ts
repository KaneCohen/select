import { h, defineComponent, VNode } from 'vue';
import { commonProps } from './props';

export default defineComponent({
  name: 'Typehead',

  props: commonProps,

  watch: {
    'select.state.isFocused': {
      handler(value) {
        if (value) (this.$el as HTMLInputElement).focus();
      }
    },
    'select.state.inputValue': {
      handler(value) {
        (this.$el as HTMLInputElement).value = value;
      }
    }
  },

  mounted() {
    this.select!.setInputRef(this.$el as HTMLInputElement);
  },

  render(): VNode {
    const select = this.select!;

    let classes = [
      select.getThemeClass('input'),
      select.getClass('input'),
    ];

    return h(
      'input',
      {
        class: [...classes].filter((v: string) => v.length),
        type: select.props.inputType,
        value: select.state.inputValue,
        spellcheck: false,
        tabindex: 0,
        style: {
          minWidth: '2px',
          opacity: select.state.inputIsHidden ? 0 : null,
        },
        onKeydown(e: KeyboardEvent) {
          select.onKeyDown(e);
        },

        onInput(e: InputEvent) {
          select.handleInputChange(e);
        },

        onPaste(e: ClipboardEvent) {
          if (select.props.multiple && select.props.setValueOnPaste) {
            select.pasteValue(e);
          }
        },

        onMousedown(e: MouseEvent) {
          e.stopPropagation();
        },

        onFocus(e: FocusEvent) {
          select.onInputFocus(e);
        },

        onBlur(e: FocusEvent) {
          select.onInputBlur(e);
        }
      },
    );
  }
});
