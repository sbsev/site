import marked from 'marked'

// https://primer.style/octicons/link-16
const linkIcon = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0z"/></svg>`

const renderer = {
  // responsive markdown images
  image(href, title, text) {
    if (href?.includes(`images.ctfassets.net`) && !href.endsWith(`.svg`)) {
      title = title ? `title="${title}"` : ``

      const srcSet = (params) =>
        [900, 600, 400]
          .map((width) => `${href}?w=${width}&${params} ${width}w`)
          .join(`, `)

      return `
      <picture>
        <source srcset="${srcSet(`q=80&fit=fill&fm=webp`)}" type="image/webp" />
        <source srcset="${srcSet(`q=80&fit=fill`)}" />
        <img src="${href}?w=900&q=80" alt="${text}" ${title} loading="lazy" />
      </picture>`
    }

    return false // delegate to default marked image renderer
  },

  // adapted from https://marked.js.org/using_pro
  heading(text, level, raw, slugger) {
    const id = slugger.slug(raw)

    // class 'a.anchor' is styled in static/global.css
    return `<h${level}><a id="${id}" href="#${id}" class="anchor" aria-hidden="true">${linkIcon}</a>${text}</h${level}>`
  },

  // add Sapper prefetching for local markdown links
  link(href, title, text) {
    if (href.startsWith(`/`)) {
      title = title ? `title="${title}"` : ``
      return `<a sapper:prefetch href="${href}" ${title}>${text}</a>`
    }
    return false // delegate to default marked link renderer
  },

  // responsive iframes for video embeds
  codespan(code) {
    if (code.startsWith(`youtube:`) || code.startsWith(`vimeo:`)) {
      const [platform, id] = code.split(/:\s?/)
      const embed = {
        youtube: (id) => `https://youtube.com/embed/${id}`,
        vimeo: (id) => `https://player.vimeo.com/video/${id}`,
      }
      // padding-top: 56.25%; corresponds to 16/9 = most common video aspect ratio
      return `
        <div style="padding-top: 56.25%; position: relative;">
          <iframe
            title="${platform} video"
            loading="lazy"
            src="${embed[platform](id)}"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
            allowfullscreen></iframe>
        </div>`
    }
    return false // delegate to default marked codespan renderer
  },
}

marked.use({ renderer })

export default marked
