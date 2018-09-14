<template>
  <div class="container">
    <nuxt/>
    <div class="footer-container">
      <nav-list :user="user"></nav-list>
    </div>
  </div>
</template>

<script>
import navList from '~/components/nav-list.vue';

export default {
  asyncData({ store }) {
    return {
      user: store.getters('user/user'),
    };
  },
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

