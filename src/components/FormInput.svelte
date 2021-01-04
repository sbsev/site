<script>
  import Toggle from './Toggle.svelte'
  import MultiSelect from './MultiSelect.svelte'

  export let title = ``
  export let note = ``

  export let name
  export let placeholder = title
  export let select = []
  export let multiselect = []
  export let type = `text` // text, email, number, date, phone
  export let required = false
  export let state = {
    valid: true,
    dirty: false,
    value: select.length || multiselect.length ? [] : null,
  }

  $: state.valid = Boolean(
    !required || !state.dirty || (state.dirty && required && state.value)
  )

  const handleBlur = () => {
    setTimeout(() => {
      state.dirty = true
      if (required && !(Array.isArray(state.value) ? state.value.length : state.value))
        state.valid = false
      if (required && (Array.isArray(state.value) ? state.value.length : state.value))
        state.valid = true
    }, 10)
  }

  const onInput = ({ target }) => {
    state.value = type.match(/^(number|range)$/) ? +target.value : target.value
  }
</script>

<!-- prefix `for` when type is toggle to prevent toggling the checkbox on clicking its label -->
<label for={type === `toggle` ? name + type : name} class:required>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if select.length || multiselect.length}
  <MultiSelect
    bind:selected={state.value}
    on:blur={handleBlur}
    bind:valid={state.valid}
    {placeholder}
    options={select.length ? select : multiselect}
    single={select.length ? true : false} />
{:else if type === `toggle`}
  <Toggle {name} bind:checked={state.value} />
{:else}
  <input
    {type}
    on:input={onInput}
    id={name}
    {name}
    value={state.value}
    on:blur={handleBlur}
    class:valid={state.valid}
    {placeholder} />
{/if}
{#if !state.valid}<span>Dieses Feld ist erforderlich</span>{/if}

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
  input {
    display: block;
    margin: 1em 0;
    background: var(--accentBg);
    width: 100%;
    height: 2em;
  }
  input:not(.valid) {
    border: 1px solid red;
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
  span {
    color: red;
  }
</style>
