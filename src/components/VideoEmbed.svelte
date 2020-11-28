<script>
  export let videoId
  const [platform, id] = videoId.split(`:`)
  const getEmbed = {
    youtube: (id) => `https://youtube.com/embed/` + id,
    vimeo: (id) => `https://player.vimeo.com/video/` + id,
  }
</script>

<iframe
  title="Video"
  src={getEmbed[platform](id)}
  width="100%"
  height="500"
  frameborder="0"
  allow="autoplay; fullscreen"
  allowfullscreen />

<style>
  iframe {
    display: block;
    max-width: 100%;
  }
</style>
