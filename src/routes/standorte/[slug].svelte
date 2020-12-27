<script context="module">
  import { fetchPage } from '../../utils/queries'

  export async function preload({ path }, session) {
    const page = await fetchPage(path.substring(1), session.gqlUri)
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
        href="mailto:info.{page.slug}@studenten-bilden-schueler.de?cc=standortbetreuung@studenten-bilden-schueler.de&subject=Interesse Standortleiter {page.title}"
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
  @media (min-width: 850px) {
    section {
      gap: 0;
      grid-template-columns: auto auto auto;
    }
  }
  .btn {
    display: block;
    white-space: nowrap;
    margin: 1ex;
    color: white;
    border-radius: 5pt;
    padding: 1ex 1.5ex;
    transition: 0.3s;
  }
  .btn:hover {
    transform: scale(1.03);
  }
  .btn.blue {
    background: var(--blue);
  }
  .btn.blue:hover {
    background: var(--lightBlue);
  }
  .btn.green {
    background: var(--green);
  }
  .btn.green:hover {
    background: var(--darkGreen);
  }
  .btn.orange {
    background: var(--orange);
  }
  .btn.orange:hover {
    background: var(--darkOrange);
  }
  .btn.stroke {
    color: var(--textColor);
    background: none;
  }
  .btn.stroke.blue {
    border: 2pt solid var(--blue);
  }
  .btn.stroke.green {
    border: 2pt solid var(--green);
  }
  .btn.stroke.orange {
    border: 2pt solid var(--orange);
  }
  .btn.stroke:hover {
    color: white;
    border: 2pt solid transparent;
  }
</style>
