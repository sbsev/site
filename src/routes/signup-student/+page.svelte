<script lang="ts">
  import { CircleSpinner, FormField, Modal } from '$lib'
  import { signup_form_submit_handler } from '$lib/azure'
  import { signupStore } from '$lib/stores'
  import Icon from '@iconify/svelte'

  export let data
  $: ({ chapters, form } = data)

  // Add debugging and fallback
  $: if (!form || !form.header) {
    console.error('Form data is missing or incomplete:', { data, form })
  }

  let success = false
  let error: Error | undefined = undefined
  let isSubmitting: boolean
  $: modalOpen = Boolean(error)

  async function submit() {
    isSubmitting = true

    try {
      $signupStore.type = { value: `student` }

      // Ensure form fields exist before mapping
      if (!form || !form.fields) {
        console.error('Form fields not available:', { form })
        error = new Error('Form configuration is missing')
        return
      }

      const field_ids_to_validate = form.fields.map((field) => field.id) // list of form fields to validate

      const response = await signup_form_submit_handler(
        field_ids_to_validate,
        chapters,
        form.errMsg || {}
      )
      if (response.success) success = true
      error = response.error
    } catch (submitError) {
      console.error('Submit error:', submitError)
      error = submitError as Error
    } finally {
      isSubmitting = false
    }
  }
</script>

{#if success}
  <section>
    <span>{form?.submitSuccess?.title || 'Success!'}</span>
    <p>{@html form?.submitSuccess?.note || 'Your registration was successful.'}</p>
  </section>
{:else if form && form.header}
  <form on:submit|preventDefault={submit}>
    <!-- Prevent implicit submission of the form https://stackoverflow.com/a/51507806 -->
    <button type="submit" disabled style="display: none" aria-hidden="true"></button>
    <h1>
      <Icon icon="ri:plant-fill" inline />
      {@html form.header.title}
    </h1>

    <!-- wrapping @html in <p> seems to help with https://github.com/sveltejs/svelte/issues/7698 (though not in minimal repro) -->
    <p>{@html form.header.note}</p>

    {#each form.fields || [] as props, idx (idx)}
      <FormField {...props} />
    {/each}

    <h3>
      {@html form.submit?.title || 'Submit'}
    </h3>
    <p>{@html form.submit?.note || ''}</p>
    <!-- class main used by CSS selector in signup form tests -->
    <button type="submit" class="main" disabled={isSubmitting}>
      {#if isSubmitting}
        <CircleSpinner color="white" />
      {:else}
        Anmeldung abschicken
      {/if}
    </button>
  </form>
{:else}
  <div>
    <h1>Loading form...</h1>
    <p>Please wait while the form loads. If this persists, there may be an issue with the form data.</p>
  </div>
{/if}
{#if modalOpen}
  <Modal on:close={() => (modalOpen = false)} style="background: var(--body-bg);">
    <div>
      <span>{form?.submitError?.title || 'Error'}</span>
      <p>{@html form?.submitError?.note || 'An error occurred.'}</p>

      <!-- <pre style="overflow-x: auto;"><code>
        {JSON.stringify(error, null, 2)}
      </code></pre>
      <pre><code>
        {JSON.stringify(error, Object.getOwnPropertyNames(error))}
      </code></pre> -->
    </div>
  </Modal>
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
</style>
