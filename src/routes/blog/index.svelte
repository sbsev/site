<script lang="ts">
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import PostPreview from '../../components/PostPreview.svelte'
  import Social from '../../components/Social.svelte'
  import TagList from '../../components/TagList.svelte'
  import type { BlogTag, Post } from '../../types'

  export let posts: Post[]
  export let social: Record<string, string>

  let activeTag: BlogTag

  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )

  const tagCounter: Record<string, number> = { Alle: posts.length }

  // count tag occurrences
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounter[tag] = (tagCounter[tag] ?? 0) + 1
    }
  }

  const tagOccurrences = Object.entries(tagCounter) as [BlogTag, number][]
</script>

<Social {social} fixed vertical />

<TagList {tagOccurrences} bind:activeTag />

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
