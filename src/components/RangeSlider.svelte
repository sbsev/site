<script>
  // https://github.com/simeydotme/svelte-range-slider-pips
  import RangeSlider from 'svelte-range-slider-pips'

  export let required = false
  export let name = ``
  export let min, max
  export let type = ``
  export let input = undefined
  export let initial = undefined

  let value = initial

  function onStop(event) {
    value = event.detail.values.join(` - `)
    input.value = value
  }
</script>

<!-- float means current values are shown above knobs when hovering and dragging -->
{#if type === `doubleRange`}
  <RangeSlider
    range
    float
    values={[min, max]}
    {min}
    {max}
    on:stop={onStop}
    pips
    all="label" />{value}
{:else if type === `singleRange`}
  <RangeSlider
    float
    values={undefined}
    {min}
    {max}
    on:stop={onStop}
    pips
    all="label" />{value}
{/if}

<input
  bind:this={input}
  {name}
  {required}
  id={name}
  class="hidden"
  tabindex="-1"
  on:focus|preventDefault />

<style>
  input.hidden {
    border: none;
    outline: none;
    background: none;
    width: 0;
    /* needed to hide red shadow around required inputs in some browsers */
    box-shadow: none;
  }
</style>
