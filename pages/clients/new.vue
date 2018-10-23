<template>
  <main>
    <form class="form--border shadow" action="#" @submit="checkForm" method="post">
      <error-block v-if="error" :message="error"></error-block>
      <div class="form-group">
        <div class="label-group">
          <label for="input-name">Enter your application's name:</label>
          <small class="form-error" v-if="isNameInvalid()">{{ formErrors.client_name }}</small>
        </div>
        <input id="input-name" v-model.trim.lazy="client_name" type="text" name="name" class="input--full input--round" :class="{'input--alert': formErrors.client_name }" autofocus placeholder="The app's name">
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
import errorBlock from '~/components/error/error-block.vue';

export default {
  async asyncData({ app, store }) {
    store.commit('form/reset');
    store.commit('form/setHeader', 'Create application');
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
        const body = this.$store.getters['form/body'];
        if (!body) {
          return null;
        }
        return body.name;
      },
      set(value) {
        return this.$store.commit('form/updateBody', { client_name: value });
      },
    },
    grant_types: {
      get() {},
      set(value) {
        return Array.isArray(value) ? value : [value];
      },
    },
    redirect_uris: {
      get() {},
      set(value) {
        this.grant_types = this.setAppropriateGrantTypes(value);
        return Array.isArray(value) ? value : [value];
      },
    },
    response_types: {
      get() {},
      set(value) {
        return value;
      },
    },
  },
  data() {
    return {
      error: null,
      formErrors: {},
      grants: {
        authorization_code: 'Authorization Code Flow',
        implicit: 'Implicit Flow',
        refresh_token: 'Refresh Token Flow',
      },
    };
  },
  layout: 'form',
  methods: {
    async checkForm(event) {
      event.preventDefault();
      if (this.isValidForm()) {
        try {
          const result = await this.$axios({
            headers: {
              Authorization: `Bearer ${this.access_token}`,
            },
            method: 'POST',
            url: '/api/clients',
            data: this.$store.getters['form/body'],
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
      return !this.client_name || this.client_name.length === 0;
    },
    isRedirectURIInvalid() {
      // TODO: Implement redirect URI check
      return false;
    },
    isValidForm() {
      return !this.isNameInvalid() && !this.isRedirectURIInvalid();
    },
    setAppropriateGrantTypes(responseTypes) {
      const grantTypes = this.supported_grant_types.filter(entry => entry !== 'authorization_code' || entry !== 'implicit');
      const responseTypeArray = responseTypes.split(' ').map(type => type.trim());
      if (responseTypeArray.includes('code')) {
        return [
          'authorization_code',
          ...grantTypes,
        ];
      }
      return [
        'implicit',
        ...grantTypes,
      ];
    },
  },
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>

</style>
