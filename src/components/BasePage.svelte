<script>
  import Img from 'svelte-image'
  import marked from 'marked'

  export let data

  const { title, cover = {}, body = `` } = data
  const { url, description, width, height } = cover
</script>

<hgroup>
  <Img src={url} alt={description} ratio={`${Math.floor((100 * height) / width)}%`} />
  <h1>{title}</h1>
</hgroup>
<slot />
<div>
  {@html marked(body)}
</div>

<style>
  div {
    max-width: 45em;
    padding: 2em;
    margin: auto;
  }
  div :global(img) {
    width: 100%;
  }
  hgroup {
    position: relative;
    height: max-content;
    max-height: 700px;
    overflow: hidden;
  }
  h1 {
    color: white;
    background: rgba(0, 0, 0, 0.6);
    padding: 5pt 1ex;
    border-radius: 1ex;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: min-content;
  }
</style>
