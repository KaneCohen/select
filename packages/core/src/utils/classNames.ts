import { ClassNamesState } from "../types";

function applyPrefixToName(prefix: string, name: string): string {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}

export default function classNames(
  prefix?: string | null,
  state?: ClassNamesState,
  className?: string
): string {
  const arr = [className];

  if (state && prefix) {
    for (let key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push(`${applyPrefixToName(prefix, key)}`);
      }
    }
  }

  return arr
    .filter((i) => i)
    .map((i) => String(i).trim())
    .join(' ');
}
