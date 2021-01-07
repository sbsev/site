<script>
  export let name
  export let checked = false
  export let required = false
  export let node = undefined
</script>

<label for={name}>
  <input type="checkbox" id={name} {name} bind:checked {required} bind:this={node} />
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
    border: 1px solid var(--lightGray);
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
</style>
