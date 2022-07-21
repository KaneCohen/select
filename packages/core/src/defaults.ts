import {
  formatCreateLabel,
  getGroupLabel,
  getOptionLabel,
  getOptionValue,
  isOptionDisabled,
  isValidNewOption,
  getNewOptionData
} from './builtins';
import { SelectConfigs, CreatableConfigs, State, AsyncConfigs } from './types';
import { createFilter, isMobileDevice, isTouchCapable } from './utils';

export const selectConfigs: SelectConfigs = {
  autoFocus: false,
  backspaceFocusesValue: true,
  backspaceRemovesValue: true,
  blurInputOnSelect: isTouchCapable(),
  captureMenuScroll: !isTouchCapable(),
  className: null,
  classNamePrefix: null,
  clearable: true,
  clearInputOnClose: undefined,
  clipboardOptionProperty: 'label',
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  controlShouldRenderValue: true,
  copyOptionDelimiter: ', ',
  creatable: false,
  delimiters: [],
  disabeld: false,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: null,
  formatOptionLabel: null,
  focused: undefined,
  getGroupLabel: getGroupLabel,
  getOptionLabel: getOptionLabel,
  getOptionValue: getOptionValue,
  hideSelectedOptions: undefined,
  id: null,
  instanceId: null,
  inputId: '',
  inputType: 'text',
  inputValue: undefined,
  isOptionDisabled: isOptionDisabled,
  isOptionSelected: null,
  keyMap:  {
    'Escape': 'Escape',
    'PageUp': 'PageUp', // Page Up
    'PageDown': 'PageDown', // Page Down
    'Home': 'First', // Home
    'End': 'Last', // End
    'ArrowLeft': 'Left', // Arrow Left
    'ArrowUp': 'Up', // Arrow Up
    'ArrowRight': 'Right', // Arrow Right
    'ArrowDown': 'Down', // Arrow Down
    'Backspace': 'Delete', // Backspace
    'Delete': 'Delete', // Delete
    'Command': 'Meta', // Command
    'KeyA': 'SelectAll', // A works only with Ctrl/Cmd
    'KeyC': 'Copy', // C works only with Ctrl/Cmd
    'KeyX': 'Cut', // X works only with Ctrl/Cmd
    'Tab': 'Select', // Tab
    'Enter': 'Select', // Enter
    'NumpadEnter': 'Select', // Numpad Enter
  },
  loading: false,
  loadingMessage: 'Loading...',
  maxValues: undefined,
  maxOptions: undefined,
  maxMenuHeight: 300,
  menuPlacement: 'auto',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !isMobileDevice(),
  minInputLength: 0,
  minMenuHeight: 140,
  multiple: false,
  name: undefined,
  noOptionsMessage: () => 'No options',
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  open: undefined,
  placeholder: 'Select...',
  pageSize: 5,
  rtl: false,
  screenReaderStatus: ({ count }: { count: number }): string => {
    return `${count} result${count !== 1 ? 's' : ''} available`;
  },
  searchable: false,
  setValueOnBlur: false,
  setValueOnPaste: true,
  spacing: {
    baseUnit: 4,
    controlHeight: 38,
    menuGutter: 8
  },
  tabIndex: '0',
  theme: null,
  value: [],
};

export const creatableConfigs: CreatableConfigs = {
  allowCreateWhileLoading: false,
  createOptionPosition: 'last',
  formatCreateLabel,
  isValidNewOption,
  getNewOptionData,
  onCreateOption: undefined,
};

export const asyncConfigs: AsyncConfigs = {
  async: false,
  asyncOptions: {
    url: null,
    delay: 300,
    queryParam: 'q',
    params: {},
    requestOptions: {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },
  cacheOptions: true,
  defaultOptions: undefined,
  loadOptions: undefined,
  isLoading: undefined
};

export const defaults = {...selectConfigs, ...creatableConfigs, ...asyncConfigs};

export const stateDefaults: State = {
  options: [],
  value: [],
  newOption: null,
  focusedOption: null,
  focusedValue: [],
  isOpen: false,
  isFocused: false,
  isDisabled: false,
  isLoading: false,
  inputValue: '',
  inputIsHidden: false,
  inputIsHiddenAfterUpdate: null,
};
