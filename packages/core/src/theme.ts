import { CommonProps, Group, Option, Value } from "./types";

interface ControlProps extends CommonProps {
  focused: boolean;
  open: boolean;
}

interface MultipleValueProps extends CommonProps {
  value: Value;
  focused: boolean;
}

interface ClearIndicatorProps extends CommonProps {
  focused: boolean;
}

interface DropdownIndicatorProps extends CommonProps {
  focused: boolean;
}

interface MenuProps extends CommonProps {
  placement: 'top' | 'bottom';
  maxHeight: number;
}

interface GroupProps extends CommonProps {
  group: Group;
}

interface OptionProps extends CommonProps {
  option: Option;
  selected: boolean;
  focused: boolean;
}

export const theme = {
  container: 'relative',
  control: (props: ControlProps) => {
    return `flex flex-wrap items-center justify-between outline-none border border-solid bg-white border-gray-300 dark:bg-gray-950 dark:border-gray-700 rounded-md shadow-sm ${props.focused ? 'ring ring-gray-200 dark:ring-gray-700 ring-opacity-50 dark:ring-opacity-50' : ''}`;
  },
  valueContainer: 'grid flex-1 flex-wrap items-center overflow-hidden px-2 py-0.5',
  multipleValueContainer: 'flex flex-1 flex-wrap items-center overflow-hidden p-1 pl-1.5 pr-0 gap-1.5',
  placeholder: 'row-start-1 col-start-1 row-end-2 col-end-3',
  value: 'row-start-1 col-start-1 row-end-2 col-end-3 max-w-full mx-0.5 whitespace-pre text-ellipsis overflow-hidden',
  multipleValue: (props: MultipleValueProps) => {
    return `flex items-stretch content-center overflow-hidden rounded box-border bg-gray-300 dark:bg-gray-700 ${props.focused ? 'ring-1 ring-offset-0 ring-offset-black ring-gray-500 ring-inset' : ''}`;
  },
  multipleValueLabel: 'p-1 pl-2 text-ellipsis overflow-hidden whitespace-nowrap text-xs',
  multipleValueRemove: 'flex items-center px-1 rounded box-border border-0 bg-transparent opacity-50 hover:opacity-100 dark:fill-gray-300',
  inputContainer: 'inline-grid flex-auto row-start-1 col-start-1 row-end-2 col-end-3 h-full',
  input: 'w-full p-0 row-start-1 col-start-2 row-end-auto col-end-auto outline-none outline-0 border-0 ring-0 bg-transparent focus:outline-0 focus:ring-0',
  inputSizer: 'row-start-1 col-start-2 invisible whitespace-pre',
  indicators: 'flex items-center',
  loadingIndicator: 'flex items-center gap-1 p-2',
  loadingIndicatorDot: 'w-1.5 h-1.5 rounded-lg bg-gray-400 dark:bg-gray-200',
  loadingMessage: 'text-center text-gray-400 dark:text-gray-600',
  clearIndicator: (props: ClearIndicatorProps) => {
    return `flex items-center p-2 transition-opacity dark:fill-gray-200 ${props.focused ? ' opacity-50 hover:opacity-100' : ' opacity-20 hover:opacity-50'} focus-visible:opacity-50`;
  },
  indicatorSeparator: 'self-stretch w-px my-2 bg-gray-300 dark:bg-gray-700',
  dropdownIndicator: (props: DropdownIndicatorProps) => {
    return `flex items-center p-2 transition-opacity dark:fill-gray-200 ${props.focused ? ' opacity-50 hover:opacity-100' : ' opacity-20 hover:opacity-50'} focus-visible:opacity-50`;
  },
  menu: (props: MenuProps) => {
    return `absolute z-10 w-full my-2 py-1 overflow-auto border border-solid border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-lg ${props.placement === 'top' ? 'bottom-full' : 'top-full'}`;
  },
  noOptionsMessage: 'text-center text-gray-400 dark:text-gray-600',
  group: (props: GroupProps) => {
    return '';
  },
  groupLabel: (props: GroupProps) => {
    return `px-2 py-1 pb-0.5 text-xs uppercase text-gray-400 dark:text-gray-600`;
  },
  option: (props: OptionProps) => {
    return `px-2 py-1 border-0 ${!props.selected && props.focused ? 'bg-gray-100 dark:bg-gray-700' : ''} ${props.selected ? 'bg-blue-100 dark:bg-gray-600' : ''} ${props.option.disabled ? 'text-gray-300 dark:text-gray-600' : ''}`;
  },
};
