import { Options, Value } from "../types";

export default function cleanValue(value: Value): Options {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'object' && value !== null) return [value];
  return [];
}
