<script lang="ts">
  import { ChapterMap } from '$lib'
  import { microcopy } from '$lib/stores'
  // import Icon from '@iconify/svelte'
  // Bundled icons to prevent layout shift
  import IconPlace from '~icons/ic/place'
  import IconUserGraduate from '~icons/fa-solid/user-graduate'
  import IconChild from '~icons/fa-solid/child'
  import IconUserGroup from '~icons/fa6-solid/user-group'

  export let data

  const style = `margin-right: 5pt; display: inline-block; vertical-align: -0.125em;`

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

<section class="stat-groups" aria-label="Zahlen zu StudyTutors">
  <div class="stat-group">
    <h2>{$microcopy?.indexPage?.currentStatsTitle ?? `Wir sind aktuell`}</h2>
    <div class="stat-row current">
      <div class="stat-box" style="background: var(--blue);">
        <span id="chapterNumber">{data.chapters.filter((ch) => ch.acceptsSignups).length}</span>
        <strong>
          <IconPlace {style} />
          {$microcopy?.indexPage?.boxes?.locationsName}</strong
        >
      </div>
      <div class="stat-box" style="background: var(--green);">
        <span id="organizationMemberNumber">{$microcopy?.indexPage?.boxes?.organizationMemberNumber}</span>
        <strong>
          <IconUserGroup {style} />
          {@html $microcopy?.indexPage?.boxes?.organizationMemberName}
        </strong>
      </div>
    </div>
  </div>

  <div class="stat-group">
    <h2>{$microcopy?.indexPage?.mediatedStatsTitle ?? `Wir vermittelten seit 2020:`}</h2>
    <div class="stat-row mediated">
      <div class="stat-box" style="background: var(--green);">
        <span id="studentNumber">{$microcopy?.indexPage?.boxes?.studentsNumber}</span>
        <strong>
          <IconUserGraduate {style} />
          {$microcopy?.indexPage?.boxes?.studentsName}</strong
        >
      </div>
      <div class="stat-box" style="background: var(--orange);">
        <span id="pupilNumber">{$microcopy?.indexPage?.boxes?.pupilsNumber}</span>
        <strong>
          <IconChild {style} />
          {$microcopy?.indexPage?.boxes?.pupilsName}</strong
        >
      </div>
      <div class="stat-box" style="background: var(--light-blue);">
        <span id="scholarshipNumber">{$microcopy?.indexPage?.boxes?.scholarshipNumber}</span>
        <strong>
          <IconUserGraduate {style} />
          {@html $microcopy?.indexPage?.boxes?.scholarshipName}
        </strong>
      </div>
    </div>
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
  {@html data.page?.body}
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
  .stat-groups {
    display: flex;
    padding: 1em;
    place-content: center;
    gap: 2.25em;
    flex-direction: column;
    color: white;
  }

  .stat-group {
    color: var(--text-color);
  }

  .stat-group h2 {
    margin: 0 0 0.75em;
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .stat-row {
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    justify-content: center;
    white-space: nowrap;
  }

  .stat-box {
    color: white;
    font-size: 2ex;
    text-align: center;
    flex: 0 1 10em;
    padding: 1ex;
    border-radius: 1ex;
    font-weight: bold;
    display: flex;
    flex-direction: column;
  }
  .stat-box span {
    font-size: 3ex;
    display: block;
  }
  article {
    padding: calc(1ex + 2vw);
    max-width: 40em;
    margin: auto;
  }
</style>
