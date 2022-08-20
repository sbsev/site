<script lang="ts">
  import PostPreview from '$src/lib/PostPreview.svelte'
  import Social from '$src/lib/Social.svelte'
  import TagList from '$src/lib/TagList.svelte'
  import type { BlogTag } from '$src/types'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ posts, social } = data)

  let activeTag: BlogTag

  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )
</script>

<Social {social} fixed vertical />

<TagList {posts} bind:activeTag />

<ul>
  {#each filteredPosts as post (post.slug)}
    <li animate:flip={{ duration: 200 }} transition:scale style="display: flex;">
      <PostPreview {post} />
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    max-width: 56em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18em, 1fr));
    grid-gap: 1em;
    margin: auto;
    padding: 2em 1em;
  }
</style>
