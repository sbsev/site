import marked from 'marked'

const linkSvg = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.879 9.934a.81.81 0 01-.575-.238 3.818 3.818 0 010-5.392l3-3C10.024.584 10.982.187 12 .187s1.976.397 2.696 1.117a3.818 3.818 0 010 5.392l-1.371 1.371a.813.813 0 01-1.149-1.149l1.371-1.371A2.19 2.19 0 0012 1.812c-.584 0-1.134.228-1.547.641l-3 3a2.19 2.19 0 000 3.094.813.813 0 01-.575 1.387z"/><path d="M4 15.813a3.789 3.789 0 01-2.696-1.117 3.818 3.818 0 010-5.392l1.371-1.371a.813.813 0 011.149 1.149l-1.371 1.371A2.19 2.19 0 004 14.188c.585 0 1.134-.228 1.547-.641l3-3a2.19 2.19 0 000-3.094.813.813 0 011.149-1.149 3.818 3.818 0 010 5.392l-3 3A3.789 3.789 0 014 15.813z"/></svg>`

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
  heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\wäöüß]+/g, `-`)

    // class 'anchor-heading' is styled in static/global.css
    // SLUG in href will be replaced with the actual page slug in renderBody (see queries.js)
    return `<h${level} class="anchor-heading" id=${escapedText}><a href="SLUG#${escapedText}" aria-hidden="true">${linkSvg}</a>${text}</h${level}>`
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
