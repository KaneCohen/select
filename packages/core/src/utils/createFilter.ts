import memoizeOne from 'memoize-one';
import stripDiacritics from './stripDiacritics';
import { Option } from '../types';

type Config = {
  ignoreCase?: boolean,
  ignoreAccents?: boolean,
  stringify?: (v: Object) => string,
  trim?: boolean,
  matchFrom?: 'any' | 'start',
};

const memoizedStripDiacriticsForInput = memoizeOne(stripDiacritics);

const trimString = (str: string) => str.replace(/^\s+|\s+$/g, '');
const defaultStringify = (option: Option) => `${option.label} ${option.value}`;

export default (config?: Config) => (
  option: Option,
  rawInput: string
): boolean => {
  const { ignoreCase, ignoreAccents, stringify, trim, matchFrom } = {
    ignoreCase: true,
    stringify: defaultStringify,
    trim: true,
    matchFrom: 'any',
    ...config,
  };
  let input = trim ? trimString(rawInput) : rawInput;
  let candidate = trim ? trimString(stringify(option)) : stringify(option);

  if (ignoreCase) {
    input = input.toLowerCase();
    candidate = candidate.toLowerCase();
  }

  if (ignoreAccents) {
    input = memoizedStripDiacriticsForInput(input);
    candidate = stripDiacritics(candidate);
  }

  return matchFrom === 'start'
    ? candidate.slice(0, input.length) === input
    : candidate.indexOf(input) > -1;
};
