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
  export let valid = true
  export let options
  export let single = false

  const dispatch = createEventDispatcher()
  let input, activeOption, inputValue
  let showOptions = false

  $: filtered = options.filter((option) =>
    inputValue ? option.toLowerCase().includes(inputValue.toLowerCase()) : option
  )
  $: if (
    (activeOption && !filtered.includes(activeOption)) ||
    (!activeOption && inputValue)
  )
    activeOption = filtered[0]

  function add(token) {
    if (
      (!readonly && !selected.includes(token) && !single) ||
      (single && selected.length !== 1)
    ) {
      selected = single ? token : [token, ...selected]
      if (single) {
        setOptionsVisible(false)
        input.blur()
      }
    }
  }

  function remove(token) {
    if (readonly || single) return
    selected = selected.filter((str) => str !== token)
  }

  function setOptionsVisible(show) {
    if (readonly) return
    showOptions = show
    if (show) input.focus()
    else activeOption = undefined
  }
  function handleKeydown(event) {
    if (event.code === `Escape`) {
      setOptionsVisible(false)
      inputValue = ``
    }
    if (event.code === `Enter`) {
      if (activeOption) {
        selected.includes(activeOption) ? remove(activeOption) : add(activeOption)
        inputValue = ``
      } // no active option means the options are closed in which case enter means open
      else setOptionsVisible(true)
    }
    if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
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
    inputValue = ``
  }

  const style = `height: 18pt; margin-left: 3pt;`
</script>

<div class="multiselect" class:readonly class:valid>
  <div class="tokens" class:showOptions on:click={() => setOptionsVisible(true)}>
    <ExpandIcon {style} />
    {#if single}
      <span>{selected}</span>
    {:else}
      {#each selected as itm}
        <div class="token">
          <span>{itm}</span>
          {#if !readonly}
            <button
              on:click|stopPropagation={() => remove(itm)}
              type="button"
              title="Remove {itm}">
              <CrossIcon {style} />
            </button>
          {/if}
        </div>
      {/each}
    {/if}
    <div class="actions">
      {#if readonly}
        <ReadOnlyIcon {style} />
      {:else}
        <input
          on:blur={() => dispatch(`blur`)}
          autocomplete="off"
          bind:value={inputValue}
          bind:this={input}
          on:keydown={handleKeydown}
          on:blur={() => setOptionsVisible(false)}
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
    </div>
  </div>

  {#if showOptions}
    <ul transition:fly={{ duration: 200, y: 50 }}>
      {#each filtered as option}
        <li
          on:mousedown|preventDefault={() => (selected.includes(option) ? remove(option) : add(option))}
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
    border-radius: 1ex;
    margin: 1em 0;
  }
  .multiselect:not(.valid) {
    border: 1px solid red;
  }
  .multiselect.readonly {
    background: var(--lightBg);
  }

  .tokens {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
  }
  .token {
    align-items: center;
    background: var(--green);
    border-radius: 1ex;
    display: flex;
    margin: 3pt;
    padding: 1pt 0 1pt 1ex;
    transition: 0.3s;
    white-space: nowrap;
  }
  .token:hover {
    background: var(--darkGreen);
  }
  .token button,
  .remove-all {
    align-items: center;
    border-radius: 50%;
    display: flex;
    cursor: pointer;
    transition: 0.3s;
  }
  .token button:hover,
  .remove-all:hover {
    color: var(--lightGray);
  }

  .actions {
    display: flex;
    flex: 1;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    background: none;
  }

  ul {
    list-style: none;
    max-height: 50vh;
    padding: 0;
    width: 100%;
    z-index: 1;
    background: var(--lightBg);
    cursor: pointer;
    position: absolute;
    border-radius: 1ex;
    overflow: scroll;
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
