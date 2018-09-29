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
  min-height: 100vh;
  display: grid;
  grid-template-areas: 'main' 'footer';
  grid-template-rows: 1fr auto;
  grid-row-gap: 1em;
}

.footer-container {
  align-self: end;
  grid-area: footer;
}
</style>

