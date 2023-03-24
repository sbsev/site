import { fetch_chapters, fetch_yaml } from '$lib/fetch'
import { microcopy } from '$lib/stores'
import type { Chapter, NavLink } from '$lib/types'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
  const nav = await fetch_yaml(`Nav`)
  const footer = await fetch_yaml(`Footer`)
  const social = await fetch_yaml(`Social`)
  var chapters = await fetch_chapters()
  const smallTexts = await fetch_yaml(`smallTexts`)
  microcopy.set(smallTexts)

  // ensure the non-chapter link spans all chapter subnav columns
  nav.find((el: NavLink) => el.url === `/standorte`).subNav[0].spanCols = true

  // filter out partner organizations from the menu
  chapters = chapters.filter((chap) => !chap.partnerAssociation)

  // create { title, url } array containing all chapters
  const chapterLinks = chapters.map((chapter: Chapter) => {
    const { title, slug, acceptsSignups } = chapter
    return { title, url: slug, lightFont: !acceptsSignups }
  })

  // prepend chapter links into chapter subnav
  nav
    .find((el: NavLink) => el.url === `/standorte`)
    .subNav.unshift(...chapterLinks)

  return { nav, footer, social }
}

export const prerender = true
