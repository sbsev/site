<script>
  import { onMount } from 'svelte'
  import algoliasearch from 'algoliasearch/lite'
  import { stores } from '@sapper/app'
  import Search from '@svg-icons/fa-solid/search.svg'
  import { onClickOutside } from '../utils/onClickOutside'

  const { session } = stores()
  const { ALGOLIA_APP_ID: appId, ALGOLIA_SEARCH_KEY: searchKey } = $session

  export let indices = []
  let client, input
  let query = ``
  let allHits = []
  let hasFocus = false

  onMount(() => {
    client = algoliasearch(appId, searchKey)
    return () => client.destroy()
  })

  const processResults = (hits) =>
    hits.map((hit) => {
      for (const [key, val] of Object.entries(hit)) {
        hit[key] =
          hit?._snippetResult?.[key]?.value || hit?._highlightResult?.[key]?.value || val
      }
      return hit
    })

  // Fires on each keyup in form
  async function search() {
    const { results } = await client.multipleQueries(
      indices.map((indexName) => ({ indexName, query }))
    )
    if (results)
      allHits = results.map(({ hits, index }) => ({ hits: processResults(hits), index }))
  }
</script>

<aside use:onClickOutside={() => (hasFocus = false)}>
  <input
    type="text"
    bind:this={input}
    bind:value={query}
    on:keyup={search}
    placeholder="Suchen"
    aria-label="Suche"
    class:hasFocus />
  <button
    on:click={() => {
      hasFocus = true
      input.focus()
    }}
    title="Suche">
    <Search
      alt="Lupe"
      height="{hasFocus ? 2 : 2.3}ex"
      style="vertical-align: text-bottom; z-index: 0;" />
  </button>
  {#if hasFocus && allHits.length > 0 && query}
    <div class="results">
      {#each allHits as { index, hits }}
        {#if hits.length}
          <section>
            <h2>{index}</h2>
            {#each hits as { title, slug, body, cover }}
              <img src={cover.url + `?w=100`} alt={cover.description} />
              <h3>
                <a href={slug} on:click={() => (hasFocus = false)}>{@html title}</a>
              </h3>
              {#if body}
                <p>
                  {@html body}
                </p>
              {/if}
            {/each}
          </section>
        {/if}
      {/each}
    </div>
  {/if}
</aside>

<style>
  aside {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
  }
  button {
    align-items: center;
    padding: 0;
    grid-area: search;
    color: var(--headerColor);
    position: relative;
  }
  h2 {
    color: var(--headingColor);
    border-bottom: 1px solid;
    text-align: center;
  }
  input {
    font-size: 1em;
    background: var(--accentBg);
    border-radius: 5pt;
    color: var(--linkColor);
    border: 0;
    outline: none;
    width: 0;
    cursor: pointer;
    transition: 0.3s;
    opacity: 0;
  }
  input::placeholder {
    color: var(--headerColor);
  }
  input.hasFocus {
    opacity: 1;
    width: 4em;
    margin-left: -2.5ex;
    padding-left: 3ex;
  }
  input.hasFocus + button {
    color: var(--linkColor);
  }
  div.results {
    background: var(--bodyBg);
    top: 3ex;
    max-height: 60vh;
    position: absolute;
    max-width: 30em;
    overflow: scroll;
    width: 70vw;
    right: 0;
    box-shadow: 0 0 1ex black;
    padding: 1ex 1em;
    border-radius: 5pt;
  }
  section {
    font-size: 0.7em;
    white-space: initial;
  }
  section :global(em) {
    background: var(--hoverColor);
    line-height: 1.2em;
    border-radius: 3pt;
    font-style: normal;
  }
  section h3 :global(em) {
    color: white;
  }
  img {
    float: right;
    border-radius: 5pt;
    margin-top: 2ex;
  }
</style>
