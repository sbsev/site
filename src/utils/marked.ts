import { marked } from 'marked'

const renderer = {
  // responsive markdown images
  image(href: string, title: string, text: string) {
    if (href?.includes(`images.ctfassets.net`) && !href.endsWith(`.svg`)) {
      title = title ? `title="${title}"` : ``

      const srcset = (params: string) =>
        [900, 600, 400]
          .map((width) => `${href}?w=${width}&${params} ${width}w`)
          .join(`, `)

      return `
      <picture>
        <source srcset="${srcset(`q=80&fit=fill&fm=webp`)}" type="image/webp" />
        <source srcset="${srcset(`q=80&fit=fill`)}" />
        <img src="${href}?w=900&q=80" alt="${text}" ${title} loading="lazy" />
      </picture>`
    }

    return false // delegate to default marked image renderer
  },

  // adapted from https://marked.js.org/using_pro
  heading(text: string, level: string, raw: string, slugger: unknown) {
    const id = slugger.slug(raw)

    // heading links are styled in static/global.css
    return `
      <h${level} id="${id}">
        ${text}
        <a href="#${id}" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <use xlink:href="#octicon-link"></use>
          </svg>
        </a>
      </h${level}>`
  },

  // add SvelteKit prefetching for local markdown links
  link(href: string, title: string, text: string) {
    if (href.startsWith(`/`)) {
      title = title ? `title="${title}"` : ``
      return `<a href="${href}" ${title}>${text}</a>`
    }
    return false // delegate to default marked link renderer
  },

  // responsive iframes for video embeds
  codespan(code: string) {
    if (code.startsWith(`youtube:`) || code.startsWith(`vimeo:`)) {
      const [platform, id] = code.split(/:\s?/)
      const embed = {
        youtube: (id: string) => `https://www.youtube-nocookie.com/embed/${id}`,
        vimeo: (id: string) => `https://player.vimeo.com/video/${id}`,
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

  // Mangle and headerIds are deprecated since > 5.0.0
  // https://github.com/markedjs/marked/discussions/2825
  headerIds: false,
  mangle: false,
}

marked.use({ renderer })

// Disable deprecated options
marked.setOptions({
  mangle: false,
  headerIds: false
})

export default marked
