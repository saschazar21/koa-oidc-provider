<template>
  <div>
    <h1 v-if="first_name"><greeting></greeting> {{ first_name }}!</h1>
    <span>Your current dashboard:</span>
    <section>
      <card :number="3" name="tokens" title="active" action="/tokens"></card>
      <card :number="3" name="clients" title="registered" action="/clients"></card>
    </section>
  </div>
</template>

<script>
import card from '~/components/card.vue';
import greeting from '~/components/greeting.vue';

export default {
  async asyncData({ store }) {
    return {
      client: store.getters['setup/baseClient'],
      first_name: store.getters['user/firstName'],
    };
  },
  components: {
    card,
    greeting,
  },
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>
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
</style>
