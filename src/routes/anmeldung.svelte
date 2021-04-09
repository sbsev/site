<script context="module">
  import marked from 'marked'

  const renderer = new marked.Renderer()
  // open links in new tabs so form is not closed (https://git.io/J3p5G)
  renderer.link = (href, _, text) => `<a target="_blank" href="${href}">${text}</a>`
  marked.use({ renderer })

  import { fetchYaml, fetchChapters } from '../utils/queries'

  const stripOuterPTag = (str) => str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

  export async function preload() {
    let chapters = (await fetchChapters()).filter((chap) => chap.acceptsSignups)
    const options = await fetchYaml(`Signup Form Options`)

    async function parseMicrocopy(title) {
      let obj = await fetchYaml(title)
      // iterate over name, phone, email, ...
      Object.entries(obj).forEach(([key, itm]) => {
        if (typeof itm === `string`) obj[key] = stripOuterPTag(marked(itm))
        // iterate over title, note, ...
        else if (typeof itm === `object` && itm !== null) {
          obj[key].name = key // name is used by FormInput as id to link labels to their corresp. inputs
          Object.entries(itm).forEach(([innerKey, val]) => {
            if (typeof val === `string`) obj[key][innerKey] = stripOuterPTag(marked(val))
          })
        }
      })
      return obj
    }

    const studentText = await parseMicrocopy(`Student Form`)
    const pupilText = await parseMicrocopy(`Pupil Form`)

    return { props: { chapters, options, studentText, pupilText } }
  }
</script>

<script>
  import { session, page } from '$app/stores'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import { onDestroy, onMount } from 'svelte'

  import FormInput from '../components/FormInput.svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import Modal from '../components/Modal.svelte'
  import RadioButtons from '../components/RadioButtons.svelte'
  import { airtableSubmit, tryParse } from '../utils/airtable'
  import { studentSignupStore, pupilSignupStore } from '../stores'

  export let chapters, options, studentText, pupilText

  let { type = `Student`, chapter = ``, test } = $page.query
  const inputs = {}
  let response = {}
  let error = undefined
  let isSubmitting, modalOpen

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

    const data = { type, ...getFormVals() }

    for (const key in data) data[key] = tryParse(data[key])

    const { chapter } = data

    const chapterAndType = { chapter, type, 'chapter+type': `${type} aus ${chapter}` }

    const baseId = chapters?.find(({ title }) => data?.chapter?.includes(title))?.baseId
    if (!baseId) {
      isSubmitting = false
      error = { message: `baseId could not be determined` }
    }

    try {
      response = await airtableSubmit(baseId, data, $session.AIRTABLE_API_KEY, test)
      window.plausible(`Signup`, { props: chapterAndType })
      window.scrollTo({ top: 0, behavior: `smooth` })
    } catch (err) {
      error = err
      console.error(error)
      window.plausible(`Signup Error`, {
        props: { error: err.stack || err.toString(), ...chapterAndType },
      })
      modalOpen = true
    } finally {
      isSubmitting = false
    }
  }
</script>

{#if response?.records}
  <section>
    <span>🎉 ⭐ 🎉</span>
    {@html text.success}
  </section>
{:else}
  <form onsubmit="return false;" on:submit|preventDefault={submit}>
    <!-- Prevent implicit submission of the form https://stackoverflow.com/a/51507806 -->
    <button type="submit" disabled style="display: none" aria-hidden="true" />
    <h1>
      <Plant height="1em" style="vertical-align: -3pt;" />
      {@html text.page.title}
    </h1>

    <RadioButtons
      options={options.types}
      bind:selected={type}
      style="margin: 1em auto;" />

    {@html text.page.note}
    <FormInput
      select={chapters.map((c) => c.title)}
      {...text.chapter}
      bind:input={inputs.chapter} />

    <FormInput select={options.genders} {...text.gender} bind:input={inputs.gender} />

    {#if type === `Student`}
      <FormInput {...text.fullname} bind:input={inputs.fullname} />

      <FormInput {...text.phone} bind:input={inputs.phone} type="phone" />

      <FormInput {...text.email} bind:input={inputs.email} type="email" />

      <FormInput {...text.studySubject} bind:input={inputs.studySubject} />

      <FormInput {...text.semester} bind:input={inputs.semester} type="number" min={1} />

      <FormInput {...text.birthPlace} bind:input={inputs.birthPlace} />

      <FormInput {...text.birthDate} bind:input={inputs.birthDate} type="date" />

      <FormInput
        {...text.subjects}
        bind:input={inputs.subjects}
        multiselect={options.subjects} />

      <FormInput
        {...text.schoolTypes}
        bind:input={inputs.schoolTypes}
        multiselect={options.schoolTypes} />

      <FormInput
        {...text.levels}
        bind:input={inputs.levels}
        type="doubleRange"
        min={1}
        max={13}
        initial="1 - 13" />

      <FormInput
        {...text.places}
        bind:input={inputs.places}
        placeholder="Ort der Nachhilfe"
        type="placeSelect" />

      <FormInput {...text.remarks} bind:input={inputs.remarks} />

      <FormInput
        select={options.discoveries}
        {...text.discovery}
        bind:input={inputs.discovery} />

      <FormInput {...text.agreement} bind:input={inputs.agreement} type="toggle" />
    {:else if type === `Schüler`}
      <FormInput {...text.firstname} bind:input={inputs.firstname} />

      <FormInput
        {...text.subjects}
        bind:input={inputs.subjects}
        multiselect={options.subjects} />

      <FormInput
        select={options.schoolTypes}
        {...text.schoolType}
        bind:input={inputs.schoolType} />

      <FormInput
        {...text.level}
        bind:input={inputs.level}
        type="singleRange"
        min={1}
        max={13}
        initial="" />

      <FormInput
        {...text.places}
        bind:input={inputs.places}
        placeholder="Ort der Nachhilfe"
        type="placeSelect" />

      <FormInput {...text.age} bind:input={inputs.age} type="number" />

      <FormInput {...text.online} bind:input={inputs.online} type="toggle" />

      <FormInput {...text.remarks} bind:input={inputs.remarks} />

      <FormInput {...text.nameContact} bind:input={inputs.nameContact} />

      <FormInput {...text.phoneContact} bind:input={inputs.phoneContact} type="phone" />

      <FormInput {...text.emailContact} bind:input={inputs.emailContact} type="email" />

      <FormInput {...text.orgContact} bind:input={inputs.orgContact} />

      <FormInput {...text.need} bind:input={inputs.need} type="toggle" />

      <FormInput {...text.discovery} bind:input={inputs.discovery} />
    {/if}

    <FormInput
      {...text.dataProtection}
      bind:input={inputs.dataProtection}
      type="toggle" />

    <h3>
      {@html text.submit.title}
    </h3>
    {@html text.submit.note}
    <!-- class main used by CSS selector in test/signupForm.mjs -->
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
        <span>😢</span>
        {@html text.error}

        <pre><code>{error.stack}</code></pre>
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
