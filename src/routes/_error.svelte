<script>
  export let status, error
  const dev = process.env.NODE_ENV === `development`
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

{#if dev && error.stack}
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
