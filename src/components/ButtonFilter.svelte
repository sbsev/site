<script>
  import { stores, goto } from '@sapper/app'

  export let labels = [],
    labelName = `label`,
    init = ``
  export let selected

  const { page } = stores()
  $: selected = $page.query[labelName] || init
  const changeTag = (newLabel) => {
    selected = newLabel
    goto(`${$page.path}?${labelName}=${newLabel}`)
  }
</script>

<div class="buttons">
  {#each labels as label}
    <button on:click={() => changeTag(label)} class={selected === label && `active`}>
      {label}
    </button>
  {/each}
</div>

<style>
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    place-content: center;
    margin-bottom: 2em;
  }
  .buttons button {
    font-size: 0.8em;
    background: teal;
    color: white;
  }
  .buttons button.active {
    background: orange;
  }
</style>
