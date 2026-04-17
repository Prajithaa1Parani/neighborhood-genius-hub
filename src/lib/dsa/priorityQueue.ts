// ─── DSA: MIN-HEAP / PRIORITY QUEUE ──────────────────────────────
// Binary min-heap stored in an array. Used to order notifications
// by combined (priority + recency) score so the most important one
// surfaces first. push: O(log n), pop: O(log n), peek: O(1).
// ─────────────────────────────────────────────────────────────────

export class PriorityQueue<T> {
  private heap: { item: T; score: number }[] = [];

  size(): number { return this.heap.length; }

  push(item: T, score: number): void {
    this.heap.push({ item, score });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (!this.heap.length) return undefined;
    const top = this.heap[0].item;
    const last = this.heap.pop()!;
    if (this.heap.length) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  /** Drain the heap into a sorted array (lowest score first). O(n log n) */
  drain(): T[] {
    const out: T[] = [];
    while (this.size()) out.push(this.pop()!);
    return out;
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].score <= this.heap[i].score) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number) {
    const n = this.heap.length;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.heap[l].score < this.heap[smallest].score) smallest = l;
      if (r < n && this.heap[r].score < this.heap[smallest].score) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}
