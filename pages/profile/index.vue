<template>
  <article>
    <h1>Your profile</h1>
    <div class="profile-block shadow">
      <div class="profile-avatar">
        <img :src="picture" :alt="`Avatar of ${name}`" class="img--circle img--border" v-if="picture">
      </div>
      <div class="profile-body">
        <small>ID: {{ id }}</small>
        <h2>{{ name }}</h2>
        <strong>{{ email }}</strong>
      </div>
      <div class="profile-actions">
        <nuxt-link to="/profile/edit">Edit profile</nuxt-link>
      </div>
    </div>
  </article>
</template>

<script>
/* eslint-disable no-underscore-dangle */
export default {
  asyncData({ store }) {
    const user = store.getters['user/user'];
    return {
      ...user,
      id: user._id,
    };
  },
  middleware: ['auth'],
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_partials/fonts';
@import '~assets/css/_partials/variables';
@import '~assets/css/_partials/typography';
@import '~assets/css/_partials/images';

h2 {
  margin-top: 0;
}

img {
  height: auto;
  min-width: 100%;
}

small {
  color: $color-shadow;
  font-size: 1.5rem;
}

.profile-actions {
  grid-area: 'actions';
}

.profile-avatar {
  display: none;
  grid-area: 'avatar';
}

.profile-body {
  grid-area: 'body';
}

.profile-block {
  background-color: $bg-main;
  border: $border-width solid $color-border;
  display: grid;
  grid-gap: $grid-gap;
  grid-template-areas: 'body' 'actions';
  grid-template-columns: 1fr;
  padding: 1em;
}

@media screen and (min-width: map-get($breakpoints, s)) {
  .profile-avatar {
    display: block;
    min-width: map-get($media-sizes, s);
    padding: 1em;
  }

  .profile-block {
    grid-template-areas: 'avatar body' 'actions actions';
    grid-template-columns: auto 1fr;
  }
}

@media screen and (min-width: map-get($breakpoints, m)) {
  .profile-block {
    grid-template-areas: 'avatar body actions';
  }
}
</style>
