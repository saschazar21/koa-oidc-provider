<template>
  <ul class="list--inline list--blank">
    <li><nuxt-link to="/">Home</nuxt-link></li>
    <li v-if="user.sub"><nuxt-link to="/logout">Logout</nuxt-link></li>
    <li><strong><a href="https://sascha.work">sascha.work</a></strong></li>
  </ul>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.list--inline {
  justify-content: center;
}
</style>

