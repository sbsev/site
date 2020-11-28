<script>
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'

  const getNav = gql`
    {
      json(id: "3hmpA4klTFvPa9PDvF6TiI") {
        data
      }
    }
  `
  const nav = query(getNav)

  import { stores } from '@sapper/app'
  const { page } = stores()
</script>

<nav>
  {#each $nav?.data?.json?.data?.nav || [] as { title, url }}
    <a
      rel="prefetch"
      aria-current={url === $page.path ? `page` : undefined}
      href={url}>{title}</a>
  {/each}
</nav>

<style>
  nav {
    display: contents;
  }
  a {
    text-decoration: none;
    transition: 0.4s;
    border-bottom: 3px solid transparent;
  }
  a:not(:first-child) {
    font-weight: lighter;
  }
  a:hover {
    color: orange;
  }
  a[aria-current] {
    border-bottom: 3px solid teal;
  }
</style>
