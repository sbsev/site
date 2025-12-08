<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import RangeSlider from 'svelte-range-slider-pips'
  import { PlaceSelect, RadioButtons, Toggle } from '.'
  import { signupStore } from './stores'
  import type { FormFieldType, SignupStore, Place } from './types'

  interface Props {
    title: string
    note?: string
    id: keyof SignupStore
    placeholder?: string
    options?: string[]
    type?: FormFieldType
    required?: boolean
    min?: number | null
    max?: number | null
    maxSelect?: number | null
  }

  let {
    title,
    note = ``,
    id,
    placeholder = title,
    options = [],
    type = `text`,
    required = false,
    min = null,
    max = null,
    maxSelect = null,
  }: Props = $props()

  let label: HTMLLabelElement
  let slider: HTMLDivElement

  // Initialize value immediately
  let value: string | number | boolean | (string | number)[] = $state(
    type === `select` || type === `placeSelect`
      ? maxSelect === 1
        ? ``
        : []
      : type === `toggle` || type === `checkbox`
        ? false
        : type === `number` || type === `singleRange`
          ? min || 0
          : type === `doubleRange`
            ? [min || 0, max || 100]
            : ``,
  )

  $effect(() => {
    if (!$signupStore[id]) {
      // Initialize properly if possibly undefined to satisfy stricter types
      // Using 'as any' safe because we construct the object fully
      $signupStore[id] = { required, node: label, value: value as any }
    } else {
       $signupStore[id] = { ...$signupStore[id], required, node: label, value: value as any }
    }
  })

  $effect(() => {
    if (value && $signupStore[id]) $signupStore[id].error = ``
  })

  function input_type(node: HTMLInputElement, currentType: string) {
    node.type = currentType
    return {
      update(newType: string) {
        node.type = newType
      }
    }
  }
</script>

<!-- onclick|preventDefault logic manually implemented -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<label
  for={id}
  class:required
  bind:this={label}
  onclick={(e: MouseEvent) => { if(type === `toggle`) e.preventDefault() }}
  onkeyup={(e: KeyboardEvent) => { if(type === `toggle`) e.preventDefault() }}
>
  {@html title}
</label>

{#if note}
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
    bind:value={value as any}
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
  <Toggle {id} bind:value={value as boolean} />
{:else if type === `placeSelect`}
  <PlaceSelect {id} bind:value={value as unknown as Place[] | undefined} {placeholder} />
{:else if type === `singleRange`}
  <RangeSlider
    bind:slider
    float
    values={[value as number]}
    on:stop={(e) => (value = e.detail.values[0])}
    {min}
    {max}
    pips
    all="label"
  />
{:else if type === `doubleRange`}
  <RangeSlider
    range
    bind:slider
    float
    values={value as number[]}
    on:stop={(e) => (value = e.detail.values)}
    {min}
    {max}
    pips
    all="label"
  />
{:else if type === `radio`}
  <RadioButtons bind:value={value as string} {options} />
{:else if type === `number`}
  <input
    type="number"
    bind:value={value as number}
    {id}
    {placeholder}
    onwheel={(e) => { if(type === `number`) e.currentTarget.blur() }}
    {min}
    {max}
  />
{:else}
  <input use:input_type={type} bind:value={value as string} {id} {placeholder} />
{/if}

<style>
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
