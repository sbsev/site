<script lang="ts">
  import PostPreview from '$lib/PostPreview.svelte'
  import Social from '$lib/Social.svelte'
  import TagList from '$lib/TagList.svelte'
  import type { BlogTag } from '$lib/types'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import type { PageData } from './$types'

  export let data: PageData

  let active_tag: BlogTag

  $: filtered_posts = data.posts.filter(
    (post) => active_tag === `Alle` || post.tags.includes(active_tag)
  )
</script>

<Social social={data.social} fixed vertical />

<TagList posts={data.posts} bind:active_tag />

<ul>
  {#each filtered_posts as post (post.slug)}
    <li animate:flip={{ duration: 200 }} transition:scale|local style="display: flex;">
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
