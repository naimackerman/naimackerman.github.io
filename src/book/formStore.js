import { useCallback, useSyncExternalStore } from "react";

// A tiny in-memory store for state that must outlive the page it was typed on.
// Spreads unmount on every page turn (and are drawn twice mid-turn), so form
// drafts and the Turnstile pass live here instead of in component state. It
// lasts for the visit and is shared by the book and the profile view.

const data = new Map();
const subs = new Set();

const subscribe = (cb) => {
  subs.add(cb);
  return () => subs.delete(cb);
};

export function getStored(key, initial) {
  return data.has(key) ? data.get(key) : initial;
}

export function setStored(key, value) {
  const next = typeof value === "function" ? value(data.get(key)) : value;
  if (data.get(key) === next) return;
  data.set(key, next);
  subs.forEach((cb) => cb());
}

// Like useState, but shared and kept across unmounts. `initial` should be a
// primitive (or a stable reference) so the snapshot stays referentially stable.
export function useStored(key, initial) {
  const value = useSyncExternalStore(subscribe, () => getStored(key, initial));
  const set = useCallback((v) => setStored(key, typeof v === "function" ? (prev) => v(prev ?? initial) : v), [key, initial]);
  return [value, set];
}
