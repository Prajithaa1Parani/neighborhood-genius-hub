# 🧠 DSA Concepts in The Exchange — Hyperlocal Skill Exchange

This document details every **Data Structure** and **Algorithm** used throughout the project, with code references, explanations, and time/space complexity analysis.

---

## Table of Contents

1. [Hash Map (Dictionary / Object Map)](#1-hash-map-dictionary--object-map)
2. [Arrays & Dynamic Arrays](#2-arrays--dynamic-arrays)
3. [Linear Search](#3-linear-search)
4. [String Matching & Pattern Search](#4-string-matching--pattern-search)
5. [Filtering Algorithm (Multi-Criteria)](#5-filtering-algorithm-multi-criteria)
6. [Queue (FIFO — Message Ordering)](#6-queue-fifo--message-ordering)
7. [State Machine (Finite Automaton)](#7-state-machine-finite-automaton)
8. [Tree Structure (Component Tree / DOM Tree)](#8-tree-structure-component-tree--dom-tree)
9. [Graph Concepts (Social Network)](#9-graph-concepts-social-network)
10. [Streaming / Buffered Parsing (SSE Parser)](#10-streaming--buffered-parsing-sse-parser)
11. [Memoization & Caching](#11-memoization--caching)
12. [Array Slicing (Pagination / Windowing)](#12-array-slicing-pagination--windowing)

---

## 1. Hash Map (Dictionary / Object Map)

### Concept
A **Hash Map** stores key-value pairs with O(1) average lookup, insertion, and deletion. In JavaScript/TypeScript, plain objects `{}` and `Record<K, V>` types serve as hash maps.

### Usage in Project

#### a) Chat Messages Storage
```typescript
// src/routes/chat.tsx
const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(chatMessages);
```
- **Key**: Conversation ID (`string`)
- **Value**: Array of messages (`ChatMessage[]`)
- **Operation**: O(1) lookup of messages by conversation ID
- **Why**: Allows instant access to any conversation's messages without iterating through all messages

#### b) Character Profiles Lookup
```typescript
// supabase/functions/chat-reply/index.ts
const CHARACTER_PROFILES: Record<string, string> = {
  "Elena Vance": `You are Elena Vance, a passionate urban gardener...`,
  "David Kim": `You are David Kim, a senior software developer...`,
  // ...
};

const systemPrompt = CHARACTER_PROFILES[characterName];
```
- **Operation**: O(1) lookup of AI system prompt by character name
- **Why**: Instant retrieval of the correct persona without searching through an array

#### c) Mock Data — Chat Messages by Conversation
```typescript
// src/lib/mock-data.ts
export const chatMessages: Record<string, ChatMessage[]> = {
  "c1": [{ id: "m1", senderId: "u2", text: "...", timestamp: "..." }],
  "c2": [{ id: "m3", senderId: "u2", text: "...", timestamp: "..." }],
};
```

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| Lookup by key | O(1) avg | O(n) |
| Insert | O(1) avg | O(1) |
| Delete | O(1) avg | O(1) |

---

## 2. Arrays & Dynamic Arrays

### Concept
**Arrays** are contiguous collections of elements, accessed by index in O(1). Dynamic arrays (JavaScript arrays) automatically resize, supporting push/pop in amortized O(1).

### Usage in Project

#### a) Skills Collection
```typescript
// src/lib/mock-data.ts
export const allSkills: Skill[] = [
  { id: "s1", title: "Vertical Hydroponics", category: "Gardening", ... },
  { id: "s2", title: "React Components", category: "Technology", ... },
  // ...
];
```
- Used for: Marketplace listing, search, filtering, and iteration

#### b) Conversations List
```typescript
export const conversations: ChatConversation[] = [
  { id: "c1", user: { name: "Elena Vance", ... }, lastMessage: "...", unread: 2 },
  // ...
];
```

#### c) Reviews Collection
```typescript
export const reviews: Review[] = [
  { id: "r1", author: "Elena V.", rating: 5, text: "...", date: "..." },
  // ...
];
```

#### d) Active Exchanges
```typescript
export const activeExchanges: Exchange[] = [
  { id: "e1", skill: "Hydroponics Setup", partner: "Elena V.", progress: 65 },
  // ...
];
```

### Complexity
| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Push (append) | O(1) amortized |
| Search (unsorted) | O(n) |
| `.map()` / `.filter()` | O(n) |

---

## 3. Linear Search

### Concept
**Linear Search** traverses each element in a collection sequentially until the target is found or the collection is exhausted. Time complexity: O(n).

### Usage in Project

#### a) Skill Search in Market
```typescript
// src/routes/market.tsx
const filtered = allSkills.filter(s => {
  const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase())
    || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
  const matchesCategory = activeCategory === "All Skills" || s.category === activeCategory;
  return matchesSearch && matchesCategory;
});
```
- Iterates through every skill, checking title and tags
- **Time**: O(n × m) where n = skills, m = avg tags per skill

#### b) Message Update by ID
```typescript
// src/routes/chat.tsx (streaming reply update)
setMessages(prev => ({
  ...prev,
  [convoId]: prev[convoId].map(m =>
    m.id === replyId ? { ...m, text: replyText } : m
  ),
}));
```
- Linear scan through messages to find and update the streaming reply
- **Time**: O(n) where n = messages in conversation

### Complexity
| Scenario | Time |
|----------|------|
| Best case (first element) | O(1) |
| Worst case (last/not found) | O(n) |
| Average case | O(n/2) → O(n) |

---

## 4. String Matching & Pattern Search

### Concept
**String matching** finds occurrences of a pattern within a larger text. JavaScript's `.includes()` uses an optimized substring search internally.

### Usage in Project

#### a) Skill Title Search
```typescript
s.title.toLowerCase().includes(search.toLowerCase())
```
- Case-insensitive substring matching
- Converts both strings to lowercase before comparison

#### b) Tag Matching with `.some()`
```typescript
s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
```
- Combines linear search (`.some()`) with string matching (`.includes()`)
- Short-circuits: returns `true` on first match

#### c) SSE Stream Line Parsing
```typescript
// src/routes/chat.tsx
if (line.startsWith("data: ")) continue;
const jsonStr = line.slice(6).trim();
if (jsonStr === "[DONE]") { onDone(); return; }
```
- Prefix matching with `.startsWith()`
- String slicing to extract payload

### Complexity
| Operation | Time |
|-----------|------|
| `.includes()` | O(n × m) worst case |
| `.toLowerCase()` | O(n) |
| `.startsWith()` | O(m) where m = prefix length |
| `.slice()` | O(k) where k = slice length |

---

## 5. Filtering Algorithm (Multi-Criteria)

### Concept
**Multi-criteria filtering** applies multiple predicates simultaneously to narrow down a dataset. This is a composition of filter functions.

### Usage in Project

```typescript
// src/routes/market.tsx — Two-criteria filter
const filtered = allSkills.filter(s => {
  // Criterion 1: Text search (title OR tags)
  const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase())
    || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

  // Criterion 2: Category filter
  const matchesCategory = activeCategory === "All Skills" || s.category === activeCategory;

  // Boolean AND — both must be true
  return matchesSearch && matchesCategory;
});
```

### Algorithm Breakdown
```
INPUT: allSkills[], searchQuery, selectedCategory
OUTPUT: filteredSkills[]

FOR each skill in allSkills:
    matchesSearch ← skill.title CONTAINS searchQuery
                    OR ANY tag in skill.tags CONTAINS searchQuery
    matchesCategory ← selectedCategory == "All Skills"
                      OR skill.category == selectedCategory
    IF matchesSearch AND matchesCategory:
        ADD skill to result
RETURN result
```

### Complexity
- **Time**: O(n × (t + m)) where n = skills, t = avg tags, m = search string length
- **Space**: O(k) where k = number of matching results

---

## 6. Queue (FIFO — Message Ordering)

### Concept
A **Queue** follows First-In-First-Out (FIFO) ordering. New elements are added at the end and processed from the front.

### Usage in Project

#### Chat Message List
```typescript
// Messages are stored in chronological order (FIFO)
const convoMessages = messages[selectedConvo.id] || [];

// New messages appended to end (enqueue)
setMessages(prev => ({
  ...prev,
  [convoId]: [...(prev[convoId] || []), userMsg],
}));
```

- Messages are **always appended** to the end of the array (enqueue operation)
- Messages are **rendered in order** from first to last (dequeue/process order)
- The chat scrolls to the bottom (most recent) automatically
- This maintains temporal ordering — a fundamental queue property

#### Rendering (Processing Order)
```typescript
{convoMessages.map(msg => (
  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
    {/* Render each message in FIFO order */}
  </div>
))}
```

### Complexity
| Operation | Time |
|-----------|------|
| Enqueue (push to end) | O(1) amortized |
| Process all (render) | O(n) |

---

## 7. State Machine (Finite Automaton)

### Concept
A **Finite State Machine (FSM)** has a finite number of states, transitions between them based on inputs, and produces outputs based on the current state.

### Usage in Project

#### a) Authentication State Machine
```
States: { UNAUTHENTICATED, AUTHENTICATED }
Transitions:
  UNAUTHENTICATED → login(valid_credentials) → AUTHENTICATED
  AUTHENTICATED → logout() → UNAUTHENTICATED
  UNAUTHENTICATED → login(invalid_credentials) → UNAUTHENTICATED (with error)
```

```typescript
// src/lib/auth-context.tsx
const [user, setUser] = useState<User | null>(null);  // null = UNAUTHENTICATED

const login = (email, password) => {
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    setUser(currentUser);           // Transition → AUTHENTICATED
    return { success: true };
  }
  return { success: false, error: "Invalid email or password" };  // Stay UNAUTHENTICATED
};

const logout = () => {
  setUser(null);                     // Transition → UNAUTHENTICATED
};
```

#### b) Chat Page View State Machine
```
States: { CONVERSATION_LIST, CONVERSATION_DETAIL }
Transitions:
  CONVERSATION_LIST → selectConvo(convo) → CONVERSATION_DETAIL
  CONVERSATION_DETAIL → backButton() → CONVERSATION_LIST
```

```typescript
// src/routes/chat.tsx
const [selectedConvo, setSelectedConvo] = useState<ChatConversation | null>(null);

// null → ConversationList view, non-null → ConversationDetail view
if (selectedConvo) {
  return <ConversationDetailView />;
}
return <ConversationListView />;
```

#### c) Chat Typing State Machine
```
States: { IDLE, TYPING }
Transitions:
  IDLE → sendMessage() → TYPING
  TYPING → onDone() → IDLE
  TYPING → onError() → IDLE
```

### State Diagram (Auth)
```
                  login(valid)
    ┌──────────────────────────────────┐
    │                                  ▼
┌───────────────┐              ┌──────────────┐
│UNAUTHENTICATED│              │ AUTHENTICATED │
└───────────────┘              └──────────────┘
    ▲                                  │
    │           logout()               │
    └──────────────────────────────────┘
```

---

## 8. Tree Structure (Component Tree / DOM Tree)

### Concept
A **Tree** is a hierarchical data structure with a root node and child subtrees. React's component hierarchy forms a tree, and the Virtual DOM is a tree diffing algorithm.

### Usage in Project

#### Component Tree
```
__root.tsx (Root)
├── AuthProvider (Context Provider)
│   ├── index.tsx (Redirect Logic)
│   ├── login.tsx
│   │   └── LoginForm
│   ├── dashboard.tsx
│   │   ├── AppHeader
│   │   ├── StatsCards
│   │   ├── ActiveExchanges
│   │   ├── RecommendedSkills
│   │   └── BottomNav
│   ├── market.tsx
│   │   ├── AppHeader
│   │   ├── SearchBar
│   │   ├── CategoryFilter
│   │   ├── SkillCards[]
│   │   └── BottomNav
│   ├── chat.tsx
│   │   ├── ConversationList
│   │   │   └── ConversationItem[]
│   │   └── ConversationDetail
│   │       ├── ChatHeader
│   │       ├── MessageList
│   │       │   └── MessageBubble[]
│   │       └── InputBar
│   └── profile.tsx
│       ├── AppHeader
│       ├── ProfileHeader
│       ├── SkillsList
│       ├── ReviewsList
│       └── BottomNav
```

#### React Virtual DOM — Tree Diffing
- React uses a **tree reconciliation algorithm** (O(n) heuristic) to update only changed nodes
- The `key` prop in `.map()` renders helps React's diffing algorithm identify moved/changed nodes:
```typescript
{convoMessages.map(msg => (
  <div key={msg.id}>  {/* Key enables efficient tree diffing */}
```

### Complexity
| Operation | Time |
|-----------|------|
| Tree traversal (render) | O(n) |
| Virtual DOM diff | O(n) heuristic |
| Targeted update | O(log n) to O(n) |

---

## 9. Graph Concepts (Social Network)

### Concept
A **Graph** consists of vertices (nodes) and edges (connections). Social networks are naturally modeled as graphs.

### Usage in Project

#### User Skill Exchange Network (Implicit Graph)
```
Vertices: Users (Marcus, Elena, David, Priya, Sarah, Jean Pierre)
Edges: Skill Exchange relationships

    Marcus ────── Elena (Hydroponics ↔ Photography)
       │
       ├──────── David (React ↔ Python)
       │
       ├──────── Priya (Thai Cuisine ↔ Baking)
       │
       ├──────── Sarah (UI/UX ↔ Motion Design)
       │
       └──────── Jean Pierre (Guitar ↔ Pasta Making)
```

#### Data Representation (Adjacency List via Conversations)
```typescript
// Each conversation represents an edge in the social graph
export const conversations: ChatConversation[] = [
  { id: "c1", user: { name: "Elena Vance" } },   // Edge: Marcus → Elena
  { id: "c2", user: { name: "David Kim" } },      // Edge: Marcus → David
  { id: "c3", user: { name: "Priya Nair" } },     // Edge: Marcus → Priya
  // ...
];

// Active exchanges represent weighted edges (with progress)
export const activeExchanges: Exchange[] = [
  { partner: "Elena V.", progress: 65 },  // Edge weight = progress
  { partner: "David K.", progress: 40 },
];
```

### Graph Properties
- **Type**: Undirected (skill exchange is mutual)
- **Weighted**: Yes (exchange progress as weight)
- **Sparse**: Each user connects to a few neighbors, not all

---

## 10. Streaming / Buffered Parsing (SSE Parser)

### Concept
**Buffered stream parsing** reads data incrementally, accumulating a buffer and extracting complete tokens (lines/messages) as they become available. This is crucial for real-time streaming.

### Usage in Project

```typescript
// src/routes/chat.tsx — SSE Stream Parser
const reader = resp.body.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // Accumulate bytes into buffer
  buffer += decoder.decode(value, { stream: true });

  // Extract complete lines (delimited by \n)
  let newlineIdx: number;
  while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
    let line = buffer.slice(0, newlineIdx);       // Extract line
    buffer = buffer.slice(newlineIdx + 1);         // Remove from buffer

    if (line.endsWith("\r")) line = line.slice(0, -1);  // Handle \r\n
    if (!line.startsWith("data: ")) continue;            // Filter SSE prefix

    const jsonStr = line.slice(6).trim();
    if (jsonStr === "[DONE]") { onDone(); return; }

    const parsed = JSON.parse(jsonStr);                  // Parse JSON token
    const content = parsed.choices?.[0]?.delta?.content;
    if (content) onDelta(content);                       // Emit delta
  }
}
```

### Algorithm: Line-Delimited Buffer Parser
```
INITIALIZE buffer ← ""
LOOP:
    chunk ← READ from stream
    IF stream ended: BREAK
    buffer ← buffer + DECODE(chunk)

    WHILE buffer CONTAINS "\n":
        line ← buffer[0 .. indexOf("\n")]
        buffer ← buffer[indexOf("\n")+1 .. end]
        PROCESS(line)
```

### Complexity
- **Time**: O(n) where n = total bytes received
- **Space**: O(b) where b = max buffer size between newlines

---

## 11. Memoization & Caching

### Concept
**Memoization** caches the results of function calls to avoid redundant computation. React's `useCallback` and `useMemo` implement this pattern.

### Usage in Project

```typescript
// src/routes/chat.tsx — Memoized scroll function
const scrollToBottom = useCallback(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, []);  // Empty deps = created once, reused forever

// src/lib/auth-context.tsx — Memoized auth functions
const login = useCallback((email: string, password: string) => {
  // ...
}, []);

const logout = useCallback(() => {
  // ...
}, []);
```

- `useCallback` returns the **same function reference** across re-renders
- Prevents unnecessary re-renders of child components that receive these functions as props
- Equivalent to maintaining a **cache** of function references

### Complexity
- Without memoization: O(1) per render (but causes child re-renders)
- With memoization: O(1) per render + reference equality check

---

## 12. Array Slicing (Pagination / Windowing)

### Concept
**Array slicing** extracts a contiguous subset from an array. Used for pagination, limiting displayed results, and creating views of data.

### Usage in Project

```typescript
// src/routes/dashboard.tsx — Show only first 3 recommended skills
const recommendedSkills = allSkills.slice(0, 3);
```

- `slice(0, 3)` creates a **window** of the first 3 elements
- Original array is unchanged (non-destructive)
- Simulates **pagination** (page 1, size 3)

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| `.slice(start, end)` | O(k) where k = end - start | O(k) |

---

## Summary Table

| # | DSA Concept | Where Used | Complexity |
|---|------------|------------|------------|
| 1 | **Hash Map** | Chat messages by convo ID, Character profiles | O(1) lookup |
| 2 | **Arrays** | Skills, conversations, reviews, exchanges | O(1) access, O(n) iterate |
| 3 | **Linear Search** | Message update by ID, skill search | O(n) |
| 4 | **String Matching** | Skill title/tag search, SSE parsing | O(n×m) |
| 5 | **Multi-Criteria Filter** | Market search + category filter | O(n×(t+m)) |
| 6 | **Queue (FIFO)** | Chat message ordering | O(1) enqueue |
| 7 | **State Machine** | Auth flow, chat view toggle, typing state | Finite states |
| 8 | **Tree** | React component hierarchy, Virtual DOM | O(n) diff |
| 9 | **Graph** | User skill exchange network | Adjacency list |
| 10 | **Buffer Parsing** | SSE stream parser for AI chat | O(n) total |
| 11 | **Memoization** | useCallback for scroll, auth functions | O(1) cached |
| 12 | **Array Slicing** | Recommended skills (first 3) | O(k) |

---

## Conclusion

This project demonstrates that **DSA concepts are not just theoretical** — they are the foundation of every real-world application. From hash maps powering instant message lookups, to state machines governing authentication flows, to streaming parsers enabling real-time AI chat, every feature relies on fundamental data structures and algorithms.

The combination of these concepts creates a performant, responsive, and scalable skill exchange platform that handles real-time data efficiently.
