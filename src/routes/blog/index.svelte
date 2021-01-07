<script context="module">
  import { fetchMicrocopy, fetchPosts } from '../../utils/queries'

  export async function preload() {
    const posts = await fetchPosts()
    const social = await fetchMicrocopy(`Social`)
    return { posts, social }
  }
</script>

<script>
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
    <PostPreview {post} />
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    max-width: 50em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16em, 1fr));
    grid-gap: 1em;
    margin: auto;
    padding: 2em 1em;
  }
</style>
