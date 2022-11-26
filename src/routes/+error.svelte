<script lang="ts">
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { name } from '../../package.json'

  let online: boolean
</script>

<svelte:head>
  <title>Fehler {$page.status} &bull; {name}</title>
</svelte:head>

<svelte:window bind:online />

<div>
  <h1>Fehler {String($page.status).replace(`0`, `😵`)}: {$page.error?.message}</h1>
  {#if $page.status >= 500}
    <p>
      When neu laden nicht hilft, schreib uns bitte eine E-Mail mit dem Fehlercode und
      evtl. relevanten Informationen an
      <a href="mailto:it@{name}" target="_blank" rel="noreferrer">it@{name}</a>. Danke! 🙏
    </p>
  {/if}
  {#if online === false}
    Sieht aus als wärst du offline. Wenn du denkst, es liegt nicht an deiner Verbindung,
    check bitte die
    <a href="https://githubstatus.com">GitHub Status Seite</a>
    da unsere Seite von &thinsp;<Icon icon="octicon:mark-github" inline />&thinsp; GitHub
    Pages gehostet wird.
  {/if}

  <p>
    Zurück zur <a href=".">Startseite</a>.
  </p>
</div>

<style>
  div {
    font-size: 1.2em;
    max-width: 45em;
    padding: 5em 3em 1em;
    margin: auto;
    text-align: center;
  }
</style>
