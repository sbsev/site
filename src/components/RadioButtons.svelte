<script>
  export let options
  export let selected = undefined
  export let required = false
  export let style = ``
  export let name = ``
</script>

<div {style}>
  {#each options as value, idx}
    <label>
      <input
        type="radio"
        id={name ? `${name}-${idx}` : undefined}
        {name}
        bind:group={selected}
        {value}
        {required} />
      <span>{value}</span></label>
  {/each}
</div>

<style>
  div {
    display: flex;
    border-radius: 1ex;
    width: max-content;
    overflow: hidden;
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
