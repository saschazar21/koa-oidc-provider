<template>
  <main>
    <form class="form--border shadow" action="#" @submit="checkForm" method="post">
      <error-hash v-show="error"></error-hash>
      <div class="form-group">
        <div class="label-group">
          <label for="input-username">Enter E-Mail:</label>
          <small class="form-error" v-if="isEmailInvalid()">{{ formErrors.email }}</small>
        </div>
        <input id="input-username" v-model.trim.lazy="email" type="text" name="email" class="input--full input--round" :class="{'input--alert': formErrors.email }" autofocus placeholder="Your E-Mail">
      </div>
      <div class="form-group">
        <div class="label-group">
          <label for="input-password">Enter Password:</label>
          <small class="form-error" v-if="isPasswordInvalid()">{{ formErrors.password }}</small>
        </div>
        <div class="input-group">
          <input type="password" id="input-password" name="password" class="input--full input--round" :class="{'input--alert': formErrors.password }" placeholder="Your password">
          <input type="password" name="password2" id="input-password2" class="input--full input--round" :class="{ 'input--alert': formErrors.password }" placeholder="Your password again...">
        </div>
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
    isPasswordInvalid() {
      return false;
    },
  },
  middleware: 'registrationEnabled',
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_partials/variables";

.input-group {
  align-items: center;
  display: grid;
  grid-template-areas: 'a';
  grid-template-columns: 1fr;
  grid-column-gap: .5em;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .input-group {
    grid-template-areas: 'a a';
  }
}
</style>
