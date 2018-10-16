<template>
  <main class="container">
    <nuxt/>
    <aside class="footer-container">
      <nav-list></nav-list>
    </aside>
  </main>
</template>

<script>
import navList from '~/components/nav-list.vue';

export default {
  components: {
    'nav-list': navList,
  },
};
</script>

<style lang="scss">
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/blocks';

h1 {
  text-align: center;
}

nuxt {
  grid-area: main;
}

.container {
  box-sizing: border-box;
  min-height: 100vh;
  display: grid;
  grid-template-areas:
    'main'
    'footer';
  grid-template-columns: 1fr;
  grid-row-gap: $grid-gap;
}

.footer-container {
  align-self: end;
  grid-area: footer;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .container {
    grid-template-areas: 'main' 'footer';
    grid-template-rows: 1fr auto;
  }
}
</style>

