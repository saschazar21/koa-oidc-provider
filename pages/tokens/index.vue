<template>
  <div>
    <h1>Tokens</h1>
    <ul>
      <li v-for="(token, index) in tokens" :key="index">
        <token-block :token="token"></token-block>
      </li>
    </ul>
  </div>
</template>

<script>
import tokenBlock from '~/components/token-block.vue';

export default {
  asyncData({ store }) {
    return {
      tokens: store.getters['tokens/tokens'],
    };
  },
  components: {
    'token-block': tokenBlock,
  },
  middleware: ['auth', 'tokens'],
};
</script>
