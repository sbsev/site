<script>
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'
  import { stores } from '@sapper/app'
  import marked from 'marked'
  const { page } = stores()
  const slug = $page.path.replace(`/blog/`, ``)

  const posts = query(gql`
    {
      posts: contentType2WKn6YEnZewu2ScCkus4AsCollection(where: {slug: "${slug}"}) {
        items {
          title
          slug
          date
          cover {
            description
            url
          }
          body
          author {
            name
            email
            homepage
            bio
            fieldOfStudy
          }
        }
      }
    }
  `)
  $: post = $posts?.data?.posts.items[0] || {}
  $: ({ title, author = {}, date, cover = {}, body = `` } = post)
  $: ({ bio, fieldOfStudy, name } = author)
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
