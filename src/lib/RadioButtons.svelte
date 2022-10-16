<script lang="ts">
  export let options: (string | number | boolean)[]
  export let value: string | number | boolean | null = null
  export let required = false
  export let style = ``
  export let id: string | null = null
</script>

<div {style}>
  {#each options as option, idx}
    <label>
      <input
        type="radio"
        id={id ? `${id}-${idx}` : null}
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
    background: var(--light-green);
    transform: scale(1.03);
  }
  input:checked + span {
    box-shadow: inset 0 0 1em -3pt black;
    background: var(--dark-green);
  }
</style>
