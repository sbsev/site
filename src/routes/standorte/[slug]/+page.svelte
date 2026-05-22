<script lang="ts">
  import { BasePage } from '$lib'
  import { microcopy } from '$lib/stores'
  import { showsSignupSection, canAcceptStudents, canAcceptPupils } from '$lib/types'

  // Icon imports (bundled at build time)
  import IconGraduation from '~icons/fa-solid/graduation-cap'
  import IconInfo from '~icons/bi/info-circle-fill'
  import IconChild from '~icons/fa-solid/child'
  import IconEmail from '~icons/ic/email'

  const { data } = $props()
  const page = $derived(data.page)
  const slug = $derived(data.slug)
  const chapterStatus = $derived(data.chapterStatus)

  // Derive signup eligibility from status
  const showSignupSection = $derived(showsSignupSection(chapterStatus))
  const studentsCanSignup = $derived(canAcceptStudents(chapterStatus))
  const pupilsCanSignup = $derived(canAcceptPupils(chapterStatus))

  const style = `margin-right: 3pt;`
</script>

<BasePage {page}>
  <!-- Signup buttons section - only shown for active/accepting chapters -->
  {#if showSignupSection}
    <h2 style="text-align: center; margin-top: 2em;">{$microcopy?.location?.register}</h2>
    <section>
      <span>
        {$microcopy?.location?.joinStudent}
        {#if studentsCanSignup}
          <a href="/signup-student?chapter={page.title}" class="btn blue">
            <IconGraduation {style} />{$microcopy?.location?.registerStudent}
          </a>
        {:else}
          <button class="btn blue disabled" disabled>
            <IconGraduation {style} />{$microcopy?.location?.studentWaitlistFull ?? 'Warteliste voll'}
          </button>
        {/if}
        <a href={$microcopy?.location?.linkStudentInfo} class="btn blue stroke">
          <IconInfo style={style + `margin-right: 6pt;`} />{$microcopy?.location?.infoStudentButton}
        </a>
      </span>
      <span>
        {$microcopy?.location?.joinPupil}
        {#if pupilsCanSignup}
          <a href="/signup-pupil?chapter={page.title}" class="btn green">
            <IconChild {style} />{$microcopy?.location?.registerPupil}
          </a>
        {:else}
          <button class="btn green disabled" disabled>
            <IconChild {style} />{$microcopy?.location?.pupilWaitlistFull ?? 'Warteliste voll'}
          </button>
        {/if}
        <a href={$microcopy?.location?.linkPupilInfo} class="btn green stroke">
          <IconInfo style={style + `margin-right: 6pt;`} />{$microcopy?.location?.infoPupilButton}</a
        >
      </span>
      <span>
        {$microcopy?.location?.locationManagement}
        <a href="mailto:info.{slug}{$microcopy?.location?.mailTo}" class="btn orange">
          <IconEmail {style} />{$microcopy?.location?.writeMailButton}
        </a>
        <a href={$microcopy?.location?.linkLeadingInfo} class="btn orange stroke">
          <IconInfo style={style + `margin-right: 6pt;`} />{$microcopy?.location?.infoLeadingButton}</a
        >
      </span>
    </section>
  {/if}

  {#snippet afterBody()}
    {#if showSignupSection}
      <h2 id="kontakt">{$microcopy?.location?.contact}</h2>
      <p>{$microcopy?.location?.questions}</p>
      <ul class="contact">
        <li>
          <a
            href="mailto:{$microcopy?.location?.student}.{slug}@{$microcopy?.location?.url}"
            title="{$microcopy?.location?.student}.{slug}@{$microcopy?.location?.url}"
            class="btn blue"
          >
            <IconEmail style="margin: 0 3pt 0 0;" />
            {$microcopy?.location?.student}.{slug}@{$microcopy?.location?.url}
          </a>
          {$microcopy?.location?.forStudents}
        </li>
        <li>
          <a
            href="mailto:{$microcopy?.location?.pupil}.{slug}@{$microcopy?.location?.url}"
            title="{$microcopy?.location?.pupil}.{slug}@{$microcopy?.location?.url}"
            class="btn green"
          >
            <IconEmail style="margin: 0 3pt 0 0;" />
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
            <IconEmail style="margin: 0 3pt 0 0;" />
            {$microcopy?.location?.info}.{slug}@{$microcopy?.location?.url}
          </a>
          {$microcopy?.location?.generalRequests}
        </li>
      </ul>
    {/if}
  {/snippet}
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
  a.btn,
  button.btn {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 3pt 5pt;
  }
  button.btn.disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  @media (max-width: 850px) {
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
