<script>
  import { dev } from '$app/env'
  export let status, error
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

{#if dev && error?.stack}
  <pre>{error.stack}</pre>
{/if}

<style>
  pre {
    width: max-content;
    max-width: 30em;
    margin: 1em auto;
    white-space: pre-wrap;
  }
</style>
