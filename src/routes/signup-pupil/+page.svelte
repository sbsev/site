<script lang="ts">
  import Plant from '~icons/ri/plant-fill'
  import CircleSpinner from '../../components/CircleSpinner.svelte'
  import FormField from '../../components/FormField.svelte'
  import Modal from '../../components/Modal.svelte'
  // to make the signup form truely adaptive to other countries, these 3 files need to be imported adaptively (same in the other form)
  import { signupStore } from '../../stores'
  import { signup_form_submit_handler } from '../../utils/airtable'
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
      $signupStore.type = { value: `pupil` }
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
