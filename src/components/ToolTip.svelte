<script>
  export let width = `14em`
</script>

{#if $$slots.tip}
  <span>
    <slot />
    <div style="width: {width};">
      <slot name="tip" />
    </div>
  </span>
{:else}
  <slot />
{/if}

<style>
  div {
    visibility: hidden;
    opacity: 0;
    background: var(--lightBg);
    transition: 0.4s;
    position: absolute;
    top: 100%;
    padding: 5pt 1ex;
    border-radius: 1ex;
    left: 50%;
    transform: translate(-50%, 1em);
    z-index: 1;
    box-shadow: 0 0 1ex -3pt black;
  }
  div::before {
    content: '';
    width: 1em;
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translate(-50%);
    height: 1em;
    border: 1em solid;
    border-color: transparent transparent var(--lightBg) transparent;
    box-sizing: border-box;
  }
  span {
    position: relative;
  }
  span {
    cursor: pointer;
  }
  span:hover > div {
    visibility: visible;
    opacity: 1;
  }
</style>
