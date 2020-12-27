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
      Object.entries(copy).forEach(([key, val]) => {
        copy[key] = stripOuterPTag(marked(val))
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

  import MultiSelect from '../components/MultiSelect.svelte'
  import Toggle from '../components/Toggle.svelte'
  import { handleSubmit } from '../utils/airtable.js'

  const { session } = stores()
  const { AIRTABLE_API_KEY: apiKey } = $session

  export let studentSnippets, chapters, options, pupilSnippets

  let data = {}
  let type = `Student`

  $: snippets = type === `Student` ? studentSnippets : pupilSnippets
  $: baseId = chapters?.find(({ title }) => title === data.chapter)?.baseId
</script>

<form on:submit|preventDefault={() => handleSubmit(baseId, data, apiKey)}>
  <!-- Prevent implicit form submission on pressing enter in a text field (https://stackoverflow.com/a/51507806) -->
  <button type="submit" disabled style="display: none" aria-hidden="true" />

  <h1>
    <Plant height="1em" style="vertical-align: -3pt;" />
    {@html snippets.pageTitle}
  </h1>
  <!-- Type RadioButton -->
  <select bind:value={type}>
    {#each options.types as type}
      <option value={type}>{type}</option>
    {/each}
  </select>

  {@html snippets.infoText}
  <h2>
    {@html snippets.chapterTitle}
  </h2>
  {@html snippets.chapter}
  <select bind:value={data.chapter}>
    {#each chapters as { title }}
      <option value={title}>{title}</option>
    {/each}
  </select>

  <h2>
    {@html snippets.genderTitle}
  </h2>
  <select bind:value={data.gender}>
    {#each options.genders as gender}
      <option value={gender}>{gender}</option>
    {/each}
  </select>

  {#if type === `Student`}
    <h2>
      {@html snippets.fullnameTitle}
    </h2>
    <input type="text" name="fullname" bind:value={data.fullname} />
    <h2>
      {@html snippets.phoneTitle}
    </h2>
    {@html snippets.phone}
    <input type="phone" name="phone" bind:value={data.phone} />
    <h2>
      {@html snippets.emailTitle}
    </h2>
    {@html snippets.email}
    <input type="email" name="email" bind:value={data.email} />
    <h2>
      {@html snippets.studySubjectTitle}
    </h2>
    {@html snippets.studySubject}
    <input type="text" name="studySubject" bind:value={data.studySubject} />

    <h2>
      {@html snippets.semesterTitle}
    </h2>
    {@html snippets.semester}
    <input type="number" name="semester" bind:value={data.semester} />

    <h2>
      {@html snippets.birthPlaceTitle}
    </h2>
    {@html snippets.birthPlace}
    <input type="text" name="birthPlace" bind:value={data.birthPlace} />
    <h2>
      {@html snippets.birthDateTitle}
    </h2>
    {@html snippets.birthDate}
    <input type="date" name="birthDate" bind:value={data.birthDate} />
    <h2>
      {@html snippets.subjectsTitle}
    </h2>
    {@html snippets.subjects}
    <MultiSelect bind:value={data.subjects}>
      {#each options.subjects as subject}
        <option value={subject}>{subject}</option>
      {/each}
    </MultiSelect>
    <h2>
      {@html snippets.schoolTypesTitle}
    </h2>
    <MultiSelect bind:value={data.schoolTypes}>
      {#each options.schoolTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </MultiSelect>

    <h2>
      {@html snippets.levelsTitle}
    </h2>
    {@html snippets.levels}
    <input type="text" name="levels" bind:value={data.levels} />

    <h2>
      {@html snippets.placeTitle}
    </h2>
    {@html snippets.place}
    <input type="text" name="place" bind:value={data.place} />

    <h2>
      {@html snippets.remarksTitle}
    </h2>
    {@html snippets.remarks}
    <input type="text" name="remarks" bind:value={data.remarks} />

    <h2>
      {@html snippets.discoveryTitle}
    </h2>
    {@html snippets.discovery}
    <select bind:value={data.discovery}>
      {#each options.discoveries as discovery}
        <option value={discovery}>{discovery}</option>
      {/each}
    </select>
    <h2>
      {@html snippets.agreementTitle}
    </h2>
    {@html snippets.agreement}
    <Toggle name="agreement" bind:checked={data.agreement} />
  {:else if type === `Schüler`}
    <h2>
      {@html snippets.firstnameTitle}
    </h2>
    {@html snippets.firstname}
    <input type="text" name="firstname" bind:value={data.firstname} />

    <h2>
      {@html snippets.schoolTypeTitle}
    </h2>
    {@html snippets.schoolType}
    <select bind:value={data.schoolType}>
      {#each options.schoolTypes as schoolType}
        <option value={schoolType}>{schoolType}</option>
      {/each}
    </select>
    <h2>
      {@html snippets.levelTitle}
    </h2>
    {@html snippets.level}
    <input type="text" name="level" bind:value={data.level} />

    <h2>
      {@html snippets.subjectsTitle}
    </h2>
    {@html snippets.subjects}
    <MultiSelect bind:value={data.subjects}>
      {#each options.subjects as subject}
        <option value={subject}>{subject}</option>
      {/each}
    </MultiSelect>
    <h2>
      {@html snippets.placeTitle}
    </h2>
    {@html snippets.place}
    <input type="text" name="place" bind:value={data.place} />

    <h2>
      {@html snippets.remarksTitle}
    </h2>
    {@html snippets.remarks}
    <input type="text" name="remarks" bind:value={data.remarks} />

    <h2>
      {@html snippets.ageTitle}
    </h2>
    {@html snippets.age}
    <input type="number" name="age" bind:value={data.remarks} />

    <h2>
      {@html snippets.nameContactTitle}
    </h2>
    {@html snippets.nameContact}
    <input type="text" name="nameContact" bind:value={data.nameContact} />

    <h2>
      {@html snippets.phoneContactTitle}
    </h2>
    {@html snippets.phoneContact}
    <input type="phone" name="phoneContact" bind:value={data.phoneContact} />

    <h2>
      {@html snippets.emailContactTitle}
    </h2>
    {@html snippets.emailContact}
    <input type="email" name="emailContact" bind:value={data.emailContact} />

    <h2>
      {@html snippets.orgContactTitle}
    </h2>
    {@html snippets.orgContact}
    <input type="text" name="orgContact" bind:value={data.orgContact} />

    <h2>
      {@html snippets.needTitle}
    </h2>
    {@html snippets.need}
    <Toggle name="need" bind:checked={data.need} />
  {/if}

  <h2>
    {@html snippets.dataProtectionTitle}
  </h2>
  {@html snippets.dataProtection}
  <Toggle name="dataProtection" bind:checked={data.dataProtection} />
  <h2>
    {@html snippets.submitTitle}
  </h2>
  {@html snippets.submit}
  <button type="submit">Anmeldung Abschicken</button>
</form>

<style>
  form {
    max-width: 40em;
    margin: 2em auto;
    background: var(--accentBg);
    padding: 2em;
  }
  input,
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
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
</style>
