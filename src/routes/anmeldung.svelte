<script context="module">
  import { fetchMicrocopy, fetchJson, fetchChapters } from '../utils/queries'
  import marked from 'marked'
  import yaml from 'js-yaml'

  const stripOuterPTag = (str) => str.replace(/^<p>/, ``).replace(/<\/p>\s*?$/, ``)

  export async function preload(_, { gqlUri }) {
    const chapters = await fetchChapters(gqlUri)
    const options = await fetchJson(`Signup Form Options`, gqlUri)

    async function parseMicrocopy(title) {
      let copy = await fetchMicrocopy(title, gqlUri)
      copy = yaml.safeLoad(copy)
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

    return { chapters, options, studentSnippets, pupilSnippets }
  }
</script>

<script>
  import { stores } from '@sapper/app'
  import Plant from '@svg-icons/remix-fill/plant.svg'

  import FormInput from '../components/FormInput.svelte'
  import { handleSubmit } from '../utils/airtable.js'
  import { signupForm as data } from '../stores'

  export let studentSnippets, chapters, options, pupilSnippets

  const { session } = stores()
  const { AIRTABLE_API_KEY: apiKey } = $session

  let type = `Student`
  let formIsValid = false

  $: snippets = type === `Student` ? studentSnippets : pupilSnippets
  $: baseId = chapters?.find(({ title }) => title === data.chapter)?.baseId
</script>

<form on:submit|preventDefault={() => handleSubmit(baseId, data, apiKey)}>
  <!-- Prevent implicit form submission on pressing enter in a text field (https://stackoverflow.com/a/51507806) -->
  <button type="submit" disabled style="display: none" aria-hidden="true" />

  <h1>
    <Plant height="1em" style="vertical-align: -3pt;" />
    {@html snippets.page.title}
  </h1>
  <!-- Type RadioButton -->
  <select bind:value={type}>
    {#each options.types as type}
      <option value={type}>{type}</option>
    {/each}
  </select>

  {@html snippets.infoText}

  <FormInput
    {...snippets.chapter}
    select={chapters.map((c) => c.title)}
    bind:value={$data.chapter} />

  <FormInput
    {...snippets.subjects}
    bind:value={$data.subjects}
    multiselect={options.subjects} />

  <FormInput {...snippets.gender} select={options.genders} bind:value={$data.gender} />

  {#if type === `Student`}
    <FormInput {...snippets.fullname} bind:value={$data.fullname} />

    <FormInput {...snippets.phone} bind:value={$data.phone} type="phone" />

    <FormInput {...snippets.email} bind:value={$data.email} type="email" />

    <FormInput {...snippets.studySubject} bind:value={$data.studySubject} />

    <FormInput {...snippets.semester} bind:value={$data.semester} type="number" />

    <FormInput {...snippets.birthPlace} bind:value={$data.birthPlace} />

    <FormInput {...snippets.birthDate} bind:value={$data.birthDate} type="date" />

    <FormInput
      {...snippets.schoolTypes}
      bind:value={$data.schoolTypes}
      multiselect={options.schoolTypes} />

    <FormInput {...snippets.levels} bind:value={$data.levels} />

    <FormInput {...snippets.place} bind:value={$data.place} />

    <FormInput {...snippets.remarks} bind:value={$data.remarks} />

    <FormInput
      {...snippets.discovery}
      select={options.discoveries}
      bind:value={$data.discovery} />

    <FormInput {...snippets.agreement} bind:value={$data.agreement} type="toggle" />
  {:else if type === `Schüler`}
    <FormInput {...snippets.firstname} bind:value={$data.firstname} />

    <FormInput
      {...snippets.schoolType}
      bind:value={$data.schoolType}
      select={options.schoolType} />

    <FormInput {...snippets.level} bind:value={$data.level} />

    <FormInput {...snippets.place} bind:value={$data.place} />

    <FormInput {...snippets.remarks} bind:value={$data.remarks} />

    <FormInput {...snippets.remarks} bind:value={$data.remarks} type="number" />

    <FormInput {...snippets.nameContact} bind:value={$data.nameContact} />

    <FormInput {...snippets.phoneContact} bind:value={$data.phoneContact} type="phone" />

    <FormInput {...snippets.emailContact} bind:value={$data.emailContact} type="email" />

    <FormInput {...snippets.orgContact} bind:value={$data.orgContact} />

    <FormInput {...snippets.need} bind:value={$data.need} type="toggle" />
  {/if}

  <FormInput
    {...snippets.dataProtection}
    bind:value={$data.dataProtection}
    type="toggle" />

  <h3>
    {@html snippets.submit.title}
  </h3>
  {@html snippets.submit.note}
  <button type="submit" disabled={!formIsValid}>Anmeldung Abschicken</button>
</form>

<style>
  form {
    max-width: 40em;
    margin: 2em auto;
    background: var(--accentBg);
    padding: 2em;
  }
  select {
    display: block;
  }
  button {
    background: var(--darkGreen);
    color: white;
    padding: 1ex 1em;
    font-size: 1.2em;
    margin: auto;
    display: block;
    transition: 0.3s;
  }
  button:hover {
    transform: scale(1.02);
    background: var(--green);
  }
</style>
