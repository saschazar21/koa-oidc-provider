<template>
  <div class="block block--alert--inverted">
    <small>{{ error_description }}</small>
  </div>
</template>

<script>
export default {
  computed: {
    error: {
      get() {
        if (!this.errorHash) {
          return {};
        }
        return this.parseHash(this.errorHash);
      },
    },
    error_description: {
      get() {
        return this.error.error_description;
      },
    },
  },
  methods: {
    parseHash(hash) {
      const obj = {};
      const sanitized = hash.startsWith('#') ? hash.substring(1) : hash;
      sanitized.split('&').forEach((segment) => {
        const error = segment.split('=');
        obj[error[0]] = decodeURIComponent(error[1]);
      });
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/blocks';

.block {
  border-radius: $border-radius;
  border-style: solid;
  border-width: $border-width;
  margin-bottom: 1em;
  max-width: 100%;
  padding: 1rem;
  
  strong,
  span {
    display: block;
  }
}
</style>
