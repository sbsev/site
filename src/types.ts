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
  subNav?: NavLink[]
  spanCols?: boolean
  lightFont?: boolean
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
  `Stipendium`,
  `Werbung`,
] as const // use const assertion to turn BlogTags into readonly tuple

export type BlogTag = typeof BlogTags[number]

export type Post = Page & {
  author: Author
  date: Date
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
  date: Date
  chapter: string
  source: string
}

// used by /lernmaterial.svelte
export type StudyPlatform = {
  title: string
  id: string
  url: string
  img: string
  body: string
  tags: string[]
}

// used by /faq.svelte
export type FAQ = {
  title: string
  id: string
  body: string
  tags: string[]
}

// used by /auszeichnungen.svelte
export type Award = {
  title: string
  id: string
  img: string
  url: string
  date: Date
  prize: string
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
  lat: number
  lng: number
}

// fields allowed in signupStore from src/stores.ts
export type SignupData = {
  age: number
  agreement: boolean
  birthDate: string
  birthPlace: string
  chapter: string[]
  dataProtection: boolean
  discovery: string[]
  email: string
  emailContact: string
  firstName: string
  fullName: string
  gender: string // 'Männlich' | 'Weiblich' | 'Divers'
  level: number
  levels: number[]
  nameContact: string
  need: string
  online: boolean
  orgContact: string
  phone: string
  phoneContact: string
  place: Place
  places: Place[]
  remarks: string
  schoolType: string
  schoolTypes: string[]
  semester: number
  studySubject: string
  subjects: string
  type: 'Student' | 'Pupil'
}

// used by both signup forms src/routes/anmeldung-{student,schueler}.svelte
export type FieldData = {
  title: string
  note?: string
  required?: boolean
  placeholder?: string
}
