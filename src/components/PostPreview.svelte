<script>
  import Tags from '@svg-icons/fa-solid/tags.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import Email from '@svg-icons/material-sharp/email.svg'
  import Link from '@svg-icons/boxicons-regular/link.svg'
  import Calendar from '@svg-icons/octicons/calendar.svg'

  import ToolTip from './ToolTip.svelte'
  import Img from './Img.svelte'

  export let post

  const { title, slug, cover, date, author, tags, plainBody } = post
  const { src, alt } = cover

  const style = `padding-right: 4pt; vertical-align: -1pt; height: 12pt;`
  const imgStyle = `width: 4ex; border-radius: 50%; vertical-align: -8pt; margin-right: 1ex;`
</script>

<section>
  <a href={slug}><Img sizes={[{ width: 400, height: 300 }]} {src} {alt} /></a>
  <h3><a href={slug}>{title}</a></h3>
  <div class="metadata">
    <ToolTip>
      <Img
        src={author.photo.url}
        alt={author.name}
        sizes={[{ width: 100, height: 100 }]}
        {imgStyle} />{author.name}
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
    <span><Calendar {style} />{new Date(date).toLocaleDateString(`de`)}</span>
    <span><Tags {style} />{tags.join(`, `)}</span>
    <p>
      {plainBody.slice(0, 150) + `...`}
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
  div.metadata {
    padding: 1ex;
    display: flex;
    flex-wrap: wrap;
    gap: 2ex;
    align-items: baseline;
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
