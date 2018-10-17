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
      <span>Token: {{ access_token }}</span>
      <ul class="list--inline list--blank">
        <li v-for="(scope, index) of scopes" :key="index"><small>{{ scope }}</small></li>
      </ul>
    </div>
    <div class="token-info">
      <span>Issued at: <strong>{{ issued }}</strong></span>
      <span>Expires in: <strong>{{ expires }}</strong></span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    access_token: {
      get() {
        /* eslint-disable-next-line no-underscore-dangle */
        const t = this.token._id;
        const len = Math.round(t.length * 0.5);
        return `${t.slice(0, len)}...`;
      },
    },
    client: {
      get() {
        return this.token.clientId;
      },
    },
    expires: {
      get() {
        const d = new Date(this.token.exp * 1000);
        const lifespan = d - new Date();
        return this.semanticExpire(lifespan);
      },
    },
    issued: {
      get() {
        const d = new Date(this.token.iat * 1000);
        const min = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const h = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
        return `${h}:${min}`;
      },
    },
    scopes: {
      get() {
        return this.token.scope.split(' ');
      },
    },
  },
  methods: {
    semanticExpire(ms) {
      const seconds = Math.round(ms * 0.001);
      if (seconds < 60) {
        return '< 1min';
      }
      const mins = Math.round(seconds * 0.0166666667);
      if (mins < 60) {
        return `${mins}min`;
      }
      const hours = Math.round(mins * 0.0166666667);
      if (hours < 24) {
        return `${hours}h`;
      }
      const days = Math.round(hours * 0.04166666667);
      return `${days}d`;
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

.token-body,
.token-info {
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

  .token-info {
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
