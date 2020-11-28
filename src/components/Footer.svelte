<script>
  let social = []
  social.push({ name: `Impressum`, url: `/imprint` })
</script>

<footer>
  <span>© 2020 Studenten bilden Schüler</span>
  <div>
    {#each social as { name, url }}<a href={url}>{name}</a>{/each}
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid lightblue;
    padding: 2em;
    text-align: center;
    display: grid;
    gap: 1em;
  }
  footer div {
    margin: auto;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
