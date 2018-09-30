<template>
  <div class="intermediate-container">
    <h1>One last step...</h1>
    <p>You're nearly there - just wait a few more seconds until you're being redirected.<br>If that doesn't happen, please click the 'retry' button below.</p>
    <button class="button--success button--round" onClick="sendForm()">Retry</button>
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
@import "~assets/css/_partials/variables";
@import "~assets/css/_partials/forms";

.button--success {
  justify-self: center;
  max-height: 3em;
}

.intermediate-container {
  display: grid;
  justify-content: center;
}
</style>

