<script lang="ts" context="module">
  import { fetchPost } from '../../utils/queries'

  export async function load({ page }: LoadInput): Promise<LoadOutput> {
    const post = await fetchPost(page.params.slug)

    return { props: { post } }
  }
</script>

<script lang="ts">
  import ToolTip from '../../components/ToolTip.svelte'

  import type { LoadInput, LoadOutput } from '@sveltejs/kit'

  import Calendar from '@svicons/octicons/calendar.svelte'
  import PersonCircle from '@svicons/bootstrap/person-circle.svelte'
  import GraduationCap from '@svicons/fa-solid/graduation-cap.svelte'
  import HistoryEdu from '@svicons/material-sharp/history-edu.svelte'
  import Img from '../../components/Img.svelte'

  import type { Post } from '../../types'

  export let post: Post

  $: ({ title, body, cover } = post)
  $: ({ bio, fieldOfStudy, name, photo } = post.author)
  const style = `height: 18pt; vertical-align: -3pt; padding: 0 3pt;`
</script>

<article>
  <Img
    sizes={[{ w: 1000 }, { w: 700 }, { w: 500 }, { w: 300 }]}
    {...cover}
    pictureStyle="margin: -2em 0 3em 0" />
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
