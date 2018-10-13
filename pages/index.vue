<template>
  <div>
    <h1 v-if="first_name"><greeting></greeting> {{ first_name }}!</h1>
    <span>Your current dashboard:</span>
    <div class="error-block shadow" v-if="error">
      <error-block :message="error"></error-block>
    </div>
    <section v-if="clients && tokens">
      <card :number="tokens.length" name="tokens" title="active"></card>
      <card :number="clients.length" name="clients" title="registered"></card>
    </section>
  </div>
</template>

<script>
import card from '~/components/card.vue';
import errorBlock from '~/components/error/error-block.vue';
import greeting from '~/components/greeting.vue';

export default {
  async asyncData({ store }) {
    const token = store.getters['user/access_token'];
    const expires = store.getters['user/token_expires'];
    const data = {
      client: store.getters['setup/baseClient'],
      clients: null,
      first_name: store.getters['user/firstName'],
      tokens: null,
    };
    try {
      if (!token || !expires) {
        throw new Error('No token available, or token expired');
      }
      return {
        ...data,
        clients: store.getters['clients/clients'],
        tokens: store.getters['tokens/tokens'],
      };
    } catch (e) {
      return {
        ...data,
        error: e.message || e,
      };
    }
  },
  components: {
    card,
    'error-block': errorBlock,
    greeting,
  },
  middleware: [
    'auth',
    'clients',
    'tokens',
  ],
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_partials/variables";

section {
  display: grid;
  grid-gap: 1.5em;
  grid-template-areas: 
    'a'
    'a';
  grid-template-columns: 1fr;
  margin-top: 2em;
}

span {
  display: block;
  text-align: center;
}

.error-block {
  background-color: $bg-main;
  border-radius: $border-radius;
  margin: 1.5em auto;
  max-width: map-get($breakpoints, s);
  padding: 1em;
}

@media screen and (min-width: map-get($breakpoints, m)) {
  section {
    grid-template-areas: 'a a';
    grid-template-columns: 1fr 1fr;
  }
}
</style>
