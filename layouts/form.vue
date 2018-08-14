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

<style lang="scss">
  @import "~assets/css/_partials/variables";
  @import "~assets/css/_partials/forms";

  form {
    background-color: $bg-main;
    margin-left: 1rem;
    margin-right: 1rem;
    max-width: 100%;
  }

  input[type=checkbox] {
    height: 1rem;
    width: 1rem;
  }

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

  .form-group--inline {
    align-items: center;
  }

  .form-group + .form-group {
    margin-top: 2rem;
  }

  .label-group {
    display: grid;
    grid-template-areas: 'a a';
    justify-content: space-between;
  }

  .button-group {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .form-error {
    color: $color-alert;
  }

  @media screen and (min-width: map-get($breakpoints, s)) {
    form {
      margin-left: auto;
      margin-right: auto;
      padding: 3rem 2rem;
      width: map-get($breakpoints, s);
    }
  }
</style>
