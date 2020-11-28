<script>
  export let cards = []
</script>

<div class="cards">
  {#each cards as { title, slug, color, items }}
    <div class="card" style="background: {color};">
      <a href={slug}>
        <h2>{title}</h2>
      </a>
      {#each items as { slug, title, img }}
        <div class="item">
          {#if img}<a href={slug}><img src={img} alt={title} /></a>{/if}
          <a href={slug}>
            <h3>
              {@html title.split(` `).splice(0, 8).join(` `) + `&hellip;`}
            </h3>
          </a>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .cards {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 2em 0;
  }
  @media (max-width: 850px) {
    .cards {
      grid-template-columns: 1fr;
    }
  }
  .card {
    padding: 1ex 1em;
    border-radius: 4pt;
    transition: 0.5s;
  }
  h2 {
    margin: 5pt 0 1ex;
  }
  .card a {
    color: white;
  }
  .card a:hover {
    color: black;
  }
  .card:hover {
    transform: scale(1.01);
  }
  .item {
    display: flex;
    margin-top: 1ex;
    padding-top: 1ex;
    border-top: 1px dotted white;
  }
  h3 {
    font-size: 1.4ex;
    margin: 0;
  }
  img {
    width: 4em;
    margin-right: 1em;
  }
</style>
