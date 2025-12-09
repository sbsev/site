import { fetch_chapters, fetch_yaml } from '$lib/fetch'
import { microcopy } from '$lib/stores'
import type { Chapter, NavLink } from '$lib/types'

export const load = async ({ fetch }) => {
  try {
    const nav = (await fetch_yaml(`Nav`, fetch)) as NavLink[]
    const footer = await fetch_yaml(`Footer`, fetch)
    const social = await fetch_yaml(`Social`, fetch)
    // don't show partner orgs in nav
    const chapters = (await fetch_chapters(fetch)).filter(
      (chap) => chap.status != `partner`,
    )
    const smallTexts = await fetch_yaml(`smallTexts`, fetch)
    microcopy.set(smallTexts as Record<string, unknown>)

    // ensure the non-chapter link spans all chapter subnav columns
    const standorteNav = nav.find((el: NavLink) => el.url === `/standorte`)
    if (standorteNav?.subNav?.[0]) {
      standorteNav.subNav[0].spanCols = true
    }

    // create { title, url } array containing all chapters
    const chapterLinks = chapters.map((chapter: Chapter) => {
      const { title, slug, acceptsSignups } = chapter
      return { title, url: slug, lightFont: !acceptsSignups }
    })

    // prepend chapter links into chapter subnav
    const standorteNavForChapters = nav.find(
      (el: NavLink) => el.url === `/standorte`,
    )
    if (standorteNavForChapters?.subNav) {
      standorteNavForChapters.subNav.unshift(...chapterLinks)
    }

    return { nav, footer, social }
  } catch (error) {
    console.error(`Error loading layout data:`, error)
    // Return minimal fallback data so the page can still load
    return {
      nav: [],
      footer: { links: [] },
      social: [],
    }
  }
}

export const prerender = true
