import marked from 'marked'

function htmlEscapeToText(text) {
  return text.replace(/&#[0-9]*;|&amp;/g, (escapeCode) => {
    if (escapeCode.match(/amp/)) return `&`
    return String.fromCharCode(escapeCode.match(/[0-9]+/))
  })
}

// return a custom plain-text renderer for marked
// adapted from https://dustinpfister.github.io/2017/11/19/nodejs-marked
function plainRenderer() {
  const render = new marked.Renderer()

  // render just the text of a link
  render.link = (href, title, text) => text

  // render just the text of a paragraph
  render.paragraph = (text) => htmlEscapeToText(text) + `\r\n`

  // render just the text of a heading element, but indicate level
  render.heading = (text, level) => level + ` ) ` + text

  // render nothing for images (available args: href, title, text)
  render.image = () => ``

  return render
}

export const mdToPlain = (md) => marked(md, { renderer: plainRenderer() })
