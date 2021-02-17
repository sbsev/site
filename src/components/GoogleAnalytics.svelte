<script>
  // https://analytics.google.com
  import { stores } from '@sapper/app'

  const { page } = stores()

  $: if (typeof gtag !== `undefined`) {
    window.gtag(`config`, `G-LZW9SF70F3`, { page_path: $page.path })
  }
</script>

<svelte:head>
  <script async src="https://googletagmanager.com/gtag/js?id=G-LZW9SF70F3"></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }

    gtag('js', new Date())

    // generate random, but almost certainly unique ID that carries no
    // user data but allows us to prevent double-counting visitors
    if (!localStorage.gaID) localStorage.gaID = Math.random().toString(16).slice(2)

    gtag('config', 'G-LZW9SF70F3', {
      anonymize_ip: true,
      client_storage: 'none',
      client_id: localStorage.gaID,
    })
  </script>
</svelte:head>
