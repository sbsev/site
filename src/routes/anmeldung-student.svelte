<script context="module">
  import { session } from '$app/stores'
  import Plant from '@svicons/remix-fill/plant.svelte'
  import { marked } from 'marked'
  import { onMount } from 'svelte'
  import CircleSpinner from '../components/CircleSpinner.svelte'
  import FormField from '../components/FormField.svelte'
  import LinkButtons from '../components/LinkButtons.svelte'
  import Modal from '../components/Modal.svelte'
  import { signupStore } from '../stores'
  import { airtableSubmit } from '../utils/airtable.js'
  import { fetchChapters, fetchYaml } from '../utils/queries.js'

  export const ssr = false

  const renderer = new marked.Renderer()
  // open links in new tabs so form is not closed (https://git.io/J3p5G)
  renderer.link = (href, _, text) => `<a target="_blank" href="${href}">${text}</a>`
  marked.use({ renderer })

  // remove outer-most paragraph tags (if any)
  const stripOuterParTag = (str) => str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

  export async function load() {
    const chapters = (await fetchChapters()).filter((chap) => chap.acceptsSignups)
    const options = await fetchYaml(`Signup Form Options`)

    function parseMicrocopy(obj) {
      // iterate over name, phone, email, ...
      Object.entries(obj).forEach(([key, itm]) => {
        if (typeof itm === `string`) obj[key] = stripOuterParTag(marked(itm))
        // iterate over title, note, ...
        else if (typeof itm === `object` && itm !== null) {
          obj[key].name = key // name is used by FormField as id to link labels to their corresp. inputs
          Object.entries(itm).forEach(([innerKey, val]) => {
            if (typeof val === `string`)
              obj[key][innerKey] = stripOuterParTag(marked(val))
          })
        }
      })
      return obj
    }

    const microcopy = parseMicrocopy(await fetchYaml(`Student Form`))

    return { props: { chapters, options, microcopy } }
  }
</script>

<script>
  export let chapters, options, microcopy

  // let { chapter = ``, test } = $page.url.searchParams
  let response = {}
  let error = undefined
  let isSubmitting, modalOpen

  onMount(() => {
    $signupStore.type = `Student`
  })

  async function submit() {
    isSubmitting = true

    let { chapter, type } = $signupStore
    chapter = chapter[0]
    const chapterAndType = { chapter, type, 'chapter+type': `${type} aus ${chapter}` }

    const baseId = chapters?.find(({ title }) =>
      $signupStore?.chapter?.includes(title)
    )?.baseId
    if (!baseId) {
      isSubmitting = false
      error = { message: `baseId could not be determined` }
    }

    try {
      response = await airtableSubmit(baseId, $signupStore, $session.AIRTABLE_API_KEY)

      console.log(`Airtable response:`, response)

      window.plausible(`Signup`, { props: chapterAndType })
      window.scrollTo({ top: 0, behavior: `smooth` })

      $signupStore = {}
    } catch (err) {
      error = err
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
    <span>🎉 ⭐ 🎉</span>
    {@html microcopy.success}
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
      current="Student"
    />

    {@html microcopy.page.note}
    <FormField
      select={chapters.map((c) => c.title)}
      name="chapter"
      {...microcopy.chapter}
      maxSelect={1}
    />

    <FormField
      select={options.genders}
      name="gender"
      {...microcopy.gender}
      maxSelect={1}
    />

    <FormField name="fullname" {...microcopy.fullname} />

    <FormField name="phone" {...microcopy.phone} type="phone" />

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

    <FormField name="subjects" {...microcopy.subjects} multiselect={options.subjects} />

    <FormField
      name="school"
      {...microcopy.schoolTypes}
      multiselect={options.schoolTypes}
    />

    <FormField name="levels" {...microcopy.levels} type="doubleRange" min={1} max={13} />

    <FormField
      name="places"
      {...microcopy.places}
      placeholder="Ort der Nachhilfe"
      type="placeSelect"
    />

    <FormField name="remarks" {...microcopy.remarks} />

    <FormField
      select={options.discoveries}
      name="discovery"
      {...microcopy.discovery}
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
        <span>😢</span>
        {@html microcopy.error}

        <pre><code>
          {JSON.stringify(error, Object.getOwnPropertyNames(error))}
          {JSON.stringify(error)}
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
