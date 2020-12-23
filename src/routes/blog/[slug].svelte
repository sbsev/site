<script context="module">
  import { fetchPost } from '../../utils/queries'

  export async function preload({ path }, session) {
    const post = await fetchPost(path.split(`/`).pop(), session.gqlUri)
    return { post }
  }
</script>

<script>
  import BasePage from '../../components/BasePage.svelte'

  import Calendar from '@svg-icons/octicons/calendar.svg'

  export let post

  const { author = {}, date } = post
  const { bio, fieldOfStudy, name, photo } = author
</script>

<BasePage page={post}>
  <blockquote>
    <img src={photo.url} alt={name} />
    <span><Calendar
        height="20"
        style="vertical-align: -2pt;" />{new Date(date).toLocaleDateString(`de`)}</span>
    <span>{name} {fieldOfStudy ? `(${fieldOfStudy})` : ``}</span>
    {#if bio}
      <p>{bio}</p>
    {/if}
  </blockquote>
</BasePage>

<style>
  img {
    width: 100%;
    object-position: cover;
  }
  blockquote {
    padding: 6pt 1em;
    border-radius: 1ex;
    margin-bottom: 2em;
  }
  blockquote img {
    width: 3em;
    border-radius: 50%;
  }
</style>
