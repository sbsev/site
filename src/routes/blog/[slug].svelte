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
  import PersonCircle from '@svg-icons/bootstrap/person-circle.svg'

  export let post

  const { author = {}, date } = post
  const { name, photo } = author
  const style = `height:20px; vertical-align: -2pt; padding: 0 2pt;`
</script>

<BasePage page={post}>
  <blockquote>
    <img src={photo.url} alt={name} />
    <span>von
      <PersonCircle {style} />
      <strong>{name}</strong>
      am
      <Calendar {style} />
      <strong>{new Date(date).toLocaleDateString(`de`)}</strong>
    </span>
  </blockquote>
</BasePage>

<style>
  blockquote {
    text-align: center;
    max-width: 42em;
    padding: 2em;
    margin: auto;
    font-weight: lighter;
  }
  blockquote img {
    margin: 1em auto;
    display: block;
    width: 3em;
    border-radius: 50%;
  }
</style>
