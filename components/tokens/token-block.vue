<template>
  <div class="token-block">
    <div class="token-logo">
      <a :href="token.iss" target="_blank" rel="noopener noreferrer">
        <img class="img--circle img--border" v-if="client && client.logo_uri" :src="client.logo_uri" :alt="`Logo of ${client.client_name}`">
      </a>
    </div>
    <div class="token-body">
      <span>
        <strong v-if="client && client.client_name">{{ client.client_name }} - </strong>
        <a :href="token.iss" target="_blank" rel="noopener noreferrer">{{ token.iss }}</a>
      </span>
      <span>Token: {{ token._id }}</span>
      <ul class="list--inline list--blank">
        <li v-for="(scope, index) of scopes" :key="index"><small>{{ scope }}</small></li>
      </ul>
    </div>
    <div class="token-actions">
      <button class="button--round button--alert button--shadow">Invalidate</button>
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
@import '~assets/css/_partials/buttons';

img {
  height: auto;
  min-width: 100%;
}

.token-block {
  background-color: $bg-main;
  border-radius: $border-radius;
  display: grid;
  grid-gap: $grid-gap;
  grid-template-areas:
    'logo'
    'body'
    'actions';
  grid-template-columns: 1fr;
  max-width: 100%;
  overflow: hidden;
  padding: 1em;
}

.token-body {
  display: inherit;

  li {
    color: $color-shadow;
  }
}

.token-logo {
  display: none;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .token-block {
    grid-template-areas: 
      'logo body'
      'actions actions';
    grid-template-columns: auto 1fr;
  }

  .token-logo {
    display: block;
    min-width: map-get($media-sizes, xs);
    padding: 1em;
  }

  .token-actions {
    grid-column-end: -1;
  }

  .token-logo {
    min-width: map-get($media-sizes, s);
  }
}

@media screen and (min-width: map-get($breakpoints, m)) {
  .token-block {
    align-items: center;
    grid-template-areas: 'logo body actions';
  }
}
</style>
