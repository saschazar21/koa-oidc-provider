<template>
  <div class="block block--alert--inverted">
    <strong>ERROR:</strong> <small>{{ message }}</small>
  </div>
</template>

<script>
export default {
  props: ['message'],
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