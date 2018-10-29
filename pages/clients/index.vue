<template>
  <article>
    <h1>Clients</h1>
    <div class="client-block" v-if="clients.length > 0">
      <h2>You currently have {{ clients.length }} active client<span v-if="clients.length > 1">s</span>.</h2>
      <span>Want one more? <nuxt-link to="/clients/new">Go create one!</nuxt-link></span>
      <ul class="list--blank">
        <li v-for="(client, index) in clients" :key="index">
          <client-block :id="client.client_id"></client-block>
        </li>
      </ul>
    </div>
    <div class="client-block" v-else>
      <h2>You don't have any active clients right now...</h2>
      <span>Want one? <nuxt-link to="/clients/new">Go create one!</nuxt-link></span>
    </div>
  </article>
</template>

<script>
import clientBlock from '~/components/clients/client-block.vue';

export default {
  components: {
    'client-block': clientBlock,
  },
  computed: {
    clients: {
      get() {
        return this.$store.getters['clients/clients'];
      },
    },
  },
  middleware: ['auth', 'clients'],
};
</script>

<style lang="scss" scoped>
li:not(:first-child) {
  margin-top: 2rem;
}

.client-block {
  text-align: center;

  h2 {
    text-align: inherit;
  }
}
</style>
