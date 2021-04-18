<script>
  export let count
  export let min = 0
  export let max = 1000
  export let step = 1
</script>

<button type="button" on:click={() => (count += step)} disabled={count >= max}>+</button>
<button type="button" on:click={() => (count -= step)} disabled={count <= min}>-</button>

<style>
  button {
    background: var(--lightBlue);
    color: white;
    border-radius: 50%;
    width: 1.5ex;
    height: 1.5ex;
    font-size: 5ex;
    display: inline-flex;
    place-content: center;
    place-items: center;
    vertical-align: middle;
    margin: 2pt;
    transition: 0.5s;
  }
  button:hover {
    background: var(--blue);
  }
  button:disabled {
    background: var(--lightGray);
  }
</style>
