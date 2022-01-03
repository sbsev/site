<script lang="ts">
  // https://github.com/simeydotme/svelte-range-slider-pips
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { signupStore } from '../stores'
  import type { SignupData } from '../types'
  import PlaceSelect from './PlaceSelect.svelte'
  import RadioButtons from './RadioButtons.svelte'
  import Toggle from './Toggle.svelte'

  export let title: string
  export let note = ``
  export let name: keyof SignupData
  export let placeholder = title
  export let options: string[] = []
  export let type = `text` // text, email, number, date, phone
  export let required = false
  export let min: number | undefined = undefined
  export let max: number | undefined = undefined
  export let maxSelect: number | null = null
  export let value: string | number | string[] | number[] | undefined = undefined

  $: $signupStore[name] = value
</script>

<!-- on:click|preventDefault to avoid changing Toggle state and opening MultiSelects on clicking their labels -->
<label for={name} class:required on:click|preventDefault>
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
    bind:selectedLabels={value}
    --sms-options-bg="var(--bodyBg)"
  />
{:else if type === `toggle`}
  <Toggle {name} {required} bind:value />
{:else if type === `placeSelect`}
  <PlaceSelect {name} {required} bind:value {placeholder} />
{:else if type === `singleRange`}
  <RangeSlider float bind:values={value} {min} {max} pips all="label" />
{:else if type === `doubleRange`}
  <RangeSlider
    range
    float
    values={[min, max]}
    on:stop={(e) => (value = e.detail.values)}
    {min}
    {max}
    pips
    all="label"
  />
{:else if type === `radio`}
  <RadioButtons {name} {required} bind:value {options} />
{:else}
  <input
    {type}
    on:change={(e) => (value = e?.target?.value)}
    id={name}
    {name}
    {placeholder}
    {required}
    on:wheel={(e) => type === `number` && e?.target?.blur()}
    {min}
    {max}
  />
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
