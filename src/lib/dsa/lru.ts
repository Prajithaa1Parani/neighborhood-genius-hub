// ─── DSA: LRU CACHE (HASHMAP + DOUBLY LINKED LIST) ───────────────
// Caches recently viewed mentor profiles for O(1) get/put.
// On capacity overflow, the least-recently-used entry is evicted.
// Implemented using JavaScript's Map which preserves insertion
// order — re-inserting an existing key moves it to the end (MRU).
// ─────────────────────────────────────────────────────────────────

export class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number = 5) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key)!;
    // Re-insert to mark as most-recently-used
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      // First key in iteration order is the LRU one
      const lruKey = this.map.keys().next().value as K;
      this.map.delete(lruKey);
    }
  }

  keys(): K[] { return Array.from(this.map.keys()); }
  size(): number { return this.map.size; }
}
