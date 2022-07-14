import { VNode } from "vue";
import Select from "@cohensive/select-core";
import { Group, Option, SelectOption, State } from "@cohensive/select-core/types";

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
  select: Select;
  slots: any;
  state: State;
  group: Group;
  children: VNode[];
}

export type OptionProps = {
  select: Select;
  state: State;
  option: SelectOption;
  selected: boolean;
  focused: boolean;
  id: string;
}
