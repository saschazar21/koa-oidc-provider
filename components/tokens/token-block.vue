<template>
  <div class="token-block">
    <div class="token-logo">
      <a :href="token.iss" target="_blank" rel="noopener noreferrer">
        <img class="img--circle img--border" v-if="client && client.logo_uri" :src="client.logo_uri" :alt="`Logo of ${client.client_name}`">
      </a>
    </div>
    <div class="token-body">
      <strong>{{ token._id }}</strong>
      <a :href="token.iss" target="_blank" rel="noopener noreferrer">{{ token.iss }}</a>
      <ul class="list--inline list--blank">
        <li v-for="(scope, index) of scopes" :key="index">{{ scope }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    client: {
      get() {
        return this.token.clientId;
      },
    },
    scopes: {
      get() {
        return this.token.scope.split(' ');
      },
    },
  },
  props: ['token'],
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';
@import '~assets/css/_partials/images';

img {
  height: auto;
  min-width: 100%;
}

.token-block {
  background-color: $bg-main;
  display: grid;
  grid-template-areas: 'logo body';
  grid-template-columns: auto 1fr;
  padding: 1em;
}

.token-body {
  display: inherit;

  li {
    color: $color-shadow;
    font-size: $font-small;
  }
}

.token-logo {
  min-width: map-get($media-sizes, xs);
  padding: 1em;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .token-logo {
    min-width: map-get($media-sizes, s);
  }
}
</style>
