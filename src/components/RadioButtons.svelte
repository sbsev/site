<script>
  export let options
  export let value = undefined
  export let required = false
  export let style = ``
  export let name = ``
</script>

<div {style}>
  {#each options as option, idx}
    <label>
      <input
        type="radio"
        id={name ? `${name}-${idx}` : undefined}
        {name}
        bind:group={value}
        value={option}
        {required}
        on:change
      />
      <span>{option}</span>
    </label>
  {/each}
</div>

<style>
  div {
    display: flex;
    border-radius: 1ex;
    width: max-content;
    overflow: hidden;
    height: fit-content;
  }
  input {
    display: none;
  }
  span {
    cursor: pointer;
    display: inline-block;
    color: white;
    padding: 1ex 1em;
    background: var(--green);
    transition: 0.3s;
  }
  input:not(:checked) + span:hover {
    background: var(--lightGreen);
    transform: scale(1.03);
  }
  input:checked + span {
    box-shadow: inset 0 0 1em -3pt black;
    background: var(--darkGreen);
  }
</style>
