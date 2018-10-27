<template>
  <main>
    <error-block v-if="error" :message="error"></error-block>
    <client-form @form-post="formPost" @error="setError"></client-form>
  </main>
</template>

<script>
/* eslint-disable camelcase */
import clientForm from '~/components/clients/client-form.vue';
import errorBlock from '~/components/error/error-block.vue';

export default {
  async fetch({ store }) {
    store.commit('form/reset');
    return store.commit('form/setHeader', 'Register client');
  },
  components: {
    'client-form': clientForm,
    'error-block': errorBlock,
  },
  data() {
    return {
      access_token: this.$store.getters['user/access_token'],
      error: null,
    };
  },
  layout: 'form',
  methods: {
    async formPost() {
      try {
        const formBody = this.$store.getters['form/body'];
        const { data } = await this.$axios({
          headers: {
            Authorization: `Bearer ${this.access_token}`,
          },
          method: 'POST',
          url: '/api/clients',
          data: formBody,
        });
        this.$store.commit('clients/add', data);
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
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>

</style>
