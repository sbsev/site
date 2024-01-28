<p align="center">
  <a href="https://studytutors.de"><img src="static/favicon.svg" alt="Favicon" width=150></a>
</p>

<h1 align="center">
  <a href="https://studytutors.de">studyTutors</a>
</h1>

<h3 align="center">

[![Netlify Status](https://api.netlify.com/api/v1/badges/2bcf7f93-7c33-40f4-9843-bbbf22ea213b/deploy-status)](https://app.netlify.com/sites/sbsev/deploys)
[![Tests](https://github.com/sbsev/site/actions/workflows/test.yml/badge.svg)](https://github.com/sbsev/site/actions/workflows/test.yml)
[![Lighthouse](https://github.com/sbsev/site/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/sbsev/site/actions/workflows/lighthouse.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/sbsev/site/main.svg)](https://results.pre-commit.ci/latest/github/sbsev/site/main)
[![Open in StackBlitz](https://img.shields.io/badge/Open%20in-StackBlitz-darkblue?logo=stackblitz)](https://stackblitz.com/github/sbsev/site)

</h3>

studyTutors e.V. is a student-run nonprofit initiative with chapters located in university towns all over Germany. Our mission is to provide free tutoring to refugees and children from underprivileged families.

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

## Deploy

To publish this site to netlify:

1. Create an account with [netlify](https://netlify.com).
2. Install the [`netlify-cli`](https://netlify.com/docs/cli).
3. Login to your account.

   ```sh
   netlify login
   ```

4. Connect your GitHub repo with your netlify account for [continuous deployment](https://netlify.com/docs/cli/#continuous-deployment).

   ```sh
   netlify init
   ```

5. Create a production build.

   ```sh
   pnpm export
   ```

6. Finally deploy the site with

   ```sh
   netlify deploy
   ```
