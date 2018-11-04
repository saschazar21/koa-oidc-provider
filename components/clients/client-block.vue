<template>
  <div class="client-block shadow">
    <div class="client-logo">
      <img class="img--circle img--border" v-if="client && client.logo_uri" :src="client.logo_uri" :alt="`Logo of ${client.client_name}`">
    </div>
    <div class="client-body">
      <error-block v-if="errorMsg" :message="errorMsg"></error-block>
      <h3>{{ client.client_name }} <small>- <nuxt-link :to="`/clients/${client.client_id}/edit`">Edit</nuxt-link></small></h3>
      <span>Client ID: <span class="passive">{{ client.client_id }}</span></span>
      <span v-if="client.client_secret">Client Secret: <span class="passive">{{ client.client_secret }}</span></span>
      
      <span>Redirect URIs:</span>
      <ul class="list--inline list--blank">
        <li v-for="(uri, index) of client.redirect_uris" :key="index"><small>{{ uri }}</small></li>
      </ul>
    </div>
    <div class="client-info">
      <button @click="resetClientSecret()" class="button--small button--round button--inverted">Reset Client Secret</button>
      <button @click="remove()" class="button--small button--round button--inverted button--alert">Delete Client</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import errorBlock from '~/components/error/error-block.vue';

export default {
  data() {
    return {
      accessToken: this.$store.getters['user/access_token'],
      errorMsg: null,
    };
  },
  components: {
    'error-block': errorBlock,
  },
  computed: {
    client: {
      get() {
        return this.$store.getters['clients/client'](this.id);
      },
    },
  },
  methods: {
    error(msg) {
      this.errorMsg = msg;
    },
    async remove() {
      try {
        const { client_id } = this.client;
        const token = this.accessToken;
        this.errorHandler();
        const { data } = await this.$axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'DELETE',
          url: `/api/clients/${client_id}`,
        });
        return this.$store.commit('clients/remove', data);
      } catch (e) {
        if (e.response) {
          return this.error(e.response.data || e.message || e);
        }
        return this.error(e.message || e);
      }
    },
    errorHandler() {
      const { client_id } = this.client;
      const token = this.accessToken;
      if (!client_id || !token) {
        throw new Error('No Client ID set! Please reload.');
      }
    },
    async resetClientSecret() {
      try {
        const { client_id } = this.client;
        const token = this.accessToken;
        this.errorHandler();
        const { data } = await this.$axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
          url: `/api/clients/${client_id}/reset`,
        });
        return this.$store.commit('clients/replace', data);
      } catch (e) {
        if (e.response) {
          return this.error(e.response.data || e.message || e);
        }
        return this.error(e.message || e);
      }
    },
  },
  props: ['id'],
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';
@import '~assets/css/_partials/images';
@import '~assets/css/_partials/buttons';

h3 {
  margin-top: 0;
}

img {
  height: auto;
  min-width: 100%;
}

small {
  color: $color-shadow,
}

.client-block {
  background-color: $bg-main;
  border: $border-width solid $color-border;
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

.client-body {
  text-align: left;
}

.client-body,
.client-info {
  display: inherit;
}

.client-logo {
  display: none;
}

.passive {
  color: $color-special;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .client-block {
    grid-template-areas: 
      'logo body'
      'actions actions';
    grid-template-columns: auto 1fr;
  }

  .client-logo {
    display: block;
    min-width: map-get($media-sizes, s);
    padding: 1em;
  }

  .client-info {
    grid-column-end: -1;
  }
}

@media screen and (min-width: map-get($breakpoints, m)) {
  .client-block {
    align-items: center;
    grid-template-areas: 'logo body actions';
  }
}
</style>
