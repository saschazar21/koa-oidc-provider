<template>
  <main>
    <form class="form--border shadow" action="#" @submit="checkForm" method="post">
      <error-block v-if="error" :message="error"></error-block>
      <div class="form-group">
        <div class="label-group">
          <label for="input-name">Enter your application's name:</label>
          <small class="form-error" v-if="isNameInvalid()">{{ formErrors.client_name }}</small>
        </div>
        <input id="input-name" v-model.trim.lazy="client_name" type="text" name="client_name" class="input--full input--round" :class="{'input--alert': formErrors.client_name }" autofocus placeholder="The app's name">
      </div>
      <div class="form-group">
        <div class="label-group">
          <label for="input-redirect">Enter the redirect URIs (comma separated):</label>
          <small class="form-error" v-if="isRedirectURIInvalid()">{{ formErrors.redirect_uris }}</small>
        </div>
        <input id="input-redirect" v-model.trim.lazy="redirect_uris" type="text" name="redirect_uris" class="input--full input--round" :class="{'input--alert': formErrors.redirect_uris }" placeholder="The redirect URIs">
      </div>
      <div class="form-group">
        <div class="label-group">
          <label for="input-redirect">Select the desired response types:</label>
        </div>
        <select id="input-redirect" v-if="supported_response_types" v-model.trim.lazy="response_types" name="response_types" class="input--full input--round" :class="{'input--alert': formErrors.response_types }">
          <option v-for="(responseType, index) in supported_response_types" :key="index" :value="responseType">{{ responseType }}</option>
        </select>
      </div>
      <div class="form-group button-group">
        <button class="button--success button--round" :disabled="!isValidForm()">Save</button>
        <nuxt-link class="button--inverted button--round" to="/clients">Cancel</nuxt-link>
      </div>
    </form>
  </main>
</template>

<script>
/* eslint-disable camelcase */
import errorBlock from '~/components/error/error-block.vue';

const uriRegex = /^[A-Za-z]{1}[A-Za-z0-9+-.]*:\/\/(.[^:/]+)?/;
export default {
  async asyncData({ app, store }) {
    store.commit('form/reset');
    store.commit('form/setHeader', 'Register client');
    const data = {
      access_token: store.getters['user/access_token'],
    };
    try {
      const [responseTypes, grantTypes] = await Promise.all([
        app.$axios.$get('/api/setup/responsetypes'),
        app.$axios.$get('/api/setup/granttypes'),
      ]);
      return {
        ...data,
        error: null,
        supported_grant_types: grantTypes,
        supported_response_types: responseTypes,
      };
    } catch (e) {
      return {
        ...data,
        error: `${e.message || e} - please reload!`,
        supported_grant_types: null,
        supported_response_types: null,
      };
    }
  },
  components: {
    'error-block': errorBlock,
  },
  computed: {
    client_name: {
      get() {
        const { client_name } = this.$store.getters['form/body'];
        return client_name;
      },
      set(value) {
        if (!value || value.length === 0) {
          this.formErrors.client_name = 'Empty client name is invalid.';
          return null;
        }
        this.formErrors.client_name = null;
        return this.$store.commit('form/updateBody', { client_name: value });
      },
    },
    grant_types: {
      get() {
        const { grant_types } = this.$store.getters['form/body'];
        return grant_types ? grant_types.join(', ') : null;
      },
      set(value) {
        const result = Array.isArray(value) ? value : [value];
        return this.$store.commit('form/updateBody', { grant_types: result });
      },
    },
    redirect_uris: {
      get() {
        const { redirect_uris } = this.$store.getters['form/body'];
        return redirect_uris ? redirect_uris.join(', ') : null;
      },
      set(value) {
        let applicationType;
        const uris = value.split(',').map(u => u.trim());
        const sanitized = uris.filter((u) => {
          const result = uriRegex.exec(u.toLowerCase());
          if (!result) {
            return false;
          }
          if (u.toLowerCase().startsWith('http://')) {
            if (applicationType === 'web' || result[1] !== 'localhost') {
              return false;
            }
            applicationType = 'native';
            return true;
          }
          if (u.toLowerCase().startsWith('https://')) {
            if (applicationType === 'native' || result[1] === 'localhost') {
              return false;
            }
            applicationType = 'web';
            return true;
          }
          if (applicationType === 'web') {
            return false;
          }
          applicationType = 'native';
          return true;
        });
        if (sanitized.length !== uris.length) {
          this.formErrors.redirect_uris = 'One or more malformed Redirect URIs present.';
          return null;
        }
        this.formErrors.redirect_uris = null;
        return this.$store.commit('form/updateBody', {
          application_type: applicationType,
          redirect_uris: sanitized,
        });
      },
    },
    response_types: {
      get() {
        const { response_types } = this.$store.getters['form/body'];
        return response_types ? response_types.join(', ') : null;
      },
      set(value) {
        const responseTypes = Array.isArray(value) ? value : [value];
        this.grant_types = this.setAppropriateGrantTypes(value);
        return this.$store.commit('form/updateBody', { response_types: responseTypes });
      },
    },
  },
  data() {
    return {
      error: null,
      formErrors: {},
    };
  },
  layout: 'form',
  methods: {
    async checkForm(event) {
      event.preventDefault();
      if (this.isValidForm()) {
        try {
          const data = this.$store.getters['form/body'];
          const result = await this.$axios({
            headers: {
              Authorization: `Bearer ${this.access_token}`,
            },
            method: 'POST',
            url: '/api/clients',
            data,
          });
          this.$store.commit('clients/add', result);
          this.$store.commit('form/reset');
          this.$router.push('/clients');
        } catch (e) {
          this.error = e.message || e;
        }
      }
    },
    isNameInvalid() {
      return this.formErrors.client_name;
    },
    isRedirectURIInvalid() {
      return this.formErrors.redirect_uris;
    },
    isValidForm() {
      return !this.isNameInvalid() && !this.isRedirectURIInvalid();
    },
    setAppropriateGrantTypes(responseTypes) {
      const [authorizationCode, implicit, ...grantTypes] = this.supported_grant_types;
      const responseTypeArray = responseTypes.split(' ').map(type => type.trim());
      if (responseTypeArray.includes('code')) {
        return [
          authorizationCode,
          ...grantTypes,
        ];
      }
      return [
        implicit,
        ...grantTypes,
      ];
    },
  },
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>

</style>
