<script>
  import Toggle from './Toggle.svelte'
  import MultiSelect from './MultiSelect.svelte'

  export let title = ``
  export let note = ``

  export let name
  export let select = []
  export let multiselect = []
  export let type = `text`
  export let required = false
  export let state = {
    valid: true,
    dirty: false,
    value: select.length || multiselect.length ? [] : null,
  }

  let { valid, dirty, value } = state
  $: state = { valid, dirty, value }

  $: valid = Boolean(!required || !dirty || (dirty && required && value))

  const handleBlur = () => {
    setTimeout(() => {
      dirty = true
      if (required && !(Array.isArray(value) ? value.length : value)) valid = false
      if (required && (Array.isArray(value) ? value.length : value)) valid = true
    }, 10)
  }
</script>

<!-- prefix `for` when type is toggle to prevent toggling the checkbox on clicking its label -->
<label for={type === `toggle` ? name + type : name} class:required>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if select.length}
  <select id={name} bind:value on:blur={handleBlur} class:valid>
    <option hidden disabled selected value>Auswahl treffen</option>
    {#each select as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
{:else if multiselect.length}
  <MultiSelect bind:value on:blur={handleBlur} bind:valid>
    {#each multiselect as option}
      <option value={option}>{option}</option>
    {/each}
  </MultiSelect>
{:else if type === `toggle`}
  <Toggle {name} bind:checked={value} />
{:else if type === `text`}
  <input type="text" id={name} {name} bind:value on:blur={handleBlur} class:valid />
{:else if type === `email`}
  <input type="email" id={name} {name} bind:value on:blur={handleBlur} class:valid />
{:else if type === `number`}
  <input type="number" id={name} {name} bind:value on:blur={handleBlur} class:valid />
{:else if type === `date`}
  <input type="date" id={name} {name} bind:value on:blur={handleBlur} class:valid />
{:else if type === `phone`}
  <input type="phone" id={name} {name} bind:value on:blur={handleBlur} class:valid />
{/if}
{#if !valid}<span>Dieses Feld ist erforderlich</span>{/if}

<style>
  label {
    display: block;
    font-weight: bolder;
    font-size: 2.5ex;
    margin: 1em 0 1ex;
  }
  label.required::after {
    color: red;
    content: '*';
  }
  input,
  select {
    display: block;
    margin: 1em 0;
    background: var(--accentBg);
  }
  input:not(.valid),
  select:not(.valid) {
    border: 1px solid red;
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
  span {
    color: red;
  }
</style>
