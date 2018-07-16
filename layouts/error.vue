<template>
  <div class="error-container">
    <h1>Awwww... that's a bummer!</h1>
    <div class="error-body shadow">
      <h2>{{ error.name || error.status || 'Error' }}</h2>
      <span>{{ error.message || 'Something happened, and we don\'t know why...' }}</span>
    </div>
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
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/specials';
@import '~assets/css/_partials/typography';

h1,
h2 {
  margin-top: 0;
  text-align: center;
}

.error-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-row-gap: 2rem;
}

.error-body {
  border: $border-width solid $color-border;
  background-color: $bg-main;
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: 100%;
  padding: 2rem;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .error-body {
    margin-left: auto;
    margin-right: auto;
    padding: 3rem 2rem;
    width: map-get($breakpoints, s);
  }
}
</style>
