<template>
  <div class="container">
    <nuxt/>
    <div class="footer-container">
      <nav-list></nav-list>
    </div>
  </div>
</template>

<script>
import navList from '~/components/nav-list.vue';

export default {
  components: {
    'nav-list': navList,
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/blocks';

.container {
  min-height: 100vh;
}
</style>

