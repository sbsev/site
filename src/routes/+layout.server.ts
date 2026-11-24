import { fetch_chapters, fetch_yaml } from '$lib/fetch'
import type { Microcopy, NavLink } from '$lib/types'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch }) => {
  const [nav, footer, social, chapters, smallTexts] = await Promise.all([
    fetch_yaml(`Nav`, fetch) as Promise<NavLink[]>,
    fetch_yaml(`Footer`, fetch),
    fetch_yaml(`Social`, fetch),
    fetch_chapters(fetch),
    fetch_yaml(`smallTexts`, fetch) as Promise<Microcopy>,
  ])

  const chapterNav = nav.find((link) => link.url === `/standorte`)?.subNav
  if (chapterNav) {
    if (chapterNav[0]) chapterNav[0].spanCols = true
    const chapterLinks = chapters
      .filter((chapter) => chapter.status !== `partner`)
      .map(({ title, slug, acceptsSignups }) => ({
        title,
        url: slug,
        lightFont: !acceptsSignups,
      }))
    chapterNav.unshift(...chapterLinks)
  }

  return {
    nav,
    footer,
    social,
    smallTexts,
    signupChapterSlugs: chapters
      .filter((chapter) => chapter.acceptsSignups)
      .map((chapter) => chapter.slug),
  }
}
