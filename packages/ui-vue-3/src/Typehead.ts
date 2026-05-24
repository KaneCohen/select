import { h, defineComponent, VNode, ref, watch, onMounted } from 'vue';
import { commonProps } from './props';

export default defineComponent({
  name: 'Typehead',

  props: commonProps,

  setup(props): () => VNode {
    const inputRef = ref<HTMLInputElement | null>(null);
    const select = props.select!;

    watch(
      () => select.state.isFocused,
      (value) => {
        if (value) {
          inputRef.value?.focus();
        }
      },
    );

    watch(
      () => select.state.inputValue,
      (value) => {
        if (inputRef.value) {
          inputRef.value.value = value;
        }
      },
    );

    onMounted(() => {
      if (inputRef.value) {
        select.setInputRef(inputRef.value);
      }
    });

    return () => {
      const classes = [
        select.getThemeClass('input'),
        select.getClass('input'),
      ];

      return h(
        'input',
        {
          ref: inputRef,
          class: classes.filter((v: string) => v.length),
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
    };
  },
});
