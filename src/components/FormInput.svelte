<script>
  import Toggle from './Toggle.svelte'
  import MultiSelect from './MultiSelect.svelte'
  import AutoCompletePlace from './AutoCompletePlace.svelte'

  // display props
  export let title = ``
  export let note = ``

  // input props
  export let input = undefined
  export let name = ``
  export let placeholder = title
  export let select = []
  export let multiselect = []
  export let type = `text` // text, email, number, date, phone
  export let required = false
</script>

<!-- prefix `for` with `name` when type is toggle to prevent toggling the checkbox on clicking its label -->
<label for={type === `toggle` ? `${name}-${type}` : name} class:required>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if select.length || multiselect.length}
  <MultiSelect
    bind:input
    {name}
    {placeholder}
    options={select.length ? select : multiselect}
    single={select.length ? true : false}
    {required} />
{:else if type === `toggle`}
  <Toggle {name} {required} bind:input />
{:else if type === `placeComplete`}
  <AutoCompletePlace {name} {required} bind:input {placeholder} />
{:else}
  <input
    {type}
    bind:this={input}
    id={name}
    {name}
    {placeholder}
    {required}
    on:mousewheel={() => type === `number` && input.blur()} />
  <!-- blur input type number on:mousewheel to prevent default browser scrolling behavior of changing input value  -->
{/if}

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
  input:focus {
    border: 1px solid var(--linkColor);
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
</style>
