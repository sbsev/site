<script>
  import Img from 'svelte-image'

  import Tags from '@svg-icons/fa-solid/tags.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import PersonCircle from '@svg-icons/bootstrap/person-circle.svg'
  import Email from '@svg-icons/material-sharp/email.svg'
  import Link from '@svg-icons/boxicons-regular/link.svg'
  import Calendar from '@svg-icons/octicons/calendar.svg'

  export let post

  const { title, slug, cover, date, author, tags } = post
  const { url, description } = cover

  const style = `padding-right: 4pt; vertical-align: -2pt; height: 15pt;`
</script>

<section>
  <a href={slug}><Img src={url} alt={description} /></a>
  <h3><a href={slug}>{title}</a></h3>
  <div class="metadata">
    <span><Calendar {style} />{new Date(date).toLocaleDateString(`de`)}</span>
    <div class="author">
      <PersonCircle {style} />
      {author.name}
      <address>
        {#if author.url}
          <a href={author.url}><Link {style} />{author.url}</a>
          <br />
        {/if}
        {#if author.email}
          <a href="mailto:{author.email}"><Email {style} />{author.email}</a>
          <br />
        {/if}
        {#if author.fieldOfStudy}
          <GraduationCap {style} />{author.fieldOfStudy}
        {/if}
      </address>
    </div>
    <span><Tags {style} />{tags.join(`, `)}</span>
  </div>
</section>

<style>
  section {
    background: var(--accentBg);
    border-radius: 1ex;
    display: grid;
    font-size: 0.9em;
  }
  section > *:not(:first-child) {
    margin: 1ex 1em;
  }
  section :global(.wrapper) {
    /* targets responsive cover images */
    border-radius: 1ex 1ex 0 0;
    overflow: hidden;
    height: 15em;
  }
  section :global(.wrapper img) {
    height: 15em;
    object-fit: cover;
  }
  div.metadata {
    padding: 1ex;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }
  div.author {
    position: relative;
    height: max-content;
  }
  address {
    visibility: hidden;
    opacity: 0;
    transition: 0.4s;
    position: absolute;
    max-width: 16em;
    background: var(--bodyBg);
    top: 100%;
    padding: 1ex 1em;
    border-radius: 1ex;
    left: 50%;
    transform: translate(-50%, 1em);
    z-index: 1;
    box-shadow: 0 0 1ex -3pt black;
    font-style: normal;
  }
  address a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
  }
  address::before {
    content: '';
    width: 1em;
    position: absolute;
    left: 50%;
    bottom: 100%;
    height: 1em;
    border: 1em solid;
    border-color: transparent transparent var(--bodyBg) transparent;
    box-sizing: border-box;
  }
  div.author:hover address {
    visibility: visible;
    opacity: 1;
  }
</style>
