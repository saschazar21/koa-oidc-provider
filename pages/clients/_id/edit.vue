<template>
  <main>
    <error-block v-if="error" :message="error"></error-block>
    <client-form @form-post="formPost" @error="setError"></client-form>
  </main>
</template>

<script>
/* eslint-disable camelcase */
import errorBlock from '~/components/error/error-block.vue';
import clientForm from '~/components/clients/client-form.vue';

export default {
  asyncData({ params, store }) {
    const client = store.getters['clients/client'](params.id);
    store.commit('form/reset');
    store.commit('form/setHeader', `Edit ${client.client_name}`);
    store.commit('form/updateBody', client);
    return {
      access_token: store.getters['user/access_token'],
      client,
    };
  },
  components: {
    'error-block': errorBlock,
    'client-form': clientForm,
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
        const { client_id } = this.client;
        const token = this.access_token;
        const formBody = this.$store.getters['form/body'];
        const { data } = await this.$axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          url: `/api/clients/${client_id}`,
          data: formBody,
        });
        this.$store.commit('clients/replace', data);
        this.$store.commit('form/reset');
        this.$router.push('/clients');
        return true;
      } catch (e) {
        if (e.response) {
          this.error = e.response.data.error || e.message || e;
          return null;
        }
        this.error = e.message || e;
        return null;
      }
    },
    setError(msg) {
      this.error = msg;
    },
  },
  middleware: ['auth', 'clients'],
  validate({ params, store }) {
    return store.getters['clients/client'](params.id);
  },
};
</script>
