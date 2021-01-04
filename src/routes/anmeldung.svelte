<script context="module">
  import marked from 'marked'

  import { fetchMicrocopy, fetchJson, fetchChapters } from '../utils/queries'
  import { studentData, pupilData } from '../stores'

  const stripOuterPTag = (str) => str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

  export async function preload(page, { gqlUri }) {
    const chapters = await fetchChapters(gqlUri)
    const options = await fetchJson(`Signup Form Options`, gqlUri)

    async function parseMicrocopy(title) {
      let copy = await fetchMicrocopy(title, gqlUri)
      // iterate over name, phone, email, ...
      Object.entries(copy).forEach(([key, itm]) => {
        if (typeof itm === `string`) copy[key] = stripOuterPTag(marked(itm))
        // iterate over title, note, ...
        else {
          copy[key].name = key // name is used by FormInput to link labels to their corresp. inputs
          Object.entries(itm).forEach(([innerKey, val]) => {
            copy[key][innerKey] = stripOuterPTag(marked(val))
          })
        }
      })
      return copy
    }

    const studentSnippets = await parseMicrocopy(`Student Form`)
    const pupilSnippets = await parseMicrocopy(`Pupil Form`)

    const { type = `Student`, chapter = `` } = page.query
    const state = type === `Student` ? studentData : pupilData
    if (chapter)
      state.update((val) => {
        if (!val.chapter) val.chapter = {}
        val.chapter.value = chapter
        return val
      })

    return { chapters, options, studentSnippets, pupilSnippets, type, state }
  }
</script>

<script>
  import { stores } from '@sapper/app'
  import Plant from '@svg-icons/remix-fill/plant.svg'

  import FormInput from '../components/FormInput.svelte'
  import RadioButton from '../components/RadioButton.svelte'
  import { handleSubmit } from '../utils/airtable'

  export let chapters, options, studentSnippets, pupilSnippets, type, state

  const { session } = stores()

  let submitMessage, submitError, validationError

  $: snippets = type === `Student` ? studentSnippets : pupilSnippets
  $: state = type === `Student` ? studentData : pupilData
  // state is an object of objects with initial keys
  // { valid: true, dirty: false, value: null } for each form field

  function checkFormValid() {
    // set all fields to dirty to trigger their validation before allowing submission
    Object.keys($state).forEach((key) => ($state[key].dirty = true))
    // use 100 ms timeout since svelte's two-way binding appears to need some time
    // to update all the state[key].valid attributes after marking them as dirty
    setTimeout(async () => {
      const formIsValid = Object.values($state)
        .map((val) => val.valid)
        .reduce((all, field) => all && field, true)

      let formValues = Object.entries($state).map(([key, val]) => [key, val.value])
      formValues = { type, ...Object.fromEntries(formValues) }

      const baseId = chapters?.find(({ title }) => title === $state.chapter.value)?.baseId

      if (formIsValid) {
        const success = await handleSubmit(baseId, formValues, $session.AIRTABLE_API_KEY)

        if (success) {
          submitMessage = snippets.success
          submitError = ``
          validationError = ``
        } else submitError = snippets.error
      } else {
        validationError = `Das Formular ist nicht vollständig ausgefüllt`
      }
    }, 10)
  }
</script>

<form on:submit|preventDefault={checkFormValid}>
  <!-- Prevent implicit form submission on pressing enter in a text field (https://stackoverflow.com/a/51507806) -->
  <button type="submit" disabled style="display: none" aria-hidden="true" />

  <h1>
    <Plant height="1em" style="vertical-align: -3pt;" />
    {@html snippets.page.title}
  </h1>

  <RadioButton options={options.types} bind:value={type} />

  {@html snippets.page.note}
  <FormInput
    select={chapters.map((c) => c.title)}
    {...snippets.chapter}
    bind:state={$state.chapter}
    required />

  <FormInput
    select={options.genders}
    {...snippets.gender}
    bind:state={$state.gender}
    required />

  {#if type === `Student`}
    <FormInput {...snippets.fullname} bind:state={$state.fullname} required />

    <FormInput {...snippets.phone} bind:state={$state.phone} type="phone" />

    <FormInput {...snippets.email} bind:state={$state.email} required type="email" />

    <FormInput {...snippets.studySubject} bind:state={$state.studySubject} />

    <FormInput {...snippets.semester} bind:state={$state.semester} type="number" />

    <FormInput {...snippets.birthPlace} bind:state={$state.birthPlace} />

    <FormInput {...snippets.birthDate} bind:state={$state.birthDate} type="date" />

    <FormInput
      {...snippets.subjects}
      bind:state={$state.subjects}
      multiselect={options.subjects}
      required />

    <FormInput
      {...snippets.schoolTypes}
      bind:state={$state.schoolTypes}
      multiselect={options.schoolTypes} />

    <FormInput {...snippets.levels} bind:state={$state.levels} />

    <FormInput {...snippets.place} bind:state={$state.place} required />

    <FormInput {...snippets.remarks} bind:state={$state.remarks} />

    <FormInput
      select={options.discoveries}
      {...snippets.discovery}
      bind:state={$state.discovery}
      required />

    <FormInput
      {...snippets.agreement}
      bind:state={$state.agreement}
      type="toggle"
      required />
  {:else if type === `Schüler`}
    <FormInput {...snippets.firstname} bind:state={$state.firstname} required />

    <FormInput
      {...snippets.subjects}
      bind:state={$state.subjects}
      multiselect={options.subjects}
      required />

    <FormInput
      select={options.schoolTypes}
      {...snippets.schoolType}
      bind:state={$state.schoolType}
      required />

    <FormInput {...snippets.level} bind:state={$state.level} required />

    <FormInput {...snippets.place} bind:state={$state.place} required />

    <FormInput {...snippets.age} bind:state={$state.age} type="number" />

    <FormInput {...snippets.remarks} bind:state={$state.remarks} />

    <FormInput {...snippets.nameContact} bind:state={$state.nameContact} required />

    <FormInput
      {...snippets.phoneContact}
      bind:state={$state.phoneContact}
      type="phone"
      required />

    <FormInput
      {...snippets.emailContact}
      bind:state={$state.emailContact}
      type="email"
      required />

    <FormInput {...snippets.orgContact} bind:state={$state.orgContact} required />

    <FormInput {...snippets.need} bind:state={$state.need} type="toggle" required />
  {/if}

  <FormInput
    {...snippets.dataProtection}
    bind:state={$state.dataProtection}
    type="toggle"
    required />

  <h3>
    {@html snippets.submit.title}
  </h3>
  {@html snippets.submit.note}
  <button type="submit">Anmeldung Abschicken</button>
  {#if submitMessage}
    <div class="success">
      {@html submitMessage}
    </div>
  {/if}
  {#if submitError || validationError}
    <div class="error">
      {@html submitError || validationError}
    </div>
  {/if}
</form>

<style>
  form {
    max-width: 40em;
    margin: 2em auto;
    padding: 1em;
  }
  button {
    margin: 1em auto;
    display: block;
    transition: 0.3s;
    padding: 1ex 1em;
    color: white;
  }
  button[type='submit'] {
    background: var(--darkGreen);
    font-size: 1.2em;
  }
  button[type='submit']:disabled {
    background: var(--gray);
    font-size: 1.2em;
  }
  button[type='submit']:hover:not(:disabled) {
    transform: scale(1.02);
    background: var(--green);
  }
  div {
    text-align: center;
  }
  div.error {
    color: red;
  }
  div.success {
    color: var(--green);
  }
</style>
