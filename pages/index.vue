<template>
  <div>
    <h1 v-if="first_name"><greeting></greeting> {{ first_name }}!</h1>
    <span>Your current dashboard:</span>
    <section>
      <card :number="3" name="tokens" title="active"></card>
      <card :number="clients.length" name="clients" title="registered"></card>
    </section>
  </div>
</template>

<script>
import card from '~/components/card.vue';
import greeting from '~/components/greeting.vue';

export default {
  async asyncData({ app, store }) {
    const token = store.getters['user/access_token'];
    const expires = store.getters['user/token_expires'];
    const data = {
      client: store.getters['setup/baseClient'],
      first_name: store.getters['user/firstName'],
    };
    try {
      if (!token || !expires) {
        throw new Error('No token available, or token expired');
      }
      const result = await Promise.all([
        app.$axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
          url: '/api/clients',
        }),
      ]);
      return {
        ...data,
        clients: result.shift().data,
      };
    } catch (e) {
      return {
        ...data,
        error: e,
      };
    }
  },
  components: {
    card,
    greeting,
  },
  middleware: ['auth'],
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

@media screen and (min-width: map-get($breakpoints, m)) {
  section {
    grid-template-areas: 'a a';
    grid-template-columns: 1fr 1fr;
  }
}
</style>
