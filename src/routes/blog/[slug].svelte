<script lang="ts" context="module">
  import Img from '$src/components/Img.svelte'
  import ToolTip from '$src/components/ToolTip.svelte'
  import { fetchPost } from '$src/fetch'
  import type { Post } from '$src/types'
  import type { Load } from '@sveltejs/kit'
  import PersonCircle from '~icons/bi/person-circle'
  import GraduationCap from '~icons/fa-solid/graduation-cap'
  import HistoryEdu from '~icons/ic/round-history-edu'
  import Calendar from '~icons/octicon/calendar'

  export const load: Load = async ({ params }) => {
    const post = await fetchPost(params.slug)

    if (!post) return { status: 404 }

    return { props: { post } }
  }
</script>

<script lang="ts">
  export let post: Post

  $: ({ title, body, cover } = post)
  $: ({ bio, fieldOfStudy, name, photo } = post.author)
  const style = `height: 18pt; vertical-align: -3pt; padding: 0 3pt;`
</script>

<article>
  <Img
    sizes={[{ w: 1000 }, { w: 700 }, { w: 500 }, { w: 300 }]}
    {...cover}
    imgStyle="height: auto;"
    pictureStyle="margin: -2em 0 3em 0"
  />
  <h1>{title}</h1>
  <section>
    <Img sizes={[{ w: 150 }]} {...photo} alt={name} />
    <span>
      von
      {#if bio || fieldOfStudy}
        <ToolTip minWidth="18em">
          <PersonCircle {style} />
          <strong>{name}</strong>
          <span slot="tip">
            <HistoryEdu {style} />
            Bio:
            {bio}
            {#if fieldOfStudy}
              <br />
              <GraduationCap {style} />
              Studiert:
              {fieldOfStudy}
            {/if}
          </span>
        </ToolTip>
      {:else}
        <PersonCircle {style} />
        <strong>{name}</strong>
      {/if}
      am
      <Calendar {style} />
      <strong>{new Date(post.date).toLocaleDateString(`de`)}</strong>
    </span>
  </section>
  {@html body}
</article>

<style>
  article {
    max-width: 42em;
    padding: 2em;
    margin: auto;
  }
  section {
    text-align: center;
    font-weight: lighter;
  }
  section :global(img) {
    margin: 1em auto;
    display: block;
    width: 3em;
    height: 3em;
    border-radius: 50%;
  }
</style>
