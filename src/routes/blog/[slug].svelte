<script context="module">
  import { fetchPost } from '../../utils/queries'

  export async function preload({ params }) {
    const post = await fetchPost(params.slug)
    return { post }
  }
</script>

<script>
  import BasePage from '../../components/BasePage.svelte'
  import ToolTip from '../../components/ToolTip.svelte'

  import Calendar from '@svg-icons/octicons/calendar.svg'
  import PersonCircle from '@svg-icons/bootstrap/person-circle.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import HistoryEdu from '@svg-icons/material-sharp/history-edu.svg'

  export let post

  const { author = {}, date } = post
  const { bio, fieldOfStudy, name, photo } = author
  const style = `height: 18pt; vertical-align: -3pt; padding: 0 3pt;`
</script>

<BasePage page={post}>
  <blockquote>
    <img src={photo.url} alt={name} />
    <span>von
      {#if bio || fieldOfStudy}
        <ToolTip>
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
