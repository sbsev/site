<script lang="ts">
  import { Img, ToolTip } from '$lib'
  import { onMount } from 'svelte'

  // Icon imports (bundled at build time)
  import IconPerson from '~icons/bi/person-circle'
  import IconHistoryEdu from '~icons/ic/round-history-edu'
  import IconGraduation from '~icons/fa-solid/graduation-cap'
  import IconCalendar from '~icons/octicon/calendar'
  import IconEye from '~icons/ic/round-remove-red-eye'

  const { data } = $props()
  let n_readers = 0

  onMount(async () => {
    const response = await fetch(
      `https://plausible.io/api/v1/stats/aggregate?site_id=studytutors.de&period=6mo&filters=event:page==${data.post.slug}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PLAUSIBLE_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error ` + response.status)
    }

    const { results } = await response.json()
    n_readers = results.visitors.value
  })

  const { title, body, cover, date } = data.post
  const { bio, fieldOfStudy, name, photo } = data.post.author
  const style = `padding: 0 3pt;`
</script>

<article>
  <Img
    sizes={[{ w: 1000 }, { w: 700 }, { w: 500 }, { w: 300 }]}
    {...cover}
    img_style="height: auto;"
    picture_style="margin: -2em 0 3em 0"
  />
  <h1>{title}</h1>
  <section>
    <Img sizes={[{ w: 150 }]} {...photo} alt={name} />
    <span>
      von
      {#if bio || fieldOfStudy}
        <ToolTip minWidth="18em">
          <IconPerson {style} />
          <strong>{name}</strong>
          <span slot="tip">
            <IconHistoryEdu {style} />
            Bio:
            {bio}
            {#if fieldOfStudy}
              <br />
              <IconGraduation {style} />
              Studiert:
              {fieldOfStudy}
            {/if}
          </span>
        </ToolTip>
      {:else}
        <IconPerson {style} />
        <strong>{name}</strong>
      {/if}
      am
      <IconCalendar {style} />
      <strong>{new Date(date).toLocaleDateString(`de`)}</strong>
    </span>
    <span>
      <IconEye />
      {n_readers}
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
