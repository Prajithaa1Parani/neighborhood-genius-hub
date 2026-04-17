// ─── DSA: LEVENSHTEIN DISTANCE (DYNAMIC PROGRAMMING) ──────────────
// Computes minimum edit distance between two strings (insertions,
// deletions, substitutions). Used for typo-tolerant search:
// e.g. "kuburnetes" → matches "kubernetes" within 2 edits.
// Time: O(m · n)   Space: O(min(m, n)) using rolling row.
// ──────────────────────────────────────────────────────────────────

export function levenshtein(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  // Rolling DP row → O(min(m,n)) space
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,        // deletion
        curr[j - 1] + 1,    // insertion
        prev[j - 1] + cost  // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** Returns true if `query` fuzzily matches `text` within `maxDist` edits */
export function fuzzyMatch(text: string, query: string, maxDist = 2): boolean {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  // Slide query-sized window over text and compare via DP
  const winLen = q.length;
  for (let i = 0; i <= Math.max(0, t.length - winLen); i++) {
    if (levenshtein(t.slice(i, i + winLen), q) <= maxDist) return true;
  }
  return levenshtein(t, q) <= maxDist;
}
