<template>
  <error-block v-if="error_description" :message="error_description"></error-block>
</template>

<script>
import errorBlock from '~/components/error/error-block.vue';

export default {
  components: {
    'error-block': errorBlock,
  },
  computed: {
    error: {
      get() {
        if (!this.$route.hash) {
          return {
            error_description: this.hash || 'An error occurred, please reload!',
          };
        }
        return this.parseHash(this.$route.hash);
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
  props: ['hash'],
};
</script>
