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

// fields allowed in student/pupil signup store (see src/stores.ts)
export type SignupStore = {
  agreement: StoredFormField<boolean>
  birthDate: StoredFormField<Date>
  birthPlace: StoredFormField<string>
  birthYear: StoredFormField<number>
  chapter: StoredFormField<string[]>
  dataProtection: StoredFormField<boolean>
  discovery: StoredFormField<string[]>
  email: StoredFormField<string>
  emailContact: StoredFormField<string>
  firstName: StoredFormField<string>
  fullName: StoredFormField<string>
  gender: StoredFormField<string> // 'Männlich' | 'Weiblich' | 'Divers'
  level: StoredFormField<number>
  levels: StoredFormField<number[]>
  nameContact: StoredFormField<string>
  need: StoredFormField<string>
  online: StoredFormField<boolean>
  orgContact: StoredFormField<string>
  phone: StoredFormField<string>
  phoneContact: StoredFormField<string>
  place: StoredFormField<Place>
  places: StoredFormField<Place[]>
  remarks: StoredFormField<string>
  schoolType: StoredFormField<string>
  schoolTypes: StoredFormField<string[]>
  semester: StoredFormField<number>
  studySubject: StoredFormField<string>
  subjects: StoredFormField<string>
  type: StoredFormField<'student' | 'pupil'>
}

export type StandardTypes =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'tel'
  | 'checkbox'
export type CustomTypes =
  | 'select'
  | 'toggle'
  | 'singleRange'
  | 'doubleRange'
  | 'placeSelect'
  | 'radio'
export type FormFieldType = StandardTypes | CustomTypes

export type FormFieldProps = {
  title: string
  id: keyof SignupStore
  note?: string
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  maxSelect?: number
  type?: FormFieldType
  options?: string[]
}

export type StoredFormField<T> = {
  value?: T
  error?: string | null
  node?: HTMLLabelElement
  required?: boolean
}

export type FormSelectOptions = {
  [key: string]: string[]
}

export type FormMessages = {
  submit: Record<'title' | 'note', string>
  submitSuccess: Record<'title' | 'note', string>
  submitError: Record<'title' | 'note', string>
  errMsg: Record<'title' | 'note', string>
}

export type Form = {
  fields: FormFieldProps[]
  page: Record<'title' | 'note', string>
} & FormMessages
