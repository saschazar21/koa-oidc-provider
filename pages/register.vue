<template>
  <main>
    <form class="form--border shadow" action="#" @submit="checkForm" method="post">
      <error-hash v-show="error" :hash="error"></error-hash>
      <div class="form-group">
        <div class="label-group">
          <label for="input-username">Enter E-Mail:</label>
          <small class="form-error" v-if="isEmailInvalid()">{{ formErrors.email }}</small>
        </div>
        <input id="input-username" v-model.trim.lazy="email" type="text" name="email" class="input--full input--round" :class="{'input--alert': formErrors.email }" autofocus placeholder="Your E-Mail">
      </div>
      <div class="input-group">
        <div class="form-group">
          <div class="label-group">
            <label for="input-firstname">Enter your first name:</label>
            <small class="form-error" v-if="isGivenNameInvalid()">{{ formErrors.given_name }}</small>
          </div>
          <input type="text" v-model.trim.lazy="given_name" name="given_name" class="input--full input--round" id="input-firstname" :class="{ 'input--alert': formErrors.given_name }" placeholder="Your first name">
        </div>
        <div class="form-group">
          <div class="label-group">
            <label for="input-lastname">Enter your last name:</label>
            <small class="form-error" v-if="isFamilyNameInvalid()">{{ formErrors.family_name }}</small>
          </div>
          <input type="text" v-model.trim.lazy="family_name" name="family_name" class="input--full input--round" id="input-lastname" :class="{ 'input--alert': formErrors.family_name }" placeholder="Your last name">
        </div>
      </div>
      <div class="form-group">
        <div class="label-group">
          <label for="input-password">Enter Password:</label>
          <small class="form-error" v-if="isPasswordInvalid()">{{ formErrors.password }}</small>
        </div>
        <div class="input-group">
          <input type="password" v-model.trim="password" id="input-password" name="password" class="input--full input--round" :class="{'input--alert': formErrors.password }" placeholder="Your password">
          <input type="password" v-model.trim="password2" name="password2" id="input-password2" class="input--full input--round" :class="{ 'input--alert': formErrors.password }" placeholder="Your password again...">
        </div>
      </div>
      <div class="form-group button-group">
        <button class="button--success button--round" :disabled="isFormInvalid()">Register</button>
        <nuxt-link class="button--inverted button--round" to="/">Cancel</nuxt-link>
      </div>
    </form>
  </main>
</template>

<script>
import { emailRegex } from '~/pages/login.vue';
import errorHash from '~/components/error/error-hash.vue';

export default {
  asyncData(ctx) {
    if (ctx.registrationEnabled) {
      return ctx.redirect('/');
    }
    return ctx.store.commit('form/setHeader', 'Register');
  },
  components: {
    'error-hash': errorHash,
  },
  computed: {
    email: {
      get() {
        return this.$store.state.form.body.email;
      },
      set(value) {
        this.formErrors.email = value.length === 0 || !emailRegex.test(value)
          ? 'Please enter a valid e-mail address'
          : null;
        this.$store.commit('form/updateBody', { email: value });
      },
    },
    family_name: {
      get() {
        return this.$store.state.form.body.family_name;
      },
      set(value) {
        this.formErrors.family_name = value.length === 0 ? 'Please enter your last name' : null;
        this.$store.commit('form/updateBody', { family_name: value });
      },
    },
    given_name: {
      get() {
        return this.$store.state.form.body.given_name;
      },
      set(value) {
        this.formErrors.given_name = value.length === 0 ? 'Please enter your first name' : null;
        this.$store.commit('form/updateBody', { given_name: value });
      },
    },
    password: {
      get() {
        return this.$store.state.form.body.password;
      },
      set(value) {
        this.formErrors.password = value.length < 6 || value !== this.password2
          ? 'Passwords do not match and/or is less than 6 characters'
          : null;
        if (!this.formErrors.password) {
          this.password2 = null;
        }
        this.$store.commit('form/updateBody', { password: value });
      },
    },
    password2: {
      get() {
        return this.passwordCheck;
      },
      set(value) {
        this.formErrors.password = value.length < 6 || value !== this.password ? 'Passwords do not match' : null;
        this.passwordCheck = value;
      },
    },
  },
  data() {
    return {
      error: null,
      formErrors: {},
      passwordCheck: null,
    };
  },
  layout: 'form',
  methods: {
    async checkForm(e) {
      e.preventDefault();
      if (!this.isFormInvalid()) {
        this.formErrors = {};
        try {
          await this.$axios.$post('/api/user', this.$store.state.form.body);
          this.$store.commit('form/reset');
          this.$router.push('index');
        } catch (err) {
          this.error = `${err.message || err} - please reload!`;
        }
      }
    },
    isEmailInvalid() {
      return this.formErrors.email !== null;
    },
    isFamilyNameInvalid() {
      return this.formErrors.family_name !== null;
    },
    isFormInvalid() {
      return !(this.email
        && this.password
        && !this.isEmailInvalid()
        && !this.isFamilyNameInvalid()
        && !this.isGivenNameInvalid()
        && !this.isPasswordInvalid());
    },
    isGivenNameInvalid() {
      return this.formErrors.given_name !== null;
    },
    isPasswordInvalid() {
      return this.formErrors.password !== null;
    },
  },
  middleware: 'registrationEnabled',
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_partials/variables";

.input-group > .form-group {
  margin-top: 1em;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .input-group {
    align-items: center;
    display: grid;
    grid-template-areas: 'a a';
    grid-template-columns: 1fr 1fr;
    grid-column-gap: .5em;

    .form-group {
      margin-top: 0;
    }
  }
}
</style>
