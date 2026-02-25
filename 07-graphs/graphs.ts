export {};

// ================================================================
// 📊 CHAPTER 7: GRAPHS — Runnable Examples
// ================================================================
// Run: bun run graphs.ts
//
// Graphs are the most general-purpose data structure. They model
// any relationship: social networks (friends), maps (roads),
// dependencies (build systems), state machines, and more.
//
// A graph is just a set of VERTICES (nodes) connected by EDGES.
// Unlike trees, graphs can have cycles, multiple paths between
// nodes, and no single "root."
//
// Two main representations:
//   - Adjacency List: Map<Node, Node[]> — memory efficient O(V + E)
//   - Adjacency Matrix: boolean[][] — fast edge lookup O(1)
//   We use adjacency lists here (standard for sparse graphs).
//
// This file covers:
//   1. Graph class (adjacency list, directed & undirected)
//   2. BFS — breadth-first traversal + shortest path (unweighted)
//   3. DFS — depth-first traversal (recursive & iterative)
//   4. Topological Sort — Kahn's algorithm for dependency ordering
//   5. Union-Find — disjoint set for connected components
//   6. Number of Islands — grid BFS (2D graph problem)
//   7. Cycle Detection — in both undirected and directed graphs
// ================================================================


// ================================================================
// 1️⃣  GRAPH CLASS (Adjacency List)
// ================================================================
// WHAT: A generic graph that stores connections as an adjacency
//   list — a Map where each vertex maps to an array of neighbors.
//
// WHY adjacency list over adjacency matrix?
//   - Space: O(V + E) vs O(V²). For sparse graphs (most
//     real-world graphs), this saves enormous memory.
//   - Adding vertices: O(1) vs O(V²) to resize the matrix.
//   - Trade-off: edge existence check is O(degree) vs O(1).
//
// DIRECTED vs UNDIRECTED:
//   - Undirected: addEdge(A, B) creates A→B AND B→A.
//   - Directed: addEdge(A, B) creates only A→B.
//
// REAL-WORLD ANALOGY:
//   Think of a contact list on your phone. Each person (vertex)
//   has a list of friends (edges). For undirected, if you're
//   friends with someone, they're friends with you too.
//   For directed, think of Twitter follows — you can follow
//   someone without them following you back.
//
// COMPLEXITY:
//   addVertex — O(1)
//   addEdge — O(1)
//   removeEdge — O(degree) to filter the neighbor list
//   removeVertex — O(degree) to clean up all edges
//   Space — O(V + E)
// ================================================================

class Graph<T = string> {
  private adjacencyList: Map<T, T[]>;
  private directed: boolean;

  constructor(directed = false) {
    this.adjacencyList = new Map();
    this.directed = directed;
  }

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1: T, v2: T): void {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList.get(v1)!.push(v2);
    if (!this.directed) {
      this.adjacencyList.get(v2)!.push(v1);
    }
  }

  removeEdge(v1: T, v2: T): void {
    this.adjacencyList.set(
      v1,
      (this.adjacencyList.get(v1) || []).filter((v) => v !== v2)
    );
    if (!this.directed) {
      this.adjacencyList.set(
        v2,
        (this.adjacencyList.get(v2) || []).filter((v) => v !== v1)
      );
    }
  }

  removeVertex(vertex: T): void {
    for (const neighbor of this.adjacencyList.get(vertex) || []) {
      this.removeEdge(neighbor, vertex);
    }
    this.adjacencyList.delete(vertex);
  }

  getNeighbors(vertex: T): T[] {
    return this.adjacencyList.get(vertex) || [];
  }

  getVertices(): T[] {
    return [...this.adjacencyList.keys()];
  }

  getAdjList(): Map<T, T[]> {
    return this.adjacencyList;
  }

  display(): void {
    for (const [vertex, neighbors] of this.adjacencyList) {
      console.log(`  ${vertex} → [${neighbors.join(", ")}]`);
    }
  }
}


// ================================================================
// 2️⃣  BFS TRAVERSAL + SHORTEST PATH (Unweighted)
// ================================================================
// WHAT: Breadth-First Search explores all neighbors at the current
//   depth before moving to the next depth level.
//
// HOW:
//   1. Start with the source node in a queue. Mark it visited.
//   2. Dequeue a node → process it → enqueue all unvisited neighbors.
//   3. Repeat until the queue is empty.
//
// WHY a queue (FIFO)? A queue ensures we process nodes in the
//   order they were discovered. Nodes at distance d are all
//   processed before any node at distance d+1. This is what
//   makes BFS find the SHORTEST PATH in unweighted graphs.
//
// REAL-WORLD ANALOGY:
//   Imagine dropping a stone in a pond. Ripples spread outward
//   in concentric circles. BFS explores the graph the same way —
//   wave by wave, layer by layer, from the starting point.
//
// COMPLEXITY: O(V + E) time, O(V) space
// ================================================================

function bfsTraversal(
  graph: Map<string, string[]>,
  start: string
): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  const queue: string[] = [start];
  visited.add(start);

  while (queue.length > 0) {
    const vertex = queue.shift()!;
    result.push(vertex);

    for (const neighbor of graph.get(vertex) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// ──────────────────────────────────────────────────────────────
// BFS SHORTEST PATH — finding the shortest path between two nodes
// ──────────────────────────────────────────────────────────────
// HOW: Standard BFS, but we also track:
//   - Distance: incremented each level
//   - Parent map: to reconstruct the path by backtracking
//     from the destination to the source
//
// WHY BFS guarantees shortest path in unweighted graphs:
//   BFS explores all nodes at distance d before any at d+1.
//   So the FIRST time we reach the target, we've found the
//   shortest path. No need to explore further.
//
// IMPORTANT: This only works for UNWEIGHTED graphs. For
//   weighted graphs, you need Dijkstra's algorithm.
// ──────────────────────────────────────────────────────────────

function bfsShortestPath(
  graph: Map<number, number[]>,
  start: number,
  end: number
): { distance: number; path: number[] } {
  const visited = new Set<number>();
  const parent = new Map<number, number>();
  const queue: [number, number][] = [[start, 0]];
  visited.add(start);
  parent.set(start, -1);

  while (queue.length > 0) {
    const [node, dist] = queue.shift()!;

    if (node === end) {
      const path: number[] = [];
      let current: number | undefined = end;
      while (current !== undefined && current !== -1) {
        path.unshift(current);
        current = parent.get(current);
      }
      return { distance: dist, path };
    }

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, node);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return { distance: -1, path: [] };
}


// ================================================================
// 3️⃣  DFS TRAVERSAL (Recursive + Iterative)
// ================================================================
// WHAT: Depth-First Search explores as far down one path as
//   possible before backtracking and trying another path.
//
// HOW (Recursive):
//   Visit the current node → recurse on each unvisited neighbor.
//   The call stack naturally handles backtracking.
//
// HOW (Iterative):
//   Use an explicit stack instead of the call stack. Push neighbors
//   in REVERSE order so they're popped in the correct order
//   (matching the recursive version's behavior).
//
// WHEN TO USE DFS vs BFS:
//   DFS: cycle detection, topological sort, pathfinding in mazes,
//        connected components, backtracking problems.
//   BFS: shortest path (unweighted), level-order processing,
//        finding nodes closest to a source.
//
// REAL-WORLD ANALOGY:
//   Exploring a maze. DFS goes as deep as possible down one
//   corridor, hits a dead end, then backtracks to the last fork
//   and tries a different corridor. BFS would explore all
//   corridors one step at a time (less useful for maze solving).
//
// COMPLEXITY: O(V + E) time, O(V) space
// ================================================================

function dfsRecursive(
  graph: Map<string, string[]>,
  start: string
): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(vertex: string): void {
    visited.add(vertex);
    result.push(vertex);

    for (const neighbor of graph.get(vertex) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);
  return result;
}

function dfsIterative(
  graph: Map<string, string[]>,
  start: string
): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  const stack: string[] = [start];

  while (stack.length > 0) {
    const vertex = stack.pop()!;

    if (visited.has(vertex)) continue;
    visited.add(vertex);
    result.push(vertex);

    const neighbors = graph.get(vertex) || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) {
        stack.push(neighbors[i]);
      }
    }
  }

  return result;
}


// ================================================================
// 4️⃣  TOPOLOGICAL SORT — Kahn's Algorithm (BFS + In-Degree)
// ================================================================
// WHAT: Produce a linear ordering of vertices such that for every
//   directed edge u → v, u comes before v. Only possible on
//   Directed Acyclic Graphs (DAGs). If there's a cycle, no valid
//   ordering exists.
//
// WHY: Dependency resolution! Course prerequisites, build systems
//   (compile A before B), task scheduling, package managers.
//
// HOW (Kahn's Algorithm):
//   1. Count "in-degree" for each node (how many edges point TO it).
//   2. Add all nodes with in-degree 0 to a queue (they have no
//      dependencies — safe to process first).
//   3. Dequeue a node → add to result → decrement in-degree of
//      all its neighbors. If any neighbor's in-degree reaches 0,
//      add it to the queue.
//   4. If result contains all nodes → valid topological order.
//      If not → there's a cycle (some nodes could never reach
//      in-degree 0 because they're in a circular dependency).
//
// REAL-WORLD ANALOGY:
//   University course planning. You can only take "Algorithms"
//   after completing "Data Structures." Topological sort gives
//   you a valid semester-by-semester plan.
//
// COMPLEXITY: O(V + E) time, O(V) space
// ================================================================

function topologicalSort(
  numCourses: number,
  prerequisites: number[][]
): number[] {
  const graph = new Map<number, number[]>();
  const inDegree = new Array(numCourses).fill(0);

  for (let i = 0; i < numCourses; i++) graph.set(i, []);

  for (const [course, prereq] of prerequisites) {
    graph.get(prereq)!.push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const neighbor of graph.get(node)!) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return order.length === numCourses ? order : [];
}


// ================================================================
// 5️⃣  UNION-FIND (Disjoint Set Union)
// ================================================================
// WHAT: A data structure that tracks elements partitioned into
//   disjoint (non-overlapping) sets. Supports two operations:
//     - find(x): which set does x belong to? (returns the "root")
//     - union(x, y): merge the sets containing x and y
//
// WHY: Incredibly efficient for connectivity queries. "Are A and
//   B connected?" without doing BFS/DFS each time. Used in
//   Kruskal's MST, network connectivity, image segmentation.
//
// HOW:
//   - Each set is a tree. Each element points to its parent.
//     The root of the tree is the set's "representative."
//   - find(x): follow parent pointers to the root.
//   - union(x, y): attach one root to the other.
//
// TWO OPTIMIZATIONS (crucial for near-O(1) amortized):
//
//   1. PATH COMPRESSION (in find):
//      When finding the root of x, make every node along the
//      path point DIRECTLY to the root. Next time, find is O(1)
//      for all those nodes. This flattens the tree over time.
//
//   2. UNION BY RANK:
//      When merging two sets, attach the SHORTER tree under the
//      TALLER tree. This prevents the tree from becoming a long
//      chain (which would make find slow).
//
// REAL-WORLD ANALOGY:
//   Social network groups. Each person points to their "group
//   leader." When two groups merge, one leader becomes subordinate
//   to the other. Over time, path compression means everyone
//   directly knows their ultimate leader.
//
// COMPLEXITY:
//   find / union — O(α(n)) amortized, where α is the inverse
//   Ackermann function. For all practical purposes, this is O(1).
//   Space — O(n)
// ================================================================

class UnionFind {
  private parent: number[];
  private rank: number[];
  public components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.components--;
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}


// ================================================================
// 6️⃣  NUMBER OF ISLANDS (Grid BFS)
// ================================================================
// WHAT: Given a 2D grid of '1's (land) and '0's (water), count
//   the number of islands. An island is a group of connected '1's
//   (horizontally or vertically, not diagonally).
//
// WHY: This is the quintessential "graph on a grid" problem.
//   The grid IS the graph — each cell is a node, and adjacent
//   cells (up/down/left/right) are edges.
//
// HOW:
//   1. Scan every cell in the grid.
//   2. When we find a '1' → it's a new island! Increment counter.
//   3. BFS from that cell to "sink" (mark as '0') all connected
//      land cells, so we don't count them again.
//   4. Continue scanning. Each new '1' we find is a new island.
//
// WHY "sink" the island? To avoid revisiting. We mark visited
//   cells as '0' (water) so they're treated as already processed.
//   This is an in-place visited set — no extra memory needed.
//
// REAL-WORLD ANALOGY:
//   Looking at a satellite photo. You scan left-to-right,
//   top-to-bottom. When you spot land, you "flood-fill" the
//   entire island to map it, then continue scanning for the
//   next uncharted island.
//
// COMPLEXITY: O(rows × cols) time, O(min(rows, cols)) space for queue
// ================================================================

function numIslands(grid: string[][]): number {
  if (grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const DIRECTIONS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let islands = 0;

  function bfs(startR: number, startC: number): void {
    const queue: [number, number][] = [[startR, startC]];
    grid[startR][startC] = "0";

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1") {
          grid[nr][nc] = "0";
          queue.push([nr, nc]);
        }
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        islands++;
        bfs(r, c);
      }
    }
  }

  return islands;
}


// ================================================================
// 7️⃣  CYCLE DETECTION
// ================================================================
// Detecting cycles is critical for many applications:
//   - Deadlock detection in operating systems
//   - Validating that a dependency graph is a DAG
//   - Checking if a linked list has a loop
//
// The approach differs for undirected and directed graphs.
// ================================================================

// ──────────────────────────────────────────────────────────────
// CYCLE DETECTION — Undirected Graph (DFS with parent tracking)
// ──────────────────────────────────────────────────────────────
// HOW: Run DFS. Track the "parent" of each node (who we came
//   from). If we find a visited neighbor that ISN'T our parent,
//   we've found a cycle.
//
// WHY track parent? In an undirected graph, A→B and B→A always
//   exist. Without parent tracking, we'd falsely detect a "cycle"
//   every time we look back at the node we just came from.
//
// COMPLEXITY: O(V + E) time, O(V) space
// ──────────────────────────────────────────────────────────────

function hasCycleUndirected(n: number, edges: number[][]): boolean {
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  const visited = new Set<number>();

  function dfs(node: number, parent: number): boolean {
    visited.add(node);
    for (const neighbor of graph.get(node)!) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      if (dfs(i, -1)) return true;
    }
  }
  return false;
}

// ──────────────────────────────────────────────────────────────
// CYCLE DETECTION — Directed Graph (3-Color DFS)
// ──────────────────────────────────────────────────────────────
// HOW: Use three "colors" for each node:
//   WHITE (0) = unvisited
//   GRAY  (1) = currently being explored (in the DFS call stack)
//   BLACK (2) = fully explored (all descendants processed)
//
// If during DFS we encounter a GRAY neighbor, we've found a
// "back edge" — an edge leading back to a node that's still
// being explored. That's a cycle!
//
// WHY 3 colors instead of 2?
//   In directed graphs, seeing a visited node doesn't mean cycle.
//   The node might be BLACK (fully explored via another path).
//   Only GRAY means "I'm still on the current path" → cycle.
//
// REAL-WORLD ANALOGY:
//   Imagine tracing dependencies. You're currently installing
//   package A, which needs B, which needs C, which needs A again.
//   That circular dependency (A→B→C→A) is a GRAY→GRAY back edge.
//
// COMPLEXITY: O(V + E) time, O(V) space
// ──────────────────────────────────────────────────────────────

function hasCycleDirected(n: number, edges: number[][]): boolean {
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
  }

  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Array(n).fill(WHITE);

  function dfs(node: number): boolean {
    color[node] = GRAY;
    for (const neighbor of graph.get(node)!) {
      if (color[neighbor] === GRAY) return true;
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (color[i] === WHITE && dfs(i)) return true;
  }
  return false;
}


// ================================================================
// 🚀 Run All Examples
// ================================================================

function main(): void {
  console.log("=".repeat(60));
  console.log("📊 GRAPHS — RUNNABLE EXAMPLES");
  console.log("=".repeat(60));

  // ── 1. Graph Class ──────────────────────────────────────────

  console.log("\n🔷 1. Graph Class (Adjacency List)\n");

  const g = new Graph<string>(false);
  g.addEdge("A", "B");
  g.addEdge("A", "C");
  g.addEdge("B", "D");
  g.addEdge("C", "D");
  g.addEdge("D", "E");
  g.addEdge("C", "E");

  console.log("Undirected graph:");
  g.display();

  const dg = new Graph<string>(true);
  dg.addEdge("A", "B");
  dg.addEdge("A", "C");
  dg.addEdge("B", "D");
  dg.addEdge("C", "D");

  console.log("\nDirected graph:");
  dg.display();

  // ── 2. BFS Traversal + Shortest Path ────────────────────────

  console.log("\n🔷 2. BFS Traversal + Shortest Path\n");

  const adjList = g.getAdjList();
  console.log("BFS from A:", bfsTraversal(adjList, "A").join(" → "));

  const numGraph = new Map<number, number[]>();
  numGraph.set(0, [1, 2]);
  numGraph.set(1, [0, 3]);
  numGraph.set(2, [0, 3, 4]);
  numGraph.set(3, [1, 2, 5]);
  numGraph.set(4, [2]);
  numGraph.set(5, [3]);

  const result = bfsShortestPath(numGraph, 0, 5);
  console.log(`Shortest path 0 → 5: distance = ${result.distance}, path = [${result.path.join(" → ")}]`);

  const noPath = bfsShortestPath(numGraph, 4, 5);
  console.log(`Shortest path 4 → 5: distance = ${noPath.distance}, path = [${noPath.path.join(" → ")}]`);

  // ── 3. DFS Traversal ───────────────────────────────────────

  console.log("\n🔷 3. DFS Traversal\n");

  console.log("DFS Recursive from A:", dfsRecursive(adjList, "A").join(" → "));
  console.log("DFS Iterative from A:", dfsIterative(adjList, "A").join(" → "));

  // ── 4. Topological Sort ─────────────────────────────────────

  console.log("\n🔷 4. Topological Sort (Course Schedule II)\n");

  const prerequisites = [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ];

  const order = topologicalSort(4, prerequisites);
  console.log("Courses:", 4);
  console.log("Prerequisites:", JSON.stringify(prerequisites));
  console.log("Valid order:", order.length > 0 ? order.join(" → ") : "IMPOSSIBLE (cycle detected)");

  const cyclicPrereqs = [
    [1, 0],
    [0, 1],
  ];
  const cyclicOrder = topologicalSort(2, cyclicPrereqs);
  console.log("\nCyclic prerequisites:", JSON.stringify(cyclicPrereqs));
  console.log("Valid order:", cyclicOrder.length > 0 ? cyclicOrder.join(" → ") : "IMPOSSIBLE (cycle detected)");

  // ── 5. Union-Find ───────────────────────────────────────────

  console.log("\n🔷 5. Union-Find (Disjoint Set)\n");

  const uf = new UnionFind(7);

  console.log(`Initial components: ${uf.components}`);

  const unions: [number, number][] = [
    [0, 1],
    [1, 2],
    [3, 4],
    [5, 6],
    [4, 5],
  ];

  for (const [a, b] of unions) {
    uf.union(a, b);
    console.log(`union(${a}, ${b}) → components: ${uf.components}`);
  }

  console.log(`\nconnected(0, 2): ${uf.connected(0, 2)}`);
  console.log(`connected(0, 3): ${uf.connected(0, 3)}`);
  console.log(`connected(3, 6): ${uf.connected(3, 6)}`);

  console.log("\nUsing Union-Find for cycle detection:");
  const ufCycle = new UnionFind(4);
  const edgesForCycle: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  let cycleFound = false;
  for (const [a, b] of edgesForCycle) {
    const merged = ufCycle.union(a, b);
    if (!merged) {
      console.log(`Edge (${a}, ${b}) creates a cycle! (both already in same component)`);
      cycleFound = true;
      break;
    }
    console.log(`Edge (${a}, ${b}) added successfully`);
  }
  if (!cycleFound) console.log("No cycle detected");

  // ── 6. Number of Islands ────────────────────────────────────

  console.log("\n🔷 6. Number of Islands (Grid BFS)\n");

  const grid1: string[][] = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];

  console.log("Grid:");
  for (const row of grid1) {
    console.log("  " + row.join(" "));
  }
  console.log(`Number of islands: ${numIslands(grid1)}`);

  const grid2: string[][] = [
    ["1", "1", "1", "1", "0"],
    ["1", "1", "0", "1", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
  ];

  console.log("\nGrid:");
  for (const row of grid2) {
    console.log("  " + row.join(" "));
  }
  console.log(`Number of islands: ${numIslands(grid2)}`);

  // ── 7. Cycle Detection ──────────────────────────────────────

  console.log("\n🔷 7. Cycle Detection\n");

  console.log("Undirected graph cycle detection:");
  const acyclicEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
  ];
  console.log(`  Edges ${JSON.stringify(acyclicEdges)}: has cycle = ${hasCycleUndirected(4, acyclicEdges)}`);

  const cyclicEdges = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];
  console.log(`  Edges ${JSON.stringify(cyclicEdges)}: has cycle = ${hasCycleUndirected(3, cyclicEdges)}`);

  console.log("\nDirected graph cycle detection:");
  const dagEdges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];
  console.log(`  Edges ${JSON.stringify(dagEdges)}: has cycle = ${hasCycleDirected(4, dagEdges)}`);

  const dirCyclicEdges = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];
  console.log(`  Edges ${JSON.stringify(dirCyclicEdges)}: has cycle = ${hasCycleDirected(3, dirCyclicEdges)}`);

  // ── Summary ─────────────────────────────────────────────────

  console.log("\n" + "=".repeat(60));
  console.log("✅ All graph examples completed!");
  console.log("=".repeat(60));
}

main();
