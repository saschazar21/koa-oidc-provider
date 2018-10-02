<template>
  <div class="intermediate-container">
    <h1>One last step...</h1>
    <p>
      <span>You're nearly there - just wait a few more seconds until you're being redirected.</span><br>
      <span class="hide-first">If that doesn't happen, please click the 'retry' button below.</span>
    </p>
    <button class="button--success button--round hide-first" onClick="sendForm()">Retry</button>
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
  middleware: ['no-auth'],
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_partials/variables";
@import "~assets/css/_partials/forms";

@keyframes showAfter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.button--success {
  justify-self: center;
  max-height: 3em;
}

.hide-first {
  opacity: 0;
}

.show-after {
  animation: showAfter 500ms;
}

.intermediate-container {
  display: grid;
  justify-content: center;
}
</style>

