<p align="center">
  <a href="https://studenten-bilden-schueler.de"><img src="static/favicon.svg" alt="Favicon" width=150></a>
</p>

<h1 align="center">
  <a href="https://studenten-bilden-schueler.de">Studenten bilden Schüler</a>
</h1>

<h3 align="center">

[![Deployment](https://github.com/sbsev/site/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/sbsev/site/actions/workflows/gh-pages.yml)
[![Tests](https://github.com/sbsev/site/actions/workflows/test.yml/badge.svg)](https://github.com/sbsev/site/actions/workflows/test.yml)
[![Lighthouse](https://github.com/sbsev/site/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/sbsev/site/actions/workflows/lighthouse.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/sbsev/site/main.svg)](https://results.pre-commit.ci/latest/github/sbsev/site/main)
[![Open in StackBlitz](https://img.shields.io/badge/Open%20in-StackBlitz-darkblue?logo=stackblitz)](https://stackblitz.com/github/sbsev/site)

</h3>

Studenten bilden Schüler e.V. is a student-run nonprofit initiative with chapters located in university towns all over Germany. Our mission is to provide free tutoring to refugees and children from underprivileged families.

This site is built with [Svelte](https://github.com/sveltejs/svelte) and [Contentful](https://contentful.com).

## Setup

Running this site locally requires [`git`](https://git-scm.com) and [`pnpm`](https://pnpm.io) (or [`npm`](https://npmjs.com)). With those installed, do:

1. Clone the repo and change into its directory.

   ```sh
   git clone https://github.com/sbsev/site sbs-site && cd sbs-site
   ```

2. (optional) Setup [`pre-commit` hooks](https://pre-commit.com).

   ```sh
   pre-commit install
   ```

3. Install dependencies.

   ```sh
   pnpm install
   ```

4. Copy `.env.example` to `.env`.

   ```sh
   cp .env.example .env
   ```

   Then open `.env` and insert your [Contentful space ID and access token](https://contentful.com/developers/docs/references/authentication). These are found in the settings menu of a Contentful space under 'API keys'.

5. Start the dev server.

   ```sh
   pnpm dev
   ```

## Deployment

This site is deployed as static HTML to [GitHub Pages](https://github.com/sbsev/site/deployments/activity_log) ([by this action](.github/workflows/gh-pages.yml)).
