<template>
  <main>
    <error-block v-show="error" :message="error"></error-block>
    <user-form @form-post="formPost"></user-form>
  </main>
</template>

<script>
import errorBlock from '~/components/error/error-block.vue';
import userForm from '~/components/user-form.vue';

export default {
  asyncData({ store }) {
    return {
      client: store.getters['setup/baseClient'],
    };
  },
  async fetch({ redirect, req, store }) {
    store.commit('form/setHeader', 'Register');
    if (process.server && (!req.setup || !req.setup.registration)) {
      return redirect('/error');
    }
    return true;
  },
  components: {
    'error-block': errorBlock,
    'user-form': userForm,
  },
  data() {
    return {
      error: null,
    };
  },
  layout: 'form',
  methods: {
    async formPost() {
      try {
        const form = this.$store.getters['form/body'];
        /* eslint-disable-next-line camelcase */
        const { client_id, client_secret } = this.client;
        await this.$axios({
          auth: {
            password: client_secret,
            username: client_id,
          },
          method: 'POST',
          url: '/api/users',
          data: form,
        });
        this.$store.commit('form/reset');
        return this.$router.push('/login');
      } catch (e) {
        if (e.response) {
          this.error = e.response.data.error || e.message || e;
          return null;
        }
        this.error = e.message || e;
        return null;
      }
    },
  },
};
</script>
