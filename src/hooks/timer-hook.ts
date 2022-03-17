import { useCallback, useEffect, useRef } from 'react';

export const useTimeout = (): [
  (callback: () => void, delay: number) => void,
  () => void
] => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const set = useCallback(
    (callback: () => void, delay: number) => {
      clear();
      timeoutRef.current = setTimeout(callback, delay);
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return [set, clear];
};

export const useInterval = (): [
  (callback: () => void, delay: number, initialLoad?: boolean) => void,
  () => void
] => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const clear = useCallback(() => {
    intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  const set = useCallback(
    (callback, delay, initialLoad = false) => {
      initialLoad && callback();

      clear();
      intervalRef.current = setInterval(callback, delay);
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return [set, clear];
};
