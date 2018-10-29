<template>
  <ul class="list--inline list--blank">
    <li v-for="(link, index) in links" :key="index" v-if="link.auth === !!user">
      <nuxt-link v-if="link.nuxt" :to="link.link">{{ link.text }}</nuxt-link>
      <a v-else :href="link.link">{{ link.text }}</a>
    </li>
    <li><strong><a href="https://sascha.work">sascha.work</a></strong></li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      links: [{
        auth: true,
        link: '/',
        nuxt: true,
        text: 'Home',
      }, {
        auth: false,
        link: '/login',
        nuxt: false,
        text: 'Login',
      }, {
        auth: true,
        link: '/logout',
        nuxt: false,
        text: 'Logout',
      }, {
        auth: true,
        link: '/clients',
        nuxt: true,
        text: 'Clients',
      }, {
        auth: true,
        link: '/tokens',
        nuxt: true,
        text: 'Tokens',
      }],
      user: this.$store.getters['user/user'],
    };
  },
};
</script>

<style lang="scss" scoped>
.list--inline {
  justify-content: center;
}
</style>

