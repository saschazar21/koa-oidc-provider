<template>
  <article>
    <h1>{{ client.client_name }}</h1>
    <client-block :id="client.client_id"></client-block>
  </article>
</template>

<script>
import clientBlock from '~/components/clients/client-block.vue';

export default {
  asyncData({ params, store }) {
    return {
      client: store.getters['clients/client'](params.id),
    };
  },
  components: {
    'client-block': clientBlock,
  },
  middleware: ['auth', 'clients'],
  validate({ params, store }) {
    return store.getters['clients/client'](params.id);
  },
};
</script>
