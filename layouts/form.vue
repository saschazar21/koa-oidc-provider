<template>
  <div class="form-container">
    <div class="header-container">
      <h1 v-if="header">{{ header }}</h1>
    </div>
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
  computed: {
    header: {
      get() {
        if (this.$store) {
          return this.$store.state.form.header;
        }
        return null;
      },
    },
  },
  layout: 'default',
};
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .form-container {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr;
    height: 100vh;
    justify-content: center;
    left: 0;
    width: 100%;
    position: absolute;
    top: 0;
  }
</style>
