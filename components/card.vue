<template>
  <article>
    <div class="card-body">
      <span class="card-highlight">{{ number }}</span>
      <span class="card-title">{{ title }}<br/>{{ name }}</span>
    </div>
    <nuxt-link :to="action">View {{ name }}</nuxt-link>
  </article>
</template>

<script>
export default {
  props: [
    'action',
    'name',
    'number',
    'title',
  ],
};
</script>

<style lang="scss" scoped>
  article {
    display: grid;
    grid-gap: .75em;
    grid-template-areas: 
      'main'
      'action';
    grid-template-rows: 1fr auto;
    justify-content: center;
  }

  .card-body {
    display: grid;
    grid-gap: 1em;
    grid-template-rows: 1fr;
    grid-template-areas: 'highlight title';
  }

  .card-highlight,
  .card-title {
    align-self: center;
  }

  .card-highlight {
    font-size: 2.5em;
    font-weight: bold;
    justify-self: right;
    grid-area: highlight;
  }

  .card-title {
    grid-area: title;
  }
</style>

