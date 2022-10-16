<script lang="ts">
  import { signup_form_submit_handler } from '$lib/airtable'
  import CircleSpinner from '$lib/CircleSpinner.svelte'
  import FormField from '$lib/FormField.svelte'
  import Modal from '$lib/Modal.svelte'
  import { signupStore } from '$lib/stores'
  import Icon from '@iconify/svelte'

  import type { PageData } from './$types'
  export let data: PageData
  $: ({ chapters, form } = data)

  let success = false
  let error: Error | undefined = undefined
  let isSubmitting: boolean
  $: modalOpen = Boolean(error)

  async function submit() {
    isSubmitting = true

    try {
      $signupStore.type = { value: `student` }
      const field_ids_to_validate = form.fields.map((field) => field.id) // list of form fields to validate

      const response = await signup_form_submit_handler(
        field_ids_to_validate,
        chapters,
        form.errMsg
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
    <p>{@html form.submitSuccess.note}</p>
  </section>
{:else}
  <form onsubmit="return false;" on:submit|preventDefault={submit}>
    <!-- Prevent implicit submission of the form https://stackoverflow.com/a/51507806 -->
    <button type="submit" disabled style="display: none" aria-hidden="true" />
    <h1>
      <Icon icon="ri:plant-fill" inline />
      {@html form.header.title}
    </h1>

    <!-- wrapping @html in <p> seems to help with https://github.com/sveltejs/svelte/issues/7698 (though not in minimal repro) -->
    <p>{@html form.header.note}</p>

    {#each form.fields as props, idx (idx)}
      <FormField {...props} />
    {/each}

    <h3>
      {@html form.submit.title}
    </h3>
    <p>{@html form.submit.note}</p>
    <!-- class main used by CSS selector in signup form tests -->
    <button type="submit" class="main" disabled={isSubmitting}>
      {#if isSubmitting}
        <CircleSpinner color="white" />
      {:else}
        Anmeldung Abschicken
      {/if}
    </button>
  </form>
  {#if modalOpen}
    <Modal on:close={() => (modalOpen = false)} style="background: var(--body-bg);">
      <div>
        <span>{form.submitError.title}</span>
        <p>{@html form.submitError.note}</p>

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
    background: var(--dark-green);
    font-size: 1.2em;
    border: 1pt solid transparent;
  }
  button[type='submit']:focus {
    border: 1pt solid var(--light-blue);
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
