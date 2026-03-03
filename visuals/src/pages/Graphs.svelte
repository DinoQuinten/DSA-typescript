<script>
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";
  import { onMount } from "svelte";

  const nodes = [
    { id: "A", x: 70, y: 80 },
    { id: "B", x: 230, y: 50 },
    { id: "C", x: 380, y: 110 },
    { id: "D", x: 100, y: 200 },
    { id: "E", x: 260, y: 200 },
    { id: "F", x: 420, y: 210 }
  ];

  const edges = [
    { from: "A", to: "B" },
    { from: "A", to: "D" },
    { from: "B", to: "C" },
    { from: "B", to: "E" },
    { from: "D", to: "E" },
    { from: "E", to: "F" },
    { from: "C", to: "F" }
  ];

  const adjacency = nodes.reduce((acc, node) => {
    acc[node.id] = [];
    return acc;
  }, {});

  edges.forEach((edge) => {
    adjacency[edge.from].push(edge.to);
    adjacency[edge.to].push(edge.from);
  });

  const nodeIds = nodes.map((node) => node.id);

  let start = "A";
  let mode = "BFS";
  let steps = [];
  let stepIndex = 0;
  let snapshot = null;

  const buildSteps = (startId, algo) => {
    const visited = new Set();
    const frontier = [startId];
    const order = [];
    const snapshots = [];

    const snapshot = (current, note, line) => {
      snapshots.push({
        current,
        note,
        line,
        visited: Array.from(visited),
        frontier: [...frontier],
        order: [...order]
      });
    };

    snapshot(null, `Initialize ${algo}.`, 2);

    while (frontier.length) {
      const current = algo === "BFS" ? frontier.shift() : frontier.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      order.push(current);

      const neighbors = [...adjacency[current]].sort();
      if (algo === "DFS") neighbors.reverse();
      neighbors.forEach((next) => {
        if (!visited.has(next)) frontier.push(next);
      });

      snapshot(current, `Visit ${current} and add its neighbors.`, 9);
    }

    snapshot(null, "Traversal complete.", 15);
    return snapshots;
  };

  const rebuild = () => {
    steps = buildSteps(start, mode);
    stepIndex = 0;
  };

  onMount(rebuild);

  const code = `function traverse(graph, start, mode) {
  const visited = new Set();
  const frontier = [start];
  const order = [];

  while (frontier.length) {
    const current = mode === "BFS" ? frontier.shift() : frontier.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);

    for (const next of graph.get(current)) {
      if (!visited.has(next)) frontier.push(next);
    }
  }
  return order;
}`;

  $: snapshot = steps[stepIndex] || null;
  $: nextSnapshot = steps[stepIndex + 1] || null;
</script>

<section class="card reveal">
  <div class="badge">Graph traversal</div>
  <h1>BFS vs DFS</h1>
  <p>Switch between queue and stack behavior to feel the difference.</p>

  <div class="controls">
    <label>
      Start
      <select bind:value={start} on:change={rebuild}>
        {#each nodeIds as id}
          <option value={id}>{id}</option>
        {/each}
      </select>
    </label>
    <label>
      Mode
      <select bind:value={mode} on:change={rebuild}>
        <option value="BFS">BFS</option>
        <option value="DFS">DFS</option>
      </select>
    </label>
    <button on:click={() => (stepIndex = Math.max(stepIndex - 1, 0))} disabled={stepIndex === 0}>Back</button>
    <button on:click={() => (stepIndex = Math.min(stepIndex + 1, steps.length - 1))} disabled={stepIndex >= steps.length - 1}>Next</button>
    <button class="secondary" on:click={rebuild}>Reset</button>
  </div>

  <div class="split">
    <div class="panel">
      <div class="svg-wrap">
        <svg width="480" height="260" viewBox="0 0 480 260">
          {#each edges as edge}
            {@const from = nodes.find((n) => n.id === edge.from)}
            {@const to = nodes.find((n) => n.id === edge.to)}
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#c7b8a3" stroke-width="3" />
          {/each}

          {#each nodes as node}
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={
                snapshot && snapshot.current === node.id
                  ? "#6366f1"
                  : snapshot && snapshot.visited.includes(node.id)
                    ? "#a5b4fc"
                    : snapshot && snapshot.frontier.includes(node.id)
                      ? "#e0e7ff"
                      : "#f8fafc"
              }
              stroke="#64748b"
              stroke-width="2"
            />
            <text x={node.x} y={node.y + 4} text-anchor="middle" font-size="14" fill="#1d1b19">
              {node.id}
            </text>
          {/each}
        </svg>
      </div>

      <div>
        <h3>Step {stepIndex + 1} of {steps.length}</h3>
        <p>{snapshot ? snapshot.note : ""}</p>
        <div class="card" style="margin-bottom: 16px;">
          <h3>Next up</h3>
          <p>{nextSnapshot ? nextSnapshot.note : "Traversal complete."}</p>
        </div>
        <div class="card" style="margin-bottom: 16px;">
          <h3>Traversal order</h3>
          <p>{snapshot ? snapshot.order.join(" -> ") : ""}</p>
        </div>
        <div class="card">
          <h3>Frontier</h3>
          <p>{snapshot ? snapshot.frontier.join(", ") : ""}</p>
        </div>
      </div>
    </div>

    <div class="panel">
      <h3>Code flow</h3>
      <CodeBlock title="TypeScript" code={code} activeLines={snapshot ? snapshot.line : []} />
    </div>
  </div>
</section>

<TeachingBlock
  title="How BFS and DFS work"
  summary="Both explore the graph from a start node; the only difference is the order in which they take nodes from the frontier."
  points={[
    { heading: "Shared idea", body: "Keep a frontier (nodes to visit) and a visited set. Take one node from the frontier, mark it visited, add its unvisited neighbors to the frontier." },
    { heading: "BFS", body: "Use a queue: take from the front (FIFO). So you explore in layers by distance. First all nodes at distance 1, then 2, and so on. Gives shortest path in unweighted graphs." },
    { heading: "DFS", body: "Use a stack: take from the back (LIFO). So you go deep along one path, then backtrack. Good for exploring all paths, cycle detection, and structure search." },
    { heading: "In the code", body: "Same loop; only the line that takes the next node changes—shift() for BFS, pop() for DFS." }
  ]}
/>
