<script>
  export let title = "";
  export let code = "";
  export let activeLines = [];

  const normalize = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "number") return [value];
    return [];
  };

  $: lines = code ? code.split("\n") : [];
  $: active = new Set(normalize(activeLines));
</script>

<div>
  {#if title}
    <div class="badge">{title}</div>
  {/if}
  <pre class="code">
    <code>
      {#each lines as line, i}
        <div class={"code-line " + (active.has(i + 1) ? "active" : "")}>
          <span class="line-no">{i + 1}</span>
          <span class="line-text">{line}</span>
        </div>
      {/each}
    </code>
  </pre>
</div>
