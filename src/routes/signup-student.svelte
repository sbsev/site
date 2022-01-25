<script lang="ts" context="module">
  import { dev } from '$app/env'
  import { session } from '$app/stores'
  import type { Load } from '@sveltejs/kit'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import FormField from '../components/FormField.svelte'
  import Modal from '../components/Modal.svelte'
  import { signupStore } from '../stores'
  import type { Chapter, Form } from '../types'
  import { submitHandler } from '../utils/airtable'
  import { fetchChapters, parseFormData } from '../utils/queries.js'

  export const load: Load = async () => {
    const options = (await import(`../signup-form/de/options.yml`)).default
    let form = (await import(`../signup-form/de/student.yml`)).default
    const meta = await import(`../signup-form/de/messages.yml`)

    const chapters = (await fetchChapters()).filter(
      (chap: Chapter) => chap.acceptsSignups
    )

    form = parseFormData({ ...form, ...meta })
    if (dev) {
      chapters[0] = { title: `Test`, baseId: `appe3hVONuwBkuQv1` }
    }

    form = parseFormData({ ...form, ...meta })

    for (const field of form.fields) {
      if (field.name in options) {
        field.options = options[field.name]
      } else if (field.name === `chapter`) {
        field.options = chapters.map((chap: Chapter) => chap.title)
      }
    }

    return { props: { chapters, form } }
  }
</script>

<script lang="ts">
  export let chapters: Chapter[]
  export let form: Form

  let success = false
  let error: Error | undefined = undefined
  let isSubmitting: boolean
  $: modalOpen = Boolean(error)

  async function submit() {
    isSubmitting = true

    try {
      $signupStore.type = { value: `student` }
      const fieldNames = form.fields.map((field) => field.name) // list of form fields to validate

      const response = await submitHandler(
        fieldNames,
        chapters,
        $session.AIRTABLE_API_KEY
      )
      if (response.success) success = true
      error = response.error
    } finally {
      isSubmitting = false
    }
  }
</script>

{#if success}
  <section>
    <span>{form.submitSuccess.title}</span>
    {@html form.submitSuccess.note}
  </section>
{:else}
  <form onsubmit="return false;" on:submit|preventDefault={submit}>
    <!-- Prevent implicit submission of the form https://stackoverflow.com/a/51507806 -->
    <button type="submit" disabled style="display: none" aria-hidden="true" />
    <h1>
      <Plant height="1em" style="vertical-align: -3pt;" />
      {@html form.header.title}
    </h1>

    {@html form.header.note}
    {#each form.fields as props}
      <FormField {...props} />
    {/each}

    <h3>
      {@html form.submit.title}
    </h3>
    {@html form.submit.note}
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
        <span>{form.submitError.title}</span>
        {@html form.submitError.note}

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
