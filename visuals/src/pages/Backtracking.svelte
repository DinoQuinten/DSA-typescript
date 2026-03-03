<script>
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";
  import { onMount } from "svelte";

  const size = 4;
  let steps = [];
  let stepIndex = 0;
  let snapshot = null;

  const emptyBoard = () => Array.from({ length: size }, () => Array(size).fill(false));

  const makeSnapshot = (board, note, line) => ({
    board: board.map((row) => [...row]),
    note,
    line
  });

  const buildSteps = () => {
    const snapshots = [];
    const board = emptyBoard();

    const isSafe = (r, c) => {
      for (let i = 0; i < r; i++) {
        if (board[i][c]) return false;
      }
      for (let i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) return false;
      }
      for (let i = r - 1, j = c + 1; i >= 0 && j < size; i--, j++) {
        if (board[i][j]) return false;
      }
      return true;
    };

    const placeRow = (row) => {
      if (row === size) {
        snapshots.push(makeSnapshot(board, "Solution found.", 13));
        return true;
      }

      for (let col = 0; col < size; col++) {
        if (isSafe(row, col)) {
          board[row][col] = true;
          snapshots.push(makeSnapshot(board, `Place queen at (${row + 1}, ${col + 1}).`, 15));
          if (placeRow(row + 1)) return true;
          board[row][col] = false;
          snapshots.push(makeSnapshot(board, `Backtrack from (${row + 1}, ${col + 1}).`, 17));
        }
      }
      return false;
    };

    snapshots.push(makeSnapshot(board, "Start backtracking.", 1));
    placeRow(0);
    return snapshots;
  };

  const rebuild = () => {
    steps = buildSteps();
    stepIndex = 0;
  };

  onMount(rebuild);

  const code = `function solveNQueens(n) {
  const board = Array.from({ length: n }, () => Array(n).fill(false));

  function isSafe(r, c) {
    for (let i = 0; i < r; i++) if (board[i][c]) return false;
    for (let i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (let i = r - 1, j = c + 1; i >= 0 && j < n; i--, j++) if (board[i][j]) return false;
    return true;
  }

  function place(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = true;
        if (place(row + 1)) return true;
        board[row][col] = false;
      }
    }
    return false;
  }

  place(0);
  return board;
}`;

  $: snapshot = steps[stepIndex] || null;
  $: nextSnapshot = steps[stepIndex + 1] || null;
</script>

<section class="card reveal">
  <div class="badge">Backtracking</div>
  <h1>N-Queens search</h1>
  <p>Watch how the solver places a queen, explores, and backtracks when blocked.</p>

  <div class="controls">
    <button on:click={() => (stepIndex = Math.max(stepIndex - 1, 0))} disabled={stepIndex === 0}>Back</button>
    <button on:click={() => (stepIndex = Math.min(stepIndex + 1, steps.length - 1))} disabled={stepIndex >= steps.length - 1}>Next</button>
    <button class="secondary" on:click={rebuild}>Reset</button>
  </div>

  <div class="split">
    <div class="panel">
      <div class="board">
        {#if snapshot}
          {#each snapshot.board as row, r}
            <div class="row">
              {#each row as cell, c}
                <div class="cell {cell ? 'queen' : ''} {(r + c) % 2 === 0 ? 'light' : 'dark'}">
                  {cell ? "Q" : ""}
                </div>
              {/each}
            </div>
          {/each}
        {/if}
      </div>
      <div class="card">
        <h3>Step {stepIndex + 1} of {steps.length}</h3>
        <p>{snapshot ? snapshot.note : ""}</p>
        <p>Goal: place 4 queens without sharing a row, column, or diagonal.</p>
      </div>
      <div class="card">
        <h3>Next up</h3>
        <p>{nextSnapshot ? nextSnapshot.note : "Solution reached."}</p>
      </div>
    </div>
    <div class="panel">
      <h3>Code flow</h3>
      <CodeBlock title="TypeScript" code={code} activeLines={snapshot ? snapshot.line : []} />
    </div>
  </div>
</section>

<TeachingBlock
  title="How N-Queens backtracking works"
  summary="We place queens row by row. For each row we try every column; if a placement is safe we recurse to the next row; if we ever get stuck we backtrack and try the next column."
  points={[
    { heading: "Step 1", body: "Start at row 0. For each column, check if putting a queen there is safe (no other queen in same column or diagonal)." },
    { heading: "Step 2", body: "If safe, place the queen and recurse to the next row. If that path leads to a solution, we’re done." },
    { heading: "Step 3", body: "If not safe or the recursive call fails, remove the queen (backtrack) and try the next column in the same row." },
    { heading: "Step 4", body: "When we reach the last row and place a queen safely, we’ve found one solution. Backtrack to find more or stop." }
  ]}
/>

<style>
  .board {
    display: grid;
    gap: 4px;
    background: #f1f5f9;
    padding: 12px;
    border-radius: 16px;
  }
  .row {
    display: grid;
    grid-template-columns: repeat(4, 48px);
    gap: 4px;
  }
  .cell {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-weight: 600;
  }
  .cell.light {
    background: #f8fafc;
  }
  .cell.dark {
    background: #e2e8f0;
  }
  .cell.queen {
    background: #6366f1;
    color: white;
  }
</style>
