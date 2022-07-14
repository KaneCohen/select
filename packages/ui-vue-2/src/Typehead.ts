import Vue, { CreateElement, VNode } from 'vue';
import { commonProps } from './props';

export default Vue.extend({
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
    this.select.setInputRef(this.$el as HTMLInputElement);
  },

  render(h: CreateElement): VNode {
    const select = this.select;

    let classes = [
      select.getThemeClass('input'),
      select.getClass('input'),
    ];

    return h(
      'input',
      {
        class: [...classes].filter((v: string) => v.length),
        style: {
          minWidth: '2px',
          opacity: select.state.inputIsHidden ? 0 : null,
        },
        attrs: {
          type: select.props.inputType,
          value: select.state.inputValue,
          spellcheck: false,
          tabindex: 0
        },
        on: {
          keydown(e: KeyboardEvent) {
            select.onKeyDown(e);
          },

          input(e: InputEvent) {
            select.handleInputChange(e);
          },

          paste(e: ClipboardEvent) {
            if (select.props.multiple && select.props.setValueOnPaste) {
              select.pasteValue(e);
            }
          },

          mousedown(e: MouseEvent) {
            e.stopPropagation();
          },

          focus(e: FocusEvent) {
            select.onInputFocus(e);
          },

          blur(e: FocusEvent) {
            select.onInputBlur(e);
          }
        }
      },
    );
  }
});
