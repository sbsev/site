<script lang="ts" context="module">
  import PostPreview from '$src/components/PostPreview.svelte'
  import Social from '$src/components/Social.svelte'
  import TagList from '$src/components/TagList.svelte'
  import { fetchPosts, fetchYaml } from '$src/fetch'
  import type { BlogTag, Post } from '$src/types'
  import type { Load } from '@sveltejs/kit'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'

  export const load: Load = async () => {
    const posts = await fetchPosts()
    const social = await fetchYaml(`Social`)

    return { props: { posts, social } }
  }
</script>

<script lang="ts">
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
