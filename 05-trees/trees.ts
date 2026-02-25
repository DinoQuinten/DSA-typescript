export {};

// ================================================================
// 🌲 CHAPTER 5: TREES — Runnable TypeScript Examples
// ================================================================
// Run: bun run trees.ts
//
// Trees are hierarchical data structures that model parent-child
// relationships. They're everywhere: file systems, HTML DOMs,
// organization charts, decision trees, and database indices.
//
// A Binary Search Tree (BST) is a tree where every node's left
// children are smaller and right children are larger. This
// ordering property enables O(log n) search, insert, and delete
// — the same idea behind binary search, but in a dynamic
// structure that doesn't need to be a sorted array.
//
// This file covers:
//   - TreeNode and BST implementation
//   - All four traversal orders (inorder, preorder, postorder, level-order)
//   - Iterative inorder traversal using an explicit stack
//   - Lowest Common Ancestor (general tree & BST-optimized)
//   - BST validation
//   - Max depth and node counting
// ================================================================


// ================================================================
// TREE NODE
// ================================================================
// WHAT: The fundamental building block of any binary tree.
//   Each node holds a value and pointers to its left and right
//   children (which may be null if absent).
//
// REAL-WORLD ANALOGY:
//   Think of a family tree. Each person (node) has a name (val)
//   and can have up to two children (left, right).
// ================================================================

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number,
    left: TreeNode | null = null,
    right: TreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}


// ================================================================
// BINARY SEARCH TREE (BST)
// ================================================================
// WHAT: A binary tree where for every node:
//   - All values in the LEFT subtree are LESS than the node
//   - All values in the RIGHT subtree are GREATER than the node
//
// WHY: This ordering lets us eliminate half the tree at each step,
//   giving O(log n) search — just like binary search on an array,
//   but the structure can grow and shrink dynamically.
//
// REAL-WORLD ANALOGY:
//   A phone book organized as a tree. To find "Martinez", you
//   start at the middle entry. If "Martinez" comes after it, you
//   go right (the second half). You keep halving until found.
//
// COMPLEXITY (balanced BST):
//   insert / search / delete — O(log n) average, O(n) worst (skewed)
//   Space — O(n)
// ================================================================

class BST {
  root: TreeNode | null = null;

  // ──────────────────────────────────────────────────────────────
  // INSERT
  // ──────────────────────────────────────────────────────────────
  // HOW: Recursively walk down the tree. At each node, go left
  //   if the new value is smaller, right if larger. When we hit
  //   null, that's where the new node belongs.
  //
  // WHY recursive? Each recursive call narrows the subtree,
  //   making the code very clean. The returned node is re-linked
  //   to its parent, which handles the insertion seamlessly.
  // ──────────────────────────────────────────────────────────────
  insert(val: number): void {
    this.root = this._insert(this.root, val);
  }

  private _insert(node: TreeNode | null, val: number): TreeNode {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = this._insert(node.left, val);
    else if (val > node.val) node.right = this._insert(node.right, val);
    return node;
  }

  // ──────────────────────────────────────────────────────────────
  // SEARCH — O(log n) average
  // ──────────────────────────────────────────────────────────────
  // HOW: Start at the root. If the target equals the current
  //   node's value, we found it. If target is smaller, go left.
  //   If larger, go right. If we hit null, it's not in the tree.
  //
  // This is iterative (no recursion) — a simple while loop is
  // often preferred for search since we don't need to unwind
  // a call stack.
  // ──────────────────────────────────────────────────────────────
  search(val: number): TreeNode | null {
    let current = this.root;
    while (current) {
      if (val === current.val) return current;
      current = val < current.val ? current.left : current.right;
    }
    return null;
  }

  // ──────────────────────────────────────────────────────────────
  // DELETE — the trickiest BST operation
  // ──────────────────────────────────────────────────────────────
  // Three cases when we find the node to delete:
  //
  // CASE 1 — Leaf node (no children):
  //   Just remove it. Return null to parent.
  //
  // CASE 2 — One child:
  //   Replace the node with its single child.
  //   The child takes over the deleted node's position.
  //
  // CASE 3 — Two children (hardest):
  //   Find the "inorder successor" — the smallest value in the
  //   RIGHT subtree. Copy its value into the current node, then
  //   delete the successor from the right subtree. This preserves
  //   the BST property because the successor is the next-largest
  //   value after the deleted node.
  //
  // WHY inorder successor? You could also use the inorder
  //   predecessor (largest in left subtree). Both work.
  // ──────────────────────────────────────────────────────────────
  delete(val: number): void {
    this.root = this._delete(this.root, val);
  }

  private _delete(node: TreeNode | null, val: number): TreeNode | null {
    if (!node) return null;

    if (val < node.val) {
      node.left = this._delete(node.left, val);
    } else if (val > node.val) {
      node.right = this._delete(node.right, val);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const successor = this._findMin(node.right);
      node.val = successor.val;
      node.right = this._delete(node.right, successor.val);
    }
    return node;
  }

  // ──────────────────────────────────────────────────────────────
  // FIND MIN / MAX
  // ──────────────────────────────────────────────────────────────
  // In a BST, the minimum is always the leftmost node (keep going
  // left until there's no more left child). The maximum is the
  // rightmost. This is a direct consequence of the BST ordering.
  // ──────────────────────────────────────────────────────────────
  private _findMin(node: TreeNode): TreeNode {
    while (node.left) node = node.left;
    return node;
  }

  min(): number | null {
    if (!this.root) return null;
    return this._findMin(this.root).val;
  }

  max(): number | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.right) current = current.right;
    return current.val;
  }
}


// ================================================================
// TREE TRAVERSALS (Recursive)
// ================================================================
// WHAT: Visiting every node in a specific order. There are four
//   standard traversals, each useful for different things.
//
// WHY different orders?
//   - Inorder (L → Root → R): Visits BST nodes in sorted order.
//     Use for: producing sorted output, range queries.
//
//   - Preorder (Root → L → R): Visits the root BEFORE children.
//     Use for: copying/serializing a tree, prefix expressions.
//
//   - Postorder (L → R → Root): Visits the root AFTER children.
//     Use for: deleting a tree (free children before parent),
//     evaluating postfix expressions, calculating directory sizes.
//
//   - Level-order (BFS): Visits level by level, left to right.
//     Use for: shortest path in unweighted tree, printing by level.
//
// COMPLEXITY: All traversals are O(n) time, O(h) space where
//   h = height (for the recursion stack or queue). In a balanced
//   tree h = log n; in a skewed tree h = n.
// ================================================================

function inorderRecursive(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  inorderRecursive(node.left, result);
  result.push(node.val);
  inorderRecursive(node.right, result);
  return result;
}

function preorderRecursive(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  result.push(node.val);
  preorderRecursive(node.left, result);
  preorderRecursive(node.right, result);
  return result;
}

function postorderRecursive(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  postorderRecursive(node.left, result);
  postorderRecursive(node.right, result);
  result.push(node.val);
  return result;
}

// ──────────────────────────────────────────────────────────────
// LEVEL-ORDER TRAVERSAL (BFS with a queue)
// ──────────────────────────────────────────────────────────────
// HOW: Use a queue (FIFO). Start with the root. For each level,
//   process all nodes currently in the queue, then enqueue their
//   children. The key trick: snapshot the queue length at the
//   start of each level to know how many nodes belong to it.
//
// WHY a queue? BFS naturally explores nodes "layer by layer"
//   because a queue processes items in arrival order. Nodes at
//   depth d are all processed before any node at depth d+1.
// ──────────────────────────────────────────────────────────────
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}


// ================================================================
// ITERATIVE INORDER TRAVERSAL (Stack-Based)
// ================================================================
// WHAT: Same result as recursive inorder, but using an explicit
//   stack instead of the call stack.
//
// WHY: Recursive traversal can cause stack overflow on very deep
//   trees (e.g., 100K nodes in a skewed tree). Iterative gives
//   you control over memory. It's also what interviewers love
//   to ask about.
//
// HOW:
//   1. Push all left children onto the stack (go as far left
//      as possible).
//   2. Pop a node — that's the next in sorted order.
//   3. Move to its right child and repeat from step 1.
//
//   The stack simulates the "paused" recursive calls. Each
//   popped node represents the point where recursion would
//   return from the left subtree and process the current node.
//
// COMPLEXITY: O(n) time, O(h) space
// ================================================================

function inorderIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current = root;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop()!;
    result.push(current.val);
    current = current.right;
  }

  return result;
}


// ================================================================
// LOWEST COMMON ANCESTOR (LCA) — General Binary Tree
// ================================================================
// WHAT: Given two nodes p and q, find the deepest node that is
//   an ancestor of both. ("Ancestor" includes the node itself.)
//
// HOW (post-order recursion):
//   1. If the current node is null, or is p, or is q → return it.
//   2. Recurse into left and right subtrees.
//   3. If BOTH sides return non-null, the current node is the LCA
//      (p and q are split across the two subtrees).
//   4. If only one side returns non-null, propagate it upward.
//
// WHY this works: The recursion "reports" findings upward. When
//   both children report a target, the current node must be
//   the split point — the lowest common ancestor.
//
// COMPLEXITY: O(n) time, O(h) space
// ================================================================

function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;
  return left ?? right;
}


// ================================================================
// LOWEST COMMON ANCESTOR — BST (uses ordering for O(h) speed)
// ================================================================
// WHAT: Same problem, but we exploit the BST ordering property.
//
// HOW: Starting from the root:
//   - If both p and q are smaller → LCA must be in left subtree.
//   - If both are larger → LCA must be in right subtree.
//   - Otherwise, the current node is the split point (the LCA).
//
// WHY this is faster: We don't need to explore both subtrees.
//   We walk a single path from root to LCA, making it O(h)
//   instead of O(n) for a balanced BST.
//
// COMPLEXITY: O(h) time where h = tree height, O(h) space (recursion)
// ================================================================

function lcaBST(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root) return null;
  if (p.val < root.val && q.val < root.val) return lcaBST(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lcaBST(root.right, p, q);
  return root;
}


// ================================================================
// VALIDATE BST
// ================================================================
// WHAT: Check whether a binary tree satisfies the BST property.
//
// HOW: Pass down a valid range (min, max) for each node.
//   - The root can be anything: range is (-∞, +∞).
//   - When going left, the child must be < parent: range becomes (min, parent.val).
//   - When going right, the child must be > parent: range becomes (parent.val, max).
//   - If any node violates its range, the tree is invalid.
//
// WHY not just check "left < root < right"? Because a node deep
//   in the left subtree could be larger than the root — that
//   check would miss it. The range approach catches all violations.
//
// COMPLEXITY: O(n) time (visit every node), O(h) space
// ================================================================

function isValidBST(root: TreeNode | null): boolean {
  function validate(
    node: TreeNode | null,
    min: number,
    max: number
  ): boolean {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return (
      validate(node.left, min, node.val) &&
      validate(node.right, node.val, max)
    );
  }
  return validate(root, -Infinity, Infinity);
}


// ================================================================
// MAX DEPTH (Height of Tree)
// ================================================================
// WHAT: The number of nodes along the longest root-to-leaf path.
//
// HOW: Base case: null node has depth 0. Otherwise, the depth is
//   1 + the maximum depth of the two subtrees. Classic recursion.
//
// REAL-WORLD ANALOGY: The "height" of an org chart = the longest
//   chain of command from CEO to lowest-level employee.
//
// COMPLEXITY: O(n) time, O(h) space
// ================================================================

function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}


// ================================================================
// COUNT NODES
// ================================================================
// WHAT: Total number of nodes in the tree.
// HOW: 1 (for current) + count(left) + count(right).
// COMPLEXITY: O(n) time, O(h) space
// ================================================================

function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}


// ================================================================
// 🧪 DEMO — Run All Examples
// ================================================================

console.log("=".repeat(60));
console.log("🌲 TREES — TYPESCRIPT EXAMPLES");
console.log("=".repeat(60));

// ── Build BST ──────────────────────────────────────────────────

const bst = new BST();
const values = [10, 5, 15, 3, 8, 12, 20];
values.forEach((v) => bst.insert(v));

console.log("\n📌 Built BST from:", values);
console.log("     10");
console.log("    /  \\");
console.log("   5    15");
console.log("  / \\  /  \\");
console.log(" 3   8 12  20");

// ── Search ─────────────────────────────────────────────────────

console.log("\n🔍 Search:");
console.log(`  search(8)  → ${bst.search(8) ? "Found ✅" : "Not found ❌"}`);
console.log(`  search(99) → ${bst.search(99) ? "Found ✅" : "Not found ❌"}`);

// ── Min / Max ──────────────────────────────────────────────────

console.log("\n📊 Min / Max:");
console.log(`  min() → ${bst.min()}`);
console.log(`  max() → ${bst.max()}`);

// ── Traversals ─────────────────────────────────────────────────

console.log("\n🌿 Traversals:");
console.log(
  `  Inorder   (L→Root→R):  [${inorderRecursive(bst.root)}]  ← sorted!`
);
console.log(
  `  Preorder  (Root→L→R):  [${preorderRecursive(bst.root)}]`
);
console.log(
  `  Postorder (L→R→Root):  [${postorderRecursive(bst.root)}]`
);
console.log(
  `  Level-order (BFS):     [${levelOrder(bst.root).map((l) => `[${l}]`).join(", ")}]`
);

// ── Iterative Inorder ──────────────────────────────────────────

console.log("\n🔄 Iterative Inorder (stack-based):");
console.log(`  [${inorderIterative(bst.root)}]`);

// ── Validate BST ───────────────────────────────────────────────

console.log("\n✅ Validate BST:");
console.log(`  isValidBST(bst.root) → ${isValidBST(bst.root)}`);

const invalidTree = new TreeNode(
  5,
  new TreeNode(1),
  new TreeNode(4, new TreeNode(3), new TreeNode(6))
);
console.log(`  isValidBST(invalid)  → ${isValidBST(invalidTree)}`);

// ── Max Depth & Count ──────────────────────────────────────────

console.log("\n📏 Tree Metrics:");
console.log(`  maxDepth()   → ${maxDepth(bst.root)}`);
console.log(`  countNodes() → ${countNodes(bst.root)}`);

// ── Lowest Common Ancestor (BST) ──────────────────────────────

console.log("\n👥 Lowest Common Ancestor (BST):");
const node3 = bst.search(3)!;
const node8 = bst.search(8)!;
const node12 = bst.search(12)!;
const node20 = bst.search(20)!;

const lca1 = lcaBST(bst.root, node3, node8);
console.log(`  LCA(3, 8)   → ${lca1?.val}  (both under 5)`);

const lca2 = lcaBST(bst.root, node3, node20);
console.log(`  LCA(3, 20)  → ${lca2?.val} (split at root)`);

const lca3 = lcaBST(bst.root, node12, node20);
console.log(`  LCA(12, 20) → ${lca3?.val} (both under 15)`);

// ── Delete ─────────────────────────────────────────────────────

console.log("\n🗑️  Deletion:");
console.log(`  Before delete: [${inorderRecursive(bst.root)}]`);

bst.delete(3);
console.log(`  After delete(3)  — leaf:       [${inorderRecursive(bst.root)}]`);

bst.delete(5);
console.log(`  After delete(5)  — one child:  [${inorderRecursive(bst.root)}]`);

bst.delete(10);
console.log(`  After delete(10) — two children: [${inorderRecursive(bst.root)}]`);

// ── Insert After Delete ────────────────────────────────────────

console.log("\n➕ Re-insert 3, 5, 10:");
bst.insert(3);
bst.insert(5);
bst.insert(10);
console.log(`  Inorder: [${inorderRecursive(bst.root)}]`);

console.log("\n" + "=".repeat(60));
console.log("✅ All tree examples complete!");
console.log("=".repeat(60));
