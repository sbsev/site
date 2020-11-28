<script>
  // adapted from https://github.com/imbolc/sapper-google-analytics
  import { stores } from '@sapper/app'

  const { page, session } = stores()
  const { GOOGLE_ANALYTICS_ID: gaId } = $session

  if (typeof window !== `undefined`) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag(`js`, new Date())
    window.gtag(`config`, gaId, { send_page_view: false })
  }
  $: if (typeof gtag !== `undefined`) {
    window.gtag(`config`, gaId, {
      page_path: $page.path,
    })
  }
</script>

<svelte:head>
  <script async src="https://googletagmanager.com/gtag/js?id={gaId}">
  </script>
</svelte:head>
