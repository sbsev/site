<script context="module">
  import { fetchPage } from '../../utils/queries'

  export async function preload({ path, params: { slug } }) {
    const page = await fetchPage(path.split(`/`).filter(Boolean).join(`/`))

    return { page, slug }
  }
</script>

<script>
  import BasePage from '../../components/BasePage.svelte'

  import Email from '@svg-icons/material-sharp/email.svg'
  import GraduationCap from '@svg-icons/fa-solid/graduation-cap.svg'
  import Child from '@svg-icons/fa-solid/child.svg'
  import InfoCircle from '@svg-icons/entypo/info-with-circle.svg'

  export let page, slug

  const style = `vertical-align: -3pt; height: 18pt; margin-right: 3pt;`
</script>

<BasePage {page}>
  {#if page?.yaml?.showSignupButtons !== false}
    <h2 style="text-align: center; margin-top: 2em;">Anmeldungen</h2>
    <section>
      <span>
        Willst du bei uns mitmachen?
        <a
          sapper:prefetch
          href="/anmeldung?type=Student&chapter={page.title}"
          class="btn blue"><GraduationCap {style} />Als Student anmelden</a>
        <a sapper:prefetch href="mitmachen/nachhilfelehrer" class="btn blue stroke"
          ><InfoCircle style={style + `margin-right: 6pt;`} />Infos für Studenten</a>
      </span>
      <span>
        Suchst du Nachhilfe?
        <a
          sapper:prefetch
          href="/anmeldung?type=Schüler&chapter={page.title}"
          class="btn green"
          ><Child {style} />
          Als Schüler anmelden</a>
        <a sapper:prefetch href="mitmachen/schueler" class="btn green stroke">
          <InfoCircle style={style + `margin-right: 6pt;`} />Infos für Schüler</a>
      </span>
      <span>
        Interesse an Standortleitung?
        <a
          href="mailto:info.{slug}@studenten-bilden-schueler.de?cc=standortbetreuung@studenten-bilden-schueler.de&subject=Interesse an Standortleitung in {page.title}"
          class="btn orange"
          ><Email {style} />
          Schreib uns</a>
        <a sapper:prefetch href="mitmachen/standortleiter" class="btn orange stroke">
          <InfoCircle style={style + `margin-right: 6pt;`} />Infos für Standortleiter</a>
      </span>
    </section>
  {/if}

  <svelte:fragment slot="afterBody">
    {#if page?.yaml?.showSignupButtons !== false}
      <h2 id="kontakt">Kontakt</h2>
      <p>Noch Fragen? Schreib uns eine Mail!</p>
      <ul class="contact">
        <li>
          <a
            href="mailto:studenten.{slug}@studenten-bilden-schueler.de"
            title="studenten.{slug}@studenten-bilden-schueler.de"
            class="btn blue"
            ><Email
              style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />studenten.{slug}@studenten-bilden-schueler.de</a>
          für Studierende
        </li>
        <li>
          <a
            href="mailto:schueler.{slug}@studenten-bilden-schueler.de"
            title="schueler.{slug}@studenten-bilden-schueler.de"
            class="btn green"
            ><Email
              style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />schueler.{slug}@studenten-bilden-schueler.de</a>
          für Soziale Einrichtungen und Nachhilfeanfragen
        </li>
        <li>
          <a
            href="mailto:info.{slug}@studenten-bilden-schueler.de"
            title="info.{slug}@studenten-bilden-schueler.de"
            class="btn orange"
            ><Email
              style="width: 15pt; vertical-align: -3pt; margin: 0 3pt 0 0;" />info.{slug}@studenten-bilden-schueler.de</a>
          für Allgemeine Anfragen
        </li>
      </ul>
    {/if}
  </svelte:fragment>
</BasePage>

<style>
  section {
    text-align: center;
    max-width: 42em;
    margin: auto;
    padding: 0 1em;
    display: flex;
    gap: 1em;
  }
  section span {
    display: grid;
    gap: 1em;
  }
  a.btn {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }
  ul.contact {
    list-style: none;
    display: flex;
    padding: 0;
    justify-content: space-between;
  }
  ul.contact > li {
    text-align: center;
    width: 32%;
    margin: 1ex 0;
  }
  ul.contact > li > a.btn {
    margin: 1ex 0;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  @media (max-width: 700px) {
    section {
      flex-direction: column;
    }
    ul.contact {
      flex-direction: column;
    }
    ul.contact > li {
      width: 100%;
    }
  }
</style>
