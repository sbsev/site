<script lang="ts">
  import { dev } from "$app/env";
  import { page } from "$app/state";

  const status = $derived(page.status);
  const stack = $derived(dev && page.error && "stack" in page.error ? page.error.stack : undefined);
</script>

<svelte:head>
  <title>Fehler {status} - StudyTutors e.V.</title>
</svelte:head>

<div>
  <h1>Fehler {status}</h1>

  {#if status === 404}
    <p>
      😅 Ooops! Diese Seite konnte nicht gefunden.
      <a href="/">Zurück zur Startseite</a>.
    </p>
  {/if}

  {#if typeof stack === "string"}
    <h2>Stack Trace</h2>
    <pre>{stack}</pre>
  {/if}
</div>

<style>
  div {
    max-width: 45em;
    padding: 1em 3em;
    margin: auto;
  }
  p {
    text-align: center;
  }
  pre {
    overflow: scroll;
    font-size: 0.9em;
    white-space: pre-wrap;
    background: var(--accent-bg);
    padding: 5pt 1em;
    border-radius: 3pt;
  }
</style>
