<script lang="ts" context="module">
  import { session } from '$app/stores'
  import type { Load } from '@sveltejs/kit'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import { onMount } from 'svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import FormField from '../components/FormField.svelte'
  import LinkButtons from '../components/LinkButtons.svelte'
  import Modal from '../components/Modal.svelte'
  import { signupStore } from '../stores'
  import type { Chapter, FieldData, SignupData } from '../types'
  import { airtableSubmit } from '../utils/airtable.js'
  import { fetchChapters, fetchYaml, parseMicrocopy } from '../utils/queries.js'

  export const ssr = false

  export const load: Load = async () => {
    const chapters = (await fetchChapters()).filter(
      (chap: Chapter) => chap.acceptsSignups
    )
    const options = await fetchYaml(`Signup Form Options`)

    let microcopy = parseMicrocopy(await fetchYaml(`Pupil Form v2`))
    microcopy = { ...microcopy, ...parseMicrocopy(await fetchYaml(`Signup Form Meta`)) }

    return { props: { chapters, options, microcopy } }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let options: Record<string, unknown>
  export let microcopy: Record<string, FieldData>

  // let { chapter = ``, test } = $page.url.searchParams
  let response = {}
  let error: Error | undefined = undefined
  let isSubmitting: boolean
  let modalOpen: boolean

  onMount(() => {
    $signupStore.type = `Pupil`
  })

  async function submit() {
    isSubmitting = true

    let { chapter, type } = $signupStore
    const chapterAndType = {
      chapter: chapter[0],
      type,
      'chapter+type': `${type} aus ${chapter[0]}`,
    }

    const baseId = chapters?.find(({ title }) =>
      $signupStore?.chapter?.includes(title)
    )?.baseId
    if (!baseId) {
      isSubmitting = false
      error = { name: `BaseIDError`, message: `baseId could not be determined` }
    }

    try {
      response = await airtableSubmit(baseId, $signupStore, $session.AIRTABLE_API_KEY)

      window.plausible(`Signup`, { props: chapterAndType })
      window.scrollTo({ top: 0, behavior: `smooth` })

      $signupStore = {} as SignupData // reset store for potential next signup
    } catch (err) {
      error = err as Error
      console.error(error)
      window.plausible(`Signup Error`, {
        props: {
          error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
          ...chapterAndType,
        },
      })
      modalOpen = true
    } finally {
      isSubmitting = false
    }
  }
</script>

{#if response?.records}
  <section>
    <span>{microcopy.submitSuccess.title}</span>
    {@html microcopy.submitSuccess.note}
  </section>
{:else}
  <form onsubmit="return false;" on:submit|preventDefault={submit}>
    <!-- Prevent implicit submission of the form https://stackoverflow.com/a/51507806 -->
    <button type="submit" disabled style="display: none" aria-hidden="true" />
    <h1>
      <Plant height="1em" style="vertical-align: -3pt;" />
      {@html microcopy.page.title}
    </h1>

    <LinkButtons
      links={options.types.map((type) => ({
        title: type,
        slug: `anmeldung-${type}`,
      }))}
      style="margin: 1em auto;"
      current="Schüler"
    />

    {@html microcopy.page.note}
    <FormField
      options={chapters.map((c) => c.title)}
      name="chapter"
      {...microcopy.chapter}
      maxSelect={1}
    />

    <FormField
      options={options.genders}
      name="gender"
      {...microcopy.gender}
      maxSelect={1}
    />

    <FormField name="firstName" {...microcopy.firstName} />

    <FormField name="subjects" {...microcopy.subjects} options={options.subjects} />

    <FormField
      name="schoolTypes"
      options={options.schoolTypes}
      {...microcopy.schoolType}
      maxSelect={1}
    />

    <FormField name="level" {...microcopy.level} type="singleRange" min={1} max={13} />

    <FormField
      name="places"
      {...microcopy.places}
      placeholder="Ort der Nachhilfe"
      type="placeSelect"
    />

    <FormField name="age" {...microcopy.age} type="number" />

    <FormField name="online" {...microcopy.online} type="toggle" />

    <FormField name="remarks" {...microcopy.remarks} />

    <FormField name="nameContact" {...microcopy.nameContact} />

    <FormField name="phoneContact" {...microcopy.phoneContact} type="tel" />

    <FormField name="emailContact" {...microcopy.emailContact} type="email" />

    <FormField name="orgContact" {...microcopy.orgContact} />

    <FormField name="need" {...microcopy.need} type="toggle" />

    <FormField name="discovery" {...microcopy.discovery} />

    <FormField name="dataProtection" {...microcopy.dataProtection} type="toggle" />

    <h3>
      {@html microcopy.submit.title}
    </h3>
    {@html microcopy.submit.note}
    <!-- class main used by CSS selector in test/signupForm.js -->
    <button type="submit" class="main" disabled={isSubmitting}>
      {#if isSubmitting}
        <CircleSpinner color="white" />
      {:else}
        Anmeldung Abschicken
      {/if}
    </button>
  </form>
  {#if modalOpen}
    <Modal on:close={() => (modalOpen = false)} style="background: var(--bodyBg);">
      <div>
        <span>{microcopy.submitError.title}</span>
        {@html microcopy.submitError.note}

        <pre><code>
          {JSON.stringify(error, null, 2)}
        </code></pre>
        <pre><code>
          {JSON.stringify(error, Object.getOwnPropertyNames(error))}
        </code></pre>
      </div>
    </Modal>
  {/if}
{/if}

<style>
  /* ensures minimum font-size > 16px so iOS doesn't zoom in when focusing inputs
  https://stackoverflow.com/a/6394497 */
  :global(input) {
    font-size: clamp(1rem, 0.5vw + 1rem, 1.6rem);
  }
  form {
    max-width: 40em;
    margin: 2em auto;
    padding: 1em;
  }
  button[type='submit'] {
    margin: 1em auto;
    display: block;
    transition: 0.3s;
    padding: 1ex 1em;
    color: white;
    background: var(--darkGreen);
    font-size: 1.2em;
    border: 1pt solid transparent;
  }
  button[type='submit']:focus {
    border: 1pt solid var(--lightBlue);
  }
  button[type='submit']:disabled {
    cursor: default;
  }
  section {
    max-width: 30em;
    margin: auto;
    text-align: center;
    font-size: 3ex;
    padding: 1em;
  }
  span {
    text-align: center;
    display: block;
    font-size: 2em;
    padding: 1em;
  }
  pre {
    overflow-x: auto;
  }
</style>
