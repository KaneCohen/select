import { defaults } from '@cohensive/select-core/defaults';

export const selectProps = {
  autoFocus: {
    type: Boolean,
    default: defaults.autoFocus
  },

  backspaceFocusesValue: {
    type: Boolean,
    default: defaults.backspaceFocusesValue
  },

  backspaceRemovesValue: {
    type: Boolean,
    default: defaults.backspaceRemovesValue
  },

  blurInputOnSelect: {
    type: Boolean,
    default: defaults.blurInputOnSelect
  },

  captureMenuScroll: {
    type: Boolean,
    default: defaults.captureMenuScroll
  },

  className: {
    type: String,
    default: defaults.className
  },

  classNamePrefix: {
    type: String,
    default: 'vue-select'
  },

  clearable: {
    type: Boolean,
    default: defaults.clearable
  },

  clearInputOnClose: {
    type: Boolean,
    default: defaults.clearInputOnClose
  },

  clipboardOptionProperty: {
    type: String,
    default: defaults.clipboardOptionProperty
  },

  closeMenuOnSelect: {
    type: Boolean,
    default: defaults.closeMenuOnSelect
  },

  closeMenuOnScroll: {
    type: [Boolean, Function],
    default: defaults.closeMenuOnScroll
  },

  controlShouldRenderValue: {
    type: Boolean,
    default: defaults.controlShouldRenderValue
  },

  copyOptionDelimiter: {
    type: String,
    default: defaults.copyOptionDelimiter
  },

  creatable: {
    type: Boolean,
    default: defaults.creatable
  },

  delimiters: {
    type: Array,
    default: () => defaults.delimiters
  },

  disabeld: {
    type: Boolean,
    default: defaults.disabeld
  },

  escapeClearsValue: {
    type: Boolean,
    default: defaults.escapeClearsValue
  },

  formatOptionLabel: {
    type: Function,
    default: defaults.formatOptionLabel
  },

  formatGroupLabel: {
    type: Function,
    default: defaults.formatGroupLabel
  },

  filterOption: {
    type: Function,
    default: defaults.filterOption
  },

  getGroupLabel: {
    type: Function,
    default: defaults.getGroupLabel
  },

  getOptionLabel: {
    type: Function,
    default: defaults.getOptionLabel
  },

  getOptionValue: {
    type: Function,
    default: defaults.getOptionValue
  },

  hideSelectedOptions: {
    type: Boolean,
    default: defaults.hideSelectedOptions
  },

  id: {
    type: String,
    default: defaults.id
  },

  inputValue: {
    type: String,
    default: defaults.inputValue
  },

  inputId: {
    type: String,
    default: defaults.inputId
  },

  inputType: {
    type: String,
    default: defaults.inputType
  },

  isOptionDisabled: {
    type: Function,
    default: defaults.isOptionDisabled
  },

  isOptionSelected: {
    type: Function,
    default: defaults.isOptionSelected
  },

  keyMap: {
    type: Object,
    default: () => defaults.keyMap
  },

  loading: {
    type: Boolean,
    default: defaults.loading
  },

  loadingMessage: {
    type: [String, Function],
    default: defaults.loadingMessage
  },

  maxOptions: {
    type: Number,
    default: defaults.maxOptions
  },

  maxValues: {
    type: Number,
    default: defaults.maxValues
  },

  maxMenuHeight: {
    type: Number,
    default: defaults.maxMenuHeight
  },

  menuPlacement: {
    type: String,
    default: defaults.menuPlacement
  },

  menuPosition: {
    type: String,
    default: defaults.menuPosition
  },

  menuShouldBlockScroll: {
    type: Boolean,
    default: defaults.menuShouldBlockScroll
  },

  menuShouldScrollIntoView: {
    type: Boolean,
    default: defaults.menuShouldScrollIntoView
  },

  name: {
    type: String,
    default: defaults.name
  },

  noOptionsMessage: {
    type: [String, Function],
    default: defaults.noOptionsMessage
  },

  minInputLength: {
    type: Number,
    default: defaults.minInputLength
  },

  multiple: {
    type: Boolean,
    default: defaults.multiple
  },

  options: {
    type: Array,
    default: () => defaults.options
  },

  open: {
    type: Boolean,
    default: defaults.open
  },

  onBlur: {
    type: Function,
    default: defaults.onBlur
  },

  onChange: {
    type: Function,
    default: defaults.onChange
  },

  onFocus: {
    type: Function,
    default: defaults.onFocus
  },

  onInputChange: {
    type: Function,
    default: defaults.onInputChange
  },

  onKeyDown: {
    type: Function,
    default: defaults.onKeyDown
  },

  onMenuOpen: {
    type: Function,
    default: defaults.onMenuOpen
  },

  onMenuClose: {
    type: Function,
    default: defaults.onMenuClose
  },

  onMenuScrollToTop: {
    type: Function,
    default: defaults.onMenuScrollToTop
  },

  onMenuScrollToBottom: {
    type: Function,
    default: defaults.onMenuScrollToBottom
  },

  openMenuOnFocus: {
    type: Boolean,
    default: defaults.openMenuOnFocus
  },

  openMenuOnClick: {
    type: Boolean,
    default: defaults.openMenuOnClick
  },

  placeholder: {
    type: String,
    default: defaults.placeholder
  },

  pageSize: {
    type: Number,
    default: defaults.pageSize
  },

  rtl: {
    type: Boolean,
    default: defaults.rtl
  },

  screenReaderStatus: {
    type: Function,
    default: defaults.screenReaderStatus
  },

  searchable: {
    type: Boolean,
    default: defaults.searchable
  },

  setValueOnBlur: {
    type: Boolean,
    default: defaults.setValueOnBlur
  },

  setValueOnPaste: {
    type: Boolean,
    default: defaults.setValueOnPaste
  },

  tailwind: {
    type: Boolean,
    default: false
  },

  tabIndex: {
    type: String,
    default: defaults.tabIndex
  },

  spacing: {
    type: Object,
    default: () => defaults.spacing
  },

  theme: {
    type: Object,
    default: () => defaults.theme
  },

  value: {
    type: [Object, Array],
    default: () => defaults.value
  },
};

export const creatableProps = {
  allowCreateWhileLoading: {
    type: Boolean,
    default: false
  },

  createOptionPosition: {
    type: String,
    default: 'last'
  },

  formatCreateLabel: {
    type: Function,
    default: defaults.formatCreateLabel
  },

  isValidNewOption: {
    type: Function,
    default: defaults.isValidNewOption
  },

  getNewOptionData: {
    type: Function,
    default: defaults.getNewOptionData
  },

  onCreateOption: {
    type: Function,
  },
};

export const asyncProps = {
  async: {
    type: Boolean,
    default: false
  },

  cacheOptions: {
    type: Boolean,
    default: true
  },

  defaultOptions: {
    type: [Array, Boolean],
  },

  loadOptions: {
    type: Function,
  },

  isLoading: {
    type: Boolean,
  },
};

export const commonProps = {
  select: {
    type: Object
  },
  state: {
    type: Object,
  },
  slots: {
    type: Object,
  }
};

export const selectCommonProps = {
  clearValue: {
    type: Function
  },
  getValue: {
    type: Function
  },
  getFocusedValue: {
    type: Function
  },
  getFocusedOption: {
    type: Function
  },
  getElementId: {
    type: Function
  },
  getThemeClass: {
    type: Function
  },
  getClass: {
    type: Function
  },
  getState: {
    type: Function
  },
  hasValue: {
    type: Boolean
  },
  multiple: {
    type: Boolean
  },
  rtl: {
    type: Boolean
  },
  options: {
    type: Array
  },
  selectOption: {
    type: Function
  },
  selectProps: {
    type: Object
  },
  setValue: {
    type: Function
  },
}

export default {...selectProps, ...creatableProps, ...asyncProps};
