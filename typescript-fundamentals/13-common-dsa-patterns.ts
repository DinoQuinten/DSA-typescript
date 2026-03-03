// ================================================================
// 📋 Section 13: Common DSA Patterns
// Run standalone:  bun run 13-common-dsa-patterns.ts
// ================================================================

import { title, sub, explain, code, codeRaw, tip, log, color } from "./_helpers";

export function run() {
  title("📋", "Section 13: Common DSA Patterns");
  explain("These are patterns you'll use in nearly every DSA problem.");
  explain("Bookmark this section — you'll come back to it often!");

  sub("Array initialization patterns");
  explain("You'll create these arrays at the start of many problems:");
  log();
  code(`new Array(10).fill(0)`, new Array(5).fill(0));
  explain("  ↳ DP table — stores computed results to avoid re-computation");
  code(`new Array(10).fill(false)`, new Array(5).fill(false));
  explain("  ↳ Visited tracker — marks which nodes you've already seen");
  code(`new Array(10).fill(Infinity)`, new Array(5).fill(Infinity));
  explain("  ↳ Distance array — for shortest path algorithms like Dijkstra");

  sub("Min/Max tracking with Infinity");
  explain("Start with Infinity for min, -Infinity for max — they always lose the first comparison:");
  log();
  const testNums = [5, 2, 8, 1, 9, 3];
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (const num of testNums) {
    minVal = Math.min(minVal, num);
    maxVal = Math.max(maxVal, num);
  }
  codeRaw(`let min = Infinity, max = -Infinity`, "");
  codeRaw(`for (n of [5,2,8,1,9,3]) min/max update`, `Min=${minVal}, Max=${maxVal}`);

  sub("Type conversions — string ↔ number");
  log();
  code(`Number("123")`, Number("123"));
  code(`parseInt("123")`, parseInt("123"));
  code(`parseFloat("3.14")`, parseFloat("3.14"));
  code(`String(123)`, String(123));
  log();
  code(`parseInt("123abc")`, parseInt("123abc"));
  explain("  ↳ Stops at the first non-digit — still returns 123");
  code(`Number("123abc")`, Number("123abc"));
  explain("  ↳ Stricter — returns NaN if ANY character is non-numeric");
  tip("Use Number() for strict conversion, parseInt() for lenient.");

  sub("Grid bounds checking — write this in EVERY grid problem");
  log();
  codeRaw(`const inBounds = (r, c) =>`, "");
  codeRaw(`  r >= 0 && r < rows && c >= 0 && c < cols`, "");
  log();
  const gridRows = 5, gridCols = 5;
  const inBounds = (r: number, c: number): boolean =>
    r >= 0 && r < gridRows && c >= 0 && c < gridCols;
  code(`inBounds(0, 0)`, inBounds(0, 0));
  code(`inBounds(4, 4)`, inBounds(4, 4));
  code(`inBounds(-1, 0)`, inBounds(-1, 0));
  explain("  ↳ Row -1 doesn't exist — out of bounds!");
  code(`inBounds(5, 0)`, inBounds(5, 0));
  explain("  ↳ Row 5 is out of bounds for a 5-row grid (0-4)");

  sub("4-directional movement — for BFS/DFS on grids");
  explain("Move up, down, left, right from any cell:");
  log();
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  codeRaw(`directions = [[0,1], [0,-1], [1,0], [-1,0]]`, "right, left, down, up");
  log();
  const r = 2, c = 2;
  explain(`  Neighbors of (${r}, ${c}):`);
  for (const [dr, dc] of directions) {
    const nr = r + dr, nc = c + dc;
    const label = dr === 0 && dc === 1 ? "right" : dr === 0 && dc === -1 ? "left" : dr === 1 ? "down" : "up";
    if (inBounds(nr, nc)) {
      log(color.green(`     (${nr}, ${nc})  ← ${label}`));
    }
  }

  sub("Pretty-print a matrix — for debugging");
  log();
  const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  for (const row of matrix) {
    log(color.green("     [" + row.map(v => String(v).padStart(3)).join(",") + " ]"));
  }
  tip("JSON.stringify(matrix) for quick output, pretty-print for readable debugging.");
}

if (import.meta.main) run();
