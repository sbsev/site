<script context="module">
  import marked from 'marked'

  import { fetchYaml, fetchChapters } from '../utils/queries'

  const stripOuterPTag = (str) =>
    str
      .replace(/^<p>/, ``)
      .replace(/<\/p>\s*?$/, ``)
      .replaceAll(`<a href=`, `<a target="_blank" href=`) // open links in new tabs so form is not closed

  export async function preload() {
    const chapters = await fetchChapters()
    const options = await fetchYaml(`Signup Form Options`)

    async function parseMicrocopy(title) {
      let copy = await fetchYaml(title)
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
  import RadioButton from '../components/RadioButton.svelte'
  import Modal from '../components/Modal.svelte'
  import { handleSubmit, tryParse } from '../utils/airtable'
  import { studentSignupStore, pupilSignupStore } from '../stores'

  export let chapters, options, studentText, pupilText

  const { session, page } = stores()
  let { type = `Student`, chapter = `` } = $page.query
  const inputs = {}
  let response = undefined
  let modalOpen = false

  function getFormVals() {
    return Object.fromEntries(
      Object.entries(inputs).map(([key, inp]) => [key, tryParse(inp?.value)])
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
    let formValues = { type, ...getFormVals() }
    // eslint-disable-next-line no-console
    console.log(`formValues:`, formValues)

    const baseId = chapters?.find(({ title }) => title === formValues?.chapter)?.baseId

    if (!baseId) throw Error(`baseId could not be determined`)

    response = await handleSubmit(baseId, formValues, $session.AIRTABLE_API_KEY)
    // eslint-disable-next-line no-console
    console.log(`response:`, response)
    if (!response.error) window.scrollTo({ top: 0, behavior: `smooth` })
    else modalOpen = true
  }
</script>

{#if response?.records}
  <section>
    <span>🎉 ⭐ 🎉</span>
    {@html text.success}
  </section>
{:else}
  <form on:submit|preventDefault={submit}>
    <!-- Prevent implicit form submission on pressing enter in a text field (https://stackoverflow.com/a/51507806) -->
    <button type="submit" disabled style="display: none" aria-hidden="true" />

    <h1>
      <Plant height="1em" style="vertical-align: -3pt;" />
      {@html text.page.title}
    </h1>

    <RadioButton options={options.types} bind:value={type} />

    {@html text.page.note}
    <FormInput
      select={chapters.map((c) => c.title)}
      {...text.chapter}
      bind:node={inputs.chapter}
      required />

    <FormInput
      select={options.genders}
      {...text.gender}
      bind:node={inputs.gender}
      required />

    {#if type === `Student`}
      <FormInput {...text.fullname} bind:node={inputs.fullname} required />

      <FormInput {...text.phone} bind:node={inputs.phone} type="phone" />

      <FormInput {...text.email} bind:node={inputs.email} required type="email" />

      <FormInput {...text.studySubject} bind:node={inputs.studySubject} />

      <FormInput {...text.semester} bind:node={inputs.semester} type="number" />

      <FormInput {...text.birthPlace} bind:node={inputs.birthPlace} />

      <FormInput {...text.birthDate} bind:node={inputs.birthDate} type="date" />

      <FormInput
        {...text.subjects}
        bind:node={inputs.subjects}
        multiselect={options.subjects}
        required />

      <FormInput
        {...text.schoolTypes}
        bind:node={inputs.schoolTypes}
        multiselect={options.schoolTypes} />

      <FormInput {...text.levels} bind:node={inputs.levels} />

      <FormInput {...text.place} bind:node={inputs.place} required />

      <FormInput {...text.remarks} bind:node={inputs.remarks} />

      <FormInput
        select={options.discoveries}
        {...text.discovery}
        bind:node={inputs.discovery}
        required />

      <FormInput
        {...text.agreement}
        bind:node={inputs.agreement}
        type="toggle"
        required />
    {:else if type === `Schüler`}
      <FormInput {...text.firstname} bind:node={inputs.firstname} required />

      <FormInput
        {...text.subjects}
        bind:node={inputs.subjects}
        multiselect={options.subjects}
        required />

      <FormInput
        select={options.schoolTypes}
        {...text.schoolType}
        bind:node={inputs.schoolType}
        required />

      <FormInput {...text.level} bind:node={inputs.level} required type="number" />

      <FormInput {...text.place} bind:node={inputs.place} required />

      <FormInput {...text.age} bind:node={inputs.age} type="number" />

      <FormInput {...text.remarks} bind:node={inputs.remarks} />

      <FormInput {...text.nameContact} bind:node={inputs.nameContact} required />

      <FormInput
        {...text.phoneContact}
        bind:node={inputs.phoneContact}
        type="phone"
        required />

      <FormInput
        {...text.emailContact}
        bind:node={inputs.emailContact}
        type="email"
        required />

      <FormInput {...text.orgContact} bind:node={inputs.orgContact} required />

      <FormInput {...text.need} bind:node={inputs.need} type="toggle" required />
    {/if}

    <FormInput
      {...text.dataProtection}
      bind:node={inputs.dataProtection}
      type="toggle"
      required />

    <h3>
      {@html text.submit.title}
    </h3>
    {@html text.submit.note}
    <button type="submit">Anmeldung Abschicken</button>
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
    overflow: scroll;
  }
</style>
