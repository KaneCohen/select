export interface ThrottleOptions {
  /**
   * Fire immediately on the first call.
   */
  start?: boolean;
  /**
   * Fire as soon as `wait` has passed.
   */
  middle?: boolean;
  /**
   * Fire as soon as `wait` has reached.
   */
  end?: boolean;
  /**
   * Cancel after the first successful call.
   */
  once?: boolean;
}

export interface Throttler<T extends unknown[]> {
  (...args: T): void;
  cancel(): void;
}

export default function throttle<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  {
    start = true,
    middle = true,
    end = true,
    once = false,
  }: ThrottleOptions = {}
): Throttler<T> {
  let last = 0;
  let timer: ReturnType<typeof setTimeout>;
  let cancelled = false;
  function fn(this: unknown, ...args: T) {
    if (cancelled) return;
    const delta = Date.now() - last;
    last = Date.now();
    if (start) {
      start = false;
      callback.apply(this, args);
      if (once) fn.cancel();
    } else if ((middle && delta < wait) || !middle) {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          last = Date.now();
          callback.apply(this, args);
          if (once) fn.cancel();
        },
        !middle ? wait : wait - delta
      );
    } else if (end && delta >= wait) {
      clearTimeout(timer);
      last = Date.now();
      callback.apply(this, args);
      if (once) fn.cancel();
    }
  }
  fn.cancel = () => {
    clearTimeout(timer);
    cancelled = true;
  };
  return fn;
}
