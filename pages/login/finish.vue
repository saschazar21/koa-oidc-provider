<template>
  <div class="intermediate-container">
    <h1>One last step...</h1>
    <span>You're nearly there - just wait a few more seconds until you're being redirected.<br>If that doesn't happen, please click the 'Home' link below.</span>
    <script v-html="js" type="text/javascript"></script>
  </div>
</template>

<script>
/* eslint-disable-next-line import/extensions */
import formPost from '~/middleware/form-post.js';

export default {
  data() {
    return {
      js: formPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.intermediate-container {
  display: grid;
  justify-content: center;
}
</style>

