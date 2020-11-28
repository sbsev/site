<script>
  import { tweened } from 'svelte/motion'
  import { quintOut } from 'svelte/easing'
  import { onClickOutside } from '../utils/onClickOutside'
  export let direction = `up`
  export let size = 40
  export let options = []
  export let title = ``
  let sign = direction === `down` ? -1 : 1
  let open = false

  const angle = tweened(0, {
    duration: 500,
    easing: quintOut,
  })
  const yPos = tweened(0, {
    delay: 100,
    duration: 200,
    easing: quintOut,
  })
  const opacity = tweened(0, {
    duration: 200,
  })

  function toggle() {
    angle.set(open ? 0 : Math.PI / 4)
    yPos.set(open ? 0 : sign * 60)
    opacity.set(open ? 0 : 1)
    open = !open
  }
</script>

<div
  class="container"
  style="width: {size}px; height: {size}px;"
  use:onClickOutside={() => open && toggle()}>
  {#each options as [title, icon, handler], idx}
    <button
      class="option"
      on:click={() => {
        if (handler) handler()
        toggle()
      }}
      class:open
      style="opacity: {$opacity}; bottom: {(idx + 1) * $yPos}px; width: {size}px; height: {size}px;">
      <span>{title}</span>{icon}
    </button>
  {/each}
  <button
    on:click={toggle}
    class="toggle"
    {title}
    style="transform: rotate({$angle}rad); width: {size}px; height: {size}px;">
    <span style="transform: scale({size / 10});">+</span></button>
</div>

<style>
  .container {
    position: relative;
    display: grid;
    place-items: center;
  }
  .option {
    position: absolute;
    background: var(--bodyBg);
    border-radius: 50%;
    transition: transform 0.5s;
    font-size: 1.7ex;
    font-weight: 100;
    display: flex;
    place-content: center;
    pointer-events: none;
  }
  .option.open {
    cursor: pointer;
    pointer-events: auto;
  }
  .option:hover {
    transform: scale(1.02);
  }
  .option span {
    position: absolute;
    right: 50%;
    background: var(--transparentBg);
    color: var(--textColor);
    line-height: 1em;
    top: 50%;
    transform: translateY(-50%);
    padding: 2pt 25px 2pt 4pt;
    border-radius: 4pt;
    z-index: -1;
  }
  button.toggle {
    background: teal;
    cursor: pointer;
    border-radius: 50%;
  }
  button.toggle span {
    display: inline-block;
    transform: scale(3);
  }
</style>
