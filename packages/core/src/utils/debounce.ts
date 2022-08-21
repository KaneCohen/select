import throttle, { ThrottleOptions, Throttler } from './throttle';

export default function debounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  { start = false, middle = false, once = false }: ThrottleOptions = {}
): Throttler<T> {
  return throttle(callback, wait, { start, middle, once });
}
