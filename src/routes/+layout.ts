import { fetchChapters, fetchYaml } from '$lib/fetch'
import { microcopy } from '$lib/stores'
import type { Chapter, NavLink } from '$lib/types'
import type { LayoutLoad } from '@sveltejs/kit'

export const load: LayoutLoad = async () => {
  const nav = await fetchYaml(`Nav`)
  const footer = await fetchYaml(`Footer`)
  const social = await fetchYaml(`Social`)
  const chapters = await fetchChapters()
  const smallTexts = await fetchYaml(`smallTexts`)
  microcopy.set(smallTexts)

  // ensure the non-chapter link spans all chapter subnav columns
  nav.find((el: NavLink) => el.url === `/standorte`).subNav[0].spanCols = true

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
