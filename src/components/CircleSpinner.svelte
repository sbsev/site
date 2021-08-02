<script lang="ts">
  export let color = `var(--textColor)`
  export let duration = `1.5s`
</script>

<div style="--color: {color}; --duration: {duration}" />

<style>
  div {
    display: inline-block;
    height: 1em;
    width: 1em;
    vertical-align: bottom;
    margin-right: 5pt;
    border-color: var(--color) transparent var(--color) var(--color);
    border-width: calc(1em / 5);
    border-style: solid;
    border-radius: 50%;
    animation: var(--duration) infinite rotate;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
