# Hyperlocal Skill Exchange Platform — DSA Documentation

## Data Structures Used

### 1. Trie *(for Skill Search with Autocomplete)*

**Where it is used:** Skill Market search bar — "Search (try a typo: kuburnetes)..."

**What it does:**
- Stores all skill names character by character in a tree
- Each node = one letter
- Skills sharing the same starting letters share the same path
- Enables fast autocomplete and typo-tolerant search

**How it works (simple explanation):**
- When user types "Rea", the Trie traverses R → e → a and returns all skills starting with "Rea" like "React", "React Native"
- For typos like "kuburnetes", Levenshtein distance checks how many letter changes are needed and still returns "kubernetes"

**Time Complexity:**
- Insert a skill: O(m) where m = length of skill name
- Search a skill: O(m)
- Much faster than checking every skill one by one (which would be O(n))

**Why Trie and not simple array search?**
- Array search would check every skill name from start to finish — O(n)
- Trie goes directly to matching prefix — O(m), independent of how many skills exist

---

### 2. Array *(for storing Skill Listings)*

**Where it is used:** Skill Market — the list of 12 skills shown on screen

**What it does:**
- All skill posts are stored in an ordered array
- Quicksort is applied on this array to sort by Best Match, Price, Rating

**How it works:**
- Each element in the array is one skill listing (title, price, level, category)
- When user selects "Best Match" or price filter, Quicksort runs on this array

**Time Complexity:**
- Access by index: O(1)
- Quicksort (sorting): O(n log n) average

**Why Quicksort?**
- Bubble sort is O(n²) — too slow
- Quicksort is fast and works well in practice for sorting listings

---

### 3. HashMap *(for User Profiles and Skill Posts)*

**Where it is used:**
- Storing user data (Prajithaa's profile, 47 skills exchanged, 132 hours, 4.92 rating)
- Storing each user's own posts (My Posts page — "Intro to System Design")
- Exchange Requests — quickly finding who sent the request (Aarav Kumar → his profile)

**What it does:**
- Key = User ID or Skill ID
- Value = all data about that user or skill
- Gives instant lookup without looping through everyone

**How it works:**
- To find Prajithaa's profile: HashMap.get("user_prajithaa") → instant result
- To find a skill by ID: HashMap.get("skill_001") → returns title, description, price

**Time Complexity:**
- Insert: O(1)
- Lookup: O(1)
- Much faster than array search O(n)

---

## How All Three Work Together (Full Flow Example)

> User opens Skill Market and types "reac" in the search bar

1. **Trie** → finds all skills starting with "reac" → returns ["React", "React Native", "Advanced React & TypeScript"]
2. **Array** → holds all matched skill listings
3. **Quicksort on Array** → sorts results by Best Match or price
4. **HashMap** → fetches full details of each skill (description, poster info, price) instantly

---

## Summary Table

| Data Structure | Where Used | Why Used | Time Complexity |
|---|---|---|---|
| Trie | Search bar in Skill Market | Fast prefix search + typo tolerance | O(m) search |
| Array | Skill listings in Market | Store and sort all skills | O(n log n) with Quicksort |
| HashMap | User profiles, My Posts, Requests | Instant lookup by ID | O(1) lookup |

---

## Likely Viva Questions & Answers

**Q: What is a Trie?**
A: A tree where each node stores one character. Words sharing the same prefix share the same path. Used for fast search and autocomplete.

**Q: Why did you use Trie for search?**
A: Because users may type partial skill names or typos. Trie handles both efficiently in O(m) time.

**Q: What is Levenshtein distance?**
A: It counts the minimum number of insertions, deletions, or replacements needed to turn one word into another. I used it with Trie to handle typos in search.

**Q: Why Array for skill listings?**
A: Arrays allow index-based access and are easy to sort. I applied Quicksort on the array to sort skills by price or match score.

**Q: Why HashMap for users?**
A: HashMap gives O(1) lookup. I can fetch any user's profile or skill post instantly using their ID as the key.

**Q: What is the time complexity of Quicksort?**
A: O(n log n) average case. Worst case is O(n²) but that rarely happens with good pivot selection.

**Q: What is the difference between Array search and HashMap search?**
A: Array search is O(n) — you check each element. HashMap search is O(1) — direct access using the key.
