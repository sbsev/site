# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the StudyTutors website - a SvelteKit-powered static site for a German student-run nonprofit that provides free tutoring to refugees and underprivileged families. The site uses Contentful as a headless CMS for content management and is deployed to Netlify.

## Development Commands

### Setup

- `pnpm install` - Install dependencies
- `cp .env.example .env` - Copy environment template (then add Contentful credentials)

### Development

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build on port 3000
- `pnpm serve` - Build and preview in one command

### Testing & Quality

- `pnpm test` - Run Playwright end-to-end tests
- `pnpm check` - Run Svelte type checking

## Architecture

### Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **CMS**: Contentful (GraphQL API)
- **Styling**: CSS with custom properties for theming
- **Testing**: Playwright for E2E tests
- **Deployment**: Static site generation via @sveltejs/adapter-static

### Key Directories

- `src/lib/` - Reusable Svelte components and utilities
- `src/routes/` - SvelteKit file-based routing with server-side data loading
- `src/utils/` - Utility functions for external APIs (Contentful, Algolia, etc.)
- `src/signup-form/` - YAML-based form configurations for different locales
- `static/` - Static assets and theme CSS files

### Data Flow

1. **Content Management**: All page content, blog posts, and chapters are managed in Contentful
2. **Data Fetching**: Server-side data loading in `+page.server.ts` files using GraphQL queries
3. **Static Generation**: Site is prerendered at build time using Contentful data
4. **Form Handling**: Registration forms use server actions with YAML-based configuration

### External Services Integration

- **Contentful**: Primary CMS (requires VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN)
- **Airtable**: Chapter data management via BaseQL GraphQL API
- **Mapbox**: Interactive maps for chapter locations
- **Algolia**: Site search functionality
- **Plausible**: Privacy-friendly analytics

### Theme System

The site supports light/dark/system themes through CSS custom properties defined in `static/` theme files and managed by the ThemeSwitcher component.

### Content Structure

- **Pages**: General content pages fetched from Contentful
- **Blog Posts**: News and updates with author information
- **Chapters**: University chapter locations with signup status
- **Forms**: Multi-step registration forms for pupils and students

## Environment Setup

Copy `.env.example` to `.env` and configure:

- Contentful space ID and access tokens (required for development)
- Optional: Mapbox, Algolia, Airtable credentials for full functionality

## Testing

Playwright tests focus on form functionality and core user flows. Tests run against a development server on port 3005.
