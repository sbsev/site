<script>
  import Tags from '@svg-icons/fa-solid/tags.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import PersonCircle from '@svg-icons/bootstrap/person-circle.svg'
  import Email from '@svg-icons/material-sharp/email.svg'
  import Link from '@svg-icons/boxicons-regular/link.svg'
  import Calendar from '@svg-icons/octicons/calendar.svg'

  import ToolTip from './ToolTip.svelte'

  export let post

  const { title, slug, cover, date, author, tags, plainBody } = post
  const { small, description } = cover

  const style = `padding-right: 4pt; vertical-align: -2pt; height: 15pt;`
</script>

<section>
  <a href={slug}><img src={small} alt={description || cover.title} /></a>
  <h3><a href={slug}>{title}</a></h3>
  <div class="metadata">
    <span><Calendar {style} />{new Date(date).toLocaleDateString(`de`)}</span>
    <ToolTip>
      <PersonCircle {style} />{author.name}
      <address slot="tip">
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
    </ToolTip>
    <span><Tags {style} />{tags.join(`, `)}</span>
    <p>
      {plainBody.split(` `).slice(0, 20).join(` `) + `...`}
      [<a href={slug}>weiterlesen</a>]
    </p>
  </div>
</section>

<style>
  section {
    background: var(--accentBg);
    border-radius: 1ex;
    display: grid;
    font-size: 0.9em;
    overflow: hidden;
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
  address a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-style: normal;
  }
</style>
