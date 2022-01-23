<script lang="ts" context="module">
  import { session } from '$app/stores'
  import type { Load } from '@sveltejs/kit'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import FormField from '../components/FormField.svelte'
  import Modal from '../components/Modal.svelte'
  import { signupStore } from '../stores'
  import type { Chapter, FieldData, SignupStore } from '../types'
  import { submitHandler } from '../utils/airtable'
  import { fetchChapters, fetchYaml, parseMicrocopy } from '../utils/queries.js'

  export const load: Load = async () => {
    const chapters = (await fetchChapters()).filter(
      (chap: Chapter) => chap.acceptsSignups
    )
    const options = await fetchYaml(`Signup Form Options`)

    let microcopy = parseMicrocopy(await fetchYaml(`Student Form v2`))
    microcopy = { ...microcopy, ...parseMicrocopy(await fetchYaml(`Signup Form Meta`)) }

    return { props: { chapters, options, microcopy } }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let options: Record<keyof SignupStore, string[]>
  export let microcopy: Record<
    keyof SignupStore | 'page' | 'submit' | 'submitSuccess' | 'submitError',
    FieldData
  >

  // let { chapter = ``, test } = $page.url.searchParams
  let success = false
  let error: Error | undefined = undefined
  let isSubmitting: boolean
  $: modalOpen = Boolean(error)

  async function submit() {
    $signupStore.type = { value: `Student` }
    isSubmitting = true
    try {
      const response = await submitHandler(chapters, $session.AIRTABLE_API_KEY)
      success = `records` in response // check if airtable responded with a new record
      error = response.error
    } finally {
      isSubmitting = false
    }
  }
</script>

{#if success}
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

    {@html microcopy.page.note}
    <FormField
      options={chapters.map((c) => c.title)}
      name="chapter"
      {...microcopy.chapter}
      maxSelect={1}
    />

    <FormField
      options={options.gender}
      name="gender"
      {...microcopy.gender}
      maxSelect={1}
    />

    <FormField name="fullName" {...microcopy.fullName} />

    <FormField name="phone" {...microcopy.phone} type="tel" />

    <FormField name="email" {...microcopy.email} type="email" />

    <FormField name="studySubject" {...microcopy.studySubject} />

    <FormField
      name="semester"
      {...microcopy.semester}
      type="number"
      min={1}
      maxSelect={1}
    />

    <FormField name="birthPlace" {...microcopy.birthPlace} />

    <FormField name="birthDate" {...microcopy.birthDate} type="date" />

    <FormField name="subjects" {...microcopy.subjects} options={options.subjects} />

    <FormField name="school" {...microcopy.schoolTypes} options={options.schoolTypes} />

    <FormField name="levels" {...microcopy.levels} type="doubleRange" min={1} max={13} />

    <FormField name="places" {...microcopy.places} type="placeSelect" />

    <FormField name="remarks" {...microcopy.remarks} />

    <FormField
      name="discovery"
      {...microcopy.discovery}
      options={options.discovery}
      maxSelect={3}
    />

    <FormField name="agreement" {...microcopy.agreement} type="toggle" />

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
    font-size: calc(16px + 0.1vw);
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
