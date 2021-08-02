export type Chapter = {
  title: string
  slug: string
  coords: {
    lat: number
    lng: number
  }
  baseId: string
  acceptsSignups: boolean
  token: string
}

export type Link = {
  title: string
  url: string
}

export type NavLink = Link & {
  span?: number
  subNav?: NavLink[]
}

export type Page = {
  title: string
  slug: string
  cover: Image
  body: string
  plainBody: string // for creating excerpts and search previews
  date?: string
  yaml?: Yaml
  toc?: boolean
  sys: { publishedAt: string }
}

export type Author = {
  name: string
  bio: string
  url: string
  email: string
  photo: Image
  fieldOfStudy: string
}

export const BlogTags = [
  `Alle`,
  `Bundesvorstand`,
  `Erfahrungsberichte`,
  `Events`,
  `Freizeit`,
  `Interview`,
  `IT`,
  `Nachhilfelehrer`,
  `Soziale Partner`,
  `Spenden`,
  `Standortleiter`,
  `Werbung`,
] as const // use const assertion to turn BlogTags into readonly tuple

export type BlogTag = typeof BlogTags[number]

export type Post = Page & {
  author: Author
  date: string
  tags: BlogTag[]
  plainBody: string
}

export type Image = {
  src: string
  alt: string
  width: number
  height: number
  base64: string
  title: string
}

export type Yaml = {
  [key: string]: unknown
}

export type PressItem = {
  title: string
  id: string
  img: string
  url: string
  date: string
  chapter: string
  source: string
}

export type MapMarker = {
  lng: number
  lat: number
  title: string
  url: string
  classes: string[]
}

export type Place = {
  address: string
  coords: string // '{lat},{lng}'
}

export type StudyPlatform = {
  title: string
  id: string
  url: string
  img: string
  body: string
  tags: string[]
}

export type FAQ = {
  title: string
  id: string
  body: string
  tags: string[]
}

export type Award = {
  title: string
  id: string
  img: string
  url: string
  date: string
  prize: string
}
