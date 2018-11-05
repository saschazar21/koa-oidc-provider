<template>
  <main>
    <error-block v-show="error" :message="error"></error-block>
    <user-form @form-post="formPost"></user-form>
  </main>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import errorBlock from '~/components/error/error-block.vue';
import userForm from '~/components/user-form.vue';

export default {
  components: {
    'error-block': errorBlock,
    'user-form': userForm,
  },
  data() {
    return {
      accessToken: this.$store.getters['user/access_token'],
      error: null,
    };
  },
  fetch({ store }) {
    store.commit('form/reset');
    return store.commit('form/setHeader', 'Edit your profile');
  },
  layout: 'form',
  methods: {
    async formPost() {
      try {
        const token = this.accessToken;
        const form = this.$store.getters['form/body'];
        const { data } = await this.$axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          url: `/api/users/${form._id}`,
          data: form,
        });
        this.$store.commit('form/reset');
        this.$store.commit('user/set', data);
        return this.$router.push('/profile');
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
  middleware: ['auth'],
};
</script>
