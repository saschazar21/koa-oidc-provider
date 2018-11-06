<template>
  <section class="block block--success--inverted" v-show="scope.length > 0">
    <p>
      <span>If you proceed, you agree to pass on your details:</span>
      <ul class="list--inline list--blank">
        <li v-for="(claim, index) in translated" :key="index">
          <strong>{{ claim }}</strong>
        </li>
      </ul>
    </p>
    <p v-if="actions.length > 0">
      <span>Furthermore, the application would like to:</span>
      <ul class="list--blank">
        <li v-for="(claim, index) in actions" :key="index">
          <strong>{{ claim }}</strong>
        </li>
      </ul>
    </p>
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

const actions = {
  client: 'list your clients',
  'client:create': 'register new clients',
  'client:delete': 'delete existing clients',
  'client:edit': 'edit existing clients',
  token: 'list your active tokens',
  user: 'access users created by you',
  'user:create': 'register new users',
  'user:edit': 'edit existing users',
  'user:delete': 'delete existing users',
};

export default {
  computed: {
    actions: {
      get() {
        return this.scope.map(s => actions[s]).filter(s => typeof s !== 'undefined');
      },
    },
    scope: {
      get() {
        if (this.scopeString) {
          return this.scopeString.split(' ');
        }
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
  props: ['scopeString'],
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

