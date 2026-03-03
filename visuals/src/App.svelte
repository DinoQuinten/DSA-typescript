<script>
  import { onMount } from "svelte";
  import Nav from "./components/Nav.svelte";
  import Home from "./pages/Home.svelte";
  import Dijkstra from "./pages/Dijkstra.svelte";
  import Graphs from "./pages/Graphs.svelte";
  import Recursion from "./pages/Recursion.svelte";
  import Backtracking from "./pages/Backtracking.svelte";
  import DynamicProgramming from "./pages/DynamicProgramming.svelte";
  import AllConcepts from "./pages/AllConcepts.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import { conceptList } from "./data/conceptList.js";

  const routes = [
    { href: "#/", label: "Overview", component: Home },
    { href: "#/dijkstra", label: "Dijkstra", component: Dijkstra },
    { href: "#/graphs", label: "Graphs", component: Graphs },
    { href: "#/recursion", label: "Recursion", component: Recursion },
    { href: "#/backtracking", label: "Backtracking", component: Backtracking },
    {
      href: "#/dp",
      label: "Dynamic Programming",
      component: DynamicProgramming,
    },
  ];

  // AllConcepts shown for #/all-concepts and #/all-concepts#id (no sidebar entry)
  const allConceptsRoute = { href: "#/all-concepts", component: AllConcepts };

  let current = "#/";
  let conceptTopic = "";
  let CurrentComponent = Home;

  const syncRoute = () => {
    current = window.location.hash || "#/";
    const isAllConcepts = current === "#/all-concepts" || current.startsWith("#/all-concepts#");
    const match =
      routes.find((route) => route.href === current) ||
      (isAllConcepts ? allConceptsRoute : null);
    CurrentComponent = match ? match.component : NotFound;
    conceptTopic = current.startsWith("#/all-concepts#") ? current.slice("#/all-concepts#".length) : "";
  };

  onMount(() => {
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  });
</script>

<div class="layout">
  <aside class="sidebar">
    <div class="brand">Visual DSA Lab</div>
    <p class="tagline">
      Mid-level explanations, live state, and code you can trust.
    </p>
    <Nav {current} items={routes} conceptLinks={conceptList} {conceptTopic} />
  </aside>

  <main class="main">
    <svelte:component this={CurrentComponent} />
  </main>
</div>
