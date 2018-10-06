<template>
  <h1>Clients</h1>
</template>

<script>
export default {
  async asyncData({ store }) {
    return {
      clients: store.getters['clients/clients'],
    };
  },
  middleware: ['auth'],
};
</script>
