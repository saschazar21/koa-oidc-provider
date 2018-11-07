<template>
  <div class="block block--author">
    <figure v-if="clientLogo">
      <img class="client-logo" :src="clientLogo" :alt="`Logo of ${clientName}`">
    </figure>
    <div class="client-logo" v-else></div>
    <div class="block--author__text">
      <small>Login to:</small>
      <strong>{{ clientName }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    clientLogo: {
      get() {
        return this.client ? this.client.logo_uri : null;
      },
    },
    clientName: {
      get() {
        return this.client ? this.client.client_name || this.client.clientName : null;
      },
    },
  },
  data() {
    return {
      client: this.$store.getters['client/client'],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';
@import '~assets/css/_partials/blocks';
@import '~assets/css/_partials/images';

.client-logo {
  @extend .img--xs;
}

div.client-logo {
  background-color: $color-shadow;
  height: map-get($media-sizes, xs);
  margin: 1.5rem .5rem;
  width: map-get($media-sizes, xs);
}

@media screen and (min-width: map-get($breakpoints, m)) {
  .client-logo {
    width: map-get($media-sizes, s);
  }

  div.client-logo {
    height: map-get($media-sizes, s);
    width: map-get($media-sizes, s);
  }

  .block--author__text {
    font-size: 1.5em;
  }
}
</style>
