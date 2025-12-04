<script lang="ts">
  import { PostPreview, Social, TagList } from '$lib'
  import type { BlogTag } from '$lib/types'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  const { data } = $props()

  let active_tag: BlogTag

  const filtered_posts = $derived(
    Array.isArray(data.posts)
      ? data.posts.filter((post) => active_tag === `Alle` || post.tags.includes(active_tag))
      : []
  )
</script>

<Social social={data.social} fixed vertical />

<TagList posts={Array.isArray(data.posts) ? data.posts : []} bind:active_tag />

<ul>
  {#each filtered_posts as post (post.slug)}
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
