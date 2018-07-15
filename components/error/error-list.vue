<template>
  <div class="block">
    <h2>Errors</h2>
    <ul class="list--blank">
      <li v-for="(error, index) in errors" :key="index">
        <error-item error="error"></error-item>
      </li>
    </ul>
  </div>
</template>

<script>
import errorItem from '~/components/error/error-item.vue';

export default {
  components: {
    'error-item': errorItem,
  },
  computed: {
    errors: {
      get() {
        return this.$store.state.errors;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';

li + li {
  margin-top: 1em;
}
</style>
