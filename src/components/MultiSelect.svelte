<script>
  // https://svelte.dev/repl/c7094fb1004b440482d2a88f4d1d7ef5

  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  import CircleWithCross from '@svg-icons/entypo/circle-with-cross.svg'
  import ChevronExpand from '@svg-icons/bootstrap/chevron-expand.svg'

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
      const { [value]: val, ...rest } = selected
      selected = rest
    }
  }

  function optionsVisibility(show) {
    if (readonly) return
    if (typeof show === `boolean`) {
      showOptions = show
      show && input.focus()
    } else {
      showOptions = !showOptions
    }
    if (!showOptions) {
      activeOption = undefined
    }
  }

  function handleKeyup(e) {
    if (e.keyCode === 13) {
      Object.keys(selected).includes(activeOption.value)
        ? remove(activeOption.value)
        : add(activeOption)
      inputValue = ``
    }
    if ([38, 40].includes(e.keyCode)) {
      // up and down arrows
      const increment = e.keyCode === 38 ? -1 : 1
      const calcIndex = filtered.indexOf(activeOption) + increment
      activeOption =
        calcIndex < 0
          ? filtered[filtered.length - 1]
          : calcIndex === filtered.length
          ? filtered[0]
          : filtered[calcIndex]
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

  const style = `height: 18pt; margin: 0 5pt;`
</script>

<div class="multiselect" class:readonly>
  <div class="tokens" class:showOptions on:click={handleTokenClick}>
    <ChevronExpand {style} />
    {#each Object.values(selected) as s}
      <div class="token" data-id={s.value}>
        <span>{s.name}</span>
        {#if !readonly}
          <div class="token-remove" title="Remove {s.name}">
            <CircleWithCross {style} />
          </div>
        {/if}
      </div>
    {/each}
    <div class="actions">
      {#if !readonly}
        <input
          autocomplete="off"
          bind:value={inputValue}
          bind:this={input}
          on:keyup={handleKeyup}
          on:blur={handleBlur}
          {placeholder} />
        <div
          class="remove-all"
          title="Remove All"
          class:hidden={!Object.keys(selected).length}>
          <CircleWithCross {style} />
        </div>
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
  .tokens::after {
    background: none repeat scroll 0 0 transparent;
    bottom: -1px;
    content: '';
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    background: hsl(45, 100%, 51%);
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }
  .tokens.showOptions::after {
    width: 100%;
    left: 0;
  }
  .token {
    align-items: center;
    background: var(--green);
    border-radius: 1.25rem;
    display: flex;
    margin: 0.25rem 0.5rem 0.25rem 0;
    max-height: 1.3rem;
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    transition: 0.3s;
    white-space: nowrap;
  }
  .token:hover {
    background: var(--darkGreen);
  }
  .readonly .token {
    color: hsl(0, 0%, 40%);
  }
  .token-remove,
  .remove-all {
    align-items: center;
    border-radius: 50%;
    color: hsl(214, 17%, 92%);
    display: flex;
    justify-content: center;
    height: 1.25rem;
    margin-left: 0.25rem;
    min-width: 1.25rem;
    cursor: pointer;
  }
  .token-remove:hover,
  .remove-all:hover {
    color: var(--lightBlue);
  }

  .actions {
    align-items: center;
    display: flex;
    flex: 1;
    min-width: 15rem;
  }

  input {
    border: none;
    font-size: 1.5rem;
    line-height: 1.5rem;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;
    background: var(--bodyBg);
  }

  ul {
    left: 0;
    list-style: none;
    margin-block-end: 0;
    margin-block-start: 0;
    max-height: 70vh;
    overflow: auto;
    padding-inline-start: 0;
    position: absolute;
    top: calc(100% + 1px);
    width: 100%;
    z-index: 1;
  }
  li {
    background-color: white;
    cursor: pointer;
    padding: 0.5rem;
  }
  li:last-child {
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
  li:not(.selected):hover {
    background-color: hsl(214, 17%, 92%);
  }
  li.selected {
    background-color: hsl(232, 54%, 41%);
    color: white;
  }
  li.selected:nth-child(even) {
    background-color: hsl(232, 50%, 45%);
    color: white;
  }
  li.active {
    background-color: hsl(214, 17%, 88%);
  }
  li.selected.active,
  li.selected:hover {
    background-color: hsl(232, 48%, 50%);
  }

  .hidden {
    display: none;
  }
</style>
