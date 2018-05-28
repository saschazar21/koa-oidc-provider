<template>
  <div class="form-container">
    <form class="form--border shadow" action="/api/login" method="post">
      <div class="form-group">
        <label for="input-username">Enter Username:</label>
        <input id="input-username" type="text" class="input--full input--round" autofocus>
      </div>
      <div class="form-group">
        <label for="input-password">Enter Password:</label>
        <input id="input-password" type="password" class="input--full input--round">
      </div>
      <div class="form-group button-group">
        <button class="button--success button--round">Login</button>
        <button class="button--inverted button--round">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  @import "~assets/css/_partials/variables";
  @import "~assets/css/_partials/forms";

  form {
    background-color: $bg-main;
    padding: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    max-width: 100%;
  }

  .form-group + .form-group {
    margin-top: 2rem;
  }

  .button-group {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .form-container {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    height: 100vh;
    justify-content: center;
    left: 0;
    width: 100%;
    position: absolute;
    top: 0;
  }

  @media screen and (min-width: map-get($breakpoints, s)) {
    form {
      margin-left: auto;
      margin-right: auto;
      padding: 3rem 2rem;
      width: map-get($breakpoints, s);
    }
  }
</style>
