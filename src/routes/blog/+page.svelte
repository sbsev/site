<script lang="ts">
  import { PostPreview, Social, TagList } from '$lib'
  import type { BlogTag } from '$lib/types'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  const { data } = $props()
  const social = $derived(data.social as Record<string, string>)

  let active_tag: BlogTag = $state(`Alle` as BlogTag)

  const filtered_posts = $derived(
    Array.isArray(data.posts)
      ? data.posts.filter((post) => active_tag === `Alle` || post.tags.includes(active_tag))
      : []
  )
</script>

<Social {social} fixed vertical />

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
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1em;
    margin: auto;
    padding: 2em 1em;
  }
  @media (max-width: 900px) {
    ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    ul {
      grid-template-columns: 1fr;
    }
  }
</style>
