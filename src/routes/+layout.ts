import { fetch_chapters, fetch_yaml } from '$lib/fetch'
import { microcopy } from '$lib/stores'
import type { Chapter, NavLink } from '$lib/types'

export const load = async () => {
  const nav = await fetch_yaml(`Nav`)
  const footer = await fetch_yaml(`Footer`)
  const social = await fetch_yaml(`Social`)
  // don't show partner orgs in nav
  const chapters = (await fetch_chapters()).filter(
    (chap) => chap.status != `partner`,
  )
  const smallTexts = await fetch_yaml(`smallTexts`)
  microcopy.set(smallTexts)

  // ensure the non-chapter link spans all chapter subnav columns
  nav.find((el: NavLink) => el.url === `/standorte`).subNav[0].spanCols = true

  // create { title, url } array containing all chapters
  const chapterLinks = chapters.map((chapter: Chapter) => {
    const { title, slug, status } = chapter
    return { title, url: slug, lightFont: status == `starting` }
  })

  // prepend chapter links into chapter subnav
  nav
    .find((el: NavLink) => el.url === `/standorte`)
    .subNav.unshift(...chapterLinks)

  return { nav, footer, social }
}

export const prerender = true
