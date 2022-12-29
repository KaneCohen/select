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
    return `flex flex-wrap items-center justify-between outline-0 border border-solid border-gray-300 rounded-md shadow-sm ${props.focused ? 'ring ring-gray-200 ring-opacity-50' : ''}`;
  },
  valueContainer: 'grid flex-1 flex-wrap items-center overflow-hidden px-2 py-0.5',
  multipleValueContainer: 'flex flex-1 flex-wrap items-center overflow-hidden px-2 py-0.5',
  placeholder: 'row-start-1 col-start-1 row-end-2 col-end-3',
  value: 'row-start-1 col-start-1 row-end-2 col-end-3 max-w-full whitespace-pre text-ellipsis overflow-hidden',
  multipleValue: (props: MultipleValueProps) => {
    return `flex items-stretch content-center m-0.5 overflow-hidden rounded box-border bg-gray-300 ${props.focused ? 'ring-1 ring-gray-500 ring-inset' : ''}`;
  },
  multipleValueLabel: 'p-1 pl-2 text-ellipsis overflow-hidden whitespace-nowrap text-xs',
  multipleValueRemove: 'flex items-center px-1 rounded box-border opacity-50 hover:opacity-100',
  inputContainer: 'inline-grid flex-auto row-start-1 col-start-1 row-end-2 col-end-3 pl-1',
  input: 'w-full p-0 row-start-1 col-start-2 row-end-auto col-end-auto outline-0 border-0 ring-0 bg-transparent focus:outline-0 focus:ring-0',
  inputSizer: 'row-start-1 col-start-2 invisible whitespace-pre',
  indicators: 'flex items-center',
  loadingIndicator: 'flex gap-1 p-2',
  loadingIndicatorDot: 'w-1.5 h-1.5 rounded-lg bg-gray-400',
  clearIndicator: (props: ClearIndicatorProps) => {
    return `p-2 transition-opacity ${props.focused ? ' opacity-50 hover:opacity-100' : ' opacity-20 hover:opacity-50'}`;
  },
  indicatorSeparator: 'self-stretch w-px my-2 bg-gray-300',
  dropdownIndicator: (props: DropdownIndicatorProps) => {
    return `p-2 transition-opacity ${props.focused ? ' opacity-50 hover:opacity-100' : ' opacity-20 hover:opacity-50'}`;
  },
  menu: (props: MenuProps) => {
    return `absolute z-10 w-full my-2 py-1 overflow-auto border border-solid border-gray-300 bg-white rounded-md shadow-lg ${props.placement === 'top' ? 'bottom-full' : 'top-full'}`;
  },
  noOptionsMessage: 'text-center text-gray-400',
  group: (props: GroupProps) => {
    return '';
  },
  groupLabel: (props: GroupProps) => {
    return `px-2 py-1 pb-0.5 text-xs uppercase text-gray-400`;
  },
  option: (props: OptionProps) => {
    return `px-2 py-1 border-0 ${!props.selected && props.focused ? 'bg-gray-100' : ''} ${props.selected ? 'bg-blue-100' : ''} ${props.option.disabled ? 'text-gray-300' : ''}`;
  },
};
