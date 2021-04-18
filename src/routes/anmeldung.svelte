<script context="module">
  import marked from 'marked'

  import { fetchYaml, fetchChapters } from '../utils/queries'

  const stripOuterPTag = (str) => str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

  const openLinkinNewTab = (str) => str.replaceAll(`<a href=`, `<a target="_blank" href=`) // open links in new tabs so form is not closed

  export async function preload() {
    let chapters = (await fetchChapters()).filter((chap) => chap.acceptsSignups)
    const options = await fetchYaml(`Signup Form Options`)

    async function parseMicrocopy(title) {
      let copy = await fetchYaml(title)
      // iterate over name, phone, email, ...
      Object.entries(copy).forEach(([key, itm]) => {
        if (typeof itm === `string`)
          copy[key] = openLinkinNewTab(stripOuterPTag(marked(itm)))
        // iterate over title, note, ...
        else {
          copy[key].name = key // name is used by FormInput to link labels to their corresp. inputs
          Object.entries(itm).forEach(([innerKey, val]) => {
            copy[key][innerKey] = openLinkinNewTab(stripOuterPTag(marked(val)))
          })
        }
      })
      return copy
    }

    const studentText = await parseMicrocopy(`Student Form`)
    const pupilText = await parseMicrocopy(`Pupil Form`)

    return { chapters, options, studentText, pupilText }
  }
</script>

<script>
  import { stores } from '@sapper/app'
  import Plant from '@svg-icons/remix-fill/plant.svg'
  import { onDestroy, onMount } from 'svelte'

  import FormInput from '../components/FormInput.svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import RadioButton from '../components/RadioButton.svelte'
  import Modal from '../components/Modal.svelte'
  import { airtableSubmit } from '../utils/airtable'
  import { studentSignupStore, pupilSignupStore } from '../stores'

  export let chapters, options, studentText, pupilText

  const { session, page } = stores()
  let { type = `Student`, chapter = ``, test } = $page.query
  const inputs = {}
  let response, isSubmitting, modalOpen

  function getFormVals() {
    return Object.fromEntries(
      Object.entries(inputs).map(([key, input]) => [key, input?.value])
    )
  }
  function setFormVals(values) {
    Object.keys(inputs).forEach((key) => {
      if (values[key]) inputs[key].value = values[key]
    })
  }

  const leaveListener = () => {
    if (type === `Student`) $studentSignupStore = getFormVals()
    else $pupilSignupStore = getFormVals()
  }

  onMount(() => {
    if (type === `Student`) setFormVals($studentSignupStore)
    else setFormVals($pupilSignupStore)

    inputs.chapter.value = chapter
    // For domain changes and page reloads (site-external navigation)
    window.addEventListener(`beforeunload`, leaveListener)

    return () => window.removeEventListener(`beforeunload`, leaveListener)
  })

  // For site-internal navigation
  onDestroy(() => leaveListener())

  $: text = type === `Student` ? studentText : pupilText

  async function submit() {
    isSubmitting = true
    let formValues = { type, ...getFormVals() }

    const baseId = chapters?.find(({ title }) => formValues?.chapter?.includes(title))
      ?.baseId
    if (!baseId) {
      isSubmitting = false
      throw Error(`baseId could not be determined`)
    }

    response = await airtableSubmit(baseId, formValues, $session.AIRTABLE_API_KEY, test)
    if (!response.error) window.scrollTo({ top: 0, behavior: `smooth` })
    else modalOpen = true
    isSubmitting = false
  }
</script>

{#if response?.records}
  <section>
    <span>🎉 ⭐ 🎉</span>
    {@html text.success}
  </section>
{:else}
  <form on:submit|preventDefault={submit}>
    <h1>
      <Plant height="1em" style="vertical-align: -3pt;" />
      {@html text.page.title}
    </h1>

    <RadioButton options={options.types} bind:value={type} />

    {@html text.page.note}
    <FormInput
      select={chapters.map((c) => c.title)}
      {...text.chapter}
      bind:input={inputs.chapter}
      required />

    <FormInput
      select={options.genders}
      {...text.gender}
      bind:input={inputs.gender}
      required />

    {#if type === `Student`}
      <FormInput {...text.fullname} bind:input={inputs.fullname} required />

      <FormInput {...text.phone} bind:input={inputs.phone} type="phone" />

      <FormInput {...text.email} bind:input={inputs.email} required type="email" />

      <FormInput {...text.studySubject} bind:input={inputs.studySubject} />

      <FormInput {...text.semester} bind:input={inputs.semester} type="number" />

      <FormInput {...text.birthPlace} bind:input={inputs.birthPlace} />

      <FormInput {...text.birthDate} bind:input={inputs.birthDate} type="date" />

      <FormInput
        {...text.subjects}
        bind:input={inputs.subjects}
        multiselect={options.subjects}
        required />

      <FormInput
        {...text.schoolTypes}
        bind:input={inputs.schoolTypes}
        multiselect={options.schoolTypes} />

      <FormInput {...text.levels} bind:input={inputs.levels} />

      <FormInput
        {...text.placeSelect}
        bind:input={inputs.place}
        required
        placeholder="Ort der Nachhilfe"
        type="placeComplete" />

      <FormInput {...text.mobility} bind:input={inputs.mobility} type="number" />

      <FormInput {...text.remarks} bind:input={inputs.remarks} />

      <FormInput
        select={options.discoveries}
        {...text.discovery}
        bind:input={inputs.discovery}
        required />

      <FormInput
        {...text.agreement}
        bind:input={inputs.agreement}
        type="toggle"
        required />
    {:else if type === `Schüler`}
      <FormInput {...text.firstname} bind:input={inputs.firstname} required />

      <FormInput
        {...text.subjects}
        bind:input={inputs.subjects}
        multiselect={options.subjects}
        required />

      <FormInput
        select={options.schoolTypes}
        {...text.schoolType}
        bind:input={inputs.schoolType}
        required />

      <FormInput {...text.level} bind:input={inputs.level} required type="number" />

      <FormInput {...text.place} bind:input={inputs.place} required />

      <FormInput {...text.age} bind:input={inputs.age} type="number" />

      <FormInput {...text.online} bind:input={inputs.online} type="toggle" />

      <FormInput {...text.remarks} bind:input={inputs.remarks} />

      <FormInput {...text.nameContact} bind:input={inputs.nameContact} required />

      <FormInput
        {...text.phoneContact}
        bind:input={inputs.phoneContact}
        type="phone"
        required />

      <FormInput
        {...text.emailContact}
        bind:input={inputs.emailContact}
        type="email"
        required />

      <FormInput {...text.orgContact} bind:input={inputs.orgContact} required />

      <FormInput {...text.need} bind:input={inputs.need} type="toggle" required />
    {/if}

    <FormInput
      {...text.dataProtection}
      bind:input={inputs.dataProtection}
      type="toggle"
      required />

    <h3>
      {@html text.submit.title}
    </h3>
    {@html text.submit.note}
    <button type="submit" disabled={isSubmitting}>
      {#if isSubmitting}
        <CircleSpinner color="white" />
      {:else}
        Anmeldung Abschicken
      {/if}
    </button>
  </form>
  {#if modalOpen}
    <Modal
      on:close={() => (modalOpen = false)}
      style="background: var(--darkBlue); color: white;">
      <div>
        <span>😢</span>
        {@html text.error}
        <pre><code>
        {JSON.stringify(response?.error, null, 2)}
      </code></pre>
      </div>
    </Modal>
  {/if}
{/if}

<style>
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
    overflow: auto;
  }
</style>
