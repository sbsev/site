<script>
  import OpenSource from '@svg-icons/remix-fill/open-source.svg'
  import Cookie from '@svg-icons/boxicons-solid/cookie.svg'
  import Law from '@svg-icons/octicons/law.svg'
  import PrivacyTip from '@svg-icons/material-sharp/privacy-tip.svg'
  import AlternateEmail from '@svg-icons/material-sharp/alternate-email.svg'
  import DocumentText from '@svg-icons/ionicons-solid/document-text.svg'

  import Social from './Social.svelte'

  const icons = {
    Impressum: Law,
    Datenschutz: PrivacyTip,
    Kontakt: AlternateEmail,
    Satzung: DocumentText,
  }

  export let social
  export let links
  const style = `height: 1em; vertical-align: -3pt; padding-right: 2pt;`
</script>

<footer>
  <img src="favicon.svg" alt="SbS Logo" height="60" />
  <span>© 2020 Studenten bilden Schüler e.V.</span>
  <div>
    {#each links as { title, url }}
      <a href={url}>
        <svelte:component this={icons[title]} {style} />
        {title}</a>
    {/each}
  </div>
  <span>Diese Seite ist
    <a href="https://github.com/sbsev/website"><OpenSource
        height="2.5ex"
        style="vertical-align: bottom; padding-right: 3pt;" />open source</a>
    und verwendet
    <a href="https://de.wikipedia.org/wiki/HTTP-Cookie">keine
      <Cookie height="2.2ex" style="vertical-align: middle;" />
      Cookies.</a></span>
  <Social {social} style="margin-top: 1ex;" />
</footer>

<style>
  footer {
    padding: 3em calc(1em + 3vw);
    text-align: center;
    display: grid;
    gap: 3em;
    place-items: center;
    background: var(--footerBg);
    color: white;
  }
  footer :global(a) {
    color: var(--lightBlue);
  }
  footer :global(a:hover) {
    color: var(--green);
  }
  footer div {
    margin: auto;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
