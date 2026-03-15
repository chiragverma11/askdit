import { useSyncExternalStore } from "react";

let isMounted = false;
const subscribe = (callback: () => void) => {
  if (!isMounted) {
    isMounted = true;
    callback();
  }
  return () => {};
};
const getSnapshot = () => isMounted;
const getServerSnapshot = () => false;

export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
