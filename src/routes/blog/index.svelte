<script lang="ts" context="module">
  import { fetchYaml, fetchPosts } from '../../utils/queries'

  export async function load(): Promise<LoadOutput> {
    const posts = await fetchPosts()
    const social = await fetchYaml(`Social`)

    return { props: { posts, social } }
  }
</script>

<script lang="ts">
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import type { LoadOutput } from '@sveltejs/kit'

  import PostPreview from '../../components/PostPreview.svelte'
  import Social from '../../components/Social.svelte'
  import TagList from '../../components/TagList.svelte'
  import IntersectionObserver from '../../components/IntersectionObserver.svelte'
  import type { Post, BlogTag } from '../../types'
  import { BlogTags } from '../../types'

  export let posts: Post[]
  export let social

  let activeTag: BlogTag
  let nVisible = 12
  const onIntersect = () => (nVisible += 6)

  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )
  $: visiblePosts = filteredPosts.slice(0, nVisible)

  const tagCounter = Object.fromEntries(BlogTags.map((tag) => [tag, 0])) as Record<
    BlogTag,
    number
  >

  tagCounter.Alle = posts.length

  // count tag occurences
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounter[tag] += 1
    }
  }

  const tagOccurences = Object.entries(tagCounter) as [BlogTag, number][]
</script>

<Social {social} fixed vertical />

<TagList {tagOccurences} bind:activeTag />

<ul>
  {#each visiblePosts as post (post.slug)}
    <li animate:flip={{ duration: 200 }} transition:scale style="display: flex;">
      <PostPreview {post} />
    </li>
  {/each}
</ul>
<IntersectionObserver on:intersect={onIntersect} top={200} />

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
