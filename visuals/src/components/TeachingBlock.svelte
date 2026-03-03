<script>
  export let title = "Teaching block";
  export let summary = "";
  export let points = [];
</script>

<section class="card reveal teaching-block" style="margin-top: 24px;">
  <h2>{title}</h2>
  {#if summary}
    <p>{summary}</p>
  {/if}
  <div class="teaching-grid">
    {#each points as point}
      <div class="teaching-item">
        <h3>{point.heading}</h3>
        <p>{point.body}</p>
      </div>
    {/each}
  </div>
</section>
