<template>
  <div class="token-block">
    {{ JSON.stringify(token) }}
  </div>
</template>

<script>
export default {
  props: ['token'],
};
</script>
