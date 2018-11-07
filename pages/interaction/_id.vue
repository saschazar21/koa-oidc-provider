<template>
  <main>
    <form class="form--border shadow" :action="`/interaction/${id}`" method="post">
      <client-block v-if="clientName"></client-block>
      <p>
        <span>The application<strong v-if="clientName"> '{{ clientName }}'</strong> requests access to your profile:</span>
      </p>
      <input type="hidden" name="account" :value="account">
      <div class="form-group button-group">
        <button class="button--success button--round" type="submit">Allow</button>
        <div class="form-group--inline">
          <input type="checkbox" id="input-remember" name="remember">
          <label for="input-remember">Remember for next time?</label>
        </div>
        <a class="button--inverted button--round" :href="redirect">Cancel</a>
      </div>
    </form>
    <scope-block v-if="scope" :scopeString="scope"></scope-block>
  </main>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import clientBlock from '~/components/clients/client-login-block.vue';
import scopeBlock from '~/components/scope-block.vue';

export default {
  asyncData({ params, query, store }) {
    store.commit('form/reset');
    const client = store.getters['client/client'];
    const clientName = client ? client.client_name || client.clientName : null;
    const header = 'Allow access?';
    const user = store.getters['user/user'];
    store.commit('form/setHeader', header);
    return {
      account: user._id || user.sub,
      clientName,
      id: params.id,
      redirect: query.return_to,
      scope: query.scope,
    };
  },
  components: {
    'client-block': clientBlock,
    'scope-block': scopeBlock,
  },
  layout: 'form',
};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 1em;
  margin-top: 0;
}
</style>
