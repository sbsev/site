<script>
  // https://svelte.dev/repl/c7094fb1004b440482d2a88f4d1d7ef5

  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'

  import CrossIcon from '@svg-icons/entypo/circle-with-cross.svg'
  import ExpandIcon from '@svg-icons/bootstrap/chevron-expand.svg'
  import ReadOnlyIcon from '@svg-icons/material-sharp/person-add-disabled.svg'

  export let selected = []
  export let readonly = false
  export let placeholder = ``
  export let options
  export let single = false
  export let required = false
  export let input = undefined
  export let name = ``

  const dispatch = createEventDispatcher()
  let activeOption, filterValue, filterInput
  let showOptions = false

  $: filtered = options.filter((option) =>
    filterValue ? option.toLowerCase().includes(filterValue.toLowerCase()) : option
  )
  $: if (
    (activeOption && !filtered.includes(activeOption)) ||
    (!activeOption && filterValue)
  )
    activeOption = filtered[0]

  function add(token) {
    if (
      (!readonly && !selected.includes(token) && !single) ||
      (single && selected.length !== 1)
    ) {
      filterValue = ``
      selected = single ? token : [token, ...selected]
      input.value = JSON.stringify(selected)
      if (single) {
        setOptionsVisible(false)
        filterInput.blur()
      }
    }
  }

  function remove(token) {
    if (readonly || single) return
    selected = selected.filter((str) => str !== token)
    input.value = JSON.stringify(selected)
  }

  function setOptionsVisible(show) {
    if (readonly) return
    showOptions = show
    if (show) filterInput.focus()
    else activeOption = undefined
  }

  function handleKeydown(event) {
    if (event.key === `Escape`) {
      setOptionsVisible(false)
      filterValue = ``
    } else if (event.key === `Enter`) {
      if (activeOption) {
        selected.includes(activeOption) ? remove(activeOption) : add(activeOption)
        filterValue = ``
      } // no active option means the options are closed in which case enter means open
      else setOptionsVisible(true)
    } else if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
      const increment = event.key === `ArrowUp` ? -1 : 1
      const calcIndex = filtered.indexOf(activeOption) + increment
      if (calcIndex < 0) {
        activeOption = filtered[filtered.length - 1]
      } else {
        if (calcIndex === filtered.length) activeOption = filtered[0]
        else activeOption = filtered[calcIndex]
      }
    }
  }

  const removeAll = () => {
    selected = []
    filterValue = ``
  }

  const style = `height: 18pt; margin: 0 3pt;`
</script>

<div class="multiselect" class:readonly on:click|self={() => setOptionsVisible(true)}>
  <ExpandIcon {style} />
  {#if single}
    {selected}
  {:else}
    {#each selected as itm}
      <span class="token">
        {itm}
        {#if !readonly}
          <button
            on:click|stopPropagation={() => remove(itm)}
            type="button"
            title="Remove {itm}">
            <CrossIcon {style} />
          </button>
        {/if}
      </span>
    {/each}
  {/if}
  {#if readonly}
    <ReadOnlyIcon {style} />
  {:else}
    <!-- for holding the component's value in a way accessible to the DOM -->
    <input
      bind:this={input}
      {required}
      {name}
      id={name}
      on:focus={() => filterInput.focus()}
      tabindex="-1" />
    <!-- tabindex="-1" means skip element during tabbing, else we couldn't shift-tab out of filterInput as filterInput.focus() would jump right back -->
    <input
      on:click|self={() => setOptionsVisible(true)}
      on:blur={() => dispatch(`blur`)}
      autocomplete="off"
      bind:value={filterValue}
      bind:this={filterInput}
      on:keydown={handleKeydown}
      on:focus={() => setOptionsVisible(true)}
      on:blur={() => setOptionsVisible(false)}
      style="flex: 1;"
      placeholder={selected.length ? `` : placeholder} />
    {#if !single}
      <button
        type="button"
        class="remove-all"
        title="Remove All"
        on:click={removeAll}
        style={selected.length === 0 && `display: none;`}>
        <CrossIcon {style} />
      </button>
    {/if}
  {/if}

  {#if showOptions}
    <ul transition:fly={{ duration: 200, y: 50 }}>
      {#each filtered as option}
        <li
          on:mousedown|preventDefault={() =>
            selected.includes(option) ? remove(option) : add(option)}
          class:selected={selected.includes(option)}
          class:active={activeOption === option}>
          {option}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .multiselect {
    background: var(--accentBg);
    position: relative;
    border-radius: 5pt;
    margin: 1em 0;
    min-height: 2em;
    border: 1px solid var(--lightBg);
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
  }
  .multiselect.readonly {
    background: var(--lightBg);
  }

  span.token {
    align-items: center;
    background: var(--green);
    border-radius: 1ex;
    display: flex;
    margin: 3pt;
    padding: 1pt 0 1pt 1ex;
    transition: 0.3s;
    white-space: nowrap;
  }
  span.token:hover {
    background: var(--darkGreen);
  }
  span.token button,
  .remove-all {
    align-items: center;
    border-radius: 50%;
    display: flex;
    cursor: pointer;
    transition: 0.3s;
  }
  span.token button:hover,
  .remove-all:hover {
    color: var(--lightGray);
  }

  .multiselect input {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    width: 1pt;
    padding: 1pt;
    /* needed to hide red shadow around required inputs in some browsers */
    box-shadow: none;
  }
  .multiselect:focus-within {
    border: 1pt solid var(--lightBlue);
  }

  ul {
    list-style: none;
    max-height: 50vh;
    padding: 0;
    top: 100%;
    width: 100%;
    z-index: 1;
    background: var(--accentBg);
    box-shadow: 0 0 1em var(--shadow);
    cursor: pointer;
    position: absolute;
    border-radius: 1ex;
    overflow: auto;
  }
  li {
    padding: 3pt 2ex;
  }
  li:not(.selected):hover {
    background: var(--green);
    color: white;
  }
  li.selected {
    background: var(--darkGreen);
    color: white;
  }
  li.active {
    background: var(--green);
  }
  li.selected.active {
    background: var(--darkerGreen);
  }
</style>
