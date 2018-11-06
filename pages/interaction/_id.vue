<template>
  <main>
    <form :action="`/interaction/${id}`" method="post">
      <span>The application<strong v-if="clientName"> '{{ clientName }}'</strong> requests access to your profile.</span>
      <div class="form-group button-group">
        <button class="button--success button--round" type="submit">Allow</button>
        <a class="button--inverted button--round" :href="redirect">Cancel</a>
      </div>
    </form>
    <scope-block v-if="scope" :scopeString="scope"></scope-block>
  </main>
</template>

<script>
import scopeBlock from '~/components/scope-block.vue';

export default {
  asyncData({ params, query, store }) {
    store.commit('form/reset');
    const client = store.getters['client/client'];
    const header = `Allow access from '${client && client.client_name ? client.client_name : 'application'}'?`;
    store.commit('form/setHeader', header);
    return {
      clientName: client.client_name,
      id: params.id,
      redirect: client.redirect_uris[0],
      scope: query.scope,
    };
  },
  components: {
    'scope-block': scopeBlock,
  },
  layout: 'form',
};
</script>

<style lang="scss" scoped>

</style>
