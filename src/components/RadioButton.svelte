<script>
  export let value = ``
  export let options
</script>

<div>
  {#each options as option}
    <label>
      <input type="radio" bind:group={value} value={option} />
      <span>{option}</span></label>
  {/each}
</div>

<style>
  div {
    display: flex;
    margin: auto;
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
