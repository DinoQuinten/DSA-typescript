<script>
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";
  import { onMount } from "svelte";

  const nodes = [
    { id: "A", x: 60, y: 70 },
    { id: "B", x: 220, y: 40 },
    { id: "C", x: 360, y: 90 },
    { id: "D", x: 120, y: 190 },
    { id: "E", x: 280, y: 200 },
    { id: "F", x: 420, y: 190 }
  ];

  const edges = [
    { from: "A", to: "B", w: 4 },
    { from: "A", to: "D", w: 2 },
    { from: "B", to: "C", w: 6 },
    { from: "B", to: "E", w: 5 },
    { from: "C", to: "F", w: 3 },
    { from: "D", to: "E", w: 8 },
    { from: "D", to: "B", w: 1 },
    { from: "E", to: "F", w: 1 }
  ];

  const adjacency = nodes.reduce((acc, node) => {
    acc[node.id] = [];
    return acc;
  }, {});

  edges.forEach((edge) => {
    adjacency[edge.from].push({ to: edge.to, w: edge.w });
    adjacency[edge.to].push({ to: edge.from, w: edge.w });
  });

  const nodeIds = nodes.map((node) => node.id);

  let start = "A";
  let target = "F";
  let steps = [];
  let stepIndex = 0;
  let snapshot = null;
  let path = [];

  const buildSteps = (startId) => {
    const dist = {};
    const prev = {};
    nodeIds.forEach((id) => {
      dist[id] = Infinity;
      prev[id] = null;
    });
    dist[startId] = 0;

    const visited = new Set();
    const queue = [{ id: startId, dist: 0 }];
    const snapshots = [];

    const snapshot = (current, note, line) => {
      snapshots.push({
        current,
        note,
        line,
        dist: { ...dist },
        prev: { ...prev },
        visited: Array.from(visited),
        frontier: queue.map((item) => item.id)
      });
    };

    snapshot(null, "Initialize distances and frontier.", 6);

    while (queue.length) {
      queue.sort((a, b) => a.dist - b.dist);
      const { id: current } = queue.shift();
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      adjacency[current].forEach((neighbor) => {
        const nextDist = dist[current] + neighbor.w;
        if (nextDist < dist[neighbor.to]) {
          dist[neighbor.to] = nextDist;
          prev[neighbor.to] = current;
          queue.push({ id: neighbor.to, dist: nextDist });
        }
      });

      snapshot(current, `Visit ${current} and relax its edges.`, 16);
    }

    snapshot(null, "Done. Shortest paths are fixed.", 23);
    return snapshots;
  };

  const buildPath = (prev, targetId, dist) => {
    if (!dist || dist[targetId] === Infinity) return [];
    const path = [];
    let current = targetId;
    while (current) {
      path.unshift(current);
      current = prev[current];
    }
    return path;
  };

  const rebuild = () => {
    steps = buildSteps(start);
    stepIndex = 0;
  };

  onMount(rebuild);

  const code = `function dijkstra(graph, start) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const pq = [{ id: start, d: 0 }];

  for (const node of graph.keys()) {
    dist.set(node, Infinity);
    prev.set(node, null);
  }
  dist.set(start, 0);

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { id } = pq.shift();
    if (visited.has(id)) continue;
    visited.add(id);

    for (const edge of graph.get(id)) {
      const next = dist.get(id) + edge.w;
      if (next < dist.get(edge.to)) {
        dist.set(edge.to, next);
        prev.set(edge.to, id);
        pq.push({ id: edge.to, d: next });
      }
    }
  }
  return { dist, prev };
}`;

  const onPath = (id) => path.includes(id);
  $: snapshot = steps[stepIndex] || null;
  $: path = snapshot ? buildPath(snapshot.prev, target, snapshot.dist) : [];
  $: nextSnapshot = steps[stepIndex + 1] || null;
</script>

<section class="card reveal">
  <div class="badge">Shortest path</div>
  <h1>Dijkstra in slow motion</h1>
  <p>Each step locks in the next closest node and relaxes its edges.</p>

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
      Target
      <select bind:value={target}>
        {#each nodeIds as id}
          <option value={id}>{id}</option>
        {/each}
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
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#94a3b8"
              stroke-width="3"
            />
            <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6} font-size="12" fill="#64748b">
              {edge.w}
            </text>
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
              stroke={onPath(node.id) ? "#10b981" : "#64748b"}
              stroke-width={onPath(node.id) ? 4 : 2}
            />
            <text x={node.x} y={node.y + 4} text-anchor="middle" font-size="14" fill="#0f172a">
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
          <p>{nextSnapshot ? nextSnapshot.note : "End of walkthrough."}</p>
        </div>
        <div class="card" style="margin-bottom: 16px;">
          <h3>Distances</h3>
          <div>
            {#if snapshot}
              {#each nodeIds as id}
                <div>{id}: {snapshot.dist[id] === Infinity ? "inf" : snapshot.dist[id]}</div>
              {/each}
            {/if}
          </div>
        </div>
        <div class="card">
          <h3>Shortest path to {target}</h3>
          <p>{path.length ? path.join(" -> ") : "No path yet."}</p>
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
  title="How Dijkstra works"
  summary="The algorithm repeatedly picks the closest unvisited node, fixes its distance, then relaxes all its outgoing edges."
  points={[
    { heading: "Step 1", body: "Start with the source at distance 0 and all other nodes at infinity. Keep a frontier of reachable nodes with tentative distances." },
    { heading: "Step 2", body: "Take the node in the frontier with smallest distance. Its distance is now final (no shorter path can exist)." },
    { heading: "Step 3", body: "Relax its edges: for each neighbor, if distance(current) + edge weight is less than the neighbor’s current distance, update the neighbor’s distance and predecessor." },
    { heading: "Step 4", body: "Repeat until the frontier is empty. The predecessor pointers give the shortest path back to the source." }
  ]}
/>
