export {};

// ================================================================
// 🌊🏰 Chapter 14: BFS and DFS — Runnable Examples
// ================================================================
//
// WHAT ARE BFS AND DFS?
// ----------------------
// BFS (Breadth-First Search) and DFS (Depth-First Search) are
// the two fundamental strategies for traversing graphs and trees.
//
// BFS — "Explore level by level" (uses a QUEUE)
//   Visit all neighbors first, then neighbors' neighbors, etc.
//   Like ripples spreading outward from a stone dropped in water.
//
// DFS — "Explore as deep as possible first" (uses a STACK or recursion)
//   Dive down one path until you can't go further, then backtrack.
//   Like exploring a maze by always turning left until you hit a dead end.
//
// WHEN TO USE WHICH:
// ┌──────────────────────────────────┬──────────┬──────────┐
// │ Problem                         │ BFS      │ DFS      │
// ├──────────────────────────────────┼──────────┼──────────┤
// │ Shortest path (unweighted)      │ ✅ Best  │ ❌       │
// │ Level-order traversal           │ ✅ Best  │ ❌       │
// │ Connected components            │ ✅       │ ✅       │
// │ Cycle detection                 │ ✅       │ ✅       │
// │ Topological sort                │ ✅       │ ✅       │
// │ Flood fill / island counting    │ ✅       │ ✅ Best  │
// │ Path existence                  │ ✅       │ ✅       │
// │ Exhaustive search (all paths)   │ ❌       │ ✅ Best  │
// └──────────────────────────────────┴──────────┴──────────┘
//
// HOW TO RUN:
//   bun run bfs-and-dfs.ts
// ================================================================


// ────────────────────────────────────────────────────────────
// HELPER: Build an adjacency list from edge pairs
// ────────────────────────────────────────────────────────────
//
// WHAT:  Converts an array of edge pairs [u, v] into an
//        adjacency list representation (Map<string, string[]>).
//        This is an UNDIRECTED graph, so each edge creates
//        entries in both directions: u→v AND v→u.
//
// WHY ADJACENCY LIST:
//   For sparse graphs (few edges relative to nodes), an adjacency
//   list is much more space-efficient than an adjacency matrix.
//   Lookup of neighbors is O(degree) which is typically small.
//
// COMPLEXITY:
//   Time:  O(E) where E is the number of edges
//   Space: O(V + E) for the adjacency list
// ────────────────────────────────────────────────────────────

function buildGraph(edges: [string, string][]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  return graph;
}


// ────────────────────────────────────────────────────────────
// 1️⃣  BFS ON GRAPH (with visited order logging)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Traverse all reachable nodes from a start node using
//        Breadth-First Search. Visits nodes layer by layer:
//        first the start, then all its neighbors, then their
//        neighbors, and so on.
//
// WHY BFS:
//   BFS guarantees that we visit nodes in order of increasing
//   distance from the start. This is why it's the go-to
//   algorithm for finding SHORTEST PATHS in unweighted graphs.
//
// HOW (step-by-step):
//   1. Initialize a queue with the start node; mark it visited.
//   2. While the queue is not empty:
//      a. DEQUEUE the front node → process it.
//      b. For each unvisited neighbor:
//         - Mark visited, ENQUEUE it.
//   3. The `visited` set prevents revisiting nodes (avoiding
//      infinite loops in cyclic graphs).
//
// COMPLEXITY:
//   Time:  O(V + E) — each node and edge visited once
//   Space: O(V) — for the queue and visited set
//
// REAL-WORLD ANALOGY:
//   Imagine dropping a stone in a pond. The ripples spread
//   outward in concentric circles — that's BFS. Each "ring"
//   is one level of distance from the starting point.
// ────────────────────────────────────────────────────────────

function bfsGraph(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  const order: string[] = [];

  console.log(`\n🌊 BFS from "${start}"`);
  console.log(`   Queue initialized: [${start}]`);

  while (queue.length > 0) {
    // DEQUEUE: take the node at the front of the queue (FIFO)
    const node = queue.shift()!;
    order.push(node);

    // Enqueue all unvisited neighbors
    const added: string[] = [];
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        added.push(neighbor);
      }
    }

    console.log(
      `   Visit: ${node} | Enqueued: [${added.join(", ")}] | Queue: [${queue.join(", ")}]`
    );
  }

  console.log(`   ✅ BFS Order: ${order.join(" → ")}`);
  return order;
}


// ────────────────────────────────────────────────────────────
// 2a️⃣  DFS ON GRAPH — Recursive
// ────────────────────────────────────────────────────────────
//
// WHAT:  Traverse all reachable nodes using Depth-First Search
//        (recursive version). Dives as deep as possible along
//        each branch before backtracking.
//
// WHY RECURSIVE DFS:
//   The call stack naturally acts as the "stack" data structure.
//   This makes the code clean and intuitive — the backtracking
//   happens automatically when the function returns.
//
// HOW (step-by-step):
//   1. Mark current node as visited, process it.
//   2. For each unvisited neighbor: recurse into it.
//   3. When all neighbors are explored, return (backtrack).
//
// COMPLEXITY:
//   Time:  O(V + E) — same as BFS
//   Space: O(V) — recursion stack depth (could be O(V) in worst case)
//
// CAVEAT:
//   For very deep graphs, recursive DFS can cause a STACK OVERFLOW.
//   In such cases, use the iterative version (2b) below.
// ────────────────────────────────────────────────────────────

function dfsGraphRecursive(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];

  console.log(`\n🏰 DFS Recursive from "${start}"`);

  function dfs(node: string, depth: number): void {
    visited.add(node);
    order.push(node);
    const indent = "   " + "  ".repeat(depth);
    console.log(`${indent}Visit: ${node} (depth ${depth})`);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, depth + 1);
      }
    }

    if (depth > 0) {
      const indent2 = "   " + "  ".repeat(depth - 1);
      console.log(`${indent2}  ↩ backtrack from ${node}`);
    }
  }

  dfs(start, 0);
  console.log(`   ✅ DFS Recursive Order: ${order.join(" → ")}`);
  return order;
}


// ────────────────────────────────────────────────────────────
// 2b️⃣  DFS ON GRAPH — Iterative (with explicit stack)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Same DFS traversal, but using an explicit stack instead
//        of recursion. This avoids stack overflow for deep graphs.
//
// WHY ITERATIVE:
//   Sometimes the graph is too deep for recursion (e.g., a linked
//   list of 100,000 nodes). An explicit stack on the heap has no
//   depth limit (until you run out of memory).
//
// HOW (step-by-step):
//   1. Push start onto the stack.
//   2. While stack is not empty:
//      a. POP the top node.
//      b. If already visited → skip (this can happen because we
//         may push the same node multiple times from different neighbors).
//      c. Mark visited, process it.
//      d. Push all unvisited neighbors (in reverse order so that
//         the first neighbor in the adjacency list is processed first).
//
// COMPLEXITY:
//   Time:  O(V + E)
//   Space: O(V) — for the stack and visited set
//
// NOTE ON VISIT ORDER:
//   Iterative DFS may visit nodes in a DIFFERENT order than
//   recursive DFS because of how neighbors are pushed. We push
//   in reverse to approximate the recursive order.
// ────────────────────────────────────────────────────────────

function dfsGraphIterative(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const stack: string[] = [start];
  const order: string[] = [];

  console.log(`\n🏰 DFS Iterative from "${start}"`);
  console.log(`   Stack initialized: [${start}]`);

  while (stack.length > 0) {
    // POP: take the node from the top of the stack (LIFO)
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);

    // Push neighbors in REVERSE order so the first neighbor is on top
    const pushed: string[] = [];
    const neighbors = graph.get(node) || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) {
        stack.push(neighbors[i]);
        pushed.push(neighbors[i]);
      }
    }

    console.log(
      `   Pop: ${node} | Pushed: [${pushed.join(", ")}] | Stack: [${stack.join(", ")}]`
    );
  }

  console.log(`   ✅ DFS Iterative Order: ${order.join(" → ")}`);
  return order;
}


// ────────────────────────────────────────────────────────────
// 3️⃣  BFS SHORTEST PATH (Unweighted Graph)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Find the shortest path (fewest edges) between two nodes
//        in an unweighted graph. Returns both the distance and
//        the actual path.
//
// WHY BFS IS OPTIMAL HERE:
//   BFS explores nodes in order of increasing distance. The FIRST
//   time we reach the destination, we've found the SHORTEST path.
//   This is guaranteed because all edges have equal weight (1).
//   DFS would find A path, but not necessarily the shortest.
//
// HOW (step-by-step):
//   1. Initialize queue with [start, [start]] — node + path so far.
//   2. While queue is not empty:
//      a. Dequeue [node, path].
//      b. For each unvisited neighbor:
//         - If it's the destination → return path + neighbor.
//         - Otherwise: mark visited, enqueue [neighbor, path + neighbor].
//   3. If queue empties without finding destination → no path exists.
//
// COMPLEXITY:
//   Time:  O(V + E)
//   Space: O(V) — queue and visited set (plus O(V²) for stored paths)
//
// REAL-WORLD ANALOGY:
//   Google Maps finding the route with the fewest turns (if all
//   roads were the same length). BFS radiates outward from the
//   start until it touches the destination.
// ────────────────────────────────────────────────────────────

function bfsShortestPath(
  graph: Map<string, string[]>,
  start: string,
  end: string
): { distance: number; path: string[] } {
  console.log(`\n📏 BFS Shortest Path: "${start}" → "${end}"`);

  if (start === end) {
    console.log(`   Already at destination! Distance: 0`);
    return { distance: 0, path: [start] };
  }

  const visited = new Set<string>([start]);
  const queue: [string, string[]][] = [[start, [start]]];

  while (queue.length > 0) {
    const [node, path] = queue.shift()!;

    for (const neighbor of graph.get(node) || []) {
      if (neighbor === end) {
        const fullPath = [...path, neighbor];
        console.log(`   ✅ Found! Distance: ${fullPath.length - 1}`);
        console.log(`   📍 Path: ${fullPath.join(" → ")}`);
        return { distance: fullPath.length - 1, path: fullPath };
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  console.log(`   ❌ No path found!`);
  return { distance: -1, path: [] };
}


// ────────────────────────────────────────────────────────────
// 4️⃣  NUMBER OF ISLANDS (DFS on Grid)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a 2D grid of '1' (land) and '0' (water), count
//        the number of islands. An island is a group of '1's
//        connected horizontally or vertically (not diagonally).
//        LeetCode 200 — a classic grid DFS problem.
//
// WHY DFS:
//   When we find a '1', we need to "flood" the entire connected
//   land mass to mark it as visited (so we don't double-count).
//   DFS naturally follows connected components — it dives into
//   each neighboring '1' recursively until the entire island
//   is "sunk" (marked as '0').
//
// HOW (step-by-step):
//   1. Scan the grid cell by cell.
//   2. When we find a '1' (unvisited land):
//      a. Increment island count.
//      b. DFS from that cell: mark it '0' (sink it), then
//         recurse into all 4 neighbors (up, down, left, right).
//      c. The DFS stops when it hits water ('0') or grid boundaries.
//   3. After the scan, island count is the answer.
//
// COMPLEXITY:
//   Time:  O(rows × cols) — each cell visited at most once
//   Space: O(rows × cols) — worst-case recursion depth (entire grid is land)
//
// REAL-WORLD ANALOGY:
//   Imagine pouring paint on each piece of land you find. The
//   paint spreads to all connected land cells. Each "pour" is
//   one island.
// ────────────────────────────────────────────────────────────

function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  console.log(`\n🏝️  Number of Islands`);
  console.log(`   Grid (${rows}×${cols}):`);
  for (const row of grid) console.log(`   ${row.join(" ")}`);

  function dfs(r: number, c: number, id: number): void {
    // Boundary check + water check (base case for the recursion)
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === "0") return;

    // SINK: mark as visited by turning land into water
    grid[r][c] = "0";
    console.log(`   🔵 Island ${id}: visiting (${r}, ${c})`);

    // Explore all 4 cardinal directions
    dfs(r - 1, c, id);  // up
    dfs(r + 1, c, id);  // down
    dfs(r, c - 1, id);  // left
    dfs(r, c + 1, id);  // right
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        console.log(`   🏝️  Found island #${count} starting at (${r}, ${c})`);
        dfs(r, c, count);
      }
    }
  }

  console.log(`   ✅ Total islands: ${count}`);
  return count;
}


// ────────────────────────────────────────────────────────────
// 5️⃣  ROTTING ORANGES (Multi-Source BFS)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a grid where 0=empty, 1=fresh orange, 2=rotten orange,
//        each minute every rotten orange rots its 4-directional fresh
//        neighbors. Return the minimum minutes until no fresh oranges
//        remain, or -1 if it's impossible. LeetCode 994.
//
// WHY MULTI-SOURCE BFS:
//   All rotten oranges rot their neighbors SIMULTANEOUSLY — this
//   is a classic MULTI-SOURCE BFS problem. We seed the queue with
//   ALL initially rotten oranges, then process them level by level.
//   Each "level" = one minute of rotting.
//
// HOW (step-by-step):
//   1. Scan the grid: push all rotten oranges (2) into the queue,
//      count all fresh oranges (1).
//   2. If fresh == 0, return 0 (nothing to rot).
//   3. BFS level by level:
//      a. Process all nodes at the current level (current minute).
//      b. For each rotten orange, check 4 neighbors.
//      c. If a neighbor is fresh → rot it (set to 2), decrement
//         fresh count, enqueue it.
//   4. After each level, increment the minute counter.
//   5. If fresh == 0 → return minutes. Otherwise → return -1.
//
// COMPLEXITY:
//   Time:  O(rows × cols) — each cell processed at most once
//   Space: O(rows × cols) — for the queue
//
// REAL-WORLD ANALOGY:
//   Think of a virus spreading through a population simultaneously
//   from multiple patient-zero locations. BFS models this perfectly
//   because it spreads outward from ALL sources at once.
// ────────────────────────────────────────────────────────────

function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const queue: [number, number][] = [];
  let fresh = 0;

  console.log(`\n🍊 Rotting Oranges`);
  console.log(`   Grid: (0=empty, 1=fresh🍊, 2=rotten🤢)`);
  for (const row of grid) {
    const symbols = row.map((v) => (v === 0 ? "·" : v === 1 ? "🍊" : "🤢"));
    console.log(`   ${symbols.join(" ")}`);
  }

  // Seed the BFS queue with ALL rotten oranges (multi-source)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  console.log(`   Initial: ${fresh} fresh, ${queue.length} rotten sources`);
  if (fresh === 0) {
    console.log(`   ✅ No fresh oranges — answer: 0`);
    return 0;
  }

  let minutes = 0;

  // BFS: process level by level (each level = 1 minute)
  while (queue.length > 0 && fresh > 0) {
    const size = queue.length;
    minutes++;
    const rotted: string[] = [];

    for (let i = 0; i < size; i++) {
      const [row, col] = queue.shift()!;

      for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; // rot it!
          fresh--;
          queue.push([nr, nc]);
          rotted.push(`(${nr},${nc})`);
        }
      }
    }

    console.log(`   Minute ${minutes}: rotted [${rotted.join(", ")}] | Fresh remaining: ${fresh}`);
  }

  const result = fresh === 0 ? minutes : -1;
  console.log(`   ✅ Answer: ${result}${result === -1 ? " (impossible)" : " minutes"}`);
  return result;
}


// ────────────────────────────────────────────────────────────
// 6️⃣  LEVEL-ORDER TRAVERSAL OF BINARY TREE (BFS on Tree)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Visit a binary tree level by level (top to bottom,
//        left to right within each level). Return a 2D array
//        where each inner array is one level.
//        Example:     1            → [[1], [2,3], [4,5,6,7]]
//                    / \
//                   2   3
//                  / \ / \
//                 4  5 6  7
//
// WHY BFS:
//   BFS is the NATURAL fit for level-order traversal because
//   it processes nodes layer by layer — exactly what we want.
//   The key trick: at each step, we process ALL nodes currently
//   in the queue (that's the entire current level), then move on.
//
// HOW (step-by-step):
//   1. Initialize queue with the root.
//   2. While queue is not empty:
//      a. Record levelSize = queue.length (nodes in this level).
//      b. Process exactly levelSize nodes:
//         - Dequeue a node, add its value to currentLevel.
//         - Enqueue its left and right children (if they exist).
//      c. Push currentLevel to the result.
//   3. Return result.
//
// COMPLEXITY:
//   Time:  O(n) — visit every node once
//   Space: O(n) — the queue can hold up to n/2 nodes (bottom level)
//
// KEY INSIGHT:
//   The "process exactly levelSize nodes" trick is what separates
//   level-order BFS from plain BFS. Without it, you'd visit all
//   nodes but couldn't tell which level each belongs to.
// ────────────────────────────────────────────────────────────

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function makeTree(val: number, left?: TreeNode | null, right?: TreeNode | null): TreeNode {
  return { val, left: left ?? null, right: right ?? null };
}

function levelOrder(root: TreeNode | null): number[][] {
  console.log(`\n🌳 Level-Order Traversal (BFS)`);

  if (!root) {
    console.log(`   Empty tree`);
    return [];
  }

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    // Snapshot the current level size BEFORE we start enqueuing children
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    console.log(`   Level ${result.length}: [${currentLevel.join(", ")}]`);
    result.push(currentLevel);
  }

  console.log(`   ✅ All levels: [${result.map((l) => `[${l.join(",")}]`).join(", ")}]`);
  return result;
}


// ────────────────────────────────────────────────────────────
// 7️⃣  FLOOD FILL (DFS on Grid)
// ────────────────────────────────────────────────────────────
//
// WHAT:  Given a 2D image (grid of pixel colors), a starting pixel
//        (sr, sc), and a new color, "flood fill" all pixels connected
//        to the starting pixel that share the same original color.
//        This is the "paint bucket" tool in image editors.
//        LeetCode 733.
//
// WHY DFS:
//   Starting from (sr, sc), we recursively spread to all 4-connected
//   pixels with the same color — just like pouring paint. DFS
//   naturally follows connected regions, coloring as it goes.
//
// HOW (step-by-step):
//   1. Record the originalColor at (sr, sc).
//   2. If originalColor === newColor → no work needed (avoid infinite loop).
//   3. DFS from (sr, sc):
//      a. If out of bounds OR cell color ≠ originalColor → return (base case).
//      b. Set cell color to newColor.
//      c. Recurse into all 4 neighbors.
//   4. Return the modified image.
//
// COMPLEXITY:
//   Time:  O(rows × cols) — worst case: entire image is one color
//   Space: O(rows × cols) — recursion stack depth
//
// EDGE CASE:
//   If originalColor === newColor, we must return immediately.
//   Otherwise the DFS would never stop — every pixel it visits
//   still matches "originalColor" because we just set it to the
//   same value!
// ────────────────────────────────────────────────────────────

function floodFill(
  image: number[][],
  sr: number,
  sc: number,
  color: number
): number[][] {
  const rows = image.length;
  const cols = image[0].length;
  const originalColor = image[sr][sc];

  console.log(`\n🎨 Flood Fill — start (${sr},${sc}), color ${originalColor} → ${color}`);
  console.log(`   Before:`);
  for (const row of image) console.log(`   ${row.join(" ")}`);

  // CRITICAL: if same color, no-op (prevents infinite recursion)
  if (originalColor === color) {
    console.log(`   Same color — no change needed`);
    return image;
  }

  let filled = 0;

  function dfs(r: number, c: number): void {
    // Base case: out of bounds or wrong color
    if (
      r < 0 || r >= rows ||
      c < 0 || c >= cols ||
      image[r][c] !== originalColor
    ) return;

    // Paint this pixel with the new color
    image[r][c] = color;
    filled++;
    console.log(`   🖌️  Fill (${r},${c})`);

    // Spread to all 4 cardinal directions
    dfs(r - 1, c);  // up
    dfs(r + 1, c);  // down
    dfs(r, c - 1);  // left
    dfs(r, c + 1);  // right
  }

  dfs(sr, sc);

  console.log(`   After (${filled} cells filled):`);
  for (const row of image) console.log(`   ${row.join(" ")}`);
  return image;
}


// ============================================================
// 🚀 RUN ALL EXAMPLES
// ============================================================
//
// Below we set up sample data and run each algorithm with
// detailed logging so you can see exactly how BFS and DFS
// explore their respective data structures.
// ============================================================

console.log("═".repeat(60));
console.log("  Chapter 14: BFS and DFS — Examples");
console.log("═".repeat(60));

// ── Graph setup ──
const edges: [string, string][] = [
  ["A", "B"], ["A", "C"],
  ["B", "D"], ["B", "E"],
  ["C", "F"],
  ["D", "G"], ["E", "G"],
];
const graph = buildGraph(edges);

console.log("\n📊 Graph adjacency list:");
for (const [node, neighbors] of graph) {
  console.log(`   ${node} → [${neighbors.join(", ")}]`);
}

// 1. BFS on graph — watch the queue expand level by level
bfsGraph(graph, "A");

// 2a. DFS recursive — watch the depth-first dive and backtracking
dfsGraphRecursive(graph, "A");

// 2b. DFS iterative — same traversal, explicit stack
dfsGraphIterative(graph, "A");

// 3. BFS shortest path — finds the minimum-edge path
const pathGraph = buildGraph([
  ["S", "A"], ["S", "B"],
  ["A", "C"], ["A", "D"],
  ["B", "D"], ["B", "E"],
  ["D", "F"], ["E", "F"],
  ["F", "G"],
]);
bfsShortestPath(pathGraph, "S", "G");

// 4. Number of Islands — DFS flood-fills each island
numIslands([
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
]);

// 5. Rotting Oranges — multi-source BFS spreading rot
orangesRotting([
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
]);

// 6. Level-order traversal — BFS on a binary tree
const tree = makeTree(
  1,
  makeTree(2, makeTree(4), makeTree(5)),
  makeTree(3, makeTree(6), makeTree(7))
);
levelOrder(tree);

// 7. Flood Fill — DFS paint bucket on a grid
floodFill(
  [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
  ],
  1, 1, 2
);

console.log("\n" + "═".repeat(60));
console.log("  ✅ All examples complete!");
console.log("═".repeat(60));
