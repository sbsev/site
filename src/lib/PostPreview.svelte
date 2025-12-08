<script lang="ts">
  import { Img, ToolTip } from '.'
  import type { Post } from './types'

  // Icon imports (bundled at build time)
  import IconLink from '~icons/bx/link'
  import IconEmail from '~icons/ic/email'
  import IconGraduation from '~icons/fa-solid/graduation-cap'
  import IconCalendar from '~icons/octicon/calendar'
  import IconTags from '~icons/fa-solid/tags'

  export let post: Post

  const { title, slug, cover, date, author, tags, plainBody } = post

  const style = `padding-right: 4pt; height: 12pt;`
</script>

<section>
  <a href={slug}>
    <Img
      sizes={[{ w: 400, h: 300 }]}
      {...cover}
      img_style="border-radius: 1ex 1ex 0 0; height: 15em;"
    /></a
  >
  <h3><a href={slug}>{title}</a></h3>
  <div>
    <ToolTip>
      <Img
        {...author.photo}
        alt={author.name}
        sizes={[{ w: 100, h: 100 }]}
        img_style="width: 4ex; height: 4ex; border-radius: 50%; vertical-align: -8pt; margin-right: 1ex;"
      />
      {author.name}
      <address slot="tip">
        {#if author.url}
          <a href={author.url}>
            <IconLink {style} />{author.url}
          </a>
          <br />
        {/if}
        {#if author.email}
          <a href="mailto:{author.email}">
            <IconEmail {style} />
            {author.email}
          </a>
          <br />
        {/if}
        {#if author.fieldOfStudy}
          <IconGraduation {style} />{author.fieldOfStudy}
        {/if}
      </address>
    </ToolTip>
    <span>
      <IconCalendar {style} />
      {new Date(date).toLocaleDateString(`de`)}
    </span>
    <span>
      <IconTags {style} />{tags.join(`, `)}
    </span>
  </div>
  <p>
    {plainBody.slice(0, 150) + `...`}
    [<a href={slug}>weiterlesen</a>]
  </p>
</section>

<style>
  section {
    background: var(--accent-bg);
    border-radius: 1ex;
    display: grid;
    font-size: 0.9em;
  }
  section > *:not(:first-child) {
    margin: 1ex 2.5ex;
  }
  div {
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
