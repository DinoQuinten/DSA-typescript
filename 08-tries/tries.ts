export {};

// ================================================================
// 🌳 Chapter 8: TRIES (PREFIX TREES) — TypeScript Examples
// ================================================================
//
// WHAT IS A TRIE?
// A Trie (pronounced "try", from reTRIEval) is a tree-like data
// structure used for storing strings so that prefix-based lookups
// are extremely fast.
//
// REAL-WORLD ANALOGY:
// Think of a phone's autocomplete. When you type "hel", it
// instantly suggests "hello", "help", "helmet". A Trie stores
// all words letter-by-letter in a tree, so finding all words
// that start with "hel" is just walking 3 nodes deep.
//
// WHY NOT JUST USE A HASH SET?
// - HashSet: search("cat") is O(L), but startsWith("ca")
//   requires scanning ALL words → O(N·L) where N = total words.
// - Trie: startsWith("ca") is O(P) — just walk the prefix path.
//
// STRUCTURE:
//   root
//   ├── c
//   │   ├── a
//   │   │   ├── t ✓ (end of "cat")
//   │   │   └── r ✓ (end of "car")
//   │   │       ├── d ✓ (end of "card")
//   │   │       └── e ✓ (end of "care")
//   └── d
//       └── o ✓ (end of "do")
//           └── g ✓ (end of "dog")
//
// SPACE: O(N·L) worst case (N words, avg length L).
//        In practice, shared prefixes save a LOT of space.
//
// Run: bun run tries.ts
// ================================================================


// ================================================================
// 🧩 TRIE NODE — The Building Block
// ================================================================
// WHAT: Each node in the Trie represents a single character.
//
// HOW IT WORKS:
// - `children`: A Map from character → child TrieNode.
//   We use a Map (not a fixed array of 26) so we can handle
//   any character set (uppercase, digits, unicode, etc.).
// - `isEndOfWord`: Marks whether a complete word ends here.
//   Without this, we couldn't distinguish the prefix "car"
//   from the inserted word "car" when "card" is also present.
// ================================================================
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}


// ================================================================
// 🌳 TRIE — Full Implementation
// ================================================================
// WHAT: A prefix tree supporting insert, search, delete,
//       prefix-check, autocomplete, and word counting.
//
// KEY INSIGHT: Every path from root to a node with
// isEndOfWord === true spells out one inserted word.
//
// COMPLEXITY SUMMARY:
//   ┌──────────────────────┬─────────────┐
//   │ Operation            │ Time        │
//   ├──────────────────────┼─────────────┤
//   │ insert(word)         │ O(L)        │
//   │ search(word)         │ O(L)        │
//   │ startsWith(prefix)   │ O(P)        │
//   │ delete(word)         │ O(L)        │
//   │ autocomplete(prefix) │ O(P + K)    │
//   └──────────────────────┴─────────────┘
//   L = word length, P = prefix length, K = total output chars
// ================================================================
class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // ==============================================================
  // INSERT — Add a word to the Trie
  // ==============================================================
  // HOW: Walk character-by-character from the root.
  //      If a child for this character doesn't exist, create it.
  //      After processing the last character, mark isEndOfWord.
  //
  // ANALOGY: You're filing a document in nested folders.
  //          "cat" → open folder C → open sub-folder A → create T
  //          and stamp "a file ends here" on T.
  //
  // Time: O(L) where L = word length | Space: O(L) worst case
  // ==============================================================
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  // ==============================================================
  // SEARCH — Check if an EXACT word exists in the Trie
  // ==============================================================
  // HOW: Walk the prefix path. If we reach the end AND the final
  //      node has isEndOfWord === true, the word exists.
  //
  // WHY TWO CHECKS?
  //   - findNode("ca") returns a valid node (because "cat" passes
  //     through it), but isEndOfWord is false → "ca" was NOT inserted.
  //   - findNode("cat") returns a node with isEndOfWord === true → found!
  //
  // Time: O(L) | Space: O(1)
  // ==============================================================
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  // ==============================================================
  // STARTS WITH — Check if ANY word begins with this prefix
  // ==============================================================
  // HOW: Just walk the prefix path. If we don't fall off the tree,
  //      at least one word has this prefix.
  //
  // WHY IS THIS FAST?
  //   Unlike a hash set where you'd iterate all words, the Trie
  //   eliminates all non-matching words instantly. Only the prefix
  //   length matters — not the total number of stored words.
  //
  // Time: O(P) where P = prefix length | Space: O(1)
  // ==============================================================
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  // ==============================================================
  // DELETE — Remove a word from the Trie (recursive cleanup)
  // ==============================================================
  // WHAT: Removes a word and cleans up orphaned nodes.
  //
  // WHY IS DELETE TRICKY?
  //   We can't just unmark isEndOfWord. If "car" shares a path
  //   with "card", removing "card" should remove the 'd' node
  //   but leave "car" intact.
  //
  // HOW (recursive approach):
  //   1. Recurse to the end of the word.
  //   2. Unmark isEndOfWord on the last character's node.
  //   3. On the way back up, delete child nodes that are:
  //      - Not end-of-word for another word, AND
  //      - Have no other children (i.e., they're orphaned).
  //
  // Time: O(L) | Space: O(L) due to recursion stack
  // ==============================================================
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    // BASE CASE: We've walked the entire word
    if (depth === word.length) {
      if (!node.isEndOfWord) return false; // word wasn't in the trie
      node.isEndOfWord = false;            // unmark
      return node.children.size === 0;     // true = safe to delete this node
    }

    const char = word[depth];
    const child = node.children.get(char);
    if (!child) return false; // path doesn't exist

    // RECURSE deeper into the trie
    const shouldDeleteChild = this.deleteHelper(child, word, depth + 1);

    // CLEANUP: If the recursive call says "delete me", remove the mapping
    if (shouldDeleteChild) {
      node.children.delete(char);
      // Propagate: can THIS node also be deleted?
      return !node.isEndOfWord && node.children.size === 0;
    }

    return false;
  }

  // ==============================================================
  // COUNT WORDS WITH PREFIX — How many words start with this prefix?
  // ==============================================================
  // HOW: Navigate to the prefix node, then do a DFS counting
  //      every node where isEndOfWord === true.
  //
  // Time: O(P + K) where K = number of nodes in the subtree
  // ==============================================================
  countWordsWithPrefix(prefix: string): number {
    const node = this.findNode(prefix);
    if (!node) return 0;
    return this.countWords(node);
  }

  private countWords(node: TrieNode): number {
    let count = node.isEndOfWord ? 1 : 0;
    for (const child of node.children.values()) {
      count += this.countWords(child);
    }
    return count;
  }

  // ==============================================================
  // AUTOCOMPLETE — Get ALL words that start with a given prefix
  // ==============================================================
  // WHAT: Returns a list of every complete word sharing the prefix.
  //
  // HOW:
  //   1. Walk to the prefix node (if it exists).
  //   2. DFS from that node, building words character by character.
  //   3. Whenever we hit isEndOfWord, add the accumulated string.
  //
  // ANALOGY: In a phone keyboard, you type "app" and it lists
  //          "apple", "app", "application", "apply".
  //
  // Time: O(P + K) where K = total characters in all matching words
  // ==============================================================
  getAllWordsWithPrefix(prefix: string): string[] {
    const node = this.findNode(prefix);
    if (!node) return [];
    const results: string[] = [];
    this.collectWords(node, prefix, results);
    return results;
  }

  private collectWords(
    node: TrieNode,
    currentWord: string,
    results: string[]
  ): void {
    if (node.isEndOfWord) {
      results.push(currentWord);
    }
    for (const [char, child] of node.children) {
      this.collectWords(child, currentWord + char, results);
    }
  }

  // ==============================================================
  // FIND NODE — Internal helper to walk a prefix path
  // ==============================================================
  // Returns the node at the end of the prefix, or null if any
  // character along the way is missing. Used by search(),
  // startsWith(), autocomplete, and count.
  //
  // Time: O(P) | Space: O(1)
  // ==============================================================
  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
  }
}


// ================================================================
// 🃏 WORD DICTIONARY — Wildcard Search with '.'
// ================================================================
// WHAT: A special Trie that supports '.' as a wildcard matching
//       ANY single character. Used in problems like LeetCode 211.
//
// WHY CAN'T WE USE A REGULAR TRIE?
//   Regular Trie search follows one fixed path per character.
//   '.' means "could be any character", so we must explore ALL
//   children at that level — this turns search into a DFS/backtrack.
//
// HOW:
//   - addWord: Same as Trie.insert (no wildcard logic needed).
//   - search: Character-by-character DFS.
//     * If char is a letter: follow that one child (if it exists).
//     * If char is '.': try ALL children recursively — if ANY
//       path succeeds, return true.
//
// COMPLEXITY:
//   - addWord: O(L) — same as normal insert
//   - search (no wildcards): O(L) — same as normal search
//   - search (with W wildcards): O(26^W · L) worst case
//     because each '.' fans out to up to 26 children.
//
// REAL-WORLD ANALOGY:
//   Like a crossword puzzle solver. "h.llo" could be "hello",
//   "hallo", "hullo" — you must try every possibility.
// ================================================================
class WordDictionary {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  addWord(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    return this.dfs(this.root, word, 0);
  }

  // The recursive DFS that handles '.' wildcards
  private dfs(node: TrieNode, word: string, index: number): boolean {
    // BASE CASE: processed all characters — is this a complete word?
    if (index === word.length) {
      return node.isEndOfWord;
    }

    const char = word[index];

    // WILDCARD CASE: '.' matches ANY single character
    // We must try every child — if any leads to success, return true
    if (char === ".") {
      for (const child of node.children.values()) {
        if (this.dfs(child, word, index + 1)) return true;
      }
      return false;
    }

    // NORMAL CASE: follow the exact character's child
    const child = node.children.get(char);
    if (!child) return false;
    return this.dfs(child, word, index + 1);
  }
}


// ================================================================
// 🧪 DEMOS & TESTS
// ================================================================
// All demos below are self-contained and print step-by-step output
// so you can observe how each Trie operation behaves.
// ================================================================

function separator(title: string): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(60)}\n`);
}


// ================================================================
// 📝 Demo 1: Basic Insert / Search / StartsWith
// ================================================================
// WHAT THIS DEMONSTRATES:
//   - insert() builds paths in the Trie
//   - search() returns true ONLY for exact inserted words
//   - startsWith() returns true for any valid prefix
//
// KEY TAKEAWAY:
//   search("ca") → false (it's a prefix, not an inserted word)
//   startsWith("ca") → true (at least one word begins with "ca")
// ================================================================

separator("📝 Demo 1: Basic Trie Operations");

const trie = new Trie();
const words = ["cat", "car", "card", "care", "do", "dog"];

console.log("Inserting words:", words.join(", "));
for (const w of words) trie.insert(w);

console.log("\n--- search() checks exact word existence ---");
console.log('  search("cat")  →', trie.search("cat"));   // true
console.log('  search("car")  →', trie.search("car"));   // true
console.log('  search("card") →', trie.search("card"));  // true
console.log('  search("ca")   →', trie.search("ca"));    // false — prefix, not a word
console.log('  search("cats") →', trie.search("cats"));  // false — not inserted
console.log('  search("dog")  →', trie.search("dog"));   // true
console.log('  search("do")   →', trie.search("do"));    // true
console.log('  search("d")    →', trie.search("d"));     // false

console.log("\n--- startsWith() checks prefix existence ---");
console.log('  startsWith("ca")   →', trie.startsWith("ca"));   // true
console.log('  startsWith("car")  →', trie.startsWith("car"));  // true
console.log('  startsWith("cats") →', trie.startsWith("cats")); // false
console.log('  startsWith("d")    →', trie.startsWith("d"));    // true
console.log('  startsWith("do")   →', trie.startsWith("do"));   // true
console.log('  startsWith("doo")  →', trie.startsWith("doo"));  // false


// ================================================================
// 🔍 Demo 2: Autocomplete (Get All Words With Prefix)
// ================================================================
// WHAT THIS DEMONSTRATES:
//   Given a prefix, retrieve ALL complete words that start with it.
//   This is exactly how search bar autocomplete works.
//
// HOW:
//   1. Walk to the node at the end of the prefix.
//   2. DFS from there, collecting every word (isEndOfWord nodes).
//
// EXAMPLE:
//   prefix = "hel" → walk to root→h→e→l
//   Then DFS finds: "hello", "help", "helmet"
// ================================================================

separator("🔍 Demo 2: Autocomplete (Get All Words With Prefix)");

const autoTrie = new Trie();
const dictionary = [
  "hello", "help", "helmet", "hero", "her",
  "heap", "heart", "heat",
  "apple", "app", "application", "apply"
];

console.log("Dictionary:", dictionary.join(", "));
for (const w of dictionary) autoTrie.insert(w);

const prefixes = ["hel", "he", "her", "app", "z"];
for (const prefix of prefixes) {
  const results = autoTrie.getAllWordsWithPrefix(prefix);
  const count = autoTrie.countWordsWithPrefix(prefix);
  console.log(`\n  Prefix "${prefix}":`);
  console.log(`    Count: ${count}`);
  console.log(`    Words: [${results.join(", ")}]`);
}


// ================================================================
// 🗑️ Demo 3: Deletion
// ================================================================
// WHAT THIS DEMONSTRATES:
//   Deleting a word removes it from search results, but sibling
//   words that share a prefix are NOT affected.
//
// WHY THIS IS INTERESTING:
//   "car", "card", "care", "careful" share the prefix "car".
//   Deleting "car" unmarks it, but doesn't destroy the c→a→r path
//   because "card", "care", "careful" still depend on it.
//
//   Deleting "careful" CAN remove the 'f', 'u', 'l' nodes
//   because no other word uses them.
// ================================================================

separator("🗑️ Demo 3: Deletion");

const delTrie = new Trie();
const delWords = ["car", "card", "care", "careful"];
for (const w of delWords) delTrie.insert(w);

console.log("Initial words:", delWords.join(", "));
console.log('  search("car")     →', delTrie.search("car"));     // true
console.log('  search("card")    →', delTrie.search("card"));    // true
console.log('  search("care")    →', delTrie.search("care"));    // true
console.log('  search("careful") →', delTrie.search("careful")); // true

console.log('\nDeleting "car"...');
delTrie.delete("car");
console.log('  search("car")     →', delTrie.search("car"));     // false (deleted)
console.log('  search("card")    →', delTrie.search("card"));    // true  (still exists)
console.log('  search("care")    →', delTrie.search("care"));    // true  (still exists)
console.log('  search("careful") →', delTrie.search("careful")); // true  (still exists)

console.log('\nDeleting "careful"...');
delTrie.delete("careful");
console.log('  search("careful") →', delTrie.search("careful")); // false (deleted)
console.log('  search("care")    →', delTrie.search("care"));    // true  (still exists)
console.log('  startsWith("caref") →', delTrie.startsWith("caref")); // false (nodes removed)

console.log('\nDeleting "xyz" (not in trie)...');
const deleted = delTrie.delete("xyz");
console.log("  Returned:", deleted, "(no-op, word didn't exist)");


// ================================================================
// 🃏 Demo 4: Wildcard Search (WordDictionary)
// ================================================================
// WHAT THIS DEMONSTRATES:
//   The '.' character matches ANY single letter, turning search
//   into a backtracking problem over the Trie.
//
// EXAMPLES:
//   "h.llo" → '.' can be 'e' → matches "hello"
//   "....." → matches ANY 5-letter word in the dictionary
//   "wor.s" → '.' can be 'd' → matches "words"
//
// PERFORMANCE NOTE:
//   Each '.' multiplies the search by up to 26 branches.
//   "....." on a full English dictionary is expensive!
//   But in practice, most branches are pruned quickly.
// ================================================================

separator("🃏 Demo 4: Wildcard Search (WordDictionary)");

const dict = new WordDictionary();
const dictWords = ["hello", "help", "world", "worry", "words"];

console.log("Adding words:", dictWords.join(", "));
for (const w of dictWords) dict.addWord(w);

const patterns = [
  { pattern: "hello", expected: true,  explanation: 'exact match' },
  { pattern: "h.llo", expected: true,  explanation: '"." matches "e"' },
  { pattern: "he..o", expected: true,  explanation: '"." matches "l" and "l"' },
  { pattern: ".....", expected: true,  explanation: '5 dots matches any 5-letter word (hello, world, worry, words)' },
  { pattern: "wor..", expected: true,  explanation: 'matches "world", "worry", "words"' },
  { pattern: "wor.s", expected: true,  explanation: 'matches "words"' },
  { pattern: "w..ld", expected: true,  explanation: 'matches "world"' },
  { pattern: "....x", expected: false, explanation: 'no 5-letter word ends with x' },
  { pattern: ".ello", expected: true,  explanation: '"." matches "h" → "hello"' },
  { pattern: "he..", expected: false,  explanation: '4 chars — "help" is 4 chars! → true' },
];

// Fix: "he.." actually matches "help" (h-e-l-p)
patterns[9].expected = true;

for (const { pattern, expected, explanation } of patterns) {
  const result = dict.search(pattern);
  const status = result === expected ? "✅" : "❌";
  console.log(`  ${status} search("${pattern}") → ${result}  (${explanation})`);
}


// ================================================================
// 🎮 Demo 5: Word Search in 2D Grid (Trie + Backtracking)
// ================================================================
// WHAT: Given a 2D board of letters and a list of words, find
//       which words can be formed by adjacent cells (LeetCode 212).
//
// WHY USE A TRIE HERE?
//   Without a Trie, for each cell we'd try to match EACH word
//   independently → O(W · M·N · 4^L). With a Trie, we walk
//   all words simultaneously — we prune a DFS path the moment
//   no word in the Trie shares that prefix.
//
// HOW (Trie + Backtracking):
//   1. Insert all target words into a Trie.
//   2. For each cell (r, c), start a DFS.
//   3. At each step, check if the current character exists as
//      a child in the Trie node. If not → prune (stop this path).
//   4. If we reach a node with isEndOfWord → we found a word!
//   5. Mark cells as '#' during DFS to avoid revisiting (backtrack).
//   6. Restore cells after DFS returns.
//
// COMPLEXITY:
//   Time: O(M·N · 4^L) where L = max word length
//   Space: O(W·L) for the Trie + O(L) for recursion stack
// ================================================================

separator("🎮 Demo 5: Word Search in 2D Grid (Trie + Backtracking)");

function findWords(board: string[][], words: string[]): string[] {
  const trie = new Trie();
  for (const word of words) trie.insert(word);

  const result: Set<string> = new Set();
  const rows = board.length;
  const cols = board[0].length;

  // Four directions: right, left, down, up
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r: number, c: number, node: TrieNode, path: string): void {
    // BOUNDARY + VISITED CHECK
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (board[r][c] === "#") return; // already visited in this path

    const char = board[r][c];
    const nextNode = node.children.get(char);
    if (!nextNode) return; // PRUNING: no word in Trie continues with this char

    const newPath = path + char;

    // FOUND A WORD: add to results, unmark to avoid counting twice
    if (nextNode.isEndOfWord) {
      result.add(newPath);
      nextNode.isEndOfWord = false;
    }

    // BACKTRACKING: mark visited → explore neighbors → restore
    board[r][c] = "#";
    for (const [dr, dc] of dirs) {
      dfs(r + dr, c + dc, nextNode, newPath);
    }
    board[r][c] = char;
  }

  // Start DFS from every cell on the board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, trie.root, "");
    }
  }

  return [...result];
}

const board = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];

console.log("Board:");
for (const row of board) {
  console.log("  ", row.join("  "));
}

const searchWords = ["oath", "pea", "eat", "rain", "hike", "ate", "that"];
console.log("\nSearching for:", searchWords.join(", "));

const found = findWords(board, searchWords);
console.log("Found:", found.join(", ") || "(none)");


// ================================================================
// 📊 Summary — Trie Operations & Complexity
// ================================================================

separator("📊 Summary");

console.log("Trie Operations & Complexity:");
console.log("  ┌──────────────────────┬────────────┐");
console.log("  │ Operation            │ Time       │");
console.log("  ├──────────────────────┼────────────┤");
console.log("  │ insert(word)         │ O(L)       │");
console.log("  │ search(word)         │ O(L)       │");
console.log("  │ startsWith(prefix)   │ O(P)       │");
console.log("  │ delete(word)         │ O(L)       │");
console.log("  │ autocomplete(prefix) │ O(P + K)   │");
console.log("  │ wildcard search      │ O(26^W · L)│");
console.log("  └──────────────────────┴────────────┘");
console.log("  L = word length, P = prefix length");
console.log("  K = total chars in matches, W = # wildcards");
