# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StudyTutors** is a SvelteKit-powered static site for StudyTutors e.V., a German nonprofit providing free tutoring to refugees and underprivileged children. The site integrates with Contentful CMS, Airtable for forms, and Mapbox for location services.

- **Framework**: SvelteKit 2.x with static adapter
- **Language**: TypeScript 5.8+
- **Package Manager**: pnpm
- **Node Version**: 20.x
- **Deployment**: Netlify (automatic on main branch)
- **Repository**: https://github.com/sbsev/site

## Essential Development Commands

### Setup & Installation

```bash
# Install pre-commit hooks (optional but recommended)
pre-commit install

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Then edit .env with your Contentful credentials
```

### Development

```bash
# Start dev server (http://localhost:3000)
pnpm dev

# Type check (svelte-check)
pnpm check

# Lint with auto-fix
pnpm lint

# Lint production code only
pnpm lint:prod
```

### Testing

```bash
# Full test suite (13+ test files)
pnpm test

# Smoke tests only (quick sanity checks)
pnpm test:smoke

# Run tests with visible browser UI
pnpm test:headed

# Debug mode with inspector
pnpm test:debug

# Test configuration: playwright.config.ts
# Base URL: http://localhost:3005 (auto-started)
# Browsers: Chromium, Firefox, WebKit
# Timeout: 30s per test
```

### Building & Preview

```bash
# Production build (outputs to /build/)
pnpm build

# Preview the production build locally
pnpm preview

# Combined build + preview
pnpm serve
```

## Architecture & Code Structure

### Directory Layout

```
src/
├── app.html           # HTML shell (Plausible analytics, SVG symbols)
├── app.css            # Global styles
├── app.d.ts           # TypeScript definitions
├── hooks.server.ts    # Server-side hooks (Algolia disabled)
├── lib/               # Reusable components and utilities
│   ├── *.svelte      # 24+ Svelte components (Header, Footer, Modal, etc.)
│   ├── fetch.ts      # Contentful + Airtable GraphQL queries
│   ├── types.ts      # TypeScript interfaces (Chapter, Post, Page, etc.)
│   ├── stores.ts     # Svelte stores
│   └── index.ts      # Component barrel export
├── routes/            # SvelteKit page routes (file-based routing)
│   ├── +layout.svelte    # Root layout component
│   ├── +layout.ts        # Layout data loader (all pages)
│   ├── +page.svelte      # Home page
│   ├── +page.server.ts   # Home page server-side logic
│   ├── +error.svelte     # Error page
│   ├── [...slug]/        # Catch-all dynamic routes
│   ├── blog/             # Blog listing and individual posts
│   ├── signup-pupil/     # Student signup form
│   ├── signup-student/   # Tutor/volunteer signup form
│   ├── standorte/        # Chapters/locations listing and details
│   └── [other routes]/   # Additional pages (faq, presse, lernmaterial, etc.)
├── signup-form/       # Form configurations (YAML)
│   ├── de/           # German forms
│   └── us/           # US forms (optional)
└── utils/            # Utility functions
    ├── actions.ts     # Form action handlers (API routes)
    ├── contentful.js  # Contentful SDK
    ├── marked.ts      # Markdown to HTML conversion
    └── algolia.ts     # Algolia search (indexing currently disabled)

static/               # Static assets (images, fonts, manifest)
tests/                # Playwright end-to-end tests
.github/workflows/    # CI/CD pipelines (test.yml, lighthouse.yml)
```

### Key Data Flow

1. **Content Source**: Contentful CMS (GraphQL API)
2. **Form Submissions**: Airtable (BaseQL)
3. **Page Routes**: SvelteKit file-based routing with catch-all `[...slug]` for CMS content
4. **Data Loading**: `+layout.ts` fetches global data; `+page.ts`/`+page.server.ts` fetch page-specific data
5. **Static Generation**: Pre-rendered HTML at build time via static adapter
6. **Deployment**: Netlify continuous deployment on main branch push

### Core Components

**Layout/Navigation:**

- `Header.svelte`, `Nav.svelte`, `Footer.svelte` - Main layout structure
- `BasePage.svelte` - Base layout for content pages

**Interactive:**

- `Modal.svelte` - Modal dialogs
- `ChapterMap.svelte`, `Map.svelte`, `Geocoder.svelte` - Mapbox integration
- `PlaceSelect.svelte` - Location selection
- `Collapsible.svelte`, `Toggle.svelte`, `RadioButtons.svelte` - Form controls
- `ThemeSwitcher.svelte` - Dark/light mode toggle

**Content Display:**

- `PostPreview.svelte` - Blog post cards
- `ChapterList.svelte` - Chapter listings
- `SearchHit.svelte` - Search results
- `Img.svelte` - Optimized images with placeholders
- `TagList.svelte`, `Social.svelte`, `ToolTip.svelte` - Utility components

**Forms:**

- `FormField.svelte` - Reusable form input wrapper

### Data Fetching

**lib/fetch.ts** - Primary data layer:

- `contentful_fetch(query, variables)` - GraphQL queries to Contentful
- `airtable_fetch(query, variables)` - GraphQL queries to Airtable
- `fetch_chapters()` - Loads all chapter/location data
- `base64_thumbnail(imageUrl)` - Generates low-quality image placeholders

Example usage:

```typescript
// In +page.server.ts or +layout.ts
import { contentful_fetch, fetch_chapters } from '$lib'

export async function load({ params }) {
  const chapters = await fetch_chapters()
  const pageData = await contentful_fetch(query, { slug: params.slug })
  return { chapters, pageData }
}
```

### Types (lib/types.ts)

Key TypeScript interfaces:

- `Chapter` - Location/chapter information
- `Page` - CMS page
- `Post` - Blog post with author
- `Image` - Image metadata
- `Author` - Author profile
- `BlogTag` - Blog tag enum
- `Form` - Form configuration

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Contentful CMS
VITE_CONTENTFUL_SPACE_ID=<your-space-id>
VITE_CONTENTFUL_ACCESS_TOKEN=<your-access-token>
CONTENTFUL_MANAGEMENT_TOKEN=<for-contentful-cli-only>

# Airtable (forms and chapter data)
VITE_AIRTABLE_API_KEY=<your-api-key>
VITE_AIRTABLE_CHAPTER_BASE_APP_ID=<base-id>

# Mapbox (maps and geocoding)
VITE_MAPBOX_PUBLIC_KEY=<your-public-key>

# Algolia (search - currently disabled)
VITE_ALGOLIA_APP_ID=<optional>
VITE_ALGOLIA_SEARCH_KEY=<optional>

# Translation services
DEEPL_API_KEY=<optional>

# Analytics and monitoring
VITE_PLAUSIBLE_API_KEY=<optional>
LHCI_GITHUB_APP_TOKEN=<for-lighthouse-ci>
```

## Code Quality & Standards

### Linting & Formatting

- **ESLint**: Enforced on all files (production-only in CI)
  - No semicolons, single quotes, 2-space indent
  - No console logs in production (warn/error allowed)
  - Unused variables must be prefixed with `_`
  - Test files have relaxed rules

- **Prettier**: Formats code automatically
  - 90-character print width for Svelte
  - No semicolons, single quotes

- **Pre-commit hooks** (optional but recommended)
  - Prettier formatting
  - ESLint auto-fix
  - Spell checking (codespell)
  - YAML validation
  - Case conflict detection

Run linting:

```bash
pnpm lint              # Auto-fix all files
pnpm lint:prod         # Production code only
```

### Type Safety

```bash
pnpm check             # svelte-check type validation
```

- Strict TypeScript mode enabled
- All Svelte components should have `<script lang="ts">`
- Define types in `lib/types.ts` for reusable interfaces

## Testing

**Framework**: Playwright 1.54+ for end-to-end testing

**Test Files** (in `tests/`):

- `smoke.test.ts` - Quick sanity checks
- `accessibility.test.ts` - A11y validation
- `core-functionality.test.ts` - Main features
- `blog.test.ts`, `pages.test.ts` - Content routing
- `forms.test.ts`, `pupil-form.test.ts`, `student-form.test.ts` - Form handling
- `console-capture.test.ts` - Console error detection

**Test Helpers** (tests/helpers.ts):

- Utility functions available for your tests

**Running Tests**:

```bash
pnpm test              # Full suite (all browsers)
pnpm test:smoke        # Smoke tests only
pnpm test:headed       # With browser UI visible
pnpm test:debug        # Debug mode

# Configuration: playwright.config.ts
# Base URL: http://localhost:3005
# Auto-starts dev server on port 3005
# Runs: Chromium, Firefox, WebKit
# Retry: 2 times in CI
```

**CI/CD Testing** (.github/workflows/test.yml):

- Runs on push to main and pull requests
- Runs: ESLint (prod only) → Type check → Playwright tests
- Uploads test artifacts (7-day retention)
- Must pass before merge to main

## Form Handling

### Signup Forms

Two main signup flows with configuration in `src/signup-form/`:

**Pupil Signup** (`routes/signup-pupil/`):

- Student seeking tutoring
- Form config: `signup-form/de/pupil.yml`
- Submits to Airtable

**Student Signup** (`routes/signup-student/`):

- Volunteer tutor/mentor
- Form config: `signup-form/de/student.yml`
- Submits to Airtable

### Form Implementation

Forms use:

- YAML configuration for fields (language-specific)
- `utils/actions.ts` for form handlers (server actions)
- `FormField.svelte` for input components
- Airtable as backend storage

## Markdown & Content

**Markdown Rendering**: `utils/marked.ts`

- Converts markdown to HTML
- Custom styling for code blocks, links, etc.
- Used in blog posts and CMS content

## Internationalization

Currently German-focused (de) with optional US (us) support:

- `src/signup-form/de/` - German forms
- `src/signup-form/us/` - US forms (optional)
- Language detection/selection in Header component

Translation utilities available:

- DeepL API (utils/deeplTranslate.js)
- Google Translate API (utils/googleTranslate.js)

## Performance & Analytics

### Lighthouse CI

Automatically runs on every push/PR (`.github/workflows/lighthouse.yml`):

- Performance, Accessibility, Best Practices, SEO scores
- Results displayed on commits and PRs

### Analytics

- **Plausible Analytics**: Privacy-focused, ad-blocker resistant
- Proxied through Netlify
- Initialized in `src/app.html`

### Optimization

- Static site generation = fast delivery via CDN
- Image optimization via `base64_thumbnail()` (low-quality placeholders)
- `Img.svelte` component for responsive images
- No runtime overhead (fully pre-rendered)

## Deployment

### Automatic Deployment

Main branch pushes automatically deploy to Netlify (via `netlify.toml`):

1. Build: `pnpm build`
2. Publish: `build/` directory
3. Node 18.16.0

### Domain Configuration

Domain redirects (Netlify):

- `sbsev.netlify.com` → `studytutors.de`
- `studenten-bilden-schueler.at` → `studytutors.at`
- `studenten-bilden-schueler.de` → `studytutors.de`

### Manual Deployment

```bash
# Create production build
pnpm build

# Preview locally
pnpm preview

# Deploy via Netlify CLI
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Common Development Tasks

### Adding a New Page

1. Create route directory: `src/routes/new-page/`
2. Create `+page.svelte` (component)
3. Optionally create `+page.ts` or `+page.server.ts` (data loading)
4. Import `BasePage.svelte` for consistent layout
5. Use `contentful_fetch()` or `airtable_fetch()` for data

Example:

```svelte
<!-- src/routes/new-page/+page.svelte -->
<script lang="ts">
  import BasePage from '$lib/BasePage.svelte';

  export let data; // from +page.ts
</script>

<BasePage>
  <h1>{data.title}</h1>
  <!-- content here -->
</BasePage>
```

### Adding a New Component

1. Create in `src/lib/ComponentName.svelte`
2. Use `<script lang="ts">` with type annotations
3. Export to `src/lib/index.ts` barrel export
4. Use in routes and other components

### Updating Content from Contentful

Content is fetched via GraphQL in `+page.ts` or `+layout.ts`:

```typescript
// src/routes/example/+page.ts
import { contentful_fetch } from '$lib'

const query = `
  query GetPage($slug: String!) {
    pageCollection(where: { slug: $slug }) {
      items {
        title
        content
      }
    }
  }
`

export async function load({ params }) {
  const data = await contentful_fetch(query, { slug: params.slug })
  return data.pageCollection.items[0]
}
```

### Adding a Form

1. Create form config YAML: `src/signup-form/de/my-form.yml`
2. Create route: `src/routes/my-form/+page.svelte`
3. Create form handler in `utils/actions.ts`
4. Use `FormField.svelte` components
5. Wire up to Airtable in form handler

### Debugging

- **Dev Tools**: Browser DevTools with Svelte Inspector extension
- **Console**: Check for errors/warnings (ESLint prevents console logs in prod)
- **Test Debug**: `pnpm test:debug` with inspector
- **Test Browser**: `pnpm test:headed` to watch tests run

## Git Workflow

Current branch: `dev/update`
Main branch: `main` (protected, requires PR)

Working with pre-commit hooks:

```bash
# Install hooks
pre-commit install

# Hooks run automatically on git commit:
# - Prettier formatting
# - ESLint auto-fix
# - Spell checking
# - YAML validation

# Bypass hooks if necessary (not recommended)
git commit --no-verify
```

## Troubleshooting

**Dev server won't start**:

```bash
# Clear cache and reinstall
rm -rf node_modules .svelte-kit
pnpm install
pnpm dev
```

**Tests failing**:

```bash
# Ensure Contentful env vars are set
# Run smoke tests first
pnpm test:smoke

# Run with headed browser to see issues
pnpm test:headed

# Check console errors
pnpm test tests/console-capture.test.ts
```

**Linting errors**:

```bash
# Auto-fix all issues
pnpm lint

# Check types
pnpm check
```

**Build fails**:

```bash
# Ensure env vars include all required keys from .env.example
# Check that Contentful/Airtable credentials are valid
pnpm build --verbose
```

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/`):

**test.yml** - Runs on PR and push to main:

1. Setup Node 20.x + pnpm
2. Install dependencies
3. ESLint check (production code only)
4. Type check (svelte-check)
5. Build with secrets
6. Playwright test suite (all browsers)
7. Upload artifacts (7 days)

**lighthouse.yml** - Runs on PR and push to main:

1. Build site
2. Run Lighthouse CI
3. Display performance results

Required secrets in GitHub:

- `VITE_CONTENTFUL_SPACE_ID`
- `VITE_CONTENTFUL_ACCESS_TOKEN`
- `VITE_AIRTABLE_API_KEY`
- `VITE_AIRTABLE_CHAPTER_BASE_APP_ID`
- `VITE_MAPBOX_PUBLIC_KEY`
- `LHCI_GITHUB_APP_TOKEN`

## Resources

- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte 5 Docs](https://svelte.dev)
- [Contentful Docs](https://contentful.com/developers)
- [Playwright Docs](https://playwright.dev)
- [Netlify Docs](https://docs.netlify.com)
- [Mapbox GL Docs](https://docs.mapbox.com/mapbox-gl-js)
