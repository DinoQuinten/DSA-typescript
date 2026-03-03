<script>
  export let items = [];
  export let current = "#/";
  export let conceptLinks = [];
  export let conceptTopic = ""; // hash part e.g. "bfs-dfs"
</script>

<nav class="nav">
  {#each items as item}
    <a class:active={current === item.href} href={item.href}>{item.label}</a>
  {/each}
  {#each conceptLinks as c}
    {@const conceptHref = "#/all-concepts#" + c.id}
    {@const isConceptActive = current.startsWith("#/all-concepts") && (conceptTopic === c.id || (conceptTopic === "" && c.id === conceptLinks[0].id))}
    <a class:active={isConceptActive} href={conceptHref}>{c.name}</a>
  {/each}
</nav>
