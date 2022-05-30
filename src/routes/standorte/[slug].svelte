<script lang="ts" context="module">
  import BasePage from '$src/components/BasePage.svelte'
  import { fetchPage } from '$src/fetch'
  import type { Page } from '$src/types'
  import type { Load } from '@sveltejs/kit'
  import InfoCircle from '~icons/bi/info-circle-fill'
  import Child from '~icons/fa-solid/child'
  import GraduationCap from '~icons/fa-solid/graduation-cap'
  import Email from '~icons/ic/email'
  import { microcopy } from '../../stores'

  export const load: Load = async ({ params }) => {
    const { slug } = params

    const page = await fetchPage(`standorte/${slug}`)

    if (!page) return { status: 404 }

    return { props: { page, slug } }
  }
</script>

<script lang="ts">
  export let page: Page
  export let slug: string

  const style = `vertical-align: -3pt; height: 18pt; margin-right: 3pt;`
</script>

<BasePage {page}>
  <!-- needed to hide info buttons on /standorte/gruenden page -->
  {#if page?.yaml?.showSignupButtons !== false}
    <h2 style="text-align: center; margin-top: 2em;">{$microcopy?.location?.register}</h2>
    <section>
      <span>
        {$microcopy?.location?.joinStudent}
        <a
          sveltekit:prefetch
          href="/signup-student?chapter={page.title}"
          class="btn blue"
        >
          <GraduationCap {style} />{$microcopy?.location?.registerStudent}
        </a>
        <a
          sveltekit:prefetch
          href={$microcopy?.location?.linkStudentInfo}
          class="btn blue stroke"
        >
          <InfoCircle style={style + `margin-right: 6pt;`} />{$microcopy?.location
            ?.infoStudentButton}
        </a>
      </span>
      <span>
        {$microcopy?.location?.joinPupil}
        <a sveltekit:prefetch href="/signup-pupil?chapter={page.title}" class="btn green">
          <Child {style} />{$microcopy?.location?.registerPupil}
        </a>
        <a
          sveltekit:prefetch
          href={$microcopy?.location?.linkPupilInfo}
          class="btn green stroke"
        >
          <InfoCircle style={style + `margin-right: 6pt;`} />{$microcopy?.location
            ?.infoPupilButton}</a
        >
      </span>
      <span>
        {$microcopy?.location?.leadLocation}
        <a
          href="mailto:info.{slug}{$microcopy?.location?.mailTo} {page.title}"
          class="btn orange"
        >
          <Email {style} />{$microcopy?.location?.writeMailButton}
        </a>
        <a
          sveltekit:prefetch
          href={$microcopy?.location?.linkLeadingInfo}
          class="btn orange stroke"
        >
          <InfoCircle style={style + `margin-right: 6pt;`} />{$microcopy?.location
            ?.infoLeadingButton}</a
        >
      </span>
    </section>
  {/if}

  <svelte:fragment slot="afterBody">
    {#if page?.yaml?.showSignupButtons !== false}
      <h2 id="kontakt">{$microcopy?.location?.contact}</h2>
      <p>{$microcopy?.location?.questions}</p>
      <ul class="contact">
        <li>
          <a
            href="mailto:{$microcopy?.location?.student}.{slug}@{$microcopy?.location
              ?.url}"
            title="{$microcopy?.location?.student}.{slug}@{$microcopy?.location?.url}"
            class="btn blue"
          >
            <Email style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />
            {$microcopy?.location?.student}.{slug}@{$microcopy?.location?.url}
          </a>
          {$microcopy?.location?.forStudents}
        </li>
        <li>
          <a
            href="mailto::{$microcopy?.location?.pupil}.{slug}@{$microcopy?.location
              ?.url}"
            title="{$microcopy?.location?.pupil}.{slug}@{$microcopy?.location?.url}"
            class="btn green"
          >
            <Email style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />
            {$microcopy?.location?.pupil}.{slug}@{$microcopy?.location?.url}
          </a>
          {$microcopy?.location?.forPartner}
        </li>
        <li>
          <a
            href="mailto:{$microcopy?.location?.info}.{slug}@{$microcopy?.location?.url}"
            title="{$microcopy?.location?.info}.{slug}@{$microcopy?.location?.url}"
            class="btn orange"
          >
            <Email style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />
            {$microcopy?.location?.info}.{slug}@{$microcopy?.location?.url}
          </a>
          {$microcopy?.location?.generalRequests}
        </li>
      </ul>
    {/if}
  </svelte:fragment>
</BasePage>

<style>
  section {
    text-align: center;
    max-width: 42em;
    margin: auto;
    padding: 0 1em;
    display: flex;
    gap: 1em;
  }
  section span {
    display: grid;
    gap: 1em;
  }
  a.btn {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 3pt 5pt;
  }
  ul.contact {
    list-style: none;
    display: flex;
    padding: 0;
    justify-content: space-between;
  }
  ul.contact > li {
    text-align: center;
    width: 32%;
    margin: 1ex 0;
  }
  ul.contact > li > a.btn {
    margin: 1ex 0;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  @media (max-width: 700px) {
    section {
      flex-direction: column;
    }
    ul.contact {
      flex-direction: column;
    }
    ul.contact > li {
      width: 100%;
    }
  }
</style>
