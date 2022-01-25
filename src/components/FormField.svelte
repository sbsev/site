<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { signupStore } from '../stores'
  import type { SignupStore, FormFieldType } from '../types'
  import PlaceSelect from './PlaceSelect.svelte'
  import RadioButtons from './RadioButtons.svelte'
  import Toggle from './Toggle.svelte'

  export let title: string
  export let note = ``
  export let name: keyof SignupStore
  export let placeholder = title
  export let options: string[] = []
  export let type: FormFieldType = `text`
  export let required = false
  export let min: number | undefined = undefined
  export let max: number | undefined = undefined
  export let maxSelect: number | null = null

  let input: HTMLInputElement
  let slider: HTMLDivElement

  let value: string | number | string[] | boolean | undefined

  $: $signupStore[name] = { required, node: label }
  $: $signupStore[name].value = value
  $: $signupStore[name].node = label
  $: if (value) $signupStore[name].error = ``

  let label: HTMLLabelElement

  // TODO: range slider pips have higher z-index than multiselect dropdown. could use
  // :global(.rangeSlider .rangeHandle) {
  //   z-index: 1 !important;
  // }
</script>

<!-- on:click|preventDefault to avoid changing Toggle state and opening MultiSelects on clicking their labels -->
<label for={name} class:required on:click|preventDefault bind:this={label}>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if type !== `radio` && options.length > 0}
  <MultiSelect
    {name}
    {placeholder}
    {options}
    {maxSelect}
    bind:input
    bind:selectedLabels={value}
    --sms-options-bg="var(--accentBg)"
    --sms-input-bg="var(--accentBg)"
    --sms-input-height="3ex"
    --sms-border="0"
  />
{:else if type === `toggle`}
  <Toggle {name} bind:value />
{:else if type === `placeSelect`}
  <PlaceSelect {name} bind:value {placeholder} bnd:div />
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
  <RadioButtons {name} bind:value {options} />
{:else if type === `email`}
  <input type="email" bind:value id={name} {name} {placeholder} />
{:else if type === `date`}
  <input type="date" bind:value id={name} {name} {placeholder} />
{:else if type === `tel`}
  <input type="tel" bind:value id={name} {name} {placeholder} />
{:else if type === `text`}
  <input type="text" bind:value id={name} {name} {placeholder} />
{:else if type === `number`}
  <input
    type="number"
    bind:value
    id={name}
    {name}
    {placeholder}
    on:wheel={(e) => type === `number` && e?.target?.blur()}
    {min}
    {max}
  />
  <!-- blur input type number on:mousewheel to prevent default browser scrolling behavior of changing input value  -->
{/if}

{#if $signupStore[name]?.error}
  <small class="error">{$signupStore[name].error}</small>
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
  small.error {
    color: red;
  }
</style>
