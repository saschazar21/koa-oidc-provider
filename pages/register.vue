<template>
  <main>
    <form action="#" @submit="checkForm" method="post">
      <error-hash v-show="error"></error-hash>
      <div class="form-group">
        <div class="label-group">
          <label for="input-username">Enter E-mail:</label>
          <small class="form-error" v-if="isEmailInvalid()">{{ formErrors.email }}</small>
        </div>
        <input id="input-username" v-model.trim.lazy="email" type="text" name="email" class="input--full input--round" :class="{'input--alert': formErrors.email }" autofocus>
      </div>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      formErrors: {},
    };
  },
  layout: 'form',
  methods: {
    checkForm(e) {
      console.log(e);
      e.preventDefault();
    },
    isEmailInvalid() {
      return false;
    },
  },
  middleware: 'registrationEnabled',
};
</script>

<style lang="scss" scoped>

</style>
