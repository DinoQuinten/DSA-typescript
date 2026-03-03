<script>
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";
  import { onMount } from "svelte";

  const size = 5;
  let obstacles = Array.from({ length: size }, () => Array(size).fill(false));
  let steps = [];
  let stepIndex = 0;
  let snapshot = null;

  const resetObstacles = () => {
    obstacles = Array.from({ length: size }, () => Array(size).fill(false));
    rebuild();
  };

  const buildSteps = () => {
    const dp = Array.from({ length: size }, () => Array(size).fill(0));
    const snapshots = [];

    const snapshot = (r, c, note, line) => {
      snapshots.push({
        dp: dp.map((row) => [...row]),
        current: [r, c],
        note,
        line
      });
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (obstacles[r][c]) {
          dp[r][c] = 0;
          snapshot(r, c, `Cell (${r + 1}, ${c + 1}) is blocked.`, 7);
          continue;
        }
        if (r === 0 && c === 0) {
          dp[r][c] = 1;
          snapshot(r, c, "Start cell is 1.", 9);
          continue;
        }
        const fromTop = r > 0 ? dp[r - 1][c] : 0;
        const fromLeft = c > 0 ? dp[r][c - 1] : 0;
        dp[r][c] = fromTop + fromLeft;
        snapshot(r, c, `Sum top (${fromTop}) + left (${fromLeft}).`, 12);
      }
    }

    snapshots.push({
      dp: dp.map((row) => [...row]),
      current: null,
      note: `Done. Total paths = ${dp[size - 1][size - 1]}.`,
      line: 15
    });

    return snapshots;
  };

  const rebuild = () => {
    steps = buildSteps();
    stepIndex = 0;
  };

  const toggle = (r, c) => {
    if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) return;
    obstacles = obstacles.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === r && colIndex === c ? !cell : cell))
    );
  };

  onMount(rebuild);

  const code = `function uniquePaths(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        dp[r][c] = 0;
      } else if (r === 0 && c === 0) {
        dp[r][c] = 1;
      } else {
        const fromTop = r > 0 ? dp[r - 1][c] : 0;
        const fromLeft = c > 0 ? dp[r][c - 1] : 0;
        dp[r][c] = fromTop + fromLeft;
      }
    }
  }
  return dp[rows - 1][cols - 1];
}`;

  $: snapshot = steps[stepIndex] || null;
  $: nextSnapshot = steps[stepIndex + 1] || null;
</script>

<section class="card reveal">
  <div class="badge">Dynamic programming</div>
  <h1>Unique paths in a grid</h1>
  <p>Build the DP table one cell at a time and see the counts accumulate.</p>

  <div class="controls">
    <button on:click={rebuild}>Compute</button>
    <button class="secondary" on:click={resetObstacles}>Clear blocks</button>
    <button on:click={() => (stepIndex = Math.max(stepIndex - 1, 0))} disabled={stepIndex === 0}>Back</button>
    <button on:click={() => (stepIndex = Math.min(stepIndex + 1, steps.length - 1))} disabled={stepIndex >= steps.length - 1}>Next</button>
  </div>

  <div class="split">
    <div class="panel">
      <div class="dp-grid">
        {#each obstacles as row, r}
          <div class="dp-row">
            {#each row as cell, c}
              <button
                type="button"
                class={
                  "dp-cell " +
                  ((snapshot && snapshot.current && snapshot.current[0] === r && snapshot.current[1] === c) ? "active" : "") +
                  (cell ? " blocked" : "")
                }
                on:click={() => toggle(r, c)}
              >
                {#if snapshot}
                  {snapshot.dp[r][c]}
                {/if}
              </button>
            {/each}
          </div>
        {/each}
      </div>

      <div class="card">
        <h3>Step {stepIndex + 1} of {steps.length}</h3>
        <p>{snapshot ? snapshot.note : ""}</p>
        <p>Click cells to add obstacles, then recompute.</p>
      </div>
      <div class="card">
        <h3>Next up</h3>
        <p>{nextSnapshot ? nextSnapshot.note : "DP table complete."}</p>
      </div>
    </div>

    <div class="panel">
      <h3>Code flow</h3>
      <CodeBlock title="TypeScript" code={code} activeLines={snapshot ? snapshot.line : []} />
    </div>
  </div>
</section>

<TeachingBlock
  title="How this DP works"
  summary="We fill the grid cell by cell. Each cell’s value is the number of ways to reach it: from the cell above plus the cell to the left, unless the cell is blocked."
  points={[
    { heading: "Step 1", body: "Initialize the top-left cell to 1 (one way to start). Blocked cells get 0. All other cells start at 0." },
    { heading: "Step 2", body: "Fill row by row (or column by column). For each cell, if it’s blocked, leave it 0. Otherwise set it to (value from top) + (value from left)." },
    { heading: "Step 3", body: "The value at (r, c) is the number of paths from (0,0) to (r,c). We only need the previous row and the current row to compute the next, so space can be reduced to O(cols)." },
    { heading: "Step 4", body: "The bottom-right cell holds the total number of paths from start to finish. Obstacles simply force some cells to stay 0." }
  ]}
/>
<style>
  .dp-grid {
    display: grid;
    gap: 4px;
    background: #f1f5f9;
    padding: 12px;
    border-radius: 16px;
    align-content: start;
  }
  .dp-row {
    display: grid;
    grid-template-columns: repeat(5, 56px);
    gap: 4px;
  }
  .dp-cell {
    width: 56px;
    height: 48px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: #f8fafc;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    padding: 0;
    outline: none;
  }
  .dp-cell.active {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
  }
  .dp-cell.blocked {
    background: #cbd5e1;
    color: #64748b;
  }
</style>

