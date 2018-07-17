<template>
  <form class="form--border shadow" @submit="checkForm" :action="return_to" method="post">
    <div v-if="hash">
      <error-hash :error-hash="hash"></error-hash>
    </div>
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
        <input type="checkbox" id="input-remember" name="remember">
        <label for="input-remember">Remember for next time?</label>
      </div>
      <a class="button--inverted button--round" :href="return_to || '/'">Cancel</a>
    </div>
  </form>
</template>

<script>
import errorHash from '~/components/error/error-hash.vue';
/* eslint-disable import/extensions */
import { oidcPrefix } from '~/server/lib/tools/url.js';
/* eslint-disable-next-line no-useless-escape */
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  asyncData({ query, store }) {
    store.commit('form/setHeader', 'Login');
    return {
      client: query.client_id,
      return_to: query.return_to,
    };
  },
  components: {
    'error-hash': errorHash,
  },
  computed: {
    email: {
      get() {
        return this.sanitizedEmail;
      },
      set(value) {
        this.formErrors.email = value.length === 0 || !emailRegex.test(value)
          ? 'Please enter a valid e-mail address!'
          : null;
        this.sanitizedEmail = value;
      },
    },
    hash: {
      get() {
        return this.$route.hash;
      },
    },
    password: {
      get() {
        return this.sanitizedPassword;
      },
      set(value) {
        this.formErrors.password = value.length === 0
          ? 'Please enter your password!'
          : null;
        this.sanitizedPassword = value;
      },
    },
  },
  data() {
    return {
      formErrors: {},
      prefix: oidcPrefix,
      sanitizedEmail: undefined,
      sanitizedPassword: undefined,
    };
  },
  layout: 'form',
  methods: {
    checkForm(e) {
      if (this.isFormInvalid()) {
        return e.preventDefault();
      }
      return true;
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

<style lang="scss" scoped>
  @import "~assets/css/_partials/variables";
  @import "~assets/css/_partials/forms";

  form {
    background-color: $bg-main;
    margin-left: 1rem;
    margin-right: 1rem;
    max-width: 100%;
  }

  input[type="checkbox"] {
    height: 1rem;
    width: 1rem;
  }

  .form-group--inline {
    align-items: center;
  }

  .form-group + .form-group {
    margin-top: 2rem;
  }

  .label-group {
    display: grid;
    grid-template-areas: 'a a';
    justify-content: space-between;
  }

  .button-group {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .form-error {
    color: $color-alert;
  }

  @media screen and (min-width: map-get($breakpoints, s)) {
    form {
      margin-left: auto;
      margin-right: auto;
      padding: 3rem 2rem;
      width: map-get($breakpoints, s);
    }
  }
</style>
