<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { PlaceSelect, RadioButtons, Toggle } from '.'
  import { signupStore } from './stores'
  import type { FormFieldType, SignupStore } from './types'

  export let title: string
  export let note = ``
  export let id: keyof SignupStore
  export let placeholder = title
  export let options: string[] = []
  export let type: FormFieldType = `text`
  export let required = false
  export let min: number | null = null
  export let max: number | null = null
  export let maxSelect: number | null = null

  let label: HTMLLabelElement
  let slider: HTMLDivElement

  // Initialize value with appropriate defaults based on type to fix Svelte 5 binding issue
  let value: string | number | boolean | (string | number)[] | undefined
  
  // Set default values based on field type to prevent Svelte 5 bind:value={undefined} error
  $: if (value === undefined) {
    if (type === 'select' || type === 'placeSelect') {
      value = maxSelect === 1 ? '' : []
    } else if (type === 'toggle' || type === 'checkbox') {
      value = false
    } else if (type === 'number' || type === 'singleRange') {
      value = min || 0
    } else if (type === 'doubleRange') {
      value = [min || 0, max || 100]
    } else {
      value = ''
    }
  }

  $: $signupStore[id] = { required, node: label }
  $: $signupStore[id].value = value
  $: $signupStore[id].node = label
  $: if (value) $signupStore[id].error = ``

  function input_type(node: HTMLInputElement): void {
    node.type = type
  }
</script>

<!-- on:click|preventDefault to avoid changing Toggle state and opening MultiSelects on clicking their labels -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<label
  for={id}
  class:required
  bind:this={label}
  on:click={(e) => type === `toggle` && e.preventDefault()}
  on:keyup={(e) => type === `toggle` && e.preventDefault()}
>
  {@html title}
</label>

{#if note}
  <!-- wrapping @html in <p> seems to help with https://github.com/sveltejs/svelte/issues/7698 (though not in minimal repro) -->
  <p>{@html note}</p>
{/if}

{#if $signupStore[id]?.error}
  <small class="error">{$signupStore[id].error}</small>
{/if}

{#if type === `select`}
  <MultiSelect
    {id}
    {placeholder}
    {options}
    {maxSelect}
    noMatchingOptionsMsg="Keine passenden Optionen"
    bind:value
    {required}
    --sms-options-bg="var(--accent-bg)"
    --sms-bg="var(--accent-bg)"
    --sms-height="3ex"
    --sms-border="1px solid var(--light-bg)"
    --sms-selected-bg="var(--green)"
    --sms-selected-text-color="white"
    --sms-min-height="32px"
    --sms-button-hover-color="#dbecfd"
  />
{:else if type === `toggle`}
  <Toggle {id} bind:value />
{:else if type === `placeSelect`}
  <PlaceSelect {id} bind:value {placeholder} />
{:else if type === `singleRange`}
  <RangeSlider bind:slider float bind:values={value} {min} {max} pips all="label" />
{:else if type === `doubleRange`}
  <RangeSlider
    range
    bind:slider
    float
    values={[min, max]}
    on:stop={(e) => (value = e.detail.values)}
    {min}
    {max}
    pips
    all="label"
  />
{:else if type === `radio`}
  <RadioButtons bind:value {options} />
{:else if type === `number`}
  <!-- blur input type number on:mousewheel to prevent default browser scrolling behavior of changing input value  -->
  <input
    type="number"
    bind:value
    {id}
    {placeholder}
    on:wheel={(e) => type === `number` && e?.target?.blur()}
    {min}
    {max}
  />
{:else}
  <input use:input_type bind:value {id} {placeholder} />
{/if}

<style>
  /* TODO: remove this once svelte-multiselect@5.0.5 is out, for which
    --sms-text-color="var(--text-color)" will be a simpler fix */
  :global(div.multiselect ul.selected input) {
    color: var(--text-color);
  }
  label {
    display: block;
    font-weight: bold;
    font-size: 18pt;
    margin: 1em 0 1ex;
    scroll-margin-top: 10em;
  }
  label.required::after {
    color: red;
    content: '*';
  }
  input {
    display: block;
    margin: 1em 0;
    background: var(--accent-bg);
    width: 100%;
    height: 32px;
  }
  input:focus {
    border: 1px solid var(--link-color);
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
  small.error {
    display: block;
    color: red;
  }
</style>
