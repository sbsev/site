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
  const { bio, fieldOfStudy, name } = author
</script>

<hgroup>
  <img src={cover.url} alt={cover.description} />
  <h1>{title}</h1>
  <span>{new Date(date).toLocaleDateString(`de`)}</span>
  <span class:hasbio={bio} data-tooltip={bio}>{name}
    {fieldOfStudy ? `(${fieldOfStudy})` : ``}</span>
</hgroup>
<div>
  {@html marked(body)}
</div>

<style>
  div {
    max-width: 50em;
    padding: 2em;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17em, 1fr));
    grid-gap: 2em 1.5em;
  }
  hgroup {
    position: relative;
    height: max-content;
    max-height: 700px;
    overflow: hidden;
  }
  img {
    width: 100%;
    object-position: cover;
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
  span.hasbio:before {
    content: attr(data-tooltip);
    position: absolute;
    opacity: 0;

    /* customizable */
    transition: all 0.15s ease;
    padding: 10px;
    color: #333;
    border-radius: 10px;
    box-shadow: 2px 2px 1px silver;
  }
  span.hasbio:hover:before {
    opacity: 1;

    /* customizable */
    background: yellow;
    margin-top: -50px;
  }
</style>
