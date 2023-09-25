import memoize from "lodash/memoize";
import throttle from "lodash/throttle";

/**
 * Throttle a function and memoize the result
 *
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @param resolver The function to resolve the memoization cache key
 * @returns A memoized version of the throttled function
 */
export const memoizeThrottle = <T extends (...args: any[]) => any>(
  func: T,
  wait = 0,
  options?: Parameters<typeof throttle<T>>[2],
  resolver?: Parameters<
    typeof memoize<(...args: Parameters<T>) => ReturnType<typeof throttle<T>>>
  >[1],
) => {
  const mem = memoize<
    (...args: Parameters<T>) => ReturnType<typeof throttle<T>>
  >(() => throttle<T>(func, wait, options), resolver);
  return (...args: Parameters<T>) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    mem(...args)(...args) as unknown as ReturnType<T>;
};

/**
 * Splits an array into smaller arrays of a specified chunk size
 *
 * @param arr The array to chunk
 * @param chunkSize The size of each chunk
 * @returns An array of chunks
 */
export const chunkArray = <T>(arr: T[], chunkSize: number) => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
};
