import { VNode } from "vue";
import Select from "@cohensive/select-core";
import { Option, SelectGroup, SelectOption, State } from "@cohensive/select-core/types";

export type CommonProps = {
  select: Select;
  state: State;
  slots: any;
}

export type ValueProps = {
  select: Select;
  state: State;
  slots: any;
  option: Option;
  id: string;
}

export type GroupProps = {
  slots: any;
  getClass: (name: string) => string;
  getThemeClass: (name: string, props?: {
      [name: string]: any;
    }) => string;
  formatGroupLabel: () => any;
  group: SelectGroup;
  children: VNode[];
  id: string;
  [name: string]: any;
}

export type OptionProps = {
  select: Select;
  state: State;
  option: SelectOption;
  selected: boolean;
  focused: boolean;
  id: string;
}
