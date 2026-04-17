// ─── DSA: BINARY SEARCH ──────────────────────────────────────────
// Standard binary search and lower/upper bound helpers used to
// find the price-range window inside an array sorted by price.
// Time: O(log n)   Space: O(1).
// ─────────────────────────────────────────────────────────────────

/** First index where arr[i] >= target (lower_bound). O(log n) */
export function lowerBound<T>(arr: T[], target: number, key: (x: T) => number): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (key(arr[mid]) < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** First index where arr[i] > target (upper_bound). O(log n) */
export function upperBound<T>(arr: T[], target: number, key: (x: T) => number): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (key(arr[mid]) <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Slice items whose key falls in [min, max] from a sorted array. */
export function rangeQuery<T>(sorted: T[], min: number, max: number, key: (x: T) => number): T[] {
  const l = lowerBound(sorted, min, key);
  const r = upperBound(sorted, max, key);
  return sorted.slice(l, r);
}
