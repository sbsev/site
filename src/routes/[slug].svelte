<script>
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'
  import { stores } from '@sapper/app'
  import marked from 'marked'
  const { page } = stores()

  const pages = query(gql`
    {
      pages: pageCollection(where: {slug: "${$page.path.substring(1)}"}) {
        items {
          title
          slug
          body
          cover {
            description
            url
          }
        }
      }
    }
  `)
  $: ({ title, cover = {}, body = `` } = $pages?.data?.pages.items[0] || {})
</script>

<hgroup>
  <img src={cover.url} alt={cover.description} />
  <h1>{title}</h1>
</hgroup>
<div>
  {@html marked(body)}
</div>

<style>
  div {
    max-width: 45em;
    padding: 2em;
    margin: auto;
    columns: 2;
  }
  div :global(img) {
    width: 100%;
  }
  hgroup {
    position: relative;
    height: max-content;
    max-height: 700px;
    overflow: hidden;
  }
  hgroup img {
    width: 100%;
    object-position: cover;
  }
  h1 {
    color: white;
    background: rgba(0, 0, 0, 0.2);
    padding: 5pt 1ex;
    border-radius: 1ex;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: min-content;
    white-space: nowrap;
  }
</style>
