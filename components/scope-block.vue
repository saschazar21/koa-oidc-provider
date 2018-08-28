<template>
  <section class="block block--success--inverted" v-show="scope.length > 0">
    <span>If you proceed, you agree to pass on your details:</span>
    <ul class="list--inline list--blank">
      <li v-for="(claim, index) in translated" :key="index">
        <strong>{{ claim }}</strong>
      </li>
    </ul>
  </section>
</template>

<script>
const table = {
  address: 'address',
  email: 'e-mail address',
  openid: 'ID',
  profile: 'user profile',
  website: 'website',
};

export default {
  computed: {
    scope: {
      get() {
        return this.$store.getters['setup/scope']
          ? this.$store.getters['setup/scope'].split(' ')
          : [];
      },
    },
    translated: {
      get() {
        return this.scope.map(s => table[s]).filter(s => typeof s !== 'undefined');
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';
@import '~assets/css/_partials/blocks';

ul {
  margin: 0;
}

.block {
  font-size: .75em;
  margin: 0 1rem;
  margin-top: 2rem;
  max-width: map-get($breakpoints, s);
  padding: 1rem 2rem;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .block {
    font-size: 1em;
    margin: 0 auto;
  }
}
</style>

