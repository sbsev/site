<script>
  import Toggle from './Toggle.svelte'
  import MultiSelect from './MultiSelect.svelte'

  export let value = ``
  export let name
  export let title = ``
  export let note = ``
  export let select = []
  export let multiselect = []
  export let type = `text`
</script>

<label for={name}>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if select?.length}
  <select id={name} bind:value>
    {#each select as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
{:else if multiselect?.length}
  <MultiSelect bind:checked={value}>
    {#each multiselect as option}
      <option value={option}>{option}</option>
    {/each}
  </MultiSelect>
{:else if type === `toggle`}
  <Toggle {name} bind:checked={value} />
{:else if type === `text`}
  <input type="text" id={name} {name} bind:value />
{:else if type === `email`}
  <input type="email" id={name} {name} bind:value />
{:else if type === `number`}
  <input type="number" id={name} {name} bind:value />
{:else if type === `date`}
  <input type="date" id={name} {name} bind:value />
{:else if type === `phone`}<input type="phone" id={name} {name} bind:value />{/if}

<style>
  label {
    display: block;
    font-weight: bolder;
    font-size: 2.5ex;
    margin: 1em 0 1ex;
  }
  input,
  select {
    display: block;
    margin: 1em 0;
    background: var(--accentBg);
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
</style>
