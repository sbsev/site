<script lang="ts">
  import { ChapterMap } from '$lib'
  import { microcopy } from '$lib/stores'
  import Icon from '@iconify/svelte'
    import { onMount } from 'svelte'

  export let data

  const style = `margin-right: 5pt;`

  onMount(() => {
    let numChapters = data.chapters.filter((ch) => ch.acceptsSignups).length
    let numStudents = $microcopy?.indexPage?.boxes?.studentsNumber
    let numPupils = $microcopy?.indexPage?.boxes?.pupilsNumber
    let numScholarships = $microcopy?.indexPage?.boxes?.scholarshipNumber
    let numOrganizationMembers = $microcopy?.indexPage?.boxes?.organizationMemberNumber

    let boxes = [
      { id: 'chapterNumber', number: numChapters },
      { id: 'studentNumber', number: numStudents },
      { id: 'pupilNumber', number: numPupils },
      { id: 'scholarshipNumber', number: numScholarships },
      { id: 'organizationMemberNumber', number: numOrganizationMembers },
    ]

    function updateBox(id) {
      let increment = boxes.find((box) => box.id === id)?.number / 100
      let currentNum = parseInt(document.getElementById(id).innerText)
      if (currentNum < boxes.find((box) => box.id === id)?.number) {
        document.getElementById(id).innerText = Math.ceil(currentNum + increment)
        setTimeout(() => updateBox(id), 10)
      } else {
        document.getElementById(id).innerText = boxes.find((box) => box.id === id)?.number
      }
    }

    boxes.forEach((b) => {
      updateBox(b.id)
    })
  })
</script>

<!-- Shows image of name of german association if page is german. Otherwise shows name of association. -->
{#if $microcopy?.country == `de` || $microcopy?.country == `at`}
  <h1>
    <img src="/logo-name-de.svg" alt="StudyTutors" width="1612px" height="163px" />
  </h1>
{:else}
  <h1>
    {$microcopy?.indexPage?.title}
  </h1>
{/if}

<svelte:head>
  <title>{$microcopy?.indexPage?.title}</title>
</svelte:head>

<h2>
  {@html $microcopy?.indexPage?.theme}
</h2>

<section style="white-space: nowrap;">
  <div style="background: var(--light-blue);">
    <span id="chapterNumber"> 0 </span>
    <strong>
      <Icon inline icon="ic:place" {style} />
      {$microcopy?.indexPage?.boxes?.locationsName}</strong
    >
  </div>
  <div style="background: var(--green);">
    <span id="studentNumber"> 0 </span>
    <strong>
      <Icon inline icon="fa-solid:user-graduate" {style} />
      {$microcopy?.indexPage?.boxes?.studentsName}</strong
    >
  </div>
  <div style="background: var(--orange);">
    <span id="pupilNumber"> 0 </span>
    <strong>
      <Icon inline icon="fa-solid:child" {style} />
      {$microcopy?.indexPage?.boxes?.pupilsName}</strong
    >
  </div>
  <div style="background: var(--green);">
    <span id="scholarshipNumber"> 0 </span>
    <strong>
      <Icon inline icon="fa-solid:user-graduate" {style} />
      {@html $microcopy?.indexPage?.boxes?.scholarshipName}
    </strong>
  </div>
  <div style="background: var(--light-blue);">
    <span id="organizationMemberNumber">0</span>
    <strong>
      <Icon inline icon="fa6-solid:user-group" {style} />
      {@html $microcopy?.indexPage?.boxes?.organizationMemberName}
    </strong>
  </div>
</section>

<h2>
  <!-- choose on map -->
  {@html $microcopy?.indexPage?.chooseLocation}
</h2>

<ChapterMap chapters={data.chapters} />

<h2>
  <!-- register now -->
  {@html $microcopy?.indexPage?.register}
</h2>

<article>
  {@html data.page.body}
</article>

<style>
  h1 img {
    margin: 3ex auto;
    display: block;
    width: 92vw;
    max-width: 650pt;
    height: auto;
  }
  h2 {
    margin-top: 2em;
    text-align: center;
    font-weight: lighter;
  }
  section {
    display: flex;
    padding: 1em;
    place-content: center;
    gap: 2em;
    flex-wrap: wrap;
    color: white;
  }
  section div {
    font-size: 2ex;
    text-align: center;
    flex: 0 1 10%;
    padding: 1ex;
    border-radius: 1ex;
    font-weight: bold;
    display: flex;
    flex-direction: column;
  }
  section div span {
    font-size: 3ex;
    display: block;
  }
  article {
    padding: calc(1ex + 2vw);
    max-width: 40em;
    margin: auto;
  }
</style>
