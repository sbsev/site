<script>
  import { title } from './stores'
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'

  $title = `Studenten bilden Schüler`

  const getPages = gql`
    {
      pages: pageCollection {
        items {
          title
        }
      }
      chapters: chapterCollection {
        items {
          title
          slug
          active
          coords {
            lat
            lon
          }
        }
      }
    }
  `
  const pages = query(getPages)
</script>

<div>
  <h1>{$title}</h1>

  {#each $pages?.data?.pages.items || [] as { title }}
    <p>{title}</p>
  {/each}
</div>

<style>
  div {
    max-width: 45em;
    margin: auto;
  }
</style>
