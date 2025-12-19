import { Marked } from 'marked'

// Define token types inline since marked v17 doesn't export Tokens namespace properly
interface ImageToken {
  // ... (rest is fine, I will use ReplaceFileContent wisely)

  type: `image`
  raw: string
  href: string
  title: string | null
  text: string
}

interface HeadingToken {
  type: `heading`
  raw: string
  depth: number
  text: string
  tokens: unknown[]
}

interface LinkToken {
  type: `link`
  raw: string
  href: string
  title: string | null
  text: string
  tokens: unknown[]
}

interface CodespanToken {
  type: `codespan`
  raw: string
  text: string
}

const renderer = {
  // responsive markdown images
  image(token: ImageToken) {
    const { href, title, text } = token
    if (href?.includes(`images.ctfassets.net`) && !href.endsWith(`.svg`)) {
      const titleAttr = title ? `title="${title}"` : ``

      const srcset = (params: string) =>
        [900, 600, 400]
          .map((width) => `${href}?w=${width}&${params} ${width}w`)
          .join(`, `)

      return `
      <picture>
        <source srcset="${srcset(`q=80&fit=fill&fm=webp`)}" type="image/webp" />
        <source srcset="${srcset(`q=80&fit=fill`)}" />
        <img src="${href}?w=900&q=80" alt="${text}" ${titleAttr} loading="lazy" />
      </picture>`
    }

    return false // delegate to default marked image renderer
  },

  // adapted from https://marked.js.org/using_pro
  heading(token: HeadingToken) {
    const { text, depth: level } = token
    const id = text.toLowerCase().replace(/[^\wäöü]+/g, `-`)

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
  link(token: LinkToken) {
    const { href, title, text } = token
    if (href.startsWith(`/`)) {
      const titleAttr = title ? `title="${title}"` : ``
      return `<a href="${href}" ${titleAttr}>${text}</a>`
    }
    return false // delegate to default marked link renderer
  },

  // responsive iframes for video embeds
  codespan(token: CodespanToken) {
    const { text: code } = token
    if (code.startsWith(`youtube:`) || code.startsWith(`vimeo:`)) {
      const [platform, id] = code.split(/:\s?/)
      const embed: Record<string, (id: string) => string> = {
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
}

// Export a factory function to create isolated instances

// Export a factory function to create isolated instances
export const createMarked = () => {
  const instance = new Marked()
  instance.use({ renderer })
  return instance
}

// For backward compatibility (though we should move away from this)
const defaultInstance = createMarked()
export default defaultInstance
