// ─── DSA: GRAPH + BFS (BREADTH-FIRST SEARCH) ─────────────────────
// Builds a bipartite skill-similarity graph (skills ↔ mentors) and
// runs BFS from the user's `skillsNeeded` to find the most relevant
// mentors (shortest path = strongest match).
// Time: O(V + E)   Space: O(V).
// ─────────────────────────────────────────────────────────────────

export class Graph<N> {
  private adj = new Map<N, Set<N>>();

  addEdge(a: N, b: N): void {
    if (!this.adj.has(a)) this.adj.set(a, new Set());
    if (!this.adj.has(b)) this.adj.set(b, new Set());
    this.adj.get(a)!.add(b);
    this.adj.get(b)!.add(a);
  }

  /** BFS — returns map of node → shortest distance from any source. */
  bfsFromMany(sources: N[]): Map<N, number> {
    const dist = new Map<N, number>();
    const queue: N[] = []; // FIFO
    for (const s of sources) {
      if (this.adj.has(s)) { dist.set(s, 0); queue.push(s); }
    }
    let head = 0;
    while (head < queue.length) {
      const node = queue[head++];
      const d = dist.get(node)!;
      for (const nb of this.adj.get(node) ?? []) {
        if (!dist.has(nb)) {
          dist.set(nb, d + 1);
          queue.push(nb);
        }
      }
    }
    return dist;
  }
}
