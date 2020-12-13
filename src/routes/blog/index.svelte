<script>
  import { query } from 'svelte-apollo'
  import { gql } from '@apollo/client/core'

  const posts = query(gql`
    {
      posts: contentType2WKn6YEnZewu2ScCkus4AsCollection {
        items {
          title
          slug
          date
          cover {
            description
            url
          }
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
</script>

<div>
  {#each $posts?.data?.posts.items || [] as { title, slug, cover, date, author }}
    <section>
      <a href="/blog/{slug}"><img src={cover.url} alt={cover.description} /></a>
      <h3><a href="/blog/{slug}">{title}</a></h3>
      <span>{new Date(date).toLocaleDateString(`de`)}</span>
      <span class:hasbio={author.bio} data-tooltip={author.bio}>{author.name}
        {author.fieldOfStudy ? `(${author.fieldOfStudy})` : ``}</span>
    </section>
  {/each}
</div>

<style>
  div {
    max-width: 50em;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17em, 1fr));
    grid-gap: 2em 1.5em;
  }
  section {
    background: var(--accentBg);
    padding: 1ex;
    border-radius: 1ex;
  }
  img {
    width: 100%;
    border-radius: 4pt;
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
