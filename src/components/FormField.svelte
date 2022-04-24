<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { signupStore } from '../stores'
  import type { FormFieldType, SignupStore } from '../types'
  import PlaceSelect from './PlaceSelect.svelte'
  import RadioButtons from './RadioButtons.svelte'
  import Toggle from './Toggle.svelte'

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

  let value: string | number | boolean | (string | number)[] | undefined

  $: $signupStore[id] = { required, node: label }
  $: $signupStore[id].value = value
  $: $signupStore[id].node = label
  $: if (value) $signupStore[id].error = ``
</script>

<!-- on:click|preventDefault to avoid changing Toggle state and opening MultiSelects on clicking their labels -->
<label
  for={id}
  class:required
  bind:this={label}
  on:click={(e) => type === `toggle` && e.preventDefault()}
>
  {@html title}
</label>

{#if note}
  {@html note}
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
    noOptionsMsg="Keine passenden Optionen"
    bind:selected={value}
    --sms-options-bg="var(--accentBg)"
    --sms-bg="var(--accentBg)"
    --sms-height="3ex"
    --sms-border="1px solid var(--lightBg)"
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
{:else if type === `email`}
  <input type="email" bind:value {id} {placeholder} />
{:else if type === `date`}
  <input type="date" bind:value {id} {placeholder} />
{:else if type === `tel`}
  <input type="tel" bind:value {id} {placeholder} />
{:else if type === `text`}
  <input type="text" bind:value {id} {placeholder} />
{:else if type === `number`}
  <input
    type="number"
    bind:value
    {id}
    {placeholder}
    on:wheel={(e) => type === `number` && e?.target?.blur()}
    {min}
    {max}
  />
  <!-- blur input type number on:mousewheel to prevent default browser scrolling behavior of changing input value  -->
{/if}

<style>
  label {
    display: block;
    font-weight: bold;
    font-size: 18pt;
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
    height: 32px;
  }
  input:focus {
    border: 1px solid var(--linkColor);
  }
  ::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }
  small.error {
    display: block;
    color: red;
  }
</style>
