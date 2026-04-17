// ─── DSA: TRIE (PREFIX TREE) ─────────────────────────────────────
// Used for fast prefix-based search of skill titles & tags in the
// Market page. Insert: O(L), Search by prefix: O(L + k) where L is
// pattern length and k is number of matched words.
// Space: O(N · L) for N words of average length L.
// ─────────────────────────────────────────────────────────────────

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
  // Store ids of skills whose title/tag passes through this node
  ids: Set<string> = new Set();
}

export class Trie {
  root = new TrieNode();

  /** Insert a word and associate it with a payload id. O(L) */
  insert(word: string, id: string): void {
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      node.ids.add(id);
    }
    node.isEnd = true;
  }

  /** Return ids of all words that share the given prefix. O(L + k) */
  searchPrefix(prefix: string): Set<string> {
    let node = this.root;
    for (const ch of prefix.toLowerCase()) {
      const next = node.children.get(ch);
      if (!next) return new Set();
      node = next;
    }
    return node.ids;
  }
}
