<script>
  import { onMount } from 'svelte'
  import algoliasearch from 'algoliasearch/lite'
  import Modal from './Modal.svelte'
  import { reduceMeta } from '../utils'
  import { stores } from '@sapper/app'
  import Search from '@svg-icons/fa-solid/search.svg'

  const { session } = stores()
  const { ALGOLIA_APP_ID: appId, ALGOLIA_SEARCH_KEY: searchKey } = $session

  export let indices = []
  export let highlightable = []
  let client, input
  let query = ``,
    allHits = [],
    open = false

  onMount(() => (client = algoliasearch(appId, searchKey)))

  const processResults = (hits) =>
    hits.map((hit) => {
      for (const key of highlightable) hit[key] = hit?._highlightResult[key]?.value
      return hit
    })

  // Fires on each keyup in form
  async function search() {
    const { results } = await client.multipleQueries(
      indices.map(({ name }) => ({ indexName: name, query }))
    )
    if (results)
      allHits = results.map(({ hits, index }) => ({ hits: processResults(hits), index }))
  }
</script>

<button on:click={() => (open = true)} title="Search">
  <Search alt="Search Icon" />
</button>
{#if open}
  <Modal
    on:close={() => (open = false)}
    style="background: var(--accentBg); top: 10vh; max-height: 80vh; max-width: 30em;">
    <!-- svelte-ignore a11y-autofocus -->
    <input
      autofocus
      type="text"
      bind:this={input}
      bind:value={query}
      on:keyup={search}
      placeholder="Suche" />
    {#if allHits.length > 0 && query}
      <div class="results">
        {#each allHits as { index, hits }}
          {#if hits.length}
            <section>
              <h2>{indices.find((idx) => idx.name === index).title}</h2>
              {#each hits as { title, slug, date, channel, tag, excerpt }}
                <h3>
                  <a
                    href={slug}
                    on:click={() => (open = false)}
                    on:click>{@html title}</a>
                </h3>
                <p>
                  {@html reduceMeta(date, channel, tag)}
                </p>
                {#if excerpt}
                  <p>
                    {@html excerpt}
                  </p>
                {/if}
              {/each}
            </section>
          {/if}
        {/each}
      </div>
    {/if}
  </Modal>
{/if}

<style>
  button {
    color: var(--linkColor);
    padding: 0;
    background: transparent;
    width: 3ex;
    margin-top: 4pt;
  }
  h2 {
    background: teal;
    color: white;
    text-align: center;
    border-radius: 4pt;
    margin-top: 1em;
  }
  input {
    margin: 0 auto;
    display: block;
    font-size: 1em;
    background: var(--bodyBg);
    color: inherit;
    border: 0;
    outline: none;
  }
  .results {
    font-size: 0.7em;
    white-space: initial;
  }
  .results :global(em) {
    background: orange;
    line-height: 1.2em;
    border-radius: 3pt;
  }
</style>
