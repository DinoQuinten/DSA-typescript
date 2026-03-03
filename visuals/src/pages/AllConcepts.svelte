<script>
  import { onMount } from "svelte";
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";

  const concepts = [
    {
      id: "bfs-dfs",
      name: "BFS / DFS",
      summary: "Traversal order changes with queue vs stack frontier behavior.",
      type: "graph",
      code: `function traverse(graph, start, mode) {
  const frontier = [start];
  const visited = new Set();
  while (frontier.length) {
    const node = mode === "BFS" ? frontier.shift() : frontier.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    for (const next of graph.get(node)) frontier.push(next);
  }
}`,
      stepNotes: [
        "Initialize frontier with start node.",
        "Take next node from queue/stack.",
        "Skip node if already visited.",
        "Mark node visited.",
        "Push neighbors to frontier.",
        "Repeat until frontier empty."
      ],
      lineMap: [2, 5, 6, 7, 8, 4]
    },
    {
      id: "dijkstra",
      name: "Dijkstra",
      summary: "Shortest path expands from current best known distance.",
      type: "weighted-graph",
      code: `function dijkstra(graph, start) {
  const dist = new Map([[start, 0]]);
  const pq = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    for (const [to, w] of graph.get(node)) {
      const nd = d + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        pq.push([nd, to]);
      }
    }
  }
}`,
      stepNotes: [
        "Set source distance to zero.",
        "Pick smallest-distance node from priority queue.",
        "Relax outgoing edges.",
        "Update shorter neighbor distance.",
        "Push improved neighbor into queue.",
        "Continue until queue is empty."
      ],
      lineMap: [2, 5, 7, 9, 11, 4]
    },
    {
      id: "topo",
      name: "Topological Sort",
      summary: "Nodes with indegree zero are resolved layer by layer.",
      type: "dag",
      code: `function topoSort(graph, indegree) {
  const q = [];
  for (const [n, d] of indegree) if (d === 0) q.push(n);
  const order = [];
  while (q.length) {
    const node = q.shift();
    order.push(node);
    for (const next of graph.get(node)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) q.push(next);
    }
  }
  return order;
}`,
      stepNotes: [
        "Collect all indegree-zero nodes.",
        "Remove one node from queue.",
        "Append it to topological order.",
        "Reduce indegree of outgoing neighbors.",
        "Push neighbors that become zero.",
        "Finish when queue is empty."
      ],
      lineMap: [3, 6, 7, 9, 10, 13]
    },
    {
      id: "union-find",
      name: "Union-Find",
      summary: "Visualize parent links and component merges efficiently.",
      type: "uf",
      code: `class DSU {
  constructor(n) { this.p = [...Array(n).keys()]; this.r = Array(n).fill(1); }
  find(x) { return this.p[x] === x ? x : (this.p[x] = this.find(this.p[x])); }
  union(a, b) {
    a = this.find(a); b = this.find(b);
    if (a === b) return false;
    if (this.r[a] < this.r[b]) [a, b] = [b, a];
    this.p[b] = a; this.r[a] += this.r[b];
    return true;
  }
}`,
      stepNotes: [
        "Start with each node as its own parent.",
        "Find root for first node.",
        "Find root for second node.",
        "If roots differ, merge components.",
        "Attach smaller rank under larger.",
        "Path compression speeds future finds."
      ],
      lineMap: [2, 3, 5, 6, 7, 3]
    },
    {
      id: "tree",
      name: "Tree Traversal / BST",
      summary: "Traversal order is best understood as movement paths.",
      type: "tree",
      code: `function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}`,
      stepNotes: [
        "Stop on null node.",
        "Traverse left subtree.",
        "Visit current node.",
        "Traverse right subtree.",
        "Return accumulated order.",
        "Inorder gives sorted order for BST."
      ],
      lineMap: [2, 3, 4, 5, 6, 4]
    },
    {
      id: "heap",
      name: "Heap / Priority Queue",
      summary: "Heap shape and bubble-up/down are naturally visual operations.",
      type: "heap",
      code: `function push(heap, x) {
  heap.push(x);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] <= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    i = p;
  }
}`,
      stepNotes: [
        "Append new element at end.",
        "Compare with parent.",
        "If heap property broken, swap.",
        "Move pointer upward.",
        "Stop when parent is smaller.",
        "Heap root remains min element."
      ],
      lineMap: [2, 5, 6, 7, 6, 4]
    },
    {
      id: "dp",
      name: "Dynamic Programming",
      summary: "State tables become obvious when filled step-by-step.",
      type: "dp",
      code: `for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    if (blocked[r][c]) dp[r][c] = 0;
    else if (r === 0 && c === 0) dp[r][c] = 1;
    else dp[r][c] = (dp[r - 1]?.[c] ?? 0) + (dp[r][c - 1] ?? 0);
  }
}`,
      stepNotes: [
        "Iterate row by row.",
        "Check blocked cells first.",
        "Seed base case at start cell.",
        "Compute from top and left states.",
        "Write value into DP table.",
        "Final cell contains answer."
      ],
      lineMap: [1, 3, 4, 5, 5, 5]
    },
    {
      id: "backtracking",
      name: "Backtracking",
      summary: "Decision tree with prune/undo is a strong visual pattern.",
      type: "decision-tree",
      code: `function dfs(state) {
  if (isSolution(state)) return true;
  for (const choice of choices(state)) {
    if (!valid(state, choice)) continue;
    apply(state, choice);
    if (dfs(state)) return true;
    undo(state, choice);
  }
  return false;
}`,
      stepNotes: [
        "Check goal state.",
        "Enumerate choices.",
        "Prune invalid choice.",
        "Apply choice and recurse.",
        "Undo choice on failure.",
        "Return failure if all choices fail."
      ],
      lineMap: [2, 3, 4, 5, 7, 9]
    },
    {
      id: "sliding-window",
      name: "Sliding Window / Two Pointers",
      summary: "Window boundaries and invariants are easier with motion.",
      type: "window",
      code: `let left = 0;
for (let right = 0; right < arr.length; right++) {
  add(arr[right]);
  while (!valid()) remove(arr[left++]);
  best = Math.max(best, right - left + 1);
}`,
      stepNotes: [
        "Expand right pointer.",
        "Add new element to state.",
        "Shrink while invariant breaks.",
        "Move left pointer as needed.",
        "Update answer from window length.",
        "Continue until right reaches end."
      ],
      lineMap: [2, 3, 4, 4, 5, 2]
    },
    {
      id: "mono-stack",
      name: "Monotonic Stack",
      summary: "Push/pop moments explain next-greater and histogram problems.",
      type: "stack",
      code: `const st = [];
for (let i = 0; i < nums.length; i++) {
  while (st.length && nums[st.at(-1)] < nums[i]) {
    const idx = st.pop();
    ans[idx] = nums[i];
  }
  st.push(i);
}`,
      stepNotes: [
        "Process array left to right.",
        "Check monotonic property.",
        "Pop weaker elements.",
        "Resolve answers for popped indexes.",
        "Push current index.",
        "Stack keeps unresolved candidates."
      ],
      lineMap: [2, 3, 4, 5, 7, 3]
    },
    {
      id: "binary-answer",
      name: "Binary Search on Answer",
      summary: "Feasibility boundary movement is visual and intuitive.",
      type: "binary-search",
      code: `let lo = 0, hi = 1e9;
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (feasible(mid)) hi = mid;
  else lo = mid + 1;
}
return lo;`,
      stepNotes: [
        "Initialize search range.",
        "Pick midpoint candidate.",
        "Run feasibility check.",
        "Move high if feasible.",
        "Move low if not feasible.",
        "Stop when low equals high."
      ],
      lineMap: [1, 3, 4, 4, 5, 7]
    },
    {
      id: "trie-segment",
      name: "Trie / Segment Tree",
      summary: "Prefix paths and range propagation are structurally visual.",
      type: "trie",
      code: `function insert(root, word) {
  let cur = root;
  for (const ch of word) {
    if (!cur.next[ch]) cur.next[ch] = { next: {}, end: false };
    cur = cur.next[ch];
  }
  cur.end = true;
}`,
      stepNotes: [
        "Start at trie root.",
        "Read next character.",
        "Create missing child node.",
        "Move pointer to child.",
        "Repeat for all characters.",
        "Mark end-of-word flag."
      ],
      lineMap: [2, 3, 4, 5, 3, 7]
    }
  ];

  let selected = concepts[0].id;
  let step = 0;
  const maxStep = 5;

  const syncFromHash = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const match = hash.match(/#\/all-concepts#(.+)/);
    const id = match ? match[1] : "";
    if (id && concepts.some((c) => c.id === id)) {
      selected = id;
      step = 0;
    }
  };

  $: current = concepts.find((c) => c.id === selected) || concepts[0];
  $: nextNote = step < maxStep ? current.stepNotes[step + 1] : "End of walkthrough.";
  $: activeLines = [current.lineMap[step]];

  onMount(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  });
</script>

<section class="card reveal">
  <div class="badge">All visual topics</div>
  <h1>DSA concepts that gain most from visuals</h1>
  <p>Pick a topic from the sidebar and step through visual + code flow.</p>

  <div class="panel">
      <div class="controls">
        <button on:click={() => (step = Math.max(0, step - 1))} disabled={step === 0}>Back step</button>
        <button on:click={() => (step = Math.min(maxStep, step + 1))} disabled={step === maxStep}>Next step</button>
        <button class="secondary" on:click={() => (step = 0)}>Reset</button>
      </div>

      <div class="split">
        <div class="panel">
          <div class="svg-wrap">
            <h3>{current.name}</h3>
            <p>{current.summary}</p>
            <svg width="520" height="260" viewBox="0 0 520 260">
              {#if current.type === "graph"}
                <line x1="70" y1="80" x2="190" y2="50" stroke="#94a3b8" stroke-width="3" />
                <line x1="70" y1="80" x2="170" y2="190" stroke="#94a3b8" stroke-width="3" />
                <line x1="190" y1="50" x2="320" y2="90" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="190" x2="320" y2="90" stroke="#94a3b8" stroke-width="3" />
                <line x1="320" y1="90" x2="440" y2="180" stroke="#94a3b8" stroke-width="3" />
                {#each [
                  { x: 70, y: 80, l: "A" },
                  { x: 190, y: 50, l: "B" },
                  { x: 170, y: 190, l: "C" },
                  { x: 320, y: 90, l: "D" },
                  { x: 440, y: 180, l: "E" }
                ] as n, i}
                  <circle cx={n.x} cy={n.y} r="20" fill={i <= step ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="13" fill={i <= step ? "#ffffff" : "#0f172a"}>{n.l}</text>
                {/each}
              {:else if current.type === "weighted-graph"}
                <line x1="80" y1="90" x2="220" y2="55" stroke="#94a3b8" stroke-width="3" />
                <line x1="80" y1="90" x2="180" y2="200" stroke="#94a3b8" stroke-width="3" />
                <line x1="220" y1="55" x2="340" y2="95" stroke="#94a3b8" stroke-width="3" />
                <line x1="180" y1="200" x2="340" y2="95" stroke="#94a3b8" stroke-width="3" />
                <line x1="340" y1="95" x2="450" y2="175" stroke="#94a3b8" stroke-width="3" />
                <text x="145" y="68" font-size="12">4</text>
                <text x="130" y="150" font-size="12">2</text>
                <text x="275" y="68" font-size="12">5</text>
                <text x="255" y="145" font-size="12">3</text>
                <text x="395" y="132" font-size="12">1</text>
                {#each [
                  { x: 80, y: 90, l: "S", d: "0" },
                  { x: 220, y: 55, l: "A", d: "4" },
                  { x: 180, y: 200, l: "B", d: "2" },
                  { x: 340, y: 95, l: "C", d: "5" },
                  { x: 450, y: 175, l: "T", d: "6" }
                ] as n, i}
                  <circle cx={n.x} cy={n.y} r="20" fill={i <= step ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="12" fill={i <= step ? "#ffffff" : "#0f172a"}>{n.l}</text>
                  <text x={n.x - 10} y={n.y + 32} font-size="11" fill="#475569">d={n.d}</text>
                {/each}
              {:else if current.type === "dag"}
                <line x1="70" y1="70" x2="220" y2="70" stroke="#94a3b8" stroke-width="3" />
                <line x1="70" y1="70" x2="220" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="220" y1="70" x2="370" y2="70" stroke="#94a3b8" stroke-width="3" />
                <line x1="220" y1="170" x2="370" y2="70" stroke="#94a3b8" stroke-width="3" />
                <line x1="370" y1="70" x2="470" y2="160" stroke="#94a3b8" stroke-width="3" />
                {#each [
                  { x: 70, y: 70, l: "A" },
                  { x: 220, y: 70, l: "B" },
                  { x: 220, y: 170, l: "C" },
                  { x: 370, y: 70, l: "D" },
                  { x: 470, y: 160, l: "E" }
                ] as n, i}
                  <rect x={n.x - 18} y={n.y - 18} width="36" height="36" rx="8" fill={i <= step ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="12" fill={i <= step ? "#fff" : "#0f172a"}>{n.l}</text>
                {/each}
              {:else if current.type === "uf"}
                {#each [0,1,2,3,4,5] as _, i}
                  <circle cx={70 + i * 70} cy="70" r="16" fill="#e0e7ff" stroke="#64748b" />
                  <text x={70 + i * 70} y="75" text-anchor="middle" font-size="12">{i}</text>
                {/each}
                {#if step >= 1}<line x1="70" y1="90" x2="140" y2="140" stroke="#6366f1" stroke-width="3" />{/if}
                {#if step >= 2}<line x1="140" y1="90" x2="210" y2="140" stroke="#6366f1" stroke-width="3" />{/if}
                {#if step >= 3}<line x1="280" y1="90" x2="350" y2="140" stroke="#6366f1" stroke-width="3" />{/if}
                {#if step >= 4}<line x1="210" y1="140" x2="350" y2="190" stroke="#6366f1" stroke-width="3" />{/if}
              {:else if current.type === "tree"}
                <line x1="260" y1="40" x2="170" y2="110" stroke="#94a3b8" stroke-width="3" />
                <line x1="260" y1="40" x2="350" y2="110" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="110" x2="120" y2="180" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="110" x2="220" y2="180" stroke="#94a3b8" stroke-width="3" />
                <line x1="350" y1="110" x2="300" y2="180" stroke="#94a3b8" stroke-width="3" />
                <line x1="350" y1="110" x2="400" y2="180" stroke="#94a3b8" stroke-width="3" />
                {#each [
                  { x: 260, y: 40, v: 8 },
                  { x: 170, y: 110, v: 4 },
                  { x: 350, y: 110, v: 12 },
                  { x: 120, y: 180, v: 2 },
                  { x: 220, y: 180, v: 6 },
                  { x: 300, y: 180, v: 10 },
                  { x: 400, y: 180, v: 14 }
                ] as n, i}
                  <circle cx={n.x} cy={n.y} r="18" fill={i <= step ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="12" fill={i <= step ? "#fff" : "#0f172a"}>{n.v}</text>
                {/each}
              {:else if current.type === "heap"}
                {#each [7,4,6,10,9,8,12] as val, i}
                  <rect x={40 + i * 65} y={180 - i * 12} width="42" height={i * 12 + 40} rx="8" fill={i <= step ? "#6366f1" : "#c7d2fe"} />
                  <text x={61 + i * 65} y={172 - i * 12} text-anchor="middle" font-size="11">{val}</text>
                {/each}
              {:else if current.type === "dp"}
                {#each [0,1,2,3,4] as r}
                  {#each [0,1,2,3,4] as c}
                    <rect x={70 + c * 58} y={35 + r * 40} width="52" height="34" rx="8" fill={r + c <= step + 2 ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  {/each}
                {/each}
              {:else if current.type === "decision-tree"}
                <line x1="260" y1="40" x2="170" y2="100" stroke="#94a3b8" stroke-width="3" />
                <line x1="260" y1="40" x2="350" y2="100" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="100" x2="120" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="100" x2="220" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="350" y1="100" x2="300" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="350" y1="100" x2="400" y2="170" stroke="#94a3b8" stroke-width="3" />
                {#each [
                  { x: 260, y: 40, t: "start" },
                  { x: 170, y: 100, t: "try A" },
                  { x: 350, y: 100, t: "try B" },
                  { x: 120, y: 170, t: "prune" },
                  { x: 220, y: 170, t: "next" },
                  { x: 300, y: 170, t: "prune" },
                  { x: 400, y: 170, t: "goal" }
                ] as n, i}
                  <rect x={n.x - 24} y={n.y - 12} width="48" height="24" rx="8" fill={i <= step + 1 ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="10" fill={i <= step + 1 ? "#fff" : "#0f172a"}>{n.t}</text>
                {/each}
              {:else if current.type === "window"}
                {#each [3,1,4,1,5,9,2,6] as n, i}
                  <rect x={40 + i * 55} y="90" width="42" height="42" rx="8" fill={i >= step && i <= step + 2 ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={61 + i * 55} y="115" text-anchor="middle" font-size="12" fill={i >= step && i <= step + 2 ? "#fff" : "#0f172a"}>{n}</text>
                {/each}
              {:else if current.type === "stack"}
                {#each [2,1,2,4,3] as n, i}
                  <rect x={50 + i * 80} y={160 - n * 24} width="52" height={n * 24} rx="8" fill={i <= step ? "#6366f1" : "#c7d2fe"} />
                {/each}
              {:else if current.type === "binary-search"}
                <line x1="70" y1="130" x2="460" y2="130" stroke="#6366f1" stroke-width="4" />
                <circle cx={80 + step * 70} cy="130" r="12" fill="#6366f1" />
                <rect x="300" y="112" width="140" height="36" rx="10" fill="#e0e7ff" stroke="#64748b" />
              {:else if current.type === "trie"}
                <line x1="120" y1="40" x2="120" y2="100" stroke="#94a3b8" stroke-width="3" />
                <line x1="120" y1="100" x2="70" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="120" y1="100" x2="170" y2="170" stroke="#94a3b8" stroke-width="3" />
                <line x1="170" y1="170" x2="230" y2="220" stroke="#94a3b8" stroke-width="3" />
                {#each [
                  { x: 120, y: 40, t: "root" },
                  { x: 120, y: 100, t: "c" },
                  { x: 70, y: 170, t: "a" },
                  { x: 170, y: 170, t: "o" },
                  { x: 230, y: 220, t: "w" }
                ] as n, i}
                  <circle cx={n.x} cy={n.y} r="18" fill={i <= step ? "#6366f1" : "#e0e7ff"} stroke="#64748b" />
                  <text x={n.x} y={n.y + 4} text-anchor="middle" font-size="11" fill={i <= step ? "#fff" : "#0f172a"}>{n.t}</text>
                {/each}
              {/if}
            </svg>
          </div>
          <div class="card">
            <h3>Step {step + 1} of {maxStep + 1}</h3>
            <p>{current.stepNotes[step]}</p>
            <p><strong>Next up:</strong> {nextNote}</p>
          </div>
        </div>

        <div class="panel">
          <h3>Interactive code flow</h3>
          <CodeBlock title="Pattern" code={current.code} activeLines={activeLines} />
        </div>
      </div>
  </div>
</section>

<TeachingBlock
  title="How to use these visuals"
  summary="Each concept has a small visual and matching code. Use the step controls to see how the algorithm moves; the highlighted line shows which part of the code is running."
  points={[
    { heading: "Step through", body: "Click Next to advance one step. Watch how the visual state (graph, board, stack) changes and which code line is highlighted." },
    { heading: "Match state to code", body: "After each step, say what changed in the data and which line caused it. That’s how you internalize the algorithm." },
    { heading: "Try different inputs", body: "On dedicated pages you can change start/target or inputs and rerun to see how the algorithm behaves in other cases." },
    { heading: "Then code it", body: "Once the steps make sense, implement the same logic in your own code; the snippet here is a reference." }
  ]}
/>



