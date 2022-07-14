import {
  Accessors,
  Group,
  Option,
  Options,
  OptionsOrGroups,
  Props,
} from './types';

export const getGroupLabel = (group: Group): string => group.label as string;

export const getOptionLabel = (option: Option): string => option.label as string;

export const getOptionValue = (option: Option): string => option.value as string;

export const isOptionDisabled = (option: Option): boolean => !!option.disabled;

export const formatCreateLabel = (inputValue: string): string => `Create "${inputValue}"`;

export const compareOption = <Option>(
  inputValue: string = '',
  option: Option,
  accessors: Accessors<Option>
): boolean => {
  const candidate = String(inputValue).toLocaleLowerCase();
  const optionValue = String(accessors.getOptionValue(option)).toLocaleLowerCase();
  const optionLabel = String(accessors.getOptionLabel(option)).toLocaleLowerCase();
  return optionValue === candidate || optionLabel === candidate;
};

export const isValidNewOption = (
  inputValue: string,
  value: Options,
  options: Options,
  accessors: Accessors<Option>
) =>
  !(
    !inputValue ||
    value.some((option) => compareOption(inputValue, option, accessors)) ||
    options.some((option) => compareOption(inputValue, option, accessors))
  );

export const getNewOptionData = (inputValue: string, optionLabel: string) => ({
  label: optionLabel,
  value: inputValue,
  disabled: false,
  __isNew__: true,
});

export const loadOptions = (
  inputValue: string,
  props: Props,
  controller: AbortController
): void | Promise<Readonly<OptionsOrGroups>>  => {
  const options = props.asyncOptions;
  let { url, queryParam, params } = options;
  let requestOptions = Object.assign({}, options.requestOptions);

  if (!url) {
    throw new Error('Async `url` option is not set.');
  };

  const fetchUrl = new URL(url);

  fetchUrl.search = new URLSearchParams({
    [queryParam]: inputValue,
    ...params
  }).toString();

  return fetch(url, requestOptions)
    .then(response => response.json());
};
