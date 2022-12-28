export type MouseEventHandler = (e: MouseEvent) => void;
export type FocusEventHandler = (e: FocusEvent) => void;

export type UIRef = {
  ref: any;
};

export type OptionProps = {
  id: number;
  index: number;
  disabled: boolean;
  focused: boolean;
  selected: boolean;
  label: string;
  value: any;
  onClick: MouseEventHandler;
  onMouseOver: MouseEventHandler;
  data: Option;
} & UIRef;

export type Option = {
  readonly label?: string;
  readonly value?: any;
  readonly disabled?: boolean;
  readonly __isNew__?: boolean;
  readonly [name: string]: any;
};

export type Options = Option[];

export type SingleValue = Option | null;

export type MultiValue = readonly Option[];

export type Value = Options;

export type ChangeValue = Options;

export type Group = {
  label?: string;
  options: Option[];
  [name: string]: any;
};

export type Groups = Group[];

export type OptionOrGroup = Option | Group;

export type OptionsOrGroups = OptionOrGroup[];

export type SelectOption = {
  type: 'option';
  data: Option;
  disabled: boolean;
  selected: boolean;
  label: string;
  value: string;
  index: number;
};

export type SelectGroup = {
  type: 'group';
  data: Group;
  label?: string;
  index: number;
  options: readonly SelectOption[];
};

export type SelectOptionOrGroup = SelectOption | SelectGroup;

export type SelectOptionsOrGroups = SelectOptionOrGroup[];

export type MenuPlacement = 'auto' | 'bottom' | 'top';

export type CoercedMenuPlacement = 'bottom' | 'top';

export type MenuPosition = 'absolute' | 'fixed';

export interface MenuState {
  placement: CoercedMenuPlacement;
  shouldScroll: boolean;
  maxHeight: number;
}

export type FormatOptionLabelContext = 'menu' | 'control';

export interface FormatOptionLabelMeta {
  context: FormatOptionLabelContext;
  inputValue: string;
  value: Options;
}

export interface Accessors<Option> {
  getOptionValue: GetOptionValue<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface Spacing {
  baseUnit: number;
  controlHeight: number;
  menuGutter: number;
}

export interface Theme {
  [name: string]: string | ((props?: any) => string);
}

export type SelectConfigs = {
  /**
   * Focuses the control when mounted.
   */
  autoFocus?: boolean;

  /**
   * Focuses nearest option when user presses backspace. Select must have
   * `multiple` prop be enabled.
   */
  backspaceFocusesValue?: boolean;

  /**
   * Removes nearest option when user presses backspace. Select must have
   * `multiple` prop be enabled. Works together with `backspaceSelectsValue`
   * to remove option immediately or select option for removal first.
   */
  backspaceRemovesValue?: boolean;

  /**
   * Removes focus from the input when user select an option - hides keyboard
   * on touch devices when option is picked.
   */
  blurInputOnSelect?: boolean;

  /**
   * Prevents scroll within parent element when user reaches top/bottom part
   * of the open menu.
   */
  captureMenuScroll?: boolean;

  /**
   * Sets a class name on outer component.
   */
  className?: string | null;

  /**
   * Sets a prefix for all inner components. Useful when styling is done via
   * traditional CSS classes.
   */
  classNamePrefix?: string | null;

  /**
   * Can the select value be cleared.
   */
  clearable?: boolean;

  /**
   * If set to true will clear input typehead contents when menu is closed.
   */
  clearInputOnClose?: boolean;

  /**
   * Option specifying property from options to be used when copying/pasting values.
   */
  clipboardOptionProperty?: string;

  /**
   * Hides select menu when user selects an option.
   */
  closeMenuOnSelect?: boolean;

  /**
   * Hides select menu if set to `true`.
   * If function is used - takes a ScrollEvent and returns boolean determning
   * if select menu should be closed.
   * `true` - Menu closes.
   * `false` - Menu stays open.
   */
  closeMenuOnScroll?: boolean | ScrollHandler;

  /**
   * Renders value in a control input.
   */
  controlShouldRenderValue?: boolean;

  /**
   * Option specifying string separating option properties when copying focused values.
   */
  copyOptionDelimiter?: string;

  /**
   * Creates option if one is not present in existing options.
   */
  creatable?: boolean;

  /**
   * If select has `creatable` prop set to `true` it will position new options
   * in the given position in the list.
   */
  createOptionPosition?: CreatePosition;

  /**
   * String or array of strings that act as an action to select value.
   * Select must have `multiple` prop be enabled.
   */
  delimiters?: string[];

  /**
   * Is the select disabled.
   */
  disabeld?: boolean;

  /**
   * Clear all values when user presses escape AND the menu is closed.
   */
  escapeClearsValue?: boolean;

  /**
   * If set - a method executed for every option determining if it should
   * be shown in the open menu.
   */
  filterOption?: FilterOption | null;

  /**
   * If set - formats group labels in the menu and returns UI
   * component to be used by UI library.
   */
  formatGroupLabel?: ((group: Group) => any) | null;

  /**
   * If set - formats option labels in the menu and control and returns UI
   * component to be used by UI library.
   */
  formatOptionLabel?:
    | ((option: Option, formatOptionLabelMeta: FormatOptionLabelMeta) => any)
    | null;

  /**
   * Is the select focused.
   */
  focused?: boolean;

  /**
   * If set - a method executed for every group returning group label.
   */
  getGroupLabel?: GetGroupLabel;

  /**
   * If set - a method executed for every option returning option label.
   */
  getOptionLabel?: GetOptionLabel<Option>;

  /**
   * If set - a method executed for every option returning option value.
   */
  getOptionValue?: GetOptionValue<Option>;

  /**
   * If option is selected hide it from the menu.
   */
  hideSelectedOptions?: boolean;

  /**
   * ID to set on container component.
   */
  id?: string | null;

  /**
   * ID Prefix for select components.
   */
  instanceId?: number | string | null;

  /**
   * The id of the search input.
   */
  inputId?: string | null;

  /**
   * Specifies type used in typehead component. Depending on type browser could
   * show different keyboard layout. Possible options: text, email, number etc.
   */
  inputType?: string;

  /**
   * The value of the search input.
   */
  inputValue?: string;

  /**
   * Override logic determining that option is disabled.
   */
  isOptionDisabled?: IsOptionDisabled;

  /**
   * Override logic determining that option is selected.
   */
  isOptionSelected?: IsOptionSelected | null;

  /**
   * Map specifiying key action map.
   */
  keyMap?: { [key: string]: string };

  /**
   * Is the select in a loading state (async).
   */
  loading?: boolean;

  /**
   * Text to display when loading options.
   */
  loadingMessage?: LoadingMessage;

  /**
   * Prevents setting of more options than specified.
   * Select must have `multiple` prop be enabled.
   * 0 - unlimited number of options.
   */
  maxValues?: number;

  /**
   * Prevents showing of more options than specified.
   */
  maxOptions?: number;

  /**
   * Maximum height of the open menu before scrolling.
   */
  maxMenuHeight?: number;

  /**
   * Open menu position in relation to the control. Accepts: 'auto', 'bottom' and
   * 'top'. With 'auto' if there's not enough space at the bottom it will show
   * menu at the top.
   */
  menuPlacement?: MenuPlacement;

  /**
   * The CSS position value of the menu. When 'fixed' is set requires extra
   * layout management.
   */
  menuPosition?: MenuPosition;

  /**
   * Prevents scroll events from firing when menu is open.
   */
  menuShouldBlockScroll?: boolean;

  /**
   * Whether menu should be scrolled into view when opened.
   */
  menuShouldScrollIntoView?: boolean;

  /**
   * Opens menu when input value reaches specified length.
   */
  minInputLength?: number;

  /**
   * Minimum menu height of the open menu.
   */
  minMenuHeight?: number;

  /**
   * Is the select in a multiple mode.
   */
  multiple?: boolean;

  /**
   * Name of the HTML Input. If not set, won't be rendered.
   */
  name?: string;

  /**
   * Text to display when there are no options.
   */
  noOptionsMessage?: string | (() => string);

  /**
   * Array of options or groups to populate the select menu with.
   */
  options?: OptionsOrGroups;

  /**
   * Is the select menu open.
   */
  open?: boolean;

  /**
   * Handles blur event on te control.
   */
  onBlur?: (event: FocusEvent) => void;

  /**
   * Handles change event on the select.
   */
  onChange?: (newValue: ChangeValue, actionMeta: ActionMeta) => void;

  /**
   * Handles focus event on the control.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Handles change event on the input.
   */
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;

  /**
   * Handles keydown even on the select.
   */
  onKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Handles menu opening.
   */
  onMenuOpen?: () => void;

  /**
   * Handles menu closing.
   */
  onMenuClose?: () => void;

  /**
   * Handles on event fired when menu scrolled to the top.
   */
  onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;

  /**
   * Handles on event fired when menu scrolled to the bottom.
   */
  onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;

  /**
   * Opens menu if control is focused.
   */
  openMenuOnFocus?: boolean;

  /**
   * If the select is clicked open then menu.
   */
  openMenuOnClick?: boolean;

  /**
   * Placeholder for the select value.
   */
  placeholder?: string;

  /**
   * Number of options to jump in menu when Page Up|Down keys are used.
   */
  pageSize?: number;

  /**
   * Is the select in right-to-left mode.
   */
  rtl?: boolean;

  /**
   * Status to relay to screen reader.
   */
  screenReaderStatus?: ({ count }: { count: number }) => string;

  /**
   * Is search functionality enabled.
   */
  searchable?: boolean;

  /**
   * Sets value on blur if input is not empty and option could be added.
   */
  setValueOnBlur?: boolean;

  /**
   * Sets value to select if paste event is caught by the input.
   */
  setValueOnPaste?: boolean;

  /**
   * Sets control spacing.
   */
  spacing?: Spacing;

  /**
   * Sets tab index attribute for the select input.
   */
  tabIndex?: string;

  /**
   * Sets object specifying class-based theming of the components.
   */
  theme?: Theme | null;

  /**
   * Sets the select value.
   */
  value?: Value;
};

export type CreatableConfigs = {
  /**
   * Allows options to be created while Select is in `isLoading` state.
   * Helps to prevent options being added while waiting for network request.
   */
  allowCreateWhileLoading?: boolean;

  /**
   * Sets the position of the created value in the list. Defaults to 'last'.
   */
  createOptionPosition?: 'first' | 'last';

  /**
   * Gets the label for "Create new..." option in the menu.
   */
  formatCreateLabel?: (inputValue: string) => string;

  /**
   * Determines whether new option is valid and can be created.
   */
  isValidNewOption?: (
    inputValue: string,
    value: Options,
    options: Options,
    accessors: Accessors<Option>
  ) => boolean;

  /**
   * Returns data that for the new option when created. Used to display the
   * value and is passed to `onChange`.
   */
  getNewOptionData?: (inputValue: string, optionLabel: string) => Option;

  /**
   * If set, function will be called with the input value when new option is
   * created. In that case `onChange` will no be called. Use this to have more
   * control over what happens when new option is created.
   */
  onCreateOption?: (inputValue: string) => void;
};

type AsyncOptions = {
  /**
   * Sets url used by default async implementation to fetch options.
   */
  url: string | null;

  /**
   * Sets a delay after input when async options request should be performed.
   */
  delay: number;

  /**
   * Sets parameter used by the remote API to filter and return options.
   */
  queryParam: string;

  /**
   * Sets additional parameters to be sent to remote API.
   */
  params: {
    [name: string]: any;
  };

  /**
   * Object containing options used by default async implementaion (fetch API).
   */
  requestOptions: {
    [name: string]: any;
  };
};

export type AsyncConfigs = {
  /**
   * Sets the option specifying that Select should work in async mode.
   */
  async?: boolean;

  /**
   * Object containing configs used in default async implementation.
   */
  asyncOptions?: AsyncOptions;

  /**
   * If set, options returned via async will be cached for a given input.
   */
  cacheOptions?: boolean;

  /**
   * Array of options or groups to populate the select menu with when input is
   * empty (inputValue equals to '').
   */
  defaultOptions?: OptionsOrGroups | boolean;

  /**
   * Function that returns a promise, which is the set of options to be used once the promise resolves.
   */
  loadOptions?: (
    inputValue: string,
    props: Props,
    abortController: AbortController,
    callback?: (options: Readonly<OptionsOrGroups>) => void
  ) => void | Promise<Readonly<OptionsOrGroups>>;

  /**
   * If set, will show loading indicator and message in menu if open.
   */
  isLoading?: boolean;
};

export type State = {
  options: OptionsOrGroups;
  value: Options;
  newOption: Option | null;
  focusedOption: Option | null;
  focusedValue: Options;
  isOpen: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  inputValue: string;
  inputIsHidden: boolean;
  inputIsHiddenAfterUpdate: boolean | null | undefined;
};

export type Props = Required<SelectConfigs & CreatableConfigs & AsyncConfigs>;

export type ScrollHandler = (event: Event) => boolean;

export type CreatePosition = 'first' | 'last';

export type FilterOptionOption = {
  label: string;
  value: string;
  data: Option;
};

export type FilterOption = (
  option: FilterOptionOption,
  input: string
) => boolean;

export type GetGroupLabel = (group: Group) => string;

export type GetOptionLabel<Option> = (option: Option) => string;

export type GetOptionValue<Option> = (option: Option) => any;

export type IsOptionDisabled = (option: Option, value: Value) => boolean;

export type IsOptionSelected = (option: Option, value: Value) => boolean;

export type LoadingMessage =
  | ((inputValue: string) => string | null)
  | string
  | null;

export type ComponentClassMixin = {
  methods: Object;
  [name: string]: any;
};

export type Action =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type ActionMeta = {
  action: Action;
  option?: Option | undefined;
  removedValue?: Options;
  name?: string;
};

export type SetValueAction = 'select-option' | 'deselect-option';

export type InputAction =
  | 'set-value'
  | 'remove-value'
  | 'input-change'
  | 'input-focus'
  | 'input-blur'
  | 'menu-close';

export type InputActionMeta = {
  action: InputAction;
  prevInputValue?: string;
};

export type FocusDirection =
  | 'up'
  | 'down'
  | 'pageup'
  | 'pagedown'
  | 'first'
  | 'last';

export type ClassNameList = string[];

export type ClassNamesState = {
  [name: string]: boolean;
} | void;

export type CommonProps = {
  clearValue: () => void;
  getValue: () => Value;
  getFocusedValue: () => Value;
  getFocusedValues: () => any[];
  getFocusedOption: () => Option | null;
  getElementId: (element: 'group' | 'input' | 'list' | 'option') => string;
  getThemeClass: (name: string, props?: { [name: string]: any }) => string;
  getClass: (name: string) => string;
  getState: () => State;
  hasValue: boolean;
  multiple: boolean;
  rtl: boolean;
  options: Options;
  selectOption: (option: Option) => void;
  selectProps: Props;
  setValue: (
    value: ChangeValue,
    action: SetValueAction,
    option: Option
  ) => void;
};
