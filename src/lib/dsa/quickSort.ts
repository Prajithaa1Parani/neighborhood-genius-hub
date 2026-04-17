// ─── DSA: QUICKSORT (DIVIDE & CONQUER) ───────────────────────────
// Classic in-place quicksort using Lomuto partition. Used in the
// Market page to sort skills by rating, price, or distance.
// Avg time: O(n log n)   Worst: O(n²)   Space: O(log n) stack.
// ─────────────────────────────────────────────────────────────────

export function quickSort<T>(
  arr: T[],
  cmp: (a: T, b: T) => number
): T[] {
  const a = [...arr]; // non-mutating wrapper
  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (cmp(a[j], pivot) <= 0) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    const p = i + 1;
    sort(lo, p - 1);
    sort(p + 1, hi);
  };
  sort(0, a.length - 1);
  return a;
}
