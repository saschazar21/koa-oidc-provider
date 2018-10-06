<template>
  <article class="shadow">
    <span class="card-highlight">{{ number }}</span>
    <span class="card-title">{{ title }}<br/>{{ name }}</span>
    <nuxt-link class="card-action" :to="name">View {{ name }}</nuxt-link>
  </article>
</template>

<script>
export default {
  props: [
    'name',
    'number',
    'title',
  ],
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_partials/variables";
@import "~assets/css/_partials/specials";

  article {
    background-color: $bg-main;
    border-color: $color-border;
    border-width: .5px;
    border-style: solid;
    display: grid;
    grid-gap: .75em;
    grid-template-areas: 
      'highlight title'
      'action action';
    grid-template-rows: 1fr auto;
    justify-content: center;
    justify-self: center;
    max-width: map-get($breakpoints, s);
    padding: 1em;
    width: 100%;
  }

  .card-action {
    grid-area: action;
    justify-self: inherit;
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

