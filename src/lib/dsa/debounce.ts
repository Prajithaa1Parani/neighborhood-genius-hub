// ─── DSA: DEBOUNCING (TIMER QUEUE) ───────────────────────────────
// Coalesces rapid bursts of calls into a single trailing call after
// `wait` ms of silence. Used to limit Trie/fuzzy search recomputes
// while the user is typing in the Market search box.
// Time per call: O(1).
// ─────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 200
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Hook-style version returning a stable debounced value. */
import { useEffect, useState } from "react";
export function useDebouncedValue<T>(value: T, wait = 200): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(id);
  }, [value, wait]);
  return debounced;
}
