<script>
  import CodeBlock from "../components/CodeBlock.svelte";
  import TeachingBlock from "../components/TeachingBlock.svelte";
  import { onMount } from "svelte";

  let n = 5;
  let steps = [];
  let stepIndex = 0;
  let snapshot = null;

  const buildSteps = (value) => {
    const stack = [];
    const log = [];
    const snapshots = [];

    const snapshot = (note, line) => {
      snapshots.push({
        note,
        line,
        stack: [...stack],
        log: [...log]
      });
    };

    const fact = (k) => {
      stack.push(`fact(${k})`);
      log.push(`call fact(${k})`);
      snapshot(`Call fact(${k})`, 2);

      if (k <= 1) {
        log.push("return 1");
        snapshot("Return 1", 3);
        stack.pop();
        return 1;
      }

      const result = k * fact(k - 1);
      log.push(`return ${result}`);
      snapshot(`Return ${result}`, 4);
      stack.pop();
      return result;
    };

    snapshot("Start recursion", 1);
    const result = fact(value);
    snapshot(`Done. Result = ${result}`, 4);
    return snapshots;
  };

  const rebuild = () => {
    steps = buildSteps(n);
    stepIndex = 0;
  };

  onMount(rebuild);

  const code = `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`;

  $: snapshot = steps[stepIndex] || null;
  $: nextSnapshot = steps[stepIndex + 1] || null;
  $: ladder = snapshot ? snapshot.stack.map((frame, index) => ({ frame, index })) : [];
</script>

<section class="card reveal">
  <div class="badge">Recursion</div>
  <h1>Call stack in motion</h1>
  <p>Watch how recursive calls grow the stack and unwind with results.</p>

  <div class="controls">
    <label>
      n
      <input type="number" min="1" max="7" bind:value={n} />
    </label>
    <button on:click={rebuild}>Build Steps</button>
    <button on:click={() => (stepIndex = Math.max(stepIndex - 1, 0))} disabled={stepIndex === 0}>Back</button>
    <button on:click={() => (stepIndex = Math.min(stepIndex + 1, steps.length - 1))} disabled={stepIndex >= steps.length - 1}>Next</button>
  </div>

  <div class="split">
    <div class="panel">
      <div class="svg-wrap">
        <h3>Call ladder</h3>
        <svg width="240" height="260" viewBox="0 0 240 260">
          {#if ladder.length === 0}
            <text x="20" y="40" font-size="14" fill="#64748b">Press build to start.</text>
          {:else}
            {#each ladder as item, i}
              {@const y = 30 + i * 34}
              <rect
                x="20"
                y={y}
                width="180"
                height="26"
                rx="8"
                fill={i === ladder.length - 1 ? "#6366f1" : "#e0e7ff"}
                stroke="#64748b"
              />
              <text x="30" y={y + 18} font-size="13" fill={i === ladder.length - 1 ? "#ffffff" : "#0f172a"}>
                {item.frame}
              </text>
            {/each}
          {/if}
        </svg>
      </div>
      <div class="card">
        <h3>Trace</h3>
        {#if snapshot}
          {#each snapshot.log.slice(-8) as entry}
            <div>{entry}</div>
          {/each}
        {/if}
      </div>
      <div class="card">
        <h3>Next up</h3>
        <p>{nextSnapshot ? nextSnapshot.note : "End of recursion."}</p>
      </div>
    </div>
    <div class="panel">
      <h3>Code flow</h3>
      <CodeBlock title="TypeScript" code={code} activeLines={snapshot ? snapshot.line : []} />
    </div>
  </div>

  <p style="margin-top: 12px;">{snapshot ? snapshot.note : ""}</p>
</section>

<TeachingBlock
  title="How recursion works here"
  summary="Each call to factorial pushes a frame on the call stack; when the base case returns, the stack unwinds and each frame multiplies by the returned value."
  points={[
    { heading: "Step 1", body: "Call fact(n). It pushes fact(n) onto the stack and calls fact(n-1). This repeats until fact(1) or fact(0)." },
    { heading: "Base case", body: "When k <= 1, the function returns 1 and pops one frame. No more recursive calls from that frame." },
    { heading: "Step 2", body: "The return value (1) goes back to the previous frame. That frame computes k * 1 and returns it, then pops. The stack unwinds one level at a time." },
    { heading: "Step 3", body: "Each level multiplies its k by the value returned from the deeper call. So the final result is n * (n-1) * ... * 1 = n!." }
  ]}
/>
