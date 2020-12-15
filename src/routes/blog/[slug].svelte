<script context="module">
  import { fetchPost } from '../queries'

  export async function preload({ path }, session) {
    const post = await fetchPost(path.replace(`/blog/`, ``), session.gqlUri)
    return { post }
  }
</script>

<script>
  import marked from 'marked'

  export let post

  const { title, author = {}, date, cover = {}, body = `` } = post
  const { bio, fieldOfStudy, name, photo } = author
</script>

<hgroup>
  <img src={cover.url} alt={cover.description} />
  <h1>{title}</h1>
</hgroup>
<div>
  <blockquote>
    <img src={photo.url} alt={name} />
    <span>{new Date(date).toLocaleDateString(`de`)}</span>
    <span>{name} {fieldOfStudy ? `(${fieldOfStudy})` : ``}</span>
    {#if bio}
      <p>{bio}</p>
    {/if}
  </blockquote>
  {@html marked(body)}
</div>

<style>
  div {
    max-width: 50em;
    padding: 2em;
  }
  hgroup {
    position: relative;
    height: max-content;
    max-height: 30em;
    overflow: hidden;
  }
  img {
    width: 100%;
    object-position: cover;
  }
  blockquote {
    background: var(--accentBg);
    padding: 6pt 1em;
    border-radius: 1ex;
    margin-bottom: 2em;
  }
  blockquote img {
    width: 3em;
    border-radius: 50%;
  }
  h1 {
    color: white;
    background: rgba(0, 0, 0, 0.2);
    padding: 5pt 1ex;
    border-radius: 1ex;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: min-content;
    white-space: nowrap;
  }
</style>
