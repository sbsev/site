<script lang="ts">
  export let id: string
  export let value = false // whether the toggle is on or off
  export let required = false
  export let input: HTMLInputElement | undefined = undefined

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === `Enter`) {
      value = !value
      event.preventDefault()
    }
  }
</script>

<label>
  <input
    type="checkbox"
    {id}
    bind:checked={value}
    {required}
    bind:this={input}
    on:keydown={handleKeydown}
  />
  <span />
</label>

<style>
  label {
    display: flex;
    align-items: center;
    width: max-content;
  }
  span {
    height: 1.5em;
    width: 2.7em;
    padding: 0.1em;
    box-sizing: border-box;
    border: 1px solid var(--light-gray);
    border-radius: 0.75em;
    transition: 0.3s;
  }
  input:checked + span {
    background: var(--bodyBg);
  }
  input {
    position: absolute;
    opacity: 0;
    width: 1em;
  }
  input + span::after {
    content: '';
    display: block;
    height: 1.2em;
    width: 1.2em;
    border-radius: 50%;
    background: red;
    transition: 0.3s;
  }
  input:checked + span::after {
    background: var(--green);
    transform: translate(100%);
  }
  input:focus + span {
    border: 1px solid var(--light-blue);
  }
</style>
