import EventEmitter from 'events';
import { defaults, stateDefaults } from './defaults';
import {
  Options,
  Option,
  SelectConfigs,
  Props,
  State,
  CommonProps,
  Value,
  SelectOption,
  FilterOptionOption,
  Group,
  SelectOptionOrGroup,
  SelectOptionsOrGroups,
  InputActionMeta,
  SetValueAction,
  ActionMeta,
  ChangeValue,
  FocusDirection,
  FormatOptionLabelContext,
  OptionsOrGroups,
  MenuState,
  CoercedMenuPlacement
} from './types';
import { debounce, cleanValue, isDocumentElement, notNullish, scrollIntoView } from './utils';
import { getPenuPlacement, scrollToMenu } from './utils/menuPlacement';

let instanceId = 0;

function filterOption(
  props: Props,
  option: FilterOptionOption,
  input: string
): boolean {
  return props.filterOption ? props.filterOption(option, input) : true;
}

function shouldHideSelectedOption(
  props: Props
): boolean {
  const { hideSelectedOptions, multiple } = props;
  if (hideSelectedOptions === undefined) return multiple;
  return hideSelectedOptions;
}

function getGroupLabel(
  props: Props,
  group: Group
): string {
  return props.getGroupLabel(group);
}

function getOptionLabel(
  props: Props,
  option: Option
): string {
  return props.getOptionLabel(option);
}

function getOptionValue(
  props: Props,
  option: Option
): string {
  return props.getOptionValue(option);
}

function isOptionDisabled(
  props: Props,
  option: Option,
  value: Value,
): boolean {
  return typeof props.isOptionDisabled === 'function'
    ? props.isOptionDisabled(option, value)
    : !!option.disabled;
}

function isOptionSelected(
  props: Props,
  option: Option,
  value: Value
): boolean {
  if (value.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, value);
  }

  const candidate = getOptionValue(props, option);
  return value.some((i) => getOptionValue(props, i) === candidate);
}

function isFocusable(
  props: Props,
  state: State,
  option: SelectOption
): boolean {
  const { async } = props;
  const { inputValue = '' } = state;
  const { data, selected, label, value } = option;

  if (async) {
    return (!selected || (selected && !shouldHideSelectedOption(props)));
  }

  return (
    (!selected || (selected && !shouldHideSelectedOption(props)))
    && filterOption(props, { label, value, data}, inputValue)
  );
}

function toSelectOption(
  props: Props,
  option: Option,
  value: Value,
  index: number
): SelectOption {
  return {
    type: 'option',
    data: option,
    value: getOptionValue(props, option),
    label: getOptionLabel(props, option),
    disabled: isOptionDisabled(props, option, value),
    selected: isOptionSelected(props, option, value),
    index
  };
}

function buildSelectOptions(
  props: Props,
  state: State,
  value: Value
): SelectOptionsOrGroups {
  const { isLoading, inputValue } = state;
  const {
    async,
    creatable,
    defaultOptions,
    allowCreateWhileLoading,
    createOptionPosition,
    formatCreateLabel,
    isValidNewOption,
    getNewOptionData,
    getOptionValue,
    getOptionLabel
  } = props;

  let options = [...state.options];
  if (async && !inputValue.length && Array.isArray(defaultOptions)) {
    options = [...defaultOptions];
  }

  if (creatable && (!isLoading || (isLoading && allowCreateWhileLoading))) {
    if (
      isValidNewOption(inputValue, cleanValue(value), options, {
        getOptionValue,
        getOptionLabel
      })
    ) {
      const newOption = getNewOptionData(inputValue, formatCreateLabel(inputValue));
      options = createOptionPosition === 'first'
        ? [newOption, ...options]
        : [...options, newOption]
    }
  }

  return options
    .map((item: Option | Group, index) => {
      if ('options' in item) {
        const options = item.options
          .map((option: Option, optionIndex: number) => {
            return toSelectOption(props, option, value, optionIndex);
          })
          .filter((selectOption: SelectOption) => isFocusable(props, state, selectOption));

        return options.length > 0
          ? {
              type: 'group' as const,
              data: item as Group,
              options,
              index
            }
          : undefined;
      }

      const selectOption = toSelectOption(props, item, value, index);

      return isFocusable(props, state, selectOption)
        ? selectOption
        : undefined;
    })
    .filter(notNullish);
}

function buildFocusableOptionsFromSelectOptions(options: readonly SelectOptionOrGroup[]): Options {
  return options.reduce((optionsAccumulator: Option[], item: Option | Group) => {
    if (item.type === 'group') {
      optionsAccumulator.push(...item.options.map((option: Option) => option.data));
    } else {
      optionsAccumulator.push(item.data);
    }
    return optionsAccumulator;
  }, []);
}

function buildFocusableOptions(
  props: Props,
  state: State,
  value: Value
): Options {
  return buildFocusableOptionsFromSelectOptions(
    buildSelectOptions(props, state, value)
  );
}

class Select extends EventEmitter {
  props: Props;

  abortController: AbortController = new AbortController;
  instancePrefix: string = '';
  isComposing: boolean = false;
  initialTouchX: number = 0;
  initialTouchY: number = 0;
  userIsDragging: boolean = false;
  openAfterFocus: boolean = false;
  scrollToFocusedOptionOnUpdate: boolean = false;
  blockOptionHover: boolean = false;
  asyncInputChange: (inputValue: string) => void = () => {};
  asyncCache: {[name: string]: OptionsOrGroups} = {};

  protected _state: State;

  get state(): State {
    return Object.seal(this._state);
  }

  // Refs

  controlRef: HTMLDivElement | null = null;
  setControlRef = (ref: HTMLDivElement) => {
    this.controlRef = ref;
  };

  menuListRef: HTMLDivElement | null = null;
  setMenuListRef = (ref: HTMLDivElement) => {
    this.menuListRef = ref;
  };

  inputRef: HTMLInputElement | null = null;
  setInputRef = (ref: HTMLInputElement) => {
    this.inputRef = ref;
  };

  focusedOptionRef: HTMLDivElement | null = null;
  setFocusedOptionRef = (ref: HTMLDivElement) => {
    this.focusedOptionRef = ref;

    if (
      this.menuListRef &&
      this.focusedOptionRef &&
      this.scrollToFocusedOptionOnUpdate
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
      this.scrollToFocusedOptionOnUpdate = false;
    }
  };

  constructor(props: SelectConfigs = {}) {
    super();

    this.props = { ...defaults, ...props } as Props;

    const value = cleanValue(this.props.value);

    this._state = {
      ...stateDefaults,
      ...{
        options: this.props.options,
        isOpen: !!this.props.open,
        isFocused: this.props.focused,
        isLoading: this.props.loading,
        inputValue: this.props.inputValue || '',
        value: value.slice(0, this.props.maxValues),
      },
    };

    this.setAsyncEnvironment();

    this.instancePrefix = 'select-' + (this.props.instanceId || ++instanceId);
  }

  getState = (): State => {
    return this.state;
  };

  setProps(props: SelectConfigs): Select {
    this.props = { ...defaults, ...props } as Props;

    const value = cleanValue(this.props.value);

    this.setState({
      ...this._state,
      ...{
        options:
          this.props.options === undefined
            ? this._state.options
            : this.props.options,
        isOpen:
          this.props.open === undefined ? this._state.isOpen : this.props.open,
        isFocused:
          this.props.focused === undefined
            ? this._state.isFocused
            : this.props.focused,
        isLoading:
          this.props.loading === undefined
            ? this._state.isLoading
            : this.props.loading,
        inputValue: this.props.inputValue || '',
        value: value.slice(0, this.props.maxValues),
      },
    });

    return this;
  }

  setAsyncEnvironment() {
    const { async, loadOptions } = this.props;

    if (async) {
      this.asyncInputChange = debounce((inputValue: string) => {
        const cachedOptions = this.getAsyncCache(inputValue);
        if (cachedOptions) {
          this.setState({options: cachedOptions});
          this.focusOption();
          return;
        }

        this.abortController.abort();

        const promise = loadOptions(inputValue, this.props, this.abortController, (options) => {
          this.setAsyncCache(inputValue, [...options]);
          this.setState({options: [...options], isLoading: false});
          this.focusOption();
        });

        if (promise) {
          promise.then((options) => {
            this.setAsyncCache(inputValue, [...options]);
            this.setState({options: [...options]});
            this.focusOption();
          }).catch((error) => {
            throw new Error(error);
          }).finally(() => {
            this.setState({isLoading: false});
          });
        }
      }, this.props.asyncOptions.delay);
    }
  }

  getAsyncCache(key: string): OptionsOrGroups | null {
    return this.asyncCache[key] || null;
  }

  setAsyncCache(key: string, options: OptionsOrGroups): void {
    this.asyncCache[key] = options;
  }

  onControlMouseDown = (event: MouseEvent): void => {
    // Event captured by indicators
    if (event.defaultPrevented) {
      return;
    }

    const { openMenuOnClick } = this.props;

    if (!this._state.isFocused) {
      if (openMenuOnClick) {
        this.openAfterFocus = true;
      }
      this.focusInput();
    } else if (!this._state.isOpen) {
      if (openMenuOnClick) {
        this.open();
      }
    } else {
      if (
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        this.onMenuClose();
      }
    }

    if (
      (event.target as HTMLElement).tagName !== 'INPUT' &&
      (event.target as HTMLElement).tagName !== 'TEXTAREA'
    ) {
      event.preventDefault();
    }
  };

  onDropdownIndicatorMouseDown = (event: MouseEvent) => {
    // Ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    const { multiple, disabeld } = this.props;

    if (disabeld) return;

    this.focusInput();

    if (this._state.isOpen) {
      this.setState({ inputIsHiddenAfterUpdate: !multiple });
      this.onMenuClose();
    } else {
      this.open();
    }
    event.preventDefault();
  };

  onClearIndicatorMouseDown = (event: MouseEvent) => {
    // ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    this.clearValue();
    event.preventDefault();
    this.openAfterFocus = false;

    if (event.type === 'touchend') {
      this.focusInput();
    } else {
      setTimeout(() => this.focusInput());
    }
  };

  onValueMouseDown = (event: MouseEvent, option: Option) => {
    // Ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    const { multiple, open, disabeld } = this.props;

    event.preventDefault();
    event.stopPropagation();
  };

  onMenuMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.focusInput();
  };

  onMenuMouseMove = (event: MouseEvent): void => {
    this.blockOptionHover = false;
  };

  onScroll = (event: Event) => {
    if (typeof this.props.closeMenuOnScroll === 'boolean') {
      if (
        event.target instanceof HTMLElement &&
        isDocumentElement(event.target)
      ) {
        this.props.onMenuClose();
      }
    } else if (typeof this.props.closeMenuOnScroll === 'function') {
      if (this.props.closeMenuOnScroll(event)) {
        this.props.onMenuClose();
      }
    }
  };

  updated(): void {
    if (
      this.menuListRef &&
      this.focusedOptionRef &&
      this.scrollToFocusedOptionOnUpdate
    ) {
      scrollIntoView(this.menuListRef, this.focusedOptionRef);
      this.scrollToFocusedOptionOnUpdate = false;
    }
  }

  /**
   * Composition Handlers
   */

  startListeningComposition() {
    if (document && document.addEventListener) {
      document.addEventListener(
        'compositionstart',
        this.onCompositionStart,
        false
      );
      document.addEventListener('compositionend', this.onCompositionEnd, false);
    }
  }

  stopListeningComposition() {
    if (document && document.removeEventListener) {
      document.removeEventListener('compositionstart', this.onCompositionStart);
      document.removeEventListener('compositionend', this.onCompositionEnd);
    }
  }

  onCompositionStart = () => {
    this.isComposing = true;
  };

  onCompositionEnd = () => {
    this.isComposing = false;
  };

  /**
   * Touch Event Handlers
   */

  startListeningToTouch() {
    if (document && document.addEventListener) {
      document.addEventListener('touchstart', this.onTouchStart, false);
      document.addEventListener('touchmove', this.onTouchMove, false);
      document.addEventListener('touchend', this.onTouchEnd, false);
    }
  }

  stopListeningToTouch() {
    if (document && document.removeEventListener) {
      document.removeEventListener('touchstart', this.onTouchStart);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
  }

  onTouchStart = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    this.initialTouchX = touch.clientX;
    this.initialTouchY = touch.clientY;
    this.userIsDragging = false;
  };

  onTouchMove = ({ touches }: TouchEvent) => {
    const touch = touches && touches.item(0);
    if (!touch) {
      return;
    }

    const deltaX = Math.abs(touch.clientX - this.initialTouchX);
    const deltaY = Math.abs(touch.clientY - this.initialTouchY);
    const moveThreshold = 5;

    this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
  };

  onTouchEnd = (event: TouchEvent) => {
    if (this.userIsDragging) return;

    // close the menu if the user taps outside
    // we're checking on event.target here instead of event.currentTarget, because we want to assert information
    // on events on child elements, not the document (which we've attached this handler to).
    if (
      this.controlRef &&
      !this.controlRef.contains(event.target as Node) &&
      this.menuListRef &&
      !this.menuListRef.contains(event.target as Node)
    ) {
      this.blurInput();
    }

    // reset move vars
    this.initialTouchX = 0;
    this.initialTouchY = 0;
  };

  onClearIndicatorTouchEnd = (event: MouseEvent) => {
    if (this.userIsDragging) return;

    this.onClearIndicatorMouseDown(event);
  };

  onDropdownIndicatorTouchEnd = (event: MouseEvent) => {
    if (this.userIsDragging) return;

    this.onDropdownIndicatorMouseDown(event);
  };

  /**
   * Consumer Handlers
   */

  onMenuOpen(): void {
    if (this._state.isOpen) return;

    if (this.props.onMenuOpen) {
      this.props.onMenuOpen();
    }

    if (this._state.inputValue.length >= this.props.minInputLength) {
      this.setState({
        isOpen: this.props.open !== undefined ? this.props.open : true,
      });
    }

    this.emit('menu-open');
  }

  onMenuClose(): void {
    const { clearInputOnClose, inputValue, onMenuClose, multiple } = this.props;

    if (clearInputOnClose || (clearInputOnClose === undefined && !multiple)) {
      this.onInputChange('', {
        action: 'menu-close',
        prevInputValue: inputValue,
      });
    }

    if (onMenuClose) {
      onMenuClose();
    }

    this.setState({
      isOpen: this.props.open !== undefined ? this.props.open : false,
    });

    this.emit('menu-close');
  }

  onInputChange(value: string, actionMeta: InputActionMeta): void {
    let newValue;
    const { inputIsHiddenAfterUpdate } = this._state;

    if (typeof this.props.onInputChange === 'function') {
      newValue = this.props.onInputChange(value, actionMeta);
    }

    this.setState({
      inputValue: newValue !== undefined ? newValue : value,
      inputIsHidden:
        inputIsHiddenAfterUpdate !== null ? inputIsHiddenAfterUpdate : false,
      inputIsHiddenAfterUpdate: undefined,
    });

    if (this._state.isOpen) {
      this.setState({
        focusedOption: this.getFocusedOption(),
      });
    }

    this.emit('input-change', value, actionMeta);
  }

  handleInputChange = (event: InputEvent) => {
    const { async, minInputLength, inputValue: prevInputValue } = this.props;
    const inputValue = (event.currentTarget as HTMLInputElement).value;
    this.setState({ inputIsHiddenAfterUpdate: false });

    if (this._state.focusedOption && this._state.focusedOption.__isNew__) {
      this.setState({
        focusedOption: null,
      });
    }

    this.onInputChange(inputValue, { action: 'input-change', prevInputValue });

    if (inputValue.length >= minInputLength) {
      if (async) {
        const cachedOptions = this.getAsyncCache(inputValue);
        this.setState({
          options: cachedOptions || [],
          isLoading: cachedOptions ? false : true
        });
        if (!cachedOptions) {
          this.asyncInputChange(inputValue);
        } else {
          this.focusOption();
        }
      }

      this.onMenuOpen();
    } else {
      this.onMenuClose();
    }
  };

  onInputFocus = (event: FocusEvent): void => {
    const { inputValue: prevInputValue } = this._state;
    this.onInputChange('', { action: 'input-focus', prevInputValue });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    this.setState({
      inputIsHiddenAfterUpdate: false,
      isFocused: true,
    });

    if (this.openAfterFocus || this.props.openMenuOnFocus) {
      this.open();
    }

    this.openAfterFocus = false;

    this.emit('input-focus');
  };

  onInputBlur = (event: FocusEvent): void => {
    const { inputValue: prevInputValue } = this._state;
    if (this.menuListRef && this.menuListRef.contains(document.activeElement)) {
      this.inputRef!.focus();
      return;
    }
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.onInputChange('', { action: 'input-blur', prevInputValue });
    this.onMenuClose();
    this.setState({
      focusedValue: [],
      isFocused: false,
    });

    this.emit('input-blur');
  };

  onOptionHover = (focusedOption: Option): void => {
    if (this.blockOptionHover || this._state.focusedOption === focusedOption) {
      return;
    }
    this.setState({ focusedOption });
  };

  shouldHideSelectedOptions(): boolean {
    return shouldHideSelectedOption(this.props);
  }

  focusOption = (direction: FocusDirection = 'first') => {
    const { pageSize } = this.props;
    const { focusedOption } = this._state;
    const options = this.getFocusableOptions();

    if (!options.length) return;
    let nextFocus = 0; // handles 'first'
    let focusedIndex = options.indexOf(focusedOption!);
    if (!focusedOption) {
      focusedIndex = -1;
    }

    if (direction === 'up') {
      nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
    } else if (direction === 'down') {
      nextFocus = (focusedIndex + 1) % options.length;
    } else if (direction === 'pageup') {
      nextFocus = focusedIndex - pageSize;
      if (nextFocus < 0) nextFocus = 0;
    } else if (direction === 'pagedown') {
      nextFocus = focusedIndex + pageSize;
      if (nextFocus > options.length - 1) nextFocus = options.length - 1;
    } else if (direction === 'last') {
      nextFocus = options.length - 1;
    }
    this.scrollToFocusedOptionOnUpdate = true;
    this.setState({
      focusedValue: [],
      focusedOption: options[nextFocus],
    });
    this.emit('focus-option');
  };

  onChange = (newValue: ChangeValue, actionMeta: ActionMeta): void => {
    const { onChange, maxValues } = this.props;

    newValue = newValue.slice(0, maxValues);

    if (onChange) {
      onChange(newValue, actionMeta);
    } else {
      this.setState({
        value: newValue,
      });
    }

    this.emit('change', newValue, actionMeta);
  };

  /**
   * Keyboard Handlers
   */

  onKeyDown = (event: KeyboardEvent): void => {
    const {
      multiple,
      clearable,
      escapeClearsValue,
      onKeyDown,
      keyMap,
      backspaceFocusesValue,
      backspaceRemovesValue,
      delimiters,
    } = this.props;
    const { isOpen, isDisabled, inputValue, focusedValue } = this._state;
    const focusedOption = this.getFocusedOption();

    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    this.blockOptionHover = true;

    const el = event.currentTarget as HTMLInputElement;
    const action = keyMap[event.code] || event.code;


    switch (action) {
      case 'Escape':
        if (isOpen) {
          this.setState({ inputIsHiddenAfterUpdate: false });
          this.onInputChange('', {
            action: 'menu-close',
            prevInputValue: inputValue,
          });
          this.onMenuClose();
        } else if (clearable && escapeClearsValue) {
          this.clearValue();
        }
        break;
      case 'PageUp':
        if (!isOpen) return;
        this.focusOption('pageup');
        break;
      case 'PageDown':
        if (!isOpen) return;
        this.focusOption('pagedown');
        break;
      case 'Last':
        if (!isOpen) return;
        this.open('last');
        break;
      case 'First':
        if (!isOpen) return;
        this.open('first');
        break;
      case 'Up':
        if (isOpen) {
          this.focusOption('up');
        } else {
          this.open('last');
        }
        break;
      case 'Down':
        if (isOpen) {
          this.focusOption('down');
        } else {
          this.open();
        }
        break;
      case 'Left':
        if (!multiple || inputValue) {
          return;
        }
        this.focusValueDirection('prev', event.shiftKey);
        break;
      case 'Right':
        if (!multiple || inputValue) {
          return;
        }
        this.focusValueDirection('next', event.shiftKey);
        break;
      case 'Delete':
        if (
          (event.code === 'Backspace' && !el.selectionEnd) ||
          (el.selectionStart === el.value.length && event.code === 'Delete')
        ) {
          if (!backspaceRemovesValue) return;
          if (multiple) {
            if (backspaceRemovesValue && focusedValue.length) {
              this.removeValue(focusedValue);
              this.focusInput();
              return;
            }
            if (backspaceFocusesValue) {
              this.focusValueDirection('prev');
              return;
            }
          } else if (clearable) {
            this.clearValue();
          }
        } else {
          return;
        }
        break;
      case 'Select':
        if ((!multiple && !isOpen) || event.keyCode === 229) {
          // Ignore keydown event from Input Method Editor (IME)
          return;
        }
        if (this.isComposing) return;
        if (focusedOption) {
          this.selectOption(focusedOption);
        }
        break;
      case 'SelectAll':
        if ((!event.ctrlKey && !event.metaKey) || inputValue) {
          return;
        }
        this.focusValueDirection('all');
        break;
      case 'Copy':
        if ((!event.ctrlKey && !event.metaKey) || inputValue) {
          return;
        }
        this.copyFocusedValue();
        return;
      case 'Cut':
        if ((!event.ctrlKey && !event.metaKey) || inputValue) {
          return;
        }
        this.copyFocusedValue();
        if (focusedValue.length) {
          this.removeValue(focusedValue);
        }
        return;
      default:
        if (!(event.ctrlKey || event.shiftKey) && focusedValue.length) {
          this.clearFocusedValue();
        }

        if (multiple && delimiters.includes(event.key)) {
          if ((!multiple && !isOpen) || event.keyCode === 229) {
            // Ignore keydown event from Input Method Editor (IME)
            return;
          }
          if (this.isComposing) return;
          if (focusedOption) {
            event.preventDefault();
            this.selectOption(focusedOption);
          }
        }

        return;
    }

    event.preventDefault();
  };

  /**
   * Methods
   */

  setValue = (
    newValue: ChangeValue,
    action: SetValueAction,
    option?: Option
  ): void => {
    const { closeMenuOnSelect, multiple } = this.props;
    this.onInputChange('', { action: 'set-value' });
    if (closeMenuOnSelect) {
      this.setState({ inputIsHiddenAfterUpdate: !multiple });
      this.onMenuClose();
    }

    this.onChange(newValue, { action, option });
  };

  selectOption = (newValue: Option) => {
    const { getNewOptionData, blurInputOnSelect, multiple, name } = this.props;
    const { value, inputValue } = this._state;
    const deselected = multiple && this.isOptionSelected(newValue, value);
    const isDisabled = this.isOptionDisabled(newValue, value);

    if (newValue.__isNew__) {
      newValue = getNewOptionData(inputValue, inputValue);
    }

    if (deselected) {
      const candidate = this.getOptionValue(newValue);
      this.setValue(
        value.filter((i) => this.getOptionValue(i) !== candidate),
        'deselect-option',
        newValue
      );
    } else if (!isDisabled) {
      // Select option if option is not disabled
      if (multiple) {
        this.setValue([...value, newValue], 'select-option', newValue);
      } else {
        this.setValue([newValue], 'select-option');
      }
    } else {
      this.ariaOnChange(newValue, {
        action: 'select-option',
        option: newValue,
        name,
      });
      return;
    }

    if (blurInputOnSelect) {
      this.blurInput();
    }
  };

  getValue = (): Value => {
    return this._state.value;
  };

  getFocusedValue = (): Value => {
    return this.props.multiple ? this._state.focusedValue : this._state.value;
  };

  removeValue(removedValue: Option | Options): Select {
    this.onInputChange('', { action: 'input-change' });

    if (!Array.isArray(removedValue)) {
      removedValue = [removedValue];
    }

    if (removedValue.length) {
      const newValue = this.getValue().filter((value: Option) => {
        return removedValue.indexOf(value) === -1;
      });

      this.setState({
        focusedValue: [],
        inputIsHiddenAfterUpdate: false,
        inputIsHidden: false,
      });

      this.onChange(newValue, {
        action: 'remove-value',
        removedValue: removedValue as Options,
      });
    }

    return this;
  }

  clearValue = (): Select => {
    const { value } = this._state;

    this.onChange([], {
      action: 'clear',
      removedValue: value,
    });

    return this;
  };

  setInputValue(value: string): Select {
    this.setState({ inputValue: value });

    return this;
  }

  focusInput(): void {
    if (!this.inputRef) return;
    this.inputRef.focus();
  }

  blurInput(): void {
    if (!this.inputRef) return;
    this.inputRef.blur();
  }

  focus = this.focusInput;

  blur = this.blurInput;

  open(focusOption: 'first' | 'last' = 'first'): Select {
    const { value, isFocused } = this._state;
    const focusableOptions = this.buildFocusableOptions();
    let openAtIndex = focusOption === 'first' ? 0 : focusableOptions.length - 1;

    if (!this.props.multiple) {
      const selectedIndex = focusableOptions.indexOf(value[0]);
      if (selectedIndex > -1) {
        openAtIndex = selectedIndex;
      }
    }

    // only scroll if the menu isn't already open
    this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);

    this.setState({
      inputIsHiddenAfterUpdate: false,
      inputIsHidden: false,
      focusedValue: [],
      focusedOption: focusableOptions[openAtIndex],
    });

    this.onMenuOpen();

    return this;
  }

  close(): Select {
    this.setState({ isOpen: false });

    return this;
  }

  setState(props: Partial<State>): Select {
    this._state = { ...this._state, ...props };
    this.emit('state-updated');
    return this;
  }

  createOption(inputValue: string): void {
    const {
      allowCreateWhileLoading,
      createOptionPosition,
      formatCreateLabel,
      isValidNewOption,
      getNewOptionData,
      onCreateOption,
      getOptionValue,
      getOptionLabel,
    } = this.props;
    const { value, options, isLoading } = this._state;

    if (isLoading && !allowCreateWhileLoading) return;
    if (
      isValidNewOption(inputValue, cleanValue(value), options, {
        getOptionValue,
        getOptionLabel,
      })
    ) {
      if (onCreateOption) {
        onCreateOption(inputValue);
      } else {
        const newOption = getNewOptionData(
          inputValue,
          formatCreateLabel(inputValue)
        );
        const action: ActionMeta = {
          action: 'create-option',
          option: newOption,
        };
        this.onChange([newOption], action);
        this.setState({
          options:
            createOptionPosition === 'first'
              ? [newOption, ...this._state.options]
              : [...this._state.options, newOption],
        });
      }
    }
  }

  focusValue(
    option: Option,
    shiftKey: boolean = false,
    ctrlKey: boolean = false
  ): void {
    const { focusedValue, value } = this._state;
    const focusedIndex = value.indexOf(option);
    const firstFocusedIndex = Math.min(
      focusedIndex,
      value.indexOf(focusedValue[0])
    );
    const lastFocusedIndex = Math.max(
      focusedIndex,
      value.indexOf(focusedValue[focusedValue.length])
    );
    let sortedFocusedValue = Array(value.length);

    focusedValue.forEach((v) => {
      let k = value.indexOf(v);
      sortedFocusedValue[k] = ctrlKey ? v : null;
    });

    // ShiftKey only works to focus values, not unfocus.
    if (shiftKey) {
      value.forEach((v, k) => {
        if (k >= firstFocusedIndex && k <= lastFocusedIndex) {
          sortedFocusedValue[k] = v;
        }
      });
    } else {
      if (sortedFocusedValue[focusedIndex]) {
        sortedFocusedValue[focusedIndex] = null;
      } else {
        sortedFocusedValue[focusedIndex] = option;
      }
    }

    sortedFocusedValue = sortedFocusedValue.filter((v) => !!v);

    this.setState({
      inputIsHidden: !!sortedFocusedValue.length,
      focusedValue: sortedFocusedValue,
      focusedOption: null,
    });
  }

  focusValueDirection(
    direction: 'prev' | 'next' | 'all',
    multiple: boolean = false
  ): void {
    const { focusedValue, value } = this._state;
    const last = value.length - 1;
    let sortedFocusedValue = Array(value.length);
    let nextFocusedValue: Options = [];

    let focusedIndex = direction === 'prev' ? last : 0;
    let focusedEndIndex = direction === 'prev' ? 0 : last;
    focusedValue.forEach((v) => {
      let k = value.indexOf(v);
      sortedFocusedValue[k] = v;
      if (direction === 'prev') {
        focusedIndex = Math.min(k, focusedIndex);
        focusedEndIndex = Math.max(k, focusedEndIndex);
      } else {
        focusedIndex = Math.max(k, focusedIndex);
        focusedEndIndex = Math.min(k, focusedEndIndex);
      }
    });

    sortedFocusedValue = sortedFocusedValue.filter((v) => !!v);

    // Allow value selection in multiple mode only.
    if (!this.props.multiple || !value.length) return;

    if (direction === 'all') {
      nextFocusedValue = [...value];
    } else if (direction === 'prev') {
      if (focusedIndex !== null && focusedValue.length) {
        if (focusedIndex === 0 && !multiple) {
        } else if (focusedIndex === 0 && multiple) {
          nextFocusedValue = [...sortedFocusedValue];
          nextFocusedValue.splice(nextFocusedValue.length - 1, 1);
        } else if (focusedIndex === 0) {
          nextFocusedValue = [
            value[last],
            ...(multiple ? sortedFocusedValue : []),
          ];
        } else {
          nextFocusedValue = [
            value[focusedIndex - 1],
            ...(multiple ? sortedFocusedValue : []),
          ];
        }
        if (multiple && focusedEndIndex === 0) {
          nextFocusedValue.splice(nextFocusedValue.length - 1, 1);
        }
      } else {
        nextFocusedValue = [value[last]];
      }
    } else if (direction === 'next') {
      if (focusedIndex !== null && focusedValue.length) {
        if (focusedIndex === last && !multiple) {
        } else if (focusedIndex === last && multiple) {
          nextFocusedValue = [...sortedFocusedValue];
          nextFocusedValue.splice(0, 1);
        } else if (focusedIndex === last) {
          nextFocusedValue = [
            ...(multiple ? sortedFocusedValue : []),
            value[0],
          ];
        } else {
          nextFocusedValue = [
            ...(multiple ? sortedFocusedValue : []),
            value[focusedIndex + 1],
          ];
        }
      } else {
        nextFocusedValue = [value[0]];
      }
    }

    this.setState({
      inputIsHidden: !!nextFocusedValue.length,
      focusedValue: nextFocusedValue,
      focusedOption: null,
    });
  }

  clearFocusedValue() {
    if (this._state.focusedValue.length) {
      this.setState({
        focusedValue: []
      });
    }
  }

  copyFocusedValue() {
    const props = this.props;
    let copyString = this.getFocusedValue()
      .map((option) => option[props.clipboardOptionProperty])
      .join(props.copyOptionDelimiter);

    navigator.clipboard.writeText(copyString);

    return this;
  }

  pasteValue(e: ClipboardEvent) {
    const { options, value } = this._state;
    const {
      creatable,
      delimiters,
      minInputLength,
      clipboardOptionProperty,
      getNewOptionData,
    } = this.props;
    const input = e.clipboardData!.getData('text');
    let tokens: string[] = [input];

    // Break input using delimiters option.
    if (delimiters.length) {
      let search = delimiters.join('|');
      let splitRegex = new RegExp(`(${search})`, 'ig');
      tokens = input.split(splitRegex);
    }

    const newValue: Option[] = tokens
      .map((token) => token.trim())
      .filter((token) => {
        return (
          token.length > 0 &&
          token.length >= minInputLength &&
          !delimiters.includes(token)
        );
      })
      .map((token) => {
        let matchingOption = null;
        options.some((option) => {
          const match = option[clipboardOptionProperty] === token;
          if (match) {
            matchingOption = option;
          }
        });

        if (matchingOption) return matchingOption;

        if (creatable) {
          return getNewOptionData(token, token);
        }

        return null;
      })
      .filter((option: any): option is Option => {
        return (
          option &&
          !this.isOptionDisabled(option, value) &&
          !this.isOptionSelected(option, value)
        );
      });

    if (newValue.length) {
      this.setValue([...value, ...newValue], 'select-option');
      e.preventDefault();
    }
  }

  getCommonProps(): CommonProps {
    const {
      clearValue,
      getValue,
      getFocusedValue,
      getFocusedOption,
      getElementId,
      getThemeClass,
      getClass,
      getState,
      setValue,
      selectOption,
      props,
    } = this;
    const { multiple, rtl, options } = props;

    const hasValue = this.hasValue();

    return {
      clearValue,
      getValue,
      getFocusedValue,
      getFocusedOption,
      getElementId,
      getThemeClass,
      getClass,
      getState,
      hasValue,
      multiple,
      rtl,
      options,
      selectOption,
      setValue,
      selectProps: props,
    };
  }

  getThemeClass = (
    name: string,
    props: { [name: string]: any } = {}
  ): string => {
    if (!this.props.theme) {
      return '';
    }

    const themeClass = this.props.theme[name];
    if (typeof themeClass === 'function') {
      return themeClass({ ...this.getCommonProps(), ...props }) || '';
    }

    return themeClass || '';
  };

  getClass = (name: string): string => {
    if (!this.props.classNamePrefix) {
      return '';
    }
    return this.props.classNamePrefix + '__' + name;
  };

  getGroupLabel(data: Group): string {
    return getGroupLabel(this.props, data);
  }

  getOptionLabel(data: Option): string {
    return getOptionLabel(this.props, data);
  }

  getOptionValue(data: Option): string {
    return getOptionValue(this.props, data);
  }

  getElementId = (element: 'group' | 'input' | 'list' | 'option'): string => {
    return `${this.instancePrefix}-${element}`;
  };

  buildSelectOptions() {
    return buildSelectOptions(this.props, this._state, this._state.value);
  }

  getSelectOptions(): SelectOptionsOrGroups {
    return this._state.isOpen
      ? this.buildSelectOptions().slice(0, this.props.maxOptions)
      : [];
  }

  buildFocusableOptions(): Options {
    return buildFocusableOptions(this.props, this._state, this._state.value);
  }

  getFocusableOptions(): Options {
    return this._state.isOpen
      ? this.buildFocusableOptions().slice(0, this.props.maxOptions)
      : [];
  }

  getFocusedOption = (): Option | null => {
    const { focusedOption: lastFocusedOption } = this._state;
    const options = this.getFocusableOptions();
    return lastFocusedOption &&
      options.map((o) => o.value).indexOf(lastFocusedOption.value) > -1
      ? lastFocusedOption
      : options[0] || null;
  };

  getMenuPlacement = (menuEl: HTMLDivElement | null): MenuState => {
    const { props } = this;
    return getPenuPlacement({
      maxHeight: props.maxMenuHeight,
      menuEl: menuEl,
      minHeight: props.minMenuHeight,
      placement: props.menuPlacement,
      spacing: props.spacing,
      shouldScroll: props.menuShouldScrollIntoView,
      isFixedPosition: props.menuPosition === 'fixed'
    });
  }

  scrollToMenu = (menuEl: HTMLDivElement, placement: CoercedMenuPlacement): void => {
    const { props } = this;
    if (props.menuShouldScrollIntoView) {
      scrollToMenu({
        menuEl: menuEl,
        placement: placement,
        isFixedPosition: props.menuPosition === 'fixed'
      });
    }
  }

  /**
   * Helpers
   */

  ariaOnChange = (value: Option, actionMeta: ActionMeta) => {
  };

  hasValue(): boolean {
    return this._state.value.length > 0;
  }

  hasOptions(): boolean {
    return this._state.options.length > 0;
  }

  isClearable(): boolean {
    const { clearable, multiple } = this.props;

    if (clearable === undefined) return multiple;

    return clearable;
  }

  isOptionDisabled(option: Option, value: Value): boolean {
    return isOptionDisabled(this.props, option, value);
  }

  isOptionSelected(option: Option, value: Value): boolean {
    return isOptionSelected(this.props, option, value);
  }

  filterOption(option: FilterOptionOption, input: string): boolean {
    return filterOption(this.props, option, input);
  }

  formatOptionLabel(option: Option, context: FormatOptionLabelContext): any {
    if (typeof this.props.formatOptionLabel === 'function') {
      const { inputValue } = this.props;
      const { value } = this._state;
      return this.props.formatOptionLabel(option, {
        context,
        inputValue,
        value,
      });
    } else {
      return this.getOptionLabel(option);
    }
  }

  formatGroupLabel(group: Group): any {
    if (typeof this.props.formatGroupLabel === 'function') {
      return this.props.formatGroupLabel(group);
    } else {
      return this.getGroupLabel(group);
    }
  }
}

export default Select;
