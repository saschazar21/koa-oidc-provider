<template>
  <div class="container block--alert block--inverted">
    <h3>{{ error.error }}</h3>
    <span>{{ error.error_description }}</span>
  </div>
</template>

<script>
export default {
  props: [
    'error',
  ],
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/blocks';
</style>
