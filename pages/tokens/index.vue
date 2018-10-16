<template>
  <div>
    <h1>Tokens</h1>
    <ul class="list--blank">
      <li v-for="(token, index) in tokens" :key="index">
        <token-block :token="token"></token-block>
      </li>
    </ul>
  </div>
</template>

<script>
import tokenBlock from '~/components/tokens/token-block.vue';

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

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';

ul {
  margin: 0 auto;
  max-width: map-get($sizes, text);
}

li:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
