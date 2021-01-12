<script context="module">
  import { fetchYaml, fetchPosts } from '../../utils/queries'

  export async function preload() {
    const posts = await fetchPosts()
    const social = await fetchYaml(`Social`)
    return { posts, social }
  }
</script>

<script>
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  import PostPreview from '../../components/PostPreview.svelte'
  import Social from '../../components/Social.svelte'
  import TagList from '../../components/TagList.svelte'

  export let posts, social

  let activeTag
  $: filteredPosts = posts.filter(
    (post) => activeTag === `Alle` || post.tags.includes(activeTag)
  )
  // count tag occurences
  const tags = posts.reduce(
    (obj, faq) => {
      faq.tags.forEach((tag) => (obj[tag] = obj[tag] ? obj[tag] + 1 : 1))
      return obj
    },
    { Alle: posts.length }
  )
</script>

<Social {social} fixed vertical />

<TagList {tags} bind:activeTag />

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
