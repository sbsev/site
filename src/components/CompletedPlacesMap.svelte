<script>
  // This component uses the Google Maps Places API to turn user text input into a
  // formatted address and lat/lng coordinates.
  import PlusMinusButtons from './PlusMinusButtons.svelte'
  import AutoCompletePlace from './AutoCompletePlace.svelte'

  export let placeholder = ``
  export let required = false
  export let name = ``
  export let input = undefined // hidden input field used to store value until it is read when submitting the form

  let enterInputs = {} // field that users interact with
  let placeCount = 1
  let places = []

  $: if (input) {
    input.value = JSON.stringify(places)
  }
</script>

<!-- for holding the component's value in a way accessible to the DOM -->
<input
  bind:this={input}
  {required}
  {name}
  id={name}
  on:focus={() => enterInputs[0].focus()}
  class="hidden" />

<strong
  >Möchtest du weitere Orte eingeben?
  <PlusMinusButtons bind:count={placeCount} min="1" max="5" /></strong>
<p>Einfach das Plus klicken und nach Priorität sortieren.</p>

{#each Array(placeCount).fill() as _, idx}
  <AutoCompletePlace
    bind:place={places[idx]}
    placeholder="{placeholder} {placeCount > 1 ? idx + 1 : ``}"
    {required} />
{/each}

<style>
  input {
    background: var(--accentBg);
    width: 100%;
    text-overflow: ellipsis;
    height: 2em;
    margin: 1ex 0;
  }
  strong {
    display: block;
    margin: 1em 0;
  }
  input.hidden {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    width: 1pt;
    padding: 1pt;
    /* needed to hide red shadow around required inputs in some browsers */
    box-shadow: none;
  }
</style>
