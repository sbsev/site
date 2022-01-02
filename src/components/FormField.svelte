<script>
  // https://github.com/simeydotme/svelte-range-slider-pips
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { signupStore } from '../stores'
  import PlaceSelect from './PlaceSelect.svelte'
  import RadioButtons from './RadioButtons.svelte'
  import Toggle from './Toggle.svelte'

  // input props
  export let title
  export let note = ``
  export let input = undefined
  export let name
  export let placeholder = title
  export let select = []
  export let options = []
  export let multiselect = []
  export let type = `text` // text, email, number, date, phone
  export let required = false
  export let min = undefined
  export let max = undefined
  export let initial = undefined
  export let maxSelect = null
  export let value = null

  $: $signupStore[name] = value
</script>

<!-- on:click|preventDefault to avoid changing Toggle state and opening MultiSelects on clicking their labels -->
<label for={name} class:required on:click|preventDefault>
  {@html title}
</label>

{#if note}
  {@html note}
{/if}

{#if select.length || multiselect.length}
  <MultiSelect
    {name}
    {placeholder}
    options={select.length ? select : multiselect}
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
    on:change={(e) => (value = e.target.value)}
    id={name}
    {name}
    {placeholder}
    {required}
    on:mousewheel={() => type === `number` && input.blur()}
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
