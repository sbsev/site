<script context="module">
  import { fetchPage } from '../../utils/queries'

  export async function preload({ path }) {
    const page = await fetchPage(path.substring(1))
    return { page }
  }
</script>

<script>
  import BasePage from '../../components/BasePage.svelte'

  import Email from '@svg-icons/material-sharp/email.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import Child from '@svg-icons/fa-solid/child.svg'
  import InfoCircle from '@svg-icons/entypo/info-with-circle.svg'

  export let page
  const style = `vertical-align: -3pt; height: 18pt; margin-right: 3pt;`
</script>

<BasePage {page}>
  <h2>Anmeldungen</h2>
  <section>
    <span>Willst du bei uns mitmachen?
      <a
        href="/anmeldung?type=Student&chapter={page.title}"
        class="btn blue"><GraduationCap {style} />Als Student anmelden</a>
      <a href="mitmachen/nachhilfelehrer" class="btn blue stroke"><InfoCircle
          style={style + `margin-right: 6pt;`} />Infos für Studenten</a>
    </span>
    <span>
      Suchst du Nachhilfe?
      <a href="/anmeldung?type=Schüler&chapter={page.title}" class="btn green"><Child
          {style} />
        Als Schüler anmelden</a>
      <a href="mitmachen/schueler" class="btn green stroke">
        <InfoCircle style={style + `margin-right: 6pt;`} />Infos für Schüler</a>
    </span>
    <span>
      Interesse an Standortleitung?
      <a
        href="mailto:info.{page.slug}@studenten-bilden-schueler.de?cc=standortbetreuung@studenten-bilden-schueler.de&subject=Interesse an Standortleitung in {page.title}"
        class="btn orange"><Email {style} />
        Schreib uns</a>
      <a href="mitmachen/standortleiter" class="btn orange stroke">
        <InfoCircle style={style + `margin-right: 6pt;`} />Infos für Standortleiter</a>
    </span>
  </section>
</BasePage>

<style>
  h2 {
    text-align: center;
    margin-top: 2em;
  }
  section {
    text-align: center;
    max-width: 42em;
    padding: 0 2em 2em;
    margin: auto;
    display: grid;
    gap: 1em;
  }
  section span {
    display: grid;
    align-content: space-between;
  }
  a.btn {
    width: 100%;
    margin: 1ex;
    box-sizing: border-box;
  }
  @media (min-width: 850px) {
    section {
      grid-template-columns: auto auto auto;
    }
  }
</style>
