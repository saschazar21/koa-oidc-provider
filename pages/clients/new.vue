<template>
  <main>
    <form class="form--border shadow" action="#" @submit="checkForm" method="post">
      <div class="form-group">
        <div class="label-group">
          <label for="input-name">Enter your application's name:</label>
        </div>
        <input id="input-name" v-model.trim.lazy="name" type="text" name="name" class="input--full input--round" :class="{'input--alert': formErrors.email }" autofocus placeholder="The app's name">
      </div>
    </form>
  </main>
</template>

<script>
export default {
  asyncData({ store }) {
    store.commit('form/reset');
    store.commit('form/setHeader', 'Create application');
    return {
      access_token: store.getters['user/access_token'],
    };
  },
  computed: {
    name: {
      get() {
        const body = this.$store.getters['form/body'];
        if (!body) {
          return null;
        }
        return body.name;
      },
      set(value) {
        return this.$store.commit('form/updateBody', { name: value });
      },
    },
  },
  layout: 'form',
  methods: {
    checkForm(event) {
      event.preventDefault();
    },
  },
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>

</style>
