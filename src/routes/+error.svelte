<script lang="ts">
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>Fehler {$page.status} - Studenten bilden Schüler e.V.</title>
</svelte:head>

<div>
  <h1>Fehler {$page.status}</h1>

  {#if $page.status === 404}
    <p>
      😅 Ooops! Diese Seite konnte nicht gefunden.
      <a href="/">Zurück zur Startseite</a>.
    </p>
  {/if}

  {#if dev && $page.error?.stack}
    <h2>Stack Trace</h2>
    <pre>{$page.error.stack}</pre>
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
    background: var(--accentBg);
    padding: 5pt 1em;
    border-radius: 3pt;
  }
</style>
