<template>
  <div class="form-container">
    <div class="header-container">
      <h1>Login</h1>
    </div>
    <form class="form--border shadow" @submit="checkForm" :action="action" method="post">
      <div class="form-group">
        <label for="input-username">Enter E-Mail:</label>
        <input id="input-username" v-model.lazy="email" type="text" name="email" class="input--full input--round" autofocus>
      </div>
      <div class="form-group">
        <label for="input-password">Enter Password:</label>
        <input id="input-password" v-model.lazy="password" type="password" name="password" class="input--full input--round">
      </div>
      <div class="form-group button-group">
        <button class="button--success button--round" :disabled="isFormInvalid()">Login</button>
        <div class="form-group--inline">
          <input type="checkbox" id="input-remember" name="remember">
          <label for="input-remember">Remember for next time?</label>
        </div>
        <button class="button--inverted button--round">Cancel</button>
      </div>
    </form>
    <div class="footer-container">
      <nav-list></nav-list>
    </div>
  </div>
</template>

<script>
import navList from '~/components/nav-list.vue';
/* eslint-disable-next-line import/extensions */
import { oidcPrefix } from '~/server/lib/tools/url.js';
/* eslint-disable-next-line no-useless-escape */
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  asyncData({ query }) {
    return {
      client_id: query.client_id,
      grant: query.grant,
    };
  },
  components: {
    'nav-list': navList,
  },
  computed: {
    action: {
      get() {
        return `${oidcPrefix}/interaction/${this.grant}/login`;
      },
    },
  },
  data() {
    return {
      email: null,
      errors: {},
      password: null,
      prefix: oidcPrefix,
    };
  },
  methods: {
    checkForm(e) {
      if (this.isFormInvalid()) {
        e.preventDefault();
      }
    },
    isFormInvalid() {
      this.errors.email = !this.email || this.email.length === 0 || !emailRegex.test(this.email)
        ? 'Please enter a valid e-mail address!'
        : null;
      return this.errors.email || !this.password || this.password.length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/_partials/variables";
  @import "~assets/css/_partials/forms";

  h1 {
    text-align: center;
  }

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

  .button-group {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .form-container {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr;
    height: 100vh;
    justify-content: center;
    left: 0;
    width: 100%;
    position: absolute;
    top: 0;
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
