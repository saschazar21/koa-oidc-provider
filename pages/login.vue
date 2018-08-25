<template>
  <main>
    <form class="form--border shadow" @submit="checkForm" :action="`/interaction/${grant}`" method="post">
      <error-hash v-show="hash"></error-hash>
      <div class="form-group">
        <div class="label-group">
          <label for="input-username">Enter E-Mail:</label>
          <small class="form-error" v-if="isEmailInvalid()">{{ formErrors.email }}</small>
        </div>
        <input id="input-username" v-model.trim.lazy="email" type="text" name="email" class="input--full input--round" :class="{'input--alert': formErrors.email }" autofocus>
      </div>
      <div class="form-group">
        <div class="label-group">
          <label for="input-password">Enter Password:</label>
          <small class="form-error" v-if="isPasswordInvalid()">{{ formErrors.password }}</small>
        </div>
        <input id="input-password" v-model="password" type="password" name="password" class="input--full input--round" :class="{ 'input--alert': formErrors.password }">
      </div>
      <div class="form-group button-group">
        <button class="button--success button--round" :disabled="isFormInvalid()">Login</button>
        <div class="form-group--inline">
          <input type="checkbox" id="input-remember" v-model="remember" name="remember">
          <label for="input-remember">Remember for next time?</label>
        </div>
        <a class="button--inverted button--round" :href="return_to || '/'">Cancel</a>
      </div>
      <div class="form-group" v-show="registrationEnabled">
        <span>No user account yet? <nuxt-link to="register">Register an account.</nuxt-link></span>
      </div>
    </form>
    <scope-block></scope-block>
  </main>
</template>

<script>
import errorHash from '~/components/error/error-hash.vue';
import scopeBlock from '~/components/scope-block.vue';

/* eslint-disable-next-line no-useless-escape */
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  asyncData({ query, req }) {
    return {
      grant: query.grant,
      return_to: query.return_to,
      registrationEnabled: req ? req.setup.registration : false,
    };
  },
  async fetch({ store }) {
    store.commit('form/setHeader', 'Login');
  },
  components: {
    'error-hash': errorHash,
    'scope-block': scopeBlock,
  },
  computed: {
    email: {
      get() {
        return this.$store.state.form.body.email;
      },
      set(value) {
        this.formErrors.email = value.length === 0 || !emailRegex.test(value)
          ? 'Please enter a valid e-mail address!'
          : null;
        return this.$store.commit('form/updateBody', { email: value });
      },
    },
    hash: {
      get() {
        return this.$route.hash;
      },
    },
    password: {
      get() {
        return this.$store.state.form.body.password;
      },
      set(value) {
        this.formErrors.password = value.length === 0
          ? 'Please enter your password!'
          : null;
        return this.$store.commit('form/updateBody', { password: value });
      },
    },
    remember: {
      get() {
        return this.$store.state.form.body.remember;
      },
      set(value) {
        return this.$store.commit('form/updateBody', { remember: value });
      },
    },
  },
  data() {
    return {
      formErrors: {},
    };
  },
  layout: 'form',
  methods: {
    checkForm(e) {
      if (this.isFormInvalid()) {
        return e.preventDefault();
      }
      return this.$store.commit('form/reset');
    },
    isEmailInvalid() {
      return !!this.formErrors.email;
    },
    isFormInvalid() {
      return !this.password
        || !this.email
        || this.isEmailInvalid()
        || this.isPasswordInvalid();
    },
    isPasswordInvalid() {
      return !!this.formErrors.password;
    },
  },
};
</script>
