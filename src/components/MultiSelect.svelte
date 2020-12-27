<script>
  // https://svelte.dev/repl/c7094fb1004b440482d2a88f4d1d7ef5

  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'
  import ReadOnly from '@svg-icons/material-sharp/person-add-disabled.svg'

  export let value = []
  export let readonly = false
  export let placeholder = ``

  let input, slot, activeOption, inputValue
  let options = []
  let showOptions = false
  let selected = {}
  let first = true

  onMount(() => {
    slot.querySelectorAll(`option`).forEach((o) => {
      o.selected && !value.includes(o.value) && (value = [...value, o.value])
      options = [...options, { value: o.value, name: o.textContent }]
    })
    if (value) {
      const reducer = (obj, op) =>
        value.includes(op.value) ? { ...obj, [op.value]: op } : obj
      selected = options.reduce(reducer, {})
    }
    first = false
  })

  $: if (!first) value = Object.values(selected).map((o) => o.value)
  $: filtered = options.filter((o) =>
    inputValue ? o.name.toLowerCase().includes(inputValue.toLowerCase()) : o
  )
  $: if (
    (activeOption && !filtered.includes(activeOption)) ||
    (!activeOption && inputValue)
  )
    activeOption = filtered[0]

  function add(token) {
    if (!readonly) selected[token.value] = token
  }

  function remove(value) {
    if (!readonly) {
      delete selected[value]
      selected = selected // assignment needed to trigger rerender
    }
  }

  function optionsVisibility(show) {
    if (readonly) return
    if (typeof show === `boolean`) {
      showOptions = show
      if (show) input.focus()
    } else {
      showOptions = !showOptions
    }
    if (!showOptions) {
      activeOption = undefined
    }
  }

  function handleKeyup(event) {
    if (event.keyCode === 13) {
      Object.keys(selected).includes(activeOption.value)
        ? remove(activeOption.value)
        : add(activeOption)
      inputValue = ``
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
      // activeOption =
      //   calcIndex < 0
      //     ? filtered[filtered.length - 1]
      //     : calcIndex === filtered.length
      //     ? filtered[0]
      //     : filtered[calcIndex]
    }
  }

  function handleBlur() {
    optionsVisibility(false)
  }

  function handleTokenClick(e) {
    if (e.target.closest(`.token-remove`)) {
      e.stopPropagation()
      remove(e.target.closest(`.token`).dataset.id)
    } else if (e.target.closest(`.remove-all`)) {
      selected = []
      inputValue = ``
    } else {
      optionsVisibility(true)
    }
  }

  function handleOptionMousedown(e) {
    const value = e.target.dataset.value
    if (selected[value]) {
      remove(value)
    } else {
      add(options.filter((o) => o.value === value)[0])
      input.focus()
    }
  }

  const style = `height: 18pt; margin-left: 3pt;`
</script>

<div class="multiselect" class:readonly>
  <div class="tokens" class:showOptions on:click={handleTokenClick}>
    <ChevronExpand {style} />
    {#each Object.values(selected) as s}
      <div class="token" data-id={s.value}>
        <span>{s.name}</span>
        {#if !readonly}
          <button class="token-remove" title="Remove {s.name}">
            <CircleWithCross {style} />
          </button>
        {/if}
      </div>
    {/each}
    <div class="actions">
      {#if readonly}
        <ReadOnly {style} />
      {:else}
        <input
          autocomplete="off"
          bind:value={inputValue}
          bind:this={input}
          on:keyup={handleKeyup}
          on:blur={handleBlur}
          {placeholder} />
        <button
          class="remove-all"
          title="Remove All"
          class:hidden={!Object.keys(selected).length}>
          <CircleWithCross {style} />
        </button>
      {/if}
    </div>
  </div>

  <select bind:this={slot} type="multiple" class="hidden"><slot /></select>

  {#if showOptions}
    <ul
      transition:fly={{ duration: 200, y: 50 }}
      on:mousedown|preventDefault={handleOptionMousedown}>
      {#each filtered as option}
        <li
          class:selected={selected[option.value]}
          class:active={activeOption === option}
          data-value={option.value}>
          {option.name}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .multiselect {
    background: var(--bodyBg);
    position: relative;
    border-radius: 1ex;
  }
  .multiselect:not(.readonly):hover {
    border-bottom-color: hsl(0, 0%, 50%);
  }

  .tokens {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .token {
    align-items: center;
    background: var(--green);
    border-radius: 1.25em;
    display: flex;
    margin: 0.25rem 0.5rem 0.25rem 0;
    max-height: 1.3em;
    padding: 0.25rem 0.5rem 0.25rem 0.5em;
    transition: 0.3s;
    white-space: nowrap;
  }
  .token:hover {
    background: var(--darkGreen);
  }
  .readonly .token {
    color: var(--lightGray);
  }
  .token-remove,
  .remove-all {
    align-items: center;
    border-radius: 50%;
    color: var(--gray);
    display: flex;
    justify-content: center;
    height: 1.25em;
    min-width: 1.25em;
    cursor: pointer;
    transition: 0.3s;
  }
  .token-remove:hover,
  .remove-all:hover {
    color: var(--darkGray);
  }

  .actions {
    align-items: center;
    display: flex;
    flex: 1;
    min-width: 15em;
  }

  input {
    border: none;
    font-size: 1.5em;
    line-height: 1.5em;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;
    background: var(--bodyBg);
  }

  ul {
    list-style: none;
    max-height: 70vh;
    overflow: auto;
    padding-inline-start: 0;
    top: calc(100% + 1pt);
    width: 100%;
    z-index: 1;
    background: var(--lightBg);
    cursor: pointer;
    position: absolute;
    border-radius: 1ex;
  }
  li {
    padding: 6pt 2ex;
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
  li.selected.active,
  li.selected:hover {
    background: var(--darkerGreen);
  }

  .hidden {
    display: none;
  }
</style>
